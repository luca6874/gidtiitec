(() => {
    const boton = document.querySelector(".boton-lsm");
    const reproductor = document.querySelector("#reproductor-lsm");
    const video = reproductor?.querySelector(".video-lsm");
    const botonPausa = reproductor?.querySelector(".lsm-pausa");
    const botonCerrar = reproductor?.querySelector(".lsm-cerrar");
    const rutaVideo = document.body.dataset.lsmVideo;

    if (!boton || !reproductor || !video || !botonPausa || !botonCerrar || !rutaVideo) return;

    const actualizarControlReproduccion = () => {
        const pausado = video.paused || video.ended;
        botonPausa.textContent = pausado ? "Reproducir" : "Pausar";
        botonPausa.setAttribute("aria-label", pausado ? "Reproducir video LSM" : "Pausar video LSM");
    };

    const cerrar = () => {
        video.pause();
        video.removeAttribute("src");
        video.load();
        reproductor.hidden = true;
        reproductor.setAttribute("aria-hidden", "true");
        boton.setAttribute("aria-expanded", "false");
        boton.setAttribute("aria-label", "Activar reproductor de Lengua de Señas Mexicana");
        actualizarControlReproduccion();
        boton.focus();
    };

    const abrir = () => {
        video.src = new URL(rutaVideo, document.baseURI).href;
        reproductor.hidden = false;
        reproductor.setAttribute("aria-hidden", "false");
        boton.setAttribute("aria-expanded", "true");
        boton.setAttribute("aria-label", "Desactivar reproductor de Lengua de Señas Mexicana");
        actualizarControlReproduccion();
    };

    boton.addEventListener("click", () => {
        if (reproductor.hidden) abrir();
        else cerrar();
    });

    botonCerrar.addEventListener("click", cerrar);

    botonPausa.addEventListener("click", async () => {
        if (video.paused || video.ended) {
            try {
                if (video.ended) video.currentTime = 0;
                await video.play();
            } catch {
                // El control nativo del video permanece disponible si el navegador bloquea play().
            }
        } else {
            video.pause();
        }
        actualizarControlReproduccion();
    });

    video.addEventListener("play", actualizarControlReproduccion);
    video.addEventListener("pause", actualizarControlReproduccion);
    video.addEventListener("ended", actualizarControlReproduccion);
})();
