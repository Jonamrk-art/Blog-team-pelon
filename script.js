// Firebase Config (¡NO EXPONGAS ESTO EN PRODUCCIÓN!)
const firebaseConfig = {
    apiKey: "AIzaSyBKP--CTIBM4XDoaT9Dz_VqBRt7SV2AZk0",
    authDomain: "blog-team-pelon.firebaseapp.com",
    projectId: "blog-team-pelon",
    storageBucket: "blog-team-pelon.firebasestorage.app",
    messagingSenderId: "198572305645",
    appId: "1:198572305645:web:8d37ed8f347eb80852f0e4"
};

// Inicializa Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Acceso Secreto
const CLAVE_ADMIN = "pelon123"; // Cambia esto

// Método 1: Combinación de teclas (Ctrl + Alt + A)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {  // 'a' en minúscula
        e.preventDefault(); // Evita que el navegador ejecute acciones por defecto
        console.log("Combinación detectada"); // Verifica en la consola
        document.getElementById('admin-login').classList.remove('oculto');
    }
});

// Método 2: Acceso por URL (ej: http://tusitio.com/#admin)
if (window.location.hash === '#admin') {
    document.getElementById('admin-login').classList.remove('oculto');
}

document.getElementById('btn-acceso').addEventListener('click', () => {
    const clave = document.getElementById('clave-secreta').value;
    if (clave === CLAVE_ADMIN) {
        localStorage.setItem('esAdmin', 'true');
        location.reload();
    } else {
        alert('Clave incorrecta');
    }
});

// Cargar publicaciones
document.addEventListener("DOMContentLoaded", async () => {
    if (localStorage.getItem('esAdmin') === 'true') {
        document.getElementById('nueva-publicacion').classList.remove('oculto');
    }

    // Tu lógica existente de Firestore aquí...
    // (Mantén las funciones de cargar/eliminar publicaciones)
});

// Funciones para tarjetas (mantén las que ya tienes)
function cerrarInfo() {
    document.getElementById('info-detallada').classList.add('oculto');
}

