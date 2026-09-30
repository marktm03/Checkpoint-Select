// ==========================================
// CHECKPOINT SELECT
// ADMIN.JS
// ==========================================


// ==========================================
// CONFIGURACIÓN
// ==========================================

const BUCKET_IMAGENES = "imagenes-juegos";

const parametros = new URLSearchParams(
    window.location.search
);

const juegoEditandoId =
    parametros.get("id");

let usuarioActual = null;

let archivoPortadaActual = null;
let archivoFondoActual = null;

let portadaUrlActual = null;
let fondoUrlActual = null;


// ==========================================
// ELEMENTOS DEL FORMULARIO
// ==========================================

const formulario =
    document.getElementById(
        "formulario-juego"
    );

const tituloInput =
    document.getElementById(
        "titulo"
    );

const plataformaInput =
    document.getElementById(
        "plataforma"
    );

const anioInput =
    document.getElementById(
        "anio-juego"
    );

const horasInput =
    document.getElementById(
        "horas"
    );

const mesInicioInput =
    document.getElementById(
        "mes-inicio"
    );

const anioInicioInput =
    document.getElementById(
        "anio-inicio"
    );

const mesFinInput =
    document.getElementById(
        "mes-fin"
    );

const anioFinInput =
    document.getElementById(
        "anio-fin"
    );

const opinionInput =
    document.getElementById(
        "opinion"
    );


// ==========================================
// IMÁGENES
// ==========================================

const portadaInput =
    document.getElementById(
        "portada"
    );

const imagenPreview =
    document.getElementById(
        "imagen-preview"
    );

const previewVacio =
    document.getElementById(
        "preview-vacio"
    );


const fondoInput =
    document.getElementById(
        "fondo-ficha"
    );

const fondoPreview =
    document.getElementById(
        "fondo-preview"
    );

const fondoPreviewVacio =
    document.getElementById(
        "fondo-preview-vacio"
    );

const estadoFondo =
    document.getElementById(
        "estado-fondo"
    );


// ==========================================
// COLORES
// ==========================================

const colorPrincipalInput =
    document.getElementById(
        "color-principal"
    );

const colorSecundarioInput =
    document.getElementById(
        "color-secundario"
    );

const colorAcentoInput =
    document.getElementById(
        "color-acento"
    );

const hexPrincipal =
    document.getElementById(
        "hex-principal"
    );

const hexSecundario =
    document.getElementById(
        "hex-secundario"
    );

const hexAcento =
    document.getElementById(
        "hex-acento"
    );

const estadoPaleta =
    document.getElementById(
        "estado-paleta"
    );


// ==========================================
// INTERFAZ
// ==========================================

const tituloAdmin =
    document.getElementById(
        "titulo-admin"
    );

const descripcionAdmin =
    document.getElementById(
        "descripcion-admin"
    );

const botonGuardar =
    document.getElementById(
        "guardar-juego"
    );

const botonCancelar =
    document.getElementById(
        "boton-cancelar"
    );

const estadoGuardado =
    document.getElementById(
        "estado-guardado"
    );

const notaFinalElemento =
    document.getElementById(
        "nota-final"
    );


// ==========================================
// SLIDERS
// ==========================================

const controlesNota =
    document.querySelectorAll(
        ".control-nota"
    );


// ==========================================
// ESTADO
// ==========================================

function actualizarEstado(
    texto,
    tipo = ""
) {

    if (!estadoGuardado) {
        return;
    }

    estadoGuardado.textContent =
        texto;

    estadoGuardado.dataset.tipo =
        tipo;
}


// ==========================================
// FORMATEAR NOTAS
// ==========================================

function formatearNota(valor) {

    const numero =
        Number(valor);

    if (
        Number.isInteger(numero)
    ) {

        return numero.toString();
    }

    return numero.toFixed(1);
}


// ==========================================
// OBTENER VALORACIONES
// ==========================================

function obtenerValoraciones() {

    const valoraciones = {};

    controlesNota.forEach(control => {

        const categoria =
            control.dataset.categoria;

        const slider =
            control.querySelector(
                'input[type="range"]'
            );

        const excluido =
            control.classList.contains(
                "categoria-excluida"
            );

        valoraciones[categoria] =
            excluido
                ? null
                : Number(slider.value);
    });

    return valoraciones;
}


// ==========================================
// CALCULAR MEDIA
// ==========================================

function calcularMedia() {

    const valoraciones =
        obtenerValoraciones();

    const valores =
        Object.values(valoraciones)
            .filter(
                valor =>
                    valor !== null &&
                    valor !== undefined
            );

    if (valores.length === 0) {
        return 0;
    }

    const suma =
        valores.reduce(
            (total, valor) =>
                total + valor,
            0
        );

    return suma / valores.length;
}


// ==========================================
// ACTUALIZAR NOTA FINAL
// ==========================================

function actualizarNotaFinal() {

    const media =
        calcularMedia();


    // ACTUALIZAR NÚMERO DE LA NOTA
    if (notaFinalElemento) {

        notaFinalElemento.textContent =
            media.toFixed(2);
    }


    // CONTAR CATEGORÍAS INCLUIDAS
    const valoraciones =
        obtenerValoraciones();

    const categoriasIncluidas =
        Object.values(valoraciones).filter(
            (valor) =>
                valor !== null &&
                valor !== undefined &&
                valor !== ""
        ).length;


    // ACTUALIZAR TEXTO DE DEBAJO
    const textoMedia =
        document.querySelector(
            ".resultado-media small"
        );

    if (textoMedia) {

        textoMedia.textContent =
            `Media de las ${categoriasIncluidas} categorías`;
    }
}


// ==========================================
// CONFIGURAR SLIDERS
// ==========================================

controlesNota.forEach(control => {

    const slider =
        control.querySelector(
            'input[type="range"]'
        );

    const valor =
        control.querySelector(
            ".valor-nota"
        );

    const cabecera =
        control.querySelector(
            ".cabecera-control-nota"
        );

    if (
        !slider ||
        !valor ||
        !cabecera
    ) {
        return;
    }


    // ======================================
    // BOTÓN INCLUIR / NO APLICA
    // ======================================

    const boton =
        document.createElement(
            "button"
        );

    boton.type = "button";

    boton.className =
        "boton-categoria";

    boton.textContent =
        "INCLUIR";


    cabecera.appendChild(
        boton
    );


    const actualizar = () => {

        if (
            control.classList.contains(
                "categoria-excluida"
            )
        ) {

            valor.textContent = "—";

        } else {

            valor.textContent =
                formatearNota(
                    slider.value
                );
        }

        actualizarNotaFinal();
    };


    boton.addEventListener(
        "click",
        () => {

            const excluida =
                control.classList.toggle(
                    "categoria-excluida"
                );

            slider.disabled =
                excluida;

            boton.textContent =
                excluida
                    ? "NO APLICA"
                    : "INCLUIR";

            boton.classList.toggle(
                "no-aplica",
                excluida
            );

            actualizar();
        }
    );


    slider.addEventListener(
        "input",
        actualizar
    );

    slider.addEventListener(
        "change",
        actualizar
    );


    actualizar();
});


// ==========================================
// CAMBIAR VALORACIÓN
// ==========================================

function establecerValoracion(
    categoria,
    valor
) {

    const control =
        document.querySelector(
            `.control-nota[data-categoria="${categoria}"]`
        );

    if (!control) {
        return;
    }


    const slider =
        control.querySelector(
            'input[type="range"]'
        );

    const texto =
        control.querySelector(
            ".valor-nota"
        );

    const boton =
        control.querySelector(
            ".boton-categoria"
        );


    if (!slider) {
        return;
    }


    // CATEGORÍA NO APLICABLE

    if (
        valor === null ||
        valor === undefined
    ) {

        control.classList.add(
            "categoria-excluida"
        );

        slider.disabled = true;

        if (texto) {
            texto.textContent = "—";
        }

        if (boton) {

            boton.textContent =
                "NO APLICA";

            boton.classList.add(
                "no-aplica"
            );
        }

        return;
    }


    // CATEGORÍA NORMAL

    control.classList.remove(
        "categoria-excluida"
    );

    slider.disabled = false;


    const numero =
        Number(valor);


    slider.value =
        Number.isFinite(numero)
            ? numero
            : 5;


    if (texto) {

        texto.textContent =
            formatearNota(
                slider.value
            );
    }


    if (boton) {

        boton.textContent =
            "INCLUIR";

        boton.classList.remove(
            "no-aplica"
        );
    }
}


// ==========================================
// COLORES
// ==========================================

function actualizarHex() {

    if (
        colorPrincipalInput &&
        hexPrincipal
    ) {

        hexPrincipal.textContent =
            colorPrincipalInput
                .value
                .toUpperCase();
    }

    if (
        colorSecundarioInput &&
        hexSecundario
    ) {

        hexSecundario.textContent =
            colorSecundarioInput
                .value
                .toUpperCase();
    }

    if (
        colorAcentoInput &&
        hexAcento
    ) {

        hexAcento.textContent =
            colorAcentoInput
                .value
                .toUpperCase();
    }
}


[
    colorPrincipalInput,
    colorSecundarioInput,
    colorAcentoInput

].forEach(
    input => {

        if (!input) {
            return;
        }

        input.addEventListener(
            "input",
            actualizarHex
        );
    }
);


actualizarHex();


// ==========================================
// RGB -> HEX
// ==========================================

function rgbAHex(
    r,
    g,
    b
) {

    return (
        "#" +
        [r, g, b]
            .map(
                valor =>
                    Math.round(
                        valor
                    )
                        .toString(16)
                        .padStart(
                            2,
                            "0"
                        )
            )
            .join("")
    );
}


// ==========================================
// DISTANCIA ENTRE COLORES
// ==========================================

function distanciaColor(
    color1,
    color2
) {

    return Math.sqrt(

        Math.pow(
            color1[0] -
            color2[0],
            2
        ) +

        Math.pow(
            color1[1] -
            color2[1],
            2
        ) +

        Math.pow(
            color1[2] -
            color2[2],
            2
        )
    );
}


// ==========================================
// EXTRAER PALETA DE PORTADA
// ==========================================

function extraerPaleta(
    imagen
) {

    try {

        const canvas =
            document.createElement(
                "canvas"
            );

        const contexto =
            canvas.getContext(
                "2d",
                {
                    willReadFrequently:
                        true
                }
            );

        const tamaño = 120;

        canvas.width =
            tamaño;

        canvas.height =
            tamaño;

        contexto.drawImage(
            imagen,
            0,
            0,
            tamaño,
            tamaño
        );

        const datos =
            contexto.getImageData(
                0,
                0,
                tamaño,
                tamaño
            ).data;


        const colores = [];


        for (
            let i = 0;
            i < datos.length;
            i += 16
        ) {

            const r =
                datos[i];

            const g =
                datos[i + 1];

            const b =
                datos[i + 2];

            const a =
                datos[i + 3];


            if (
                a < 200
            ) {

                continue;
            }


            const brillo =
                (
                    r +
                    g +
                    b
                ) / 3;


            if (
                brillo < 20 ||
                brillo > 240
            ) {

                continue;
            }


            colores.push(
                [
                    r,
                    g,
                    b
                ]
            );
        }


        if (
            colores.length === 0
        ) {

            return;
        }


        colores.sort(
            (
                a,
                b
            ) => {

                const saturacionA =
                    Math.max(
                        ...a
                    ) -
                    Math.min(
                        ...a
                    );

                const saturacionB =
                    Math.max(
                        ...b
                    ) -
                    Math.min(
                        ...b
                    );

                return (
                    saturacionB -
                    saturacionA
                );
            }
        );


        const elegidos = [];


        for (
            const color
            of colores
        ) {

            const diferente =
                elegidos.every(
                    elegido =>
                        distanciaColor(
                            color,
                            elegido
                        ) > 80
                );


            if (
                diferente
            ) {

                elegidos.push(
                    color
                );
            }


            if (
                elegidos.length >= 3
            ) {

                break;
            }
        }


        while (
            elegidos.length < 3
        ) {

            elegidos.push(
                colores[
                    Math.floor(
                        Math.random() *
                        colores.length
                    )
                ]
            );
        }


        const principal =
            rgbAHex(
                ...elegidos[0]
            );

        const secundario =
            rgbAHex(
                ...elegidos[1]
            );

        const acento =
            rgbAHex(
                ...elegidos[2]
            );


        colorPrincipalInput.value =
            principal;

        colorSecundarioInput.value =
            secundario;

        colorAcentoInput.value =
            acento;


        actualizarHex();


        if (
            estadoPaleta
        ) {

            estadoPaleta.textContent =
                "Paleta detectada";
        }


    } catch (error) {

        console.warn(
            "No se pudo detectar la paleta:",
            error
        );


        if (
            estadoPaleta
        ) {

            estadoPaleta.textContent =
                "Paleta manual";
        }
    }
}


// ==========================================
// PREVIEW PORTADA
// ==========================================

if (
    portadaInput
) {

    portadaInput.addEventListener(
        "change",
        () => {

            const archivo =
                portadaInput.files[0];

            if (!archivo) {
                return;
            }


            archivoPortadaActual =
                archivo;


            const url =
                URL.createObjectURL(
                    archivo
                );


            imagenPreview.onload =
                () => {

                    extraerPaleta(
                        imagenPreview
                    );
                };


            imagenPreview.src =
                url;

            imagenPreview.style.display =
                "block";


            if (
                previewVacio
            ) {

                previewVacio.style.display =
                    "none";
            }


            if (
                estadoPaleta
            ) {

                estadoPaleta.textContent =
                    "Analizando portada...";
            }
        }
    );
}


// ==========================================
// PREVIEW FONDO
// ==========================================

if (
    fondoInput
) {

    fondoInput.addEventListener(
        "change",
        () => {

            const archivo =
                fondoInput.files[0];

            if (!archivo) {
                return;
            }


            archivoFondoActual =
                archivo;


            const url =
                URL.createObjectURL(
                    archivo
                );


            fondoPreview.src =
                url;

            fondoPreview.style.display =
                "block";


            if (
                fondoPreviewVacio
            ) {

                fondoPreviewVacio.style.display =
                    "none";
            }


            if (
                estadoFondo
            ) {

                estadoFondo.textContent =
                    "Fondo seleccionado";
            }
        }
    );
}


// ==========================================
// MOSTRAR PORTADA EXISTENTE
// ==========================================

function mostrarPortada(
    url
) {

    if (!url) {
        return;
    }


    portadaUrlActual =
        url;


    imagenPreview.src =
        url;

    imagenPreview.style.display =
        "block";


    if (
        previewVacio
    ) {

        previewVacio.style.display =
            "none";
    }


    if (
        estadoPaleta
    ) {

        estadoPaleta.textContent =
            "Portada actual";
    }
}


// ==========================================
// MOSTRAR FONDO EXISTENTE
// ==========================================

function mostrarFondo(
    url
) {

    if (!url) {
        return;
    }


    fondoUrlActual =
        url;


    fondoPreview.src =
        url;

    fondoPreview.style.display =
        "block";


    if (
        fondoPreviewVacio
    ) {

        fondoPreviewVacio.style.display =
            "none";
    }


    if (
        estadoFondo
    ) {

        estadoFondo.textContent =
            "Fondo actual";
    }
}


// ==========================================
// NOMBRE SEGURO DE ARCHIVO
// ==========================================

function extensionArchivo(
    archivo
) {

    const partes =
        archivo.name
            .split(".");

    if (
        partes.length < 2
    ) {

        return "jpg";
    }


    return partes
        .pop()
        .toLowerCase();
}


// ==========================================
// SUBIR IMAGEN A SUPABASE
// ==========================================

async function subirImagenSupabase(
    archivo,
    idJuego,
    tipo
) {

    if (!archivo) {
        return null;
    }


    const extension =
        extensionArchivo(
            archivo
        );


    const ruta =
        `${usuarioActual.id}/${idJuego}/${tipo}-${Date.now()}.${extension}`;


    const {
        error
    } =
        await supabaseClient
            .storage
            .from(
                BUCKET_IMAGENES
            )
            .upload(
                ruta,
                archivo,
                {
                    cacheControl:
                        "3600",

                    upsert:
                        false,

                    contentType:
                        archivo.type
                }
            );


    if (error) {

        throw new Error(
            "Error subiendo " +
            tipo +
            ": " +
            error.message
        );
    }


    const {
        data
    } =
        supabaseClient
            .storage
            .from(
                BUCKET_IMAGENES
            )
            .getPublicUrl(
                ruta
            );


    return (
        data.publicUrl
    );
}


// ==========================================
// ELIMINAR IMAGEN ANTIGUA
// ==========================================

async function eliminarImagenAntigua(
    url
) {

    if (!url) {
        return;
    }


    try {

        const marcador =
            `/storage/v1/object/public/${BUCKET_IMAGENES}/`;


        const posicion =
            url.indexOf(
                marcador
            );


        if (
            posicion === -1
        ) {

            return;
        }


        const ruta =
            decodeURIComponent(
                url.substring(
                    posicion +
                    marcador.length
                )
            );


        await supabaseClient
            .storage
            .from(
                BUCKET_IMAGENES
            )
            .remove(
                [ruta]
            );


    } catch (error) {

        console.warn(
            "No se pudo eliminar la imagen anterior:",
            error
        );
    }
}


// ==========================================
// COMPROBAR USUARIO
// ==========================================

async function comprobarUsuario() {

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getUser();


    if (
        error ||
        !data.user
    ) {

        throw new Error(
            "No hay ninguna sesión iniciada."
        );
    }


    usuarioActual =
        data.user;
}


// ==========================================
// CARGAR JUEGO PARA EDITAR
// ==========================================

async function cargarJuego() {

    if (
        !juegoEditandoId
    ) {

        return;
    }


    actualizarEstado(
        "Cargando videojuego..."
    );


    const {
        data: juego,
        error
    } =
        await supabaseClient
            .from(
                "juegos"
            )
            .select("*")
            .eq(
                "id",
                juegoEditandoId
            )
            .eq(
                "usuario_id",
                usuarioActual.id
            )
            .single();


    if (error) {

        throw new Error(
            "No se pudo cargar el videojuego: " +
            error.message
        );
    }


    // ======================================
    // INFORMACIÓN GENERAL
    // ======================================

    tituloInput.value =
        juego.titulo ?? "";

    plataformaInput.value =
        juego.plataforma ?? "";

    anioInput.value =
        juego.anio_juego ?? "";

    horasInput.value =
        juego.horas ?? "";

    // FECHA DE INICIO

if (juego.fecha_inicio) {

    const partesInicio =
        juego.fecha_inicio.split("-");

    anioInicioInput.value =
        partesInicio[0] ?? "";

    mesInicioInput.value =
        partesInicio[1] ?? "";

} else {

    anioInicioInput.value = "";
    mesInicioInput.value = "";
}


// FECHA DE FINALIZACIÓN

if (juego.fecha_fin) {

    const partesFin =
        juego.fecha_fin.split("-");

    anioFinInput.value =
        partesFin[0] ?? "";

    mesFinInput.value =
        partesFin[1] ?? "";

} else {

    anioFinInput.value = "";
    mesFinInput.value = "";
}

    opinionInput.value =
        juego.opinion ?? "";


    // ======================================
    // COLORES
    // ======================================

    if (
        juego.color_principal
    ) {

        colorPrincipalInput.value =
            juego.color_principal;
    }


    if (
        juego.color_secundario
    ) {

        colorSecundarioInput.value =
            juego.color_secundario;
    }


    if (
        juego.color_acento
    ) {

        colorAcentoInput.value =
            juego.color_acento;
    }


    actualizarHex();


    // ======================================
    // VALORACIONES
    // ======================================

    establecerValoracion(
        "historia",
        juego.historia
    );

    establecerValoracion(
        "graficos",
        juego.graficos
    );

    establecerValoracion(
        "tecnico",
        juego.tecnico
    );

    establecerValoracion(
        "gameplay",
        juego.gameplay
    );

    establecerValoracion(
        "jugabilidad",
        juego.jugabilidad
    );

    establecerValoracion(
        "musica",
        juego.musica
    );

    establecerValoracion(
        "personajes",
        juego.personajes
    );

    establecerValoracion(
        "dificultad",
        juego.dificultad
    );

    establecerValoracion(
        "diversion",
        juego.diversion
    );


    actualizarNotaFinal();


    // ======================================
    // IMÁGENES
    // ======================================

    mostrarPortada(
        juego.portada_url
    );

    mostrarFondo(
        juego.fondo_url
    );


    // ======================================
    // INTERFAZ
    // ======================================

    if (
        tituloAdmin
    ) {

        tituloAdmin.textContent =
            "Editar videojuego";
    }


    if (
        descripcionAdmin
    ) {

        descripcionAdmin.textContent =
            "Modifica los datos de tu videojuego.";
    }


    if (
        botonGuardar
    ) {

        botonGuardar.textContent =
            "GUARDAR CAMBIOS";
    }


    if (
        botonCancelar
    ) {

        botonCancelar.href =
            `juego.html?id=${juego.id}`;
    }


    actualizarEstado("");
}


// ==========================================
// VALIDAR FORMULARIO
// ==========================================

// ==========================================
// VALIDAR FORMULARIO
// ==========================================

function validarFormulario() {

    if (!tituloInput.value.trim()) {

        alert(
            "Escribe el título del videojuego."
        );

        tituloInput.focus();

        return false;
    }


    if (!plataformaInput.value) {

        alert(
            "Selecciona una plataforma."
        );

        plataformaInput.focus();

        return false;
    }


    // Comprobar que si elegimos mes,
    // también elegimos año y viceversa

    if (
        (mesInicioInput.value && !anioInicioInput.value) ||
        (!mesInicioInput.value && anioInicioInput.value)
    ) {

        alert(
            "Selecciona el mes y el año de inicio."
        );

        return false;
    }


    if (
        (mesFinInput.value && !anioFinInput.value) ||
        (!mesFinInput.value && anioFinInput.value)
    ) {

        alert(
            "Selecciona el mes y el año de finalización."
        );

        return false;
    }


    // Comprobar que la finalización
    // no sea anterior al inicio

    if (
        mesInicioInput.value &&
        anioInicioInput.value &&    
        mesFinInput.value &&
        anioFinInput.value
    ) {

        const fechaInicio =
            `${anioInicioInput.value}-${mesInicioInput.value}`;

        const fechaFin =
            `${anioFinInput.value}-${mesFinInput.value}`;


        if (fechaFin < fechaInicio) {

            alert(
                "La fecha de finalización no puede ser anterior a la fecha de inicio."
            );

            return false;
        }
    }


    return true;
}


// ==========================================
// CREAR OBJETO DEL JUEGO
// ==========================================

function crearDatosJuego() {

    const valoraciones =
        obtenerValoraciones();


    return {

        usuario_id:
            usuarioActual.id,

        titulo:
            tituloInput
                .value
                .trim(),

        plataforma:
            plataformaInput.value ||
            null,

        anio_juego:
            anioInput.value
                ? Number(
                    anioInput.value
                )
                : null,

        horas:
            horasInput.value
                ? Number(
                    horasInput.value
                )
                : null,

        fecha_inicio:
    mesInicioInput.value &&
    anioInicioInput.value
        ? `${anioInicioInput.value}-${mesInicioInput.value}-01`
        : null,

fecha_fin:
    mesFinInput.value &&
    anioFinInput.value
        ? `${anioFinInput.value}-${mesFinInput.value}-01`
        : null,

        nota_final:
            Number(
                calcularMedia()
                    .toFixed(2)
            ),

        historia:
            valoraciones.historia,

        graficos:
            valoraciones.graficos,

        tecnico:
            valoraciones.tecnico,

        gameplay:
            valoraciones.gameplay,

        jugabilidad:
            valoraciones.jugabilidad,

        musica:
            valoraciones.musica,

        personajes:
            valoraciones.personajes,

        dificultad:
            valoraciones.dificultad,

        diversion:
            valoraciones.diversion,

        opinion:
            opinionInput
                .value
                .trim() ||
            null,

        color_principal:
            colorPrincipalInput.value,

        color_secundario:
            colorSecundarioInput.value,

        color_acento:
            colorAcentoInput.value
    };
}


// ==========================================
// CREAR NUEVO JUEGO
// ==========================================

async function crearJuego(
    datos
) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from(
                "juegos"
            )
            .insert(
                datos
            )
            .select()
            .single();


    if (error) {

        throw new Error(
            "No se pudo crear el videojuego: " +
            error.message
        );
    }


    return data;
}


// ==========================================
// ACTUALIZAR JUEGO
// ==========================================

async function actualizarJuego(
    idJuego,
    datos
) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from(
                "juegos"
            )
            .update(
                datos
            )
            .eq(
                "id",
                idJuego
            )
            .eq(
                "usuario_id",
                usuarioActual.id
            )
            .select()
            .single();


    if (error) {

        throw new Error(
            "No se pudo actualizar el videojuego: " +
            error.message
        );
    }


    return data;
}


// ==========================================
// GUARDAR IMÁGENES
// ==========================================

async function guardarImagenes(
    juego
) {

    let portadaUrl =
        juego.portada_url ??
        portadaUrlActual;

    let fondoUrl =
        juego.fondo_url ??
        fondoUrlActual;


    // ======================================
    // NUEVA PORTADA
    // ======================================

    if (
        archivoPortadaActual
    ) {

        actualizarEstado(
            "Subiendo portada..."
        );


        const nuevaUrl =
            await subirImagenSupabase(
                archivoPortadaActual,
                juego.id,
                "portada"
            );


        if (
            portadaUrlActual &&
            portadaUrlActual !==
            nuevaUrl
        ) {

            await eliminarImagenAntigua(
                portadaUrlActual
            );
        }


        portadaUrl =
            nuevaUrl;
    }


    // ======================================
    // NUEVO FONDO
    // ======================================

    if (
        archivoFondoActual
    ) {

        actualizarEstado(
            "Subiendo fondo..."
        );


        const nuevaUrl =
            await subirImagenSupabase(
                archivoFondoActual,
                juego.id,
                "fondo"
            );


        if (
            fondoUrlActual &&
            fondoUrlActual !==
            nuevaUrl
        ) {

            await eliminarImagenAntigua(
                fondoUrlActual
            );
        }


        fondoUrl =
            nuevaUrl;
    }


    // ======================================
    // ACTUALIZAR URLs
    // ======================================

    const cambios = {};


    if (
        portadaUrl
    ) {

        cambios.portada_url =
            portadaUrl;
    }


    if (
        fondoUrl
    ) {

        cambios.fondo_url =
            fondoUrl;
    }


    if (
        Object.keys(
            cambios
        ).length === 0
    ) {

        return juego;
    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from(
                "juegos"
            )
            .update(
                cambios
            )
            .eq(
                "id",
                juego.id
            )
            .eq(
                "usuario_id",
                usuarioActual.id
            )
            .select()
            .single();


    if (error) {

        throw new Error(
            "El juego se guardó, pero hubo un error guardando las imágenes: " +
            error.message
        );
    }


    return data;
}


// ==========================================
// GUARDAR FORMULARIO
// ==========================================

if (
    formulario
) {

    formulario.addEventListener(
        "submit",
        async evento => {

            evento.preventDefault();


            if (
                !validarFormulario()
            ) {

                return;
            }


            botonGuardar.disabled =
                true;


            try {

                actualizarEstado(
                    juegoEditandoId
                        ? "Guardando cambios..."
                        : "Creando videojuego..."
                );


                const datos =
                    crearDatosJuego();


                let juego;


                // ==================================
                // EDITAR
                // ==================================

                if (
                    juegoEditandoId
                ) {

                    juego =
                        await actualizarJuego(
                            juegoEditandoId,
                            datos
                        );
                }


                // ==================================
                // CREAR
                // ==================================

                else {

                    juego =
                        await crearJuego(
                            datos
                        );
                }


                // ==================================
                // IMÁGENES
                // ==================================

                juego =
                    await guardarImagenes(
                        juego
                    );


                actualizarEstado(
                    juegoEditandoId
                        ? "Cambios guardados correctamente."
                        : "Videojuego guardado correctamente.",
                    "ok"
                );


                // ==================================
                // REDIRECCIÓN
                // ==================================

                setTimeout(
                    () => {

                        window.location.href =
                            `juego.html?id=${juego.id}`;
                    },
                    400
                );


            } catch (error) {

                console.error(
                    "ERROR GUARDANDO JUEGO:",
                    error
                );


                actualizarEstado(
                    "ERROR: " +
                    error.message,
                    "error"
                );


                alert(
                    error.message
                );


            } finally {

                botonGuardar.disabled =
                    false;
            }
        }
    );
}


// ==========================================
// INICIALIZAR PANEL
// ==========================================

async function iniciarAdmin() {

    try {

        actualizarEstado(
            "Comprobando sesión..."
        );


        await comprobarUsuario();


        // ======================================
        // MODO EDITAR
        // ======================================

        if (
            juegoEditandoId
        ) {

            await cargarJuego();
        }


        // ======================================
        // MODO AÑADIR
        // ======================================

        else {

            if (
                tituloAdmin
            ) {

                tituloAdmin.textContent =
                    "Añadir videojuego";
            }


            if (
                descripcionAdmin
            ) {

                descripcionAdmin.textContent =
                    "Registra una nueva experiencia en tu colección.";
            }


            if (
                botonGuardar
            ) {

                botonGuardar.textContent =
                    "GUARDAR VIDEOJUEGO";
            }


            actualizarEstado("");
        }


    } catch (error) {

        console.error(
            "ERROR INICIANDO ADMIN:",
            error
        );


        actualizarEstado(
            "ERROR: " +
            error.message,
            "error"
        );
    }
}


// ==========================================
// INICIO
// ==========================================

iniciarAdmin();

// ==========================================
// RELLENAR SELECTORES DE AÑO
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const selectorAnioInicio = document.querySelector("#anio-inicio");
    const selectorAnioFin = document.querySelector("#anio-fin");

    if (!selectorAnioInicio || !selectorAnioFin) {
        return;
    }

    const anioActual = new Date().getFullYear();

    for (let anio = anioActual; anio >= 1980; anio--) {

        const opcionInicio = document.createElement("option");
        opcionInicio.value = anio;
        opcionInicio.textContent = anio;
        selectorAnioInicio.appendChild(opcionInicio);

        const opcionFin = document.createElement("option");
        opcionFin.value = anio;
        opcionFin.textContent = anio;
        selectorAnioFin.appendChild(opcionFin);
    }

});