// ==========================================
// CHECKPOINT SELECT
// Sistema automático de valoraciones
// ==========================================

const categorias = document.querySelectorAll(".valoracion");
const elementoNotaFinal = document.querySelector("#nota-final");

let sumaNotas = 0;
let cantidadNotas = 0;


// Recorremos todas las categorías
categorias.forEach((categoria) => {

    const elementoNota = categoria.querySelector(".nota-categoria");
    const barra = categoria.querySelector(".relleno");

    const nota = Number(elementoNota.dataset.nota);


    // Mostramos la nota usando coma
    elementoNota.textContent =
        nota.toString().replace(".", ",");


    // Convertimos la nota de 0-10 a porcentaje
    // Ejemplo:
    // 10 = 100%
    // 8.5 = 85%
    // 5 = 50%

    const porcentaje = nota * 10;

    barra.style.width = porcentaje + "%";


    // Sumamos la nota para calcular la media
    sumaNotas += nota;
    cantidadNotas++;

});


// ==========================================
// NOTA FINAL
// ==========================================

if (cantidadNotas > 0 && elementoNotaFinal) {

    const media = sumaNotas / cantidadNotas;

    elementoNotaFinal.textContent =
        media.toFixed(2).replace(".", ",");

}