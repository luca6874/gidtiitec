
/* =====================================
   ELEMENTOS DEL DOM
===================================== */

// Botón flotante
const botonAccesibilidad = document.querySelector(
    ".boton-accesibilidad"
);

// Fondo que cubre la pantalla
const menuAccesibilidad = document.querySelector(
    "#menu-accesibilidad"
);

// Contenido del modal
const modalAccesibilidad = document.querySelector(
    ".modal-accesibilidad"
);

// Botón para cerrar
const botonCerrar = document.querySelector(
    ".btn-cerrar-modal"
);


/* =====================================
   ABRIR MODAL
===================================== */

function abrirModal() {

    // Mostramos el modal
    menuAccesibilidad.hidden = false;

    // Indicamos que el botón está expandido
    botonAccesibilidad.setAttribute(
        "aria-expanded",
        "true"
    );

    // Llevamos el foco al botón de cerrar
    botonCerrar.focus();
}


/* =====================================
   CERRAR MODAL
===================================== */

function cerrarModal() {

    // Ocultamos el modal
    menuAccesibilidad.hidden = true;

    // Indicamos que el botón ya no está expandido
    botonAccesibilidad.setAttribute(
        "aria-expanded",
        "false"
    );

    // Devolvemos el foco al botón flotante
    botonAccesibilidad.focus();
}


/* =====================================
   EVENTOS DEL BOTÓN
===================================== */

// Abrir
botonAccesibilidad.addEventListener(
    "click",
    abrirModal
);

// Cerrar
botonCerrar.addEventListener(
    "click",
    cerrarModal
);


/* =====================================
   CERRAR CON ESCAPE
===================================== */

document.addEventListener("keydown", function(event) {

    if (
        event.key === "Escape" &&
        !menuAccesibilidad.hidden
    ) {
        cerrarModal();
    }

});


/* =====================================
   CERRAR AL HACER CLIC FUERA
===================================== */

menuAccesibilidad.addEventListener("click", function(event) {

    // Comprobamos si el clic fue directamente
    // sobre el fondo y no sobre el cuadro del modal

    if (event.target === menuAccesibilidad) {
        cerrarModal();
    }

});


/* =====================================
   CONTROL DEL FOCO DEL TECLADO
===================================== */

modalAccesibilidad.addEventListener("keydown", function(event) {

    if (event.key !== "Tab") {
        return;
    }

    // Buscamos los elementos que pueden recibir el foco
    const elementosEnfocables = modalAccesibilidad.querySelectorAll(
        'button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])'
    );

    const primero = elementosEnfocables[0];
    const ultimo = elementosEnfocables[elementosEnfocables.length - 1];

    // Si presionamos Shift + Tab estando en el primero
    if (event.shiftKey && document.activeElement === primero) {

        event.preventDefault();
        ultimo.focus();

    }

    // Si presionamos Tab estando en el último
    else if (!event.shiftKey && document.activeElement === ultimo) {

        event.preventDefault();
        primero.focus();

    }

});
