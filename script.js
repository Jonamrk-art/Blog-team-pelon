document.addEventListener("DOMContentLoaded", function () {
    const botonPublicar = document.getElementById("publicar");
    const listaPublicaciones = document.getElementById("lista-publicaciones");
    const formulario = document.getElementById("nueva-publicacion");

    // Clave secreta para administrar el blog
    const claveAdmin = "miClaveSecreta";
    const esAdmin = localStorage.getItem("admin") === claveAdmin;

    // Mostrar el formulario solo si eres admin
    formulario.style.display = esAdmin ? "block" : "none";
    botonPublicar.style.display = esAdmin ? "block" : "none";

    cargarPublicaciones();

    botonPublicar.addEventListener("click", function () {
        const titulo = document.getElementById("titulo").value.trim();
        const contenido = document.getElementById("contenido").value.trim();
        const imagenInput = document.getElementById("imagen");
        const videoInput = document.getElementById("video");
        const miniaturaInput = document.getElementById("miniatura");

        if (!titulo || !contenido) {
            alert("Por favor, llena todos los campos.");
            return;
        }

        let imagenData = null, videoData = null, miniaturaData = null;
        let archivosPendientes = 0;

        const procesarPublicacion = () => {
            const nuevaPublicacion = { titulo, contenido, imagen: imagenData, video: videoData, miniatura: miniaturaData };
            agregarPublicacion(nuevaPublicacion);
            guardarPublicacion(nuevaPublicacion);
        };

        const revisarYPublicar = () => {
            archivosPendientes--;
            if (archivosPendientes === 0) procesarPublicacion();
        };

        if (imagenInput.files.length > 0) {
            archivosPendientes++;
            const readerImagen = new FileReader();
            readerImagen.onload = (event) => { imagenData = event.target.result; revisarYPublicar(); };
            readerImagen.readAsDataURL(imagenInput.files[0]);
        }

        if (videoInput.files.length > 0) {
            archivosPendientes++;
            const readerVideo = new FileReader();
            readerVideo.onload = (event) => { videoData = event.target.result; revisarYPublicar(); };
            readerVideo.readAsDataURL(videoInput.files[0]);
        }

        if (miniaturaInput.files.length > 0) {
            archivosPendientes++;
            const readerMiniatura = new FileReader();
            readerMiniatura.onload = (event) => { miniaturaData = event.target.result; revisarYPublicar(); };
            readerMiniatura.readAsDataURL(miniaturaInput.files[0]);
        }

        if (archivosPendientes === 0) procesarPublicacion();
    });

    function agregarPublicacion(publicacion) {
        const nuevaPublicacion = document.createElement("div");
        nuevaPublicacion.classList.add("publicacion");

        let videoHtml = "";
        if (publicacion.video) {
            videoHtml = publicacion.miniatura
                ? `<div class="video-container">
                    <img src="${publicacion.miniatura}" class="miniatura" onclick="reproducirVideo(this)">
                    <video class="video-escondido">
                        <source src="${publicacion.video}" type="video/mp4">
                    </video>
                   </div>`
                : `<video controls><source src="${publicacion.video}" type="video/mp4"></video>`;
        }

        nuevaPublicacion.innerHTML = `
            <h3>${publicacion.titulo}</h3>
            <p>${publicacion.contenido}</p>
            ${publicacion.imagen ? `<img src="${publicacion.imagen}" alt="Imagen de la publicación">` : ""}
            ${videoHtml}
            <button class="borrar">Eliminar</button>
        `;

        nuevaPublicacion.querySelector(".borrar").addEventListener("click", function () {
            nuevaPublicacion.remove();
            eliminarPublicacion(publicacion);
        });

        listaPublicaciones.appendChild(nuevaPublicacion);
    }

    function guardarPublicacion(publicacion) {
        let publicaciones = JSON.parse(localStorage.getItem("publicaciones")) || [];
        publicaciones.push(publicacion);
        localStorage.setItem("publicaciones", JSON.stringify(publicaciones));
    }

    function cargarPublicaciones() {
        let publicaciones = JSON.parse(localStorage.getItem("publicaciones")) || [];
        publicaciones.forEach(agregarPublicacion);
    }

    function eliminarPublicacion(publicacionEliminada) {
        let publicaciones = JSON.parse(localStorage.getItem("publicaciones")) || [];
        publicaciones = publicaciones.filter(pub => pub.titulo !== publicacionEliminada.titulo || pub.contenido !== publicacionEliminada.contenido);
        localStorage.setItem("publicaciones", JSON.stringify(publicaciones));
    }

    if (esAdmin) {
        console.log("Eres administrador");
    } else {
        console.log("No eres administrador");
    }
});

