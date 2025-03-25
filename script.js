// Configura Firebase (¡usa tus datos reales!)
const firebaseConfig = {
    apiKey: "AIzaSyBKP--CTIBM4XDoaT9Dz_VqBRt7SV2AZk0",
    authDomain: "blog-team-pelon.firebaseapp.com",
    projectId: "blog-team-pelon",
    storageBucket: "blog-team-pelon.firebasestorage.app",
    messagingSenderId: "198572305645",
    appId: "1:198572305645:web:8d37ed8f347eb80852f0e4",
    measurementId: "G-VBB00G54MZ"
  };

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===== BIOGRAFÍAS =====
document.querySelectorAll('.miembro').forEach(miembro => {
    miembro.addEventListener('click', () => {
        document.getElementById('bio-texto').textContent = miembro.dataset.bio;
        document.getElementById('bio-modal').classList.remove('oculto');
    });
});

// Cerrar modal
document.querySelector('.cerrar').addEventListener('click', () => {
    document.getElementById('bio-modal').classList.add('oculto');
});

// ===== PUBLICACIONES =====
function cargarPublicaciones() {
    db.collection("publicaciones").orderBy("fecha", "desc").onSnapshot((snapshot) => {
        const lista = document.getElementById('lista-publicaciones');
        lista.innerHTML = '';
        
        snapshot.forEach(doc => {
            const publicacion = doc.data();
            lista.innerHTML += `
                <div class="publicacion">
                    <h3>${publicacion.autor}</h3>
                    <p>${publicacion.texto}</p>
                    ${publicacion.imagen ? `<img src="${publicacion.imagen}" width="200">` : ''}
                    <button class="reaccion" data-id="${doc.id}">❤️ ${publicacion.likes || 0}</button>
                </div>
            `;
        });

        // Agregar eventos de like
        document.querySelectorAll('.reaccion').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                db.collection("publicaciones").doc(id).update({
                    likes: firebase.firestore.FieldValue.increment(1)
                });
            });
        });
    });
}

// Iniciar
cargarPublicaciones();
