

/* ==========================================
   SISTEMA GLOBAL DE ACCESIBILIDAD GIDTIITEC
   ========================================== */

(() => {

    /* 1. CONFIGURACIÓN INICIAL */

    const CLAVE_ALMACENAMIENTO = "gidtiitec-accesibilidad";

    const valoresPredeterminados = {
        escala: 1,
        tema: "estandar",
        "tipografia-legible": false,
        interlineado: "1.65",
        "subrayar-enlaces": true,
        "reducir-animaciones": true,
        "foco-visible": true
    };

    const temasPermitidos = [
        "estandar",
        "contraste-claro",
        "contraste-oscuro",
        "monocromatico"
    ];

    let preferencias = cargarPreferencias();

    const documento = document.documentElement;


    /* 2. CARGAR PREFERENCIAS GUARDADAS */

    function cargarPreferencias() {

        try {
            const guardadas = localStorage.getItem(CLAVE_ALMACENAMIENTO);

            if (guardadas) {
                const datos = JSON.parse(guardadas);

                return {
                    ...valoresPredeterminados,
                    ...datos,
                    escala: [0.9, 1, 1.1, 1.25, 1.5, 1.75].includes(datos.escala)
                        ? datos.escala
                        : 1,
                    // El usuario puede elegir otros temas durante la sesión,
                    // pero cada carga de página comienza en el modo estándar.
                    tema: "estandar"
                };
            }

        } catch (error) {
            console.warn("No se pudieron cargar las preferencias:", error);
        }

        return { ...valoresPredeterminados };
    }


    /* 3. GUARDAR PREFERENCIAS */

    function guardarPreferencias() {

        try {
            localStorage.setItem(
                CLAVE_ALMACENAMIENTO,
                JSON.stringify(preferencias)
            );

            return true;

        } catch (error) {
            console.error("No se pudieron guardar las preferencias:", error);
            return false;
        }
    }


    /* 4. APLICAR PREFERENCIAS A TODA LA PÁGINA */

    function aplicarPreferencias() {

        // Escala de texto
        documento.style.fontSize = `${preferencias.escala * 100}%`;

        // Interlineado
        documento.style.setProperty("--interlineado", preferencias.interlineado);

        // Tema visual
        documento.dataset.modoVisual = preferencias.tema;

        // Preferencias visuales
        documento.dataset.tipografiaLegible =
            preferencias["tipografia-legible"];

        documento.dataset.subrayarEnlaces =
            preferencias["subrayar-enlaces"];

        documento.dataset.reducirAnimaciones =
            preferencias["reducir-animaciones"];

        documento.dataset.focoVisible =
            preferencias["foco-visible"];


        actualizarControles();
    }


    /* 5. ACTUALIZAR LOS CONTROLES DEL HTML */

    function actualizarControles() {

        // Botones de escala de texto
        document.querySelectorAll("[data-escala]").forEach(boton => {

            const escala = Number(boton.dataset.escala);
            const seleccionado = escala === preferencias.escala;

            boton.classList.toggle("activo", seleccionado);
            boton.setAttribute("aria-pressed", String(seleccionado));
        });

        // Perfiles cromáticos
        document.querySelectorAll("[data-tema]").forEach(boton => {

            const seleccionado =
                boton.dataset.tema === preferencias.tema;

            boton.classList.toggle("activo", seleccionado);
            boton.setAttribute("aria-checked", String(seleccionado));
            // Cada perfil queda disponible con Tab además de las flechas.
            boton.tabIndex = 0;
        });

        // Interruptores
        document.querySelectorAll("[data-preferencia]").forEach(input => {

            const nombre = input.dataset.preferencia;

            if (input.type === "checkbox" && Object.hasOwn(preferencias, nombre)) {
                input.checked = preferencias[nombre];
            }
        });

        // Actualizar selector de interlineado
        const selectorInterlineado = document.querySelector(
            "#select-interlineado"
        );

        if (selectorInterlineado) {
            selectorInterlineado.value = preferencias.interlineado;
        }

    }


    /* 6. CAMBIAR LA ESCALA DEL TEXTO */

    document.querySelectorAll("[data-escala]").forEach(boton => {

        boton.addEventListener("click", () => {

            const nuevaEscala = Number(boton.dataset.escala);

            if (![0.9, 1, 1.1, 1.25, 1.5, 1.75].includes(nuevaEscala)) {
                return;
            }

            preferencias.escala = nuevaEscala;

            aplicarPreferencias();
            guardarPreferencias();
        });


    });

    const selectorInterlineado = document.querySelector("#select-interlineado");
    if (selectorInterlineado) {
        selectorInterlineado.addEventListener("change", () => {
            preferencias.interlineado = selectorInterlineado.value;
            aplicarPreferencias();
            guardarPreferencias();
        });
    }


    /* 7. CAMBIAR EL TEMA VISUAL */

    function cambiarTema(nuevoTema) {

        if (!temasPermitidos.includes(nuevoTema)) {
            return;
        }

        preferencias.tema = nuevoTema;

        aplicarPreferencias();
        guardarPreferencias();
    }

    document.querySelectorAll("[data-tema]").forEach(boton => {

        boton.addEventListener("click", () => {
            cambiarTema(boton.dataset.tema);
        });

    });


    /* 8. CAMBIAR LOS INTERRUPTORES */

    document.querySelectorAll("[data-preferencia]").forEach(input => {

        input.addEventListener("change", () => {

            const nombre = input.dataset.preferencia;

            if (input.type === "checkbox" && Object.hasOwn(preferencias, nombre)) {

                preferencias[nombre] = input.checked;

                aplicarPreferencias();
                guardarPreferencias();
            }
        });

    });


    /* 9. NAVEGACIÓN CON FLECHAS EN LOS PERFILES */

    document.querySelectorAll('[role="radiogroup"]').forEach(grupo => {

        grupo.addEventListener("keydown", event => {

            if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) {
                return;
            }

            const radios = Array.from(
                grupo.querySelectorAll('[role="radio"][data-tema]')
            );

            if (radios.length === 0) return;

            event.preventDefault();

            const actual = radios.indexOf(document.activeElement);
            if (event.key === "Home" || event.key === "End") {
                event.preventDefault();
                const destino = event.key === "Home" ? radios[0] : radios[radios.length - 1];
                destino.focus();
                cambiarTema(destino.dataset.tema);
                return;
            }
            const direccion =
                event.key === "ArrowRight" || event.key === "ArrowDown"
                    ? 1
                    : -1;

            const siguiente =
                (actual + direccion + radios.length) % radios.length;

            radios[siguiente].focus();
            cambiarTema(radios[siguiente].dataset.tema);
        });

    });


    /* 10. BOTÓN PARA GUARDAR */

    const botonGuardar = document.querySelector("#guardar-preferencias");
    const mensajeEstado = document.querySelector("#estado-preferencias");

    if (botonGuardar) {

        botonGuardar.addEventListener("click", () => {

            const guardado = guardarPreferencias();

            if (mensajeEstado) {
                mensajeEstado.textContent = guardado
                    ? "Preferencias guardadas correctamente."
                    : "No fue posible guardar las preferencias en este navegador.";
            }
        });
    }


    /* 11. RESTABLECER VALORES PREDETERMINADOS */

    const botonRestablecer =
        document.querySelector("#restablecer-preferencias");

    if (botonRestablecer) {

        botonRestablecer.addEventListener("click", () => {

            preferencias = { ...valoresPredeterminados };

            aplicarPreferencias();
            guardarPreferencias();

            if (mensajeEstado) {
                mensajeEstado.textContent =
                    "Se restablecieron las preferencias predeterminadas.";
            }
        });
    }


    /* 12. MODAL FLOTANTE DE ACCESIBILIDAD */

    const botonAccesibilidad =
        document.querySelector(".boton-accesibilidad");

    const menuAccesibilidad =
        document.querySelector("#menu-accesibilidad");

    const modalAccesibilidad =
        document.querySelector(".modal-accesibilidad");

    const botonCerrar =
        document.querySelector(".btn-cerrar-modal");

    if (
        botonAccesibilidad &&
        menuAccesibilidad &&
        modalAccesibilidad &&
        botonCerrar
    ) {
        let overflowAnterior = "";

        function abrirModal() {

            overflowAnterior = document.body.style.overflow;

            menuAccesibilidad.hidden = false;
            document.body.style.overflow = "hidden";

            botonAccesibilidad.setAttribute("aria-expanded", "true");

            botonCerrar.focus();
        }

        function cerrarModal() {

            menuAccesibilidad.hidden = true;
            document.body.style.overflow = overflowAnterior;

            botonAccesibilidad.setAttribute("aria-expanded", "false");

            botonAccesibilidad.focus();
        }

        botonAccesibilidad.addEventListener("click", abrirModal);

        botonCerrar.addEventListener("click", cerrarModal);

        menuAccesibilidad.addEventListener("click", event => {

            if (event.target === menuAccesibilidad) {
                cerrarModal();
            }
        });

        document.addEventListener("keydown", event => {

            if (event.key === "Escape" && !menuAccesibilidad.hidden) {
                cerrarModal();
            }
        });


        /* Mantener el teclado dentro del modal */

        modalAccesibilidad.addEventListener("keydown", event => {

            if (event.key !== "Tab") return;

            const elementos = Array.from(
                modalAccesibilidad.querySelectorAll(
                    'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
                )
            ).filter(elemento =>
                !elemento.hidden && elemento.getClientRects().length > 0
            );

            if (elementos.length === 0) {
                event.preventDefault();
                modalAccesibilidad.focus();
                return;
            }

            const primero = elementos[0];
            const ultimo = elementos[elementos.length - 1];

            if (event.shiftKey && document.activeElement === primero) {

                event.preventDefault();
                ultimo.focus();

            } else if (
                !event.shiftKey &&
                document.activeElement === ultimo
            ) {

                event.preventDefault();
                primero.focus();
            }
        });

    }

    /* 13. ATAJOS DE TECLADO ANUNCIADOS EN LA PÁGINA */
    function ejecutarAtajoPendiente() {
        try {
            const pendiente = sessionStorage.getItem("gidtiitec-atajo-pendiente");
            if (!pendiente) return;
            sessionStorage.removeItem("gidtiitec-atajo-pendiente");

            if (pendiente === "buscar") {
                document.querySelector('input[type="search"], [role="search"] input')?.focus();
            } else if (pendiente === "modal") {
                botonAccesibilidad?.click();
            }
        } catch (error) {
            console.warn("No se pudo completar el atajo pendiente:", error);
        }
    }

    document.addEventListener("keydown", event => {
        if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

        const tecla = event.key;
        if (!["1", "2", "3", "4"].includes(tecla)) return;

        const destino = {
            "1": () => {
                const enlaceInicio = document.querySelector(
                    '.navegacion-principal a[href*="index.html"]'
                );
                if (enlaceInicio) window.location.href = enlaceInicio.href;
            },
            "2": () => document.querySelector("#contenido-principal")?.focus(),
            "3": () => {
                const buscador = document.querySelector(
                    'input[type="search"], [role="search"] input'
                );
                if (buscador) {
                    buscador.focus();
                    return;
                }

                try {
                    sessionStorage.setItem("gidtiitec-atajo-pendiente", "buscar");
                } catch (error) {
                    console.warn("No se pudo preparar el atajo de búsqueda:", error);
                }
                document.querySelector('.navegacion-principal a[href*="index.html"]')?.click();
            },
            "4": () => {
                if (botonAccesibilidad) {
                    botonAccesibilidad.click();
                    return;
                }

                try {
                    sessionStorage.setItem("gidtiitec-atajo-pendiente", "modal");
                } catch (error) {
                    console.warn("No se pudo preparar el atajo del panel:", error);
                }
                document.querySelector('.navegacion-principal a[href*="index.html"]')?.click();
            }
        }[tecla];

        if (destino) {
            event.preventDefault();
            destino();
        }
    });


    /* 14. INICIAR EL SISTEMA */

    aplicarPreferencias();
    ejecutarAtajoPendiente();

    console.log("Sistema de accesibilidad GIDTIITEC iniciado.");

})();
