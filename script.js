document.addEventListener("DOMContentLoaded", function () {
    const botonPublicar = document.getElementById("publicar");
    const listaPublicaciones = document.getElementById("lista-publicaciones");

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

        const procesarPublicacion = () => {
            const nuevaPublicacion = { titulo, contenido, imagen: imagenData, video: videoData, miniatura: miniaturaData };
            agregarPublicacion(nuevaPublicacion);
            guardarPublicacion(nuevaPublicacion);
        };

        let archivosPendientes = 0;
        const revisarYPublicar = () => {
            archivosPendientes--;
            if (archivosPendientes === 0) procesarPublicacion();
        };

        if (imagenInput.files.length > 0) {
            archivosPendientes++;
            const readerImagen = new FileReader();
            readerImagen.readAsDataURL(imagenInput.files[0]);
            readerImagen.onload = function (event) {
                imagenData = event.target.result;
                revisarYPublicar();
            };
        }

        if (videoInput.files.length > 0) {
            archivosPendientes++;
            const readerVideo = new FileReader();
            readerVideo.readAsDataURL(videoInput.files[0]);
            readerVideo.onload = function (event) {
                videoData = event.target.result;
                revisarYPublicar();
            };
        }

        if (miniaturaInput.files.length > 0) {
            archivosPendientes++;
            const readerMiniatura = new FileReader();
            readerMiniatura.readAsDataURL(miniaturaInput.files[0]);
            readerMiniatura.onload = function (event) {
                miniaturaData = event.target.result;
                revisarYPublicar();
            };
        }

        if (archivosPendientes === 0) procesarPublicacion();

        // Limpiar campos
        document.getElementById("titulo").value = "";
        document.getElementById("contenido").value = "";
        document.getElementById("imagen").value = "";
        document.getElementById("video").value = "";
        document.getElementById("miniatura").value = "";
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
});

// Función para reproducir video con miniatura
function reproducirVideo(elemento) {
    const video = elemento.nextElementSibling;
    elemento.style.display = "none";
    video.classList.remove("video-escondido");
    video.setAttribute("controls", "true");
    video.play();
}

// Función para personalizar controles de video
document.addEventListener("DOMContentLoaded", function () {
    function crearControlesPersonalizados(video) {
        const contenedor = document.createElement("div");
        contenedor.classList.add("video-wrapper");

        const barraProgreso = document.createElement("div");
        barraProgreso.classList.add("barra-progreso");

        const progreso = document.createElement("div");
        progreso.classList.add("progreso");

        barraProgreso.appendChild(progreso);
        contenedor.appendChild(video);
        contenedor.appendChild(barraProgreso);

        video.parentNode.replaceChild(contenedor, video);

        barraProgreso.addEventListener("click", function (e) {
            const rect = barraProgreso.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const porcentaje = offsetX / rect.width;
            video.currentTime = porcentaje * video.duration;
        });

        video.addEventListener("timeupdate", function () {
            const porcentaje = (video.currentTime / video.duration) * 100;
            progreso.style.width = porcentaje + "%";
        });
    }

    document.querySelectorAll("video").forEach(crearControlesPersonalizados);
});

// Funcionalidad de "Nosotros"
document.addEventListener("DOMContentLoaded", function () {
    const tarjetas = document.querySelectorAll(".tarjeta");
    const infoDetallada = document.getElementById("info-detallada");
    const contenidoInfo = document.getElementById("contenido-info");
    const cerrarInfo = document.querySelector("#info-detallada button");

    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("click", function () {
            const nombre = this.getAttribute("data-nombre");
            const descripcion = this.getAttribute("data-descripcion");
            const imagen = this.querySelector("img").src;

            contenidoInfo.innerHTML = `
                <img src="${imagen}" alt="${nombre}" class="imagen-info">
                <h3>${nombre}</h3>
                <p>${descripcion}</p>
            `;
            infoDetallada.classList.remove("oculto");
        });
    });

    cerrarInfo.addEventListener("click", function () {
        infoDetallada.classList.add("oculto");
    });
});
