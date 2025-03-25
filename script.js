// Configuración de Firebase (¡usa tus datos reales!)
const firebaseConfig = {
    apiKey: "AIzaSyBKP--CTIBM4XDoaT9Dz_VqBRt7SV2AZk0",
    authDomain: "blog-team-pelon.firebaseapp.com",
    projectId: "blog-team-pelon",
    storageBucket: "blog-team-pelon.appspot.com",
    messagingSenderId: "198572305645",
    appId: "1:198572305645:web:8d37ed8f347eb80852f0e4"
};

// Inicializa Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// ====================
// SISTEMA DE ACCESO ADMIN
// ====================
const CLAVE_ADMIN = "pelon123"; // Cambia por tu clave segura

// 1. Acceso por combinación de teclas (Ctrl + Alt + A)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        document.getElementById('admin-login').classList.remove('oculto');
    }
});

// 2. Acceso por URL (#admin)
if (window.location.hash === '#admin') {
    document.getElementById('admin-login').classList.remove('oculto');
}

// 3. Validar credenciales
document.getElementById('btn-acceso').addEventListener('click', () => {
    const clave = document.getElementById('clave-secreta').value;
    if (clave === CLAVE_ADMIN) {
        localStorage.setItem('esAdmin', 'true');
        alert('¡Modo admin activado!');
        window.location.hash = '';
        location.reload();
    } else {
        alert('Clave incorrecta');
    }
});

// ====================
// FUNCIONALIDAD PRINCIPAL
// ====================
document.addEventListener("DOMContentLoaded", async () => {
    // Mostrar controles admin si está autenticado
    if (localStorage.getItem('esAdmin') === 'true') {
        document.getElementById('nueva-publicacion').classList.remove('oculto');
    }

    // Cargar publicaciones existentes
    await cargarPublicaciones();

    // Configurar botón de publicación
    document.getElementById('publicar').addEventListener('click', publicarContenido);
});

// Función para cargar publicaciones desde Firestore
async function cargarPublicaciones() {
    try {
        const querySnapshot = await db.collection("publicaciones").get();
        const lista = document.getElementById('lista-publicaciones');
        lista.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const publicacion = doc.data();
            agregarPublicacionDOM(publicacion, doc.id);
        });
    } catch (error) {
        console.error("Error cargando publicaciones:", error);
    }
}

// Función para publicar nuevo contenido
async function publicarContenido() {
    const titulo = document.getElementById('titulo').value.trim();
    const contenido = document.getElementById('contenido').value.trim();
    const imagen = document.getElementById('imagen').files[0];
    const video = document.getElementById('video').files[0];

    if (!titulo || !contenido) {
        alert('Título y contenido son requeridos');
        return;
    }

    try {
        // Subir archivos si existen
        let imagenURL = null;
        let videoURL = null;

        if (imagen) {
            imagenURL = await subirArchivo(imagen, 'imagenes');
        }

        if (video) {
            videoURL = await subirArchivo(video, 'videos');
        }

        // Crear objeto de publicación
        const nuevaPublicacion = {
            titulo,
            contenido,
            imagen: imagenURL,
            video: videoURL,
            fecha: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Guardar en Firestore
        const docRef = await db.collection("publicaciones").add(nuevaPublicacion);
        
        // Limpiar formulario
        document.getElementById('titulo').value = '';
        document.getElementById('contenido').value = '';
        document.getElementById('imagen').value = '';
        document.getElementById('video').value = '';

        // Actualizar lista
        agregarPublicacionDOM(nuevaPublicacion, docRef.id);
        
        alert('¡Publicación exitosa!');

    } catch (error) {
        console.error("Error al publicar:", error);
        alert('Error al publicar: ' + error.message);
    }
}

// Función auxiliar para subir archivos a Storage
async function subirArchivo(archivo, carpeta) {
    const storageRef = storage.ref(`${carpeta}/${archivo.name}`);
    await storageRef.put(archivo);
    return await storageRef.getDownloadURL();
}

// Función para mostrar publicaciones en el DOM
function agregarPublicacionDOM(publicacion, id) {
    const lista = document.getElementById('lista-publicaciones');
    const publicacionDiv = document.createElement('div');
    publicacionDiv.className = 'publicacion';
    
    let mediaHTML = '';
    if (publicacion.imagen) {
        mediaHTML += `<img src="${publicacion.imagen}" alt="Imagen publicación" class="imagen-publicacion">`;
    }
    if (publicacion.video) {
        mediaHTML += `
            <video controls class="video-publicacion">
                <source src="${publicacion.video}" type="video/mp4">
            </video>
        `;
    }

    publicacionDiv.innerHTML = `
        <h3>${publicacion.titulo}</h3>
        <p>${publicacion.contenido}</p>
        ${mediaHTML}
        <small>${publicacion.fecha?.toDate().toLocaleDateString() || ''}</small>
        ${localStorage.getItem('esAdmin') === 'true' ? 
            `<button class="borrar" data-id="${id}">Eliminar</button>` : ''}
    `;

    // Configurar botón de eliminar si es admin
    if (localStorage.getItem('esAdmin') === 'true') {
        publicacionDiv.querySelector('.borrar').addEventListener('click', async () => {
            if (confirm('¿Eliminar esta publicación?')) {
                await db.collection("publicaciones").doc(id).delete();
                publicacionDiv.remove();
            }
        });
    }

    lista.prepend(publicacionDiv);
}

// Función para las tarjetas de equipo
function cerrarInfo() {
    document.getElementById('info-detallada').classList.add('oculto');
}

// Mostrar información de los miembros al hacer clic
document.querySelectorAll('.tarjeta').forEach(tarjeta => {
    tarjeta.addEventListener('click', function() {
        document.getElementById('info-nombre').textContent = this.dataset.nombre;
        document.getElementById('info-texto').textContent = this.dataset.descripcion;
        document.getElementById('info-detallada').classList.remove('oculto');
    });
});
