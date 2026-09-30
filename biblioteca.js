// ==========================================
// CHECKPOINT SELECT
// BIBLIOTECA CON SUPABASE
// ==========================================


// ==========================================
// ELEMENTOS DE LA PÁGINA
// ==========================================

const gridJuegos =
    document.querySelector("#grid-juegos");

const mensajeVacio =
    document.querySelector("#juegos-vacio");

const selectorAnio =
    document.querySelector("#selector-anio");

const selectorOrden =
    document.querySelector("#selector-orden");

const botonDireccion =
    document.querySelector("#boton-direccion");

const soloFavoritos =
    document.querySelector("#solo-favoritos");


// ==========================================
// ESTADO DE LA BIBLIOTECA
// ==========================================

let juegos = [];

let usuarioEsEstela = false;


// ==========================================
// CONSTANTES
// ==========================================

const ID_ESTELA =
    "bb88520e-c78e-4fd4-a6d1-bf1e2db29f49";


// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearFecha(fecha) {

    if (!fecha) {
        return "Sin fecha";
    }

    const fechaObjeto =
        new Date(
            fecha + "T00:00:00"
        );

    return fechaObjeto.toLocaleDateString(
        "es-ES",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


// ==========================================
// FORMATEAR PERIODO DEL JUEGO
// ==========================================

function formatearPeriodoJuego(
    fechaInicio,
    fechaFin
) {

    if (!fechaInicio && !fechaFin) {
        return "";
    }

    const formatearMesAnio =
        (fecha) => {

            if (!fecha) {
                return null;
            }

            const [anio, mes] =
                fecha.split("-");

            const meses = [
                "ene",
                "feb",
                "mar",
                "abr",
                "may",
                "jun",
                "jul",
                "ago",
                "sep",
                "oct",
                "nov",
                "dic"
            ];

            return (
                meses[
                    Number(mes) - 1
                ] +
                " " +
                anio
            );
        };


    const inicio =
        formatearMesAnio(
            fechaInicio
        );

    const fin =
        formatearMesAnio(
            fechaFin
        );


    if (!inicio) {
        return fin;
    }

    if (!fin) {
        return (
            inicio +
            " — En curso"
        );
    }

    if (inicio === fin) {
        return inicio;
    }

    return (
        inicio +
        " — " +
        fin
    );
}


// ==========================================
// FORMATEAR FECHA CORTA
// ==========================================

function formatearFechaCorta(
    fechaValor
) {

    if (!fechaValor) {
        return "";
    }

    const [anio, mes] =
        fechaValor.split("-");

    const meses = [
        "ene",
        "feb",
        "mar",
        "abr",
        "may",
        "jun",
        "jul",
        "ago",
        "sep",
        "oct",
        "nov",
        "dic"
    ];

    return (
        meses[
            Number(mes) - 1
        ] +
        " " +
        anio
    );
}


// ==========================================
// FORMATEAR NOTA
// ==========================================

function formatearNota(nota) {

    const numero =
        Number(nota);

    if (
        Number.isNaN(numero)
    ) {
        return "--";
    }

    return numero
        .toFixed(2)
        .replace(".", ",");
}


// ==========================================
// FORMATEAR HORAS
// ==========================================

function formatearHoras(horas) {

    const numero =
        Number(horas) || 0;

    return (
        numero.toLocaleString(
            "es-ES",
            {
                maximumFractionDigits: 1
            }
        ) +
        " h"
    );
}


// ==========================================
// COLOR SEGÚN LA NOTA
// ==========================================

function obtenerColorNota(
    nota
) {

    const numeroNota =
        Number(nota);

    if (numeroNota < 4) {
        return "#d32f2f";
    }

    if (numeroNota < 5) {
        return "#f4511e";
    }

    if (numeroNota < 6) {
        return "#f9a825";
    }

    if (numeroNota < 7) {
        return "#c0ca33";
    }

    if (numeroNota < 8) {
        return "#7cb342";
    }

    if (numeroNota < 9) {
        return "#15803d";
    }

    return "#00e676";
}


// ==========================================
// CARGAR JUEGOS DESDE SUPABASE
// ==========================================

async function cargarJuegosDesdeSupabase() {

    try {

        // ======================================
        // OBTENER USUARIO
        // ======================================

        const {
            data: { user },
            error: errorUsuario
        } =
            await supabaseClient.auth.getUser();


        if (errorUsuario) {

            console.error(
                "Error obteniendo el usuario:",
                errorUsuario
            );

            return;
        }


        if (!user) {

            console.error(
                "No hay ningún usuario conectado."
            );

            juegos = [];

            return;
        }


        // ======================================
        // COMPROBAR SI ES ESTELA
        // ======================================

        usuarioEsEstela =
            user.id === ID_ESTELA;


        // ======================================
        // PERSONALIZAR SELECTOR PARA ESTELA
        // ======================================

        configurarSelectorEstela();


        // ======================================
        // PORTADA SEGÚN USUARIO
        // ======================================

        const hero =
            document.querySelector(
                ".hero"
            );

        if (hero) {

            hero.classList.toggle(
                "portada-estela",
                usuarioEsEstela
            );

            hero.classList.add(
                "hero-listo"
            );
        }


        // ======================================
        // NOMBRE DEL USUARIO
        // ======================================

        const nombreUsuario =
            document.getElementById(
                "nombre-usuario"
            );

        if (nombreUsuario) {

            nombreUsuario.textContent =
                usuarioEsEstela
                    ? "Estela"
                    : "Marcos";
        }


        // ======================================
        // CARGAR JUEGOS DEL USUARIO
        // ======================================

        const {
            data,
            error
        } =
            await supabaseClient
                .from("juegos")
                .select("*")
                .eq(
                    "usuario_id",
                    user.id
                );


        if (error) {

            console.error(
                "Error cargando juegos desde Supabase:",
                error
            );

            juegos = [];

            return;
        }


        // ======================================
        // ADAPTAR DATOS DE SUPABASE
        // ======================================

        juegos =
            (data || []).map(
                (juego) => ({

                    id:
                        juego.id,

                    createdAt:
                        juego.created_at,

                    titulo:
                        juego.titulo,

                    plataforma:
                        juego.plataforma,

                    anio:
                        juego.anio_juego,

                    horas:
                        juego.horas,

                    fechaInicio:
                        juego.fecha_inicio,

                    fechaFin:
                        juego.fecha_fin,

                    notaFinal:
                        juego.nota_final,

                    historia:
                        juego.historia,

                    graficos:
                        juego.graficos,

                    tecnico:
                        juego.tecnico,

                    gameplay:
                        juego.gameplay,

                    jugabilidad:
                        juego.jugabilidad,

                    musica:
                        juego.musica,

                    personajes:
                        juego.personajes,

                    dificultad:
                        juego.dificultad,

                    diversion:
                        juego.diversion,

                    opinion:
                        juego.opinion,

                    colorPrincipal:
                        juego.color_principal,

                    colorSecundario:
                        juego.color_secundario,

                    colorAcento:
                        juego.color_acento,

                    destacado:
                        juego.destacado,

                    portada:
                        juego.portada_url,

                    fondo:
                        juego.fondo_url

                })
            );

            // ======================================
// CARGAR SELECTOR DE PLATAFORMAS
// ======================================

cargarSelectorPlataformas();


        console.log(
            "Juegos cargados desde Supabase:",
            juegos
        );


    } catch (error) {

        console.error(
            "Error inesperado cargando los juegos:",
            error
        );

        juegos = [];
    }
}

// ==========================================
// CARGAR PLATAFORMAS EN EL SELECTOR
// ==========================================

function cargarSelectorPlataformas() {

    const selectorPlataforma =
        document.getElementById(
            "selector-plataforma"
        );


    if (!selectorPlataforma) {
        return;
    }


    // ======================================
    // LIMPIAR SELECTOR
    // ======================================

    selectorPlataforma.innerHTML = "";


    // Opción inicial

    const opcionTodas =
        document.createElement(
            "option"
        );

    opcionTodas.value =
        "todas";

    opcionTodas.textContent =
        "Todas las plataformas";

    selectorPlataforma.appendChild(
        opcionTodas
    );


    // ======================================
    // OBTENER PLATAFORMAS ÚNICAS
    // ======================================

    const plataformas =
        [
            ...new Set(
                juegos
                    .map(
                        (juego) =>
                            juego.plataforma
                    )
                    .filter(
                        (plataforma) =>
                            plataforma !== null &&
                            plataforma !== undefined &&
                            plataforma.trim() !== ""
                    )
            )
        ];


    // Orden alfabético

    plataformas.sort(
        (a, b) =>
            a.localeCompare(
                b,
                "es",
                {
                    sensitivity: "base"
                }
            )
    );


    // ======================================
    // CREAR OPCIONES
    // ======================================

    plataformas.forEach(
        (plataforma) => {

            const opcion =
                document.createElement(
                    "option"
                );

            opcion.value =
                plataforma;

            opcion.textContent =
                plataforma;

            selectorPlataforma.appendChild(
                opcion
            );
        }
    );
}


// ==========================================
// CONFIGURAR SELECTOR DE ESTELA
// ==========================================

function configurarSelectorEstela() {

    if (
        !usuarioEsEstela ||
        !selectorOrden
    ) {
        return;
    }


    const opcionGameplay =
        selectorOrden.querySelector(
            'option[value="gameplay"]'
        );

    const opcionTecnico =
        selectorOrden.querySelector(
            'option[value="tecnico"]'
        );


    if (opcionGameplay) {

        opcionGameplay.textContent =
            "Narrativa";
    }


    if (opcionTecnico) {

        opcionTecnico.textContent =
            "Apartado visual";
    }


    // ======================================
    // ORDEN DE LAS CATEGORÍAS DE ESTELA
    // ======================================

    const opcionHistoria =
        selectorOrden.querySelector(
            'option[value="historia"]'
        );

    const opcionNarrativa =
        selectorOrden.querySelector(
            'option[value="gameplay"]'
        );

    const opcionGraficos =
        selectorOrden.querySelector(
            'option[value="graficos"]'
        );

    const opcionVisual =
        selectorOrden.querySelector(
            'option[value="tecnico"]'
        );


    if (
        opcionHistoria &&
        opcionNarrativa
    ) {

        opcionHistoria
            .insertAdjacentElement(
                "afterend",
                opcionNarrativa
            );
    }


    if (
        opcionGraficos &&
        opcionVisual
    ) {

        opcionGraficos
            .insertAdjacentElement(
                "afterend",
                opcionVisual
            );
    }
}


// ==========================================
// ORDEN INICIAL
// ==========================================

function ordenarJuegosPorFecha() {

    juegos.sort(
        (a, b) => {

            if (
                !a.createdAt &&
                !b.createdAt
            ) {
                return 0;
            }

            if (!a.createdAt) {
                return 1;
            }

            if (!b.createdAt) {
                return -1;
            }

            return (
                new Date(a.createdAt) -
                new Date(b.createdAt)
            );
        }
    );
}


// ==========================================
// OBTENER PORTADA
// ==========================================

async function obtenerPortadaJuego(
    juego
) {

    if (!juego.portada) {

        console.warn(
            "El juego no tiene portada_url:",
            juego.titulo
        );

        return "";
    }

    return juego.portada;
}


// ==========================================
// ACTUALIZAR FAVORITO EN SUPABASE
// ==========================================

async function actualizarDestacado(
    juego,
    nuevoEstado
) {

    const { error } =
        await supabaseClient
            .from("juegos")
            .update({
                destacado:
                    nuevoEstado
            })
            .eq(
                "id",
                juego.id
            );


    if (error) {

        console.error(
            "Error al actualizar destacado:",
            error
        );

        return false;
    }


    juego.destacado =
        nuevoEstado;

    return true;
}


// ==========================================
// ELIMINAR JUEGO
// ==========================================

async function eliminarJuego(
    juego
) {

    const confirmar =
        window.confirm(
            `¿Seguro que quieres eliminar "${juego.titulo}"?\n\nEsta acción no se puede deshacer.`
        );


    if (!confirmar) {
        return false;
    }


    try {

        const {
            data: { user }
        } =
            await supabaseClient.auth.getUser();


        if (!user) {
            return false;
        }


        const { error } =
            await supabaseClient
                .from("juegos")
                .delete()
                .eq(
                    "id",
                    juego.id
                )
                .eq(
                    "usuario_id",
                    user.id
                );


        if (error) {
            throw error;
        }


        // Quitamos también el juego
        // del array local

        juegos =
            juegos.filter(
                (elemento) =>
                    elemento.id !==
                    juego.id
            );


        return true;


    } catch (error) {

        console.error(
            "Error al eliminar el juego:",
            error
        );

        alert(
            "No se ha podido eliminar el juego."
        );

        return false;
    }
}


// ==========================================
// CREAR PANEL DE NOTAS
// ==========================================

function crearPanelNotas(
    juego
) {

    const panelNotas =
        document.createElement(
            "div"
        );

    panelNotas.classList.add(
        "panel-notas"
    );


    const mostrarNota =
        (valor) => {

            if (
                valor === null ||
                valor === undefined ||
                valor === ""
            ) {
                return "—";
            }

            return valor;
        };


    // ======================================
    // CATEGORÍAS SEGÚN USUARIO
    // ======================================

    const categorias =
        usuarioEsEstela
            ? [
                {
                    clave: "historia",
                    nombre: "HISTORIA"
                },
                {
                    clave: "gameplay",
                    nombre: "NARRATIVA"
                },
                {
                    clave: "graficos",
                    nombre: "GRÁFICOS"
                },
                {
                    clave: "tecnico",
                    nombre: "APARTADO VISUAL"
                },
                {
                    clave: "jugabilidad",
                    nombre: "JUGABILIDAD"
                },
                {
                    clave: "musica",
                    nombre: "MÚSICA / SONIDO"
                },
                {
                    clave: "personajes",
                    nombre: "PERSONAJES"
                },
                {
                    clave: "dificultad",
                    nombre: "DIFICULTAD"
                },
                {
                    clave: "diversion",
                    nombre: "DIVERSIÓN"
                }
            ]
            : [
                {
                    clave: "historia",
                    nombre: "HISTORIA"
                },
                {
                    clave: "graficos",
                    nombre: "GRÁFICOS"
                },
                {
                    clave: "tecnico",
                    nombre: "APAR. TEC. VISUAL"
                },
                {
                    clave: "gameplay",
                    nombre: "GAMEPLAY"
                },
                {
                    clave: "jugabilidad",
                    nombre: "JUGABILIDAD"
                },
                {
                    clave: "musica",
                    nombre: "MÚSICA / SONIDO"
                },
                {
                    clave: "personajes",
                    nombre: "PERSONAJES"
                },
                {
                    clave: "dificultad",
                    nombre: "DIFICULTAD"
                },
                {
                    clave: "diversion",
                    nombre: "DIVERSIÓN"
                }
            ];


    categorias.forEach(
        (categoria) => {

            const fila =
                document.createElement(
                    "div"
                );

            fila.classList.add(
                "fila-nota"
            );

            fila.dataset.categoria =
                categoria.clave;


            const nombre =
                document.createElement(
                    "span"
                );

            nombre.textContent =
                categoria.nombre;


            const valor =
                document.createElement(
                    "strong"
                );

            valor.textContent =
                mostrarNota(
                    juego[
                        categoria.clave
                    ]
                );


            fila.appendChild(
                nombre
            );

            fila.appendChild(
                valor
            );

            panelNotas.appendChild(
                fila
            );
        }
    );


    // ======================================
    // DESTACAR CATEGORÍA DE ORDENACIÓN
    // ======================================

    const categoriaOrden =
        selectorOrden.value;

    const categoriasNotas = [
        "historia",
        "graficos",
        "tecnico",
        "gameplay",
        "jugabilidad",
        "musica",
        "personajes",
        "dificultad",
        "diversion"
    ];


    if (
        categoriasNotas.includes(
            categoriaOrden
        )
    ) {

        const filaDestacada =
            panelNotas.querySelector(
                `[data-categoria="${categoriaOrden}"]`
            );

        if (filaDestacada) {

            filaDestacada.classList.add(
                "fila-nota-destacada"
            );
        }
    }


    return panelNotas;
}


// ==========================================
// CREAR TARJETA DE JUEGO
// ==========================================

async function crearTarjetaJuego(
    juego
) {

    // ======================================
    // ENLACE
    // ======================================

    const enlace =
        document.createElement(
            "a"
        );

    enlace.classList.add(
        "enlace-juego"
    );

    enlace.href =
        "juego.html?id=" +
        juego.id;


    // ======================================
    // CONTENEDOR GENERAL
    // ======================================

    const contenedorTarjeta =
        document.createElement(
            "div"
        );

    contenedorTarjeta.classList.add(
        "contenedor-tarjeta"
    );


    // ======================================
    // TARJETA
    // ======================================

    const tarjeta =
        document.createElement(
            "article"
        );

    tarjeta.classList.add(
        "tarjeta-juego"
    );


    // ======================================
    // CONTENEDOR PORTADA
    // ======================================

    const contenedorPortada =
        document.createElement(
            "div"
        );

    contenedorPortada.classList.add(
        "contenedor-portada"
    );


    // ======================================
    // PORTADA
    // ======================================

    const portada =
        document.createElement(
            "img"
        );

    portada.classList.add(
        "portada-juego"
    );

    portada.alt =
        "Portada de " +
        juego.titulo;


    const imagenPortada =
        await obtenerPortadaJuego(
            juego
        );


    if (imagenPortada) {

        portada.src =
            imagenPortada;

    } else {

        portada.removeAttribute(
            "src"
        );
    }


    // ======================================
    // NOTA FINAL
    // ======================================

    const nota =
        document.createElement(
            "div"
        );

    nota.classList.add(
        "nota-portada"
    );

    nota.textContent =
        formatearNota(
            juego.notaFinal
        );

    nota.style.background =
        obtenerColorNota(
            juego.notaFinal
        );


    // ======================================
    // ESTRELLA DE FAVORITOS
    // ======================================

    const botonDestacado =
        document.createElement(
            "button"
        );

    botonDestacado.classList.add(
        "boton-destacado"
    );

    botonDestacado.type =
        "button";


    if (
        juego.destacado === true
    ) {

        botonDestacado.classList.add(
            "activo"
        );
    }


    botonDestacado.setAttribute(
        "aria-label",
        juego.destacado
            ? "Quitar de juegos destacados"
            : "Añadir a juegos destacados"
    );


    botonDestacado.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path
                d="
                    M12 2.7
                    14.8 8.4
                    21.1 9.3
                    16.6 13.7
                    17.7 20
                    12 17
                    6.3 20
                    7.4 13.7
                    2.9 9.3
                    9.2 8.4
                    Z
                "
            />
        </svg>
    `;


    botonDestacado.addEventListener(
        "click",
        async (evento) => {

            evento.preventDefault();
            evento.stopPropagation();


            const nuevoEstado =
                !juego.destacado;


            const actualizado =
                await actualizarDestacado(
                    juego,
                    nuevoEstado
                );


            if (!actualizado) {
                return;
            }


            botonDestacado.classList.toggle(
                "activo",
                nuevoEstado
            );


            botonDestacado.setAttribute(
                "aria-label",
                nuevoEstado
                    ? "Quitar de juegos destacados"
                    : "Añadir a juegos destacados"
            );


            // Reiniciamos animación

            botonDestacado.classList.remove(
                "animando"
            );

            void botonDestacado.offsetWidth;

            botonDestacado.classList.add(
                "animando"
            );


            // Si estamos viendo únicamente
            // favoritos y lo quitamos,
            // refrescamos la biblioteca

            if (
                soloFavoritos.checked &&
                !nuevoEstado
            ) {

                await actualizarBiblioteca();
            }
        }
    );


    // ======================================
    // BOTÓN MENÚ
    // ======================================

    const botonMenu =
        document.createElement(
            "button"
        );

    botonMenu.classList.add(
        "boton-menu-juego"
    );

    botonMenu.type =
        "button";

    botonMenu.setAttribute(
        "aria-label",
        "Opciones del juego"
    );

    botonMenu.innerHTML =
        "<span>⋮</span>";


    // ======================================
    // MENÚ DE OPCIONES
    // ======================================

    const menuOpciones =
        document.createElement(
            "div"
        );

    menuOpciones.classList.add(
        "menu-opciones-juego"
    );

    menuOpciones.innerHTML = `
        <button
            type="button"
            class="opcion-editar"
        >
            Editar juego
        </button>

        <button
            type="button"
            class="opcion-eliminar"
        >
            Eliminar juego
        </button>
    `;


    // ======================================
    // EDITAR
    // ======================================

    const botonEditar =
        menuOpciones.querySelector(
            ".opcion-editar"
        );

    botonEditar.addEventListener(
        "click",
        (evento) => {

            evento.preventDefault();
            evento.stopPropagation();

            window.location.href =
                `admin.html?id=${juego.id}`;
        }
    );


    // ======================================
    // ELIMINAR
    // ======================================

    const botonEliminar =
        menuOpciones.querySelector(
            ".opcion-eliminar"
        );

    botonEliminar.addEventListener(
        "click",
        async (evento) => {

            evento.preventDefault();
            evento.stopPropagation();


            const eliminado =
                await eliminarJuego(
                    juego
                );


            if (!eliminado) {
                return;
            }


            await actualizarBiblioteca();

            crearSelectorAnios();
        }
    );


    // ======================================
    // ABRIR / CERRAR MENÚ
    // ======================================

    botonMenu.addEventListener(
        "click",
        (evento) => {

            evento.preventDefault();
            evento.stopPropagation();


            const estabaAbierto =
                menuOpciones.classList.contains(
                    "abierto"
                );


            document
                .querySelectorAll(
                    ".menu-opciones-juego.abierto"
                )
                .forEach(
                    (menu) => {

                        menu.classList.remove(
                            "abierto"
                        );
                    }
                );


            if (!estabaAbierto) {

                menuOpciones.classList.add(
                    "abierto"
                );
            }
        }
    );


    // Evitamos crear un document.addEventListener
    // nuevo por cada tarjeta.
    // El cierre global está al final del archivo.


    // ======================================
    // MONTAR PORTADA
    // ======================================

    contenedorPortada.appendChild(
        portada
    );

    contenedorPortada.appendChild(
        nota
    );

    contenedorPortada.appendChild(
        botonDestacado
    );

    contenedorPortada.appendChild(
        botonMenu
    );

    contenedorPortada.appendChild(
        menuOpciones
    );


    // ======================================
    // INFORMACIÓN DEL JUEGO
    // ======================================

    const informacion =
        document.createElement(
            "div"
        );

    informacion.classList.add(
        "info-juego"
    );


    /// ======================================
// TÍTULO
// ======================================

const titulo =
    document.createElement(
        "h3"
    );

titulo.textContent =
    juego.titulo;


// Ajustar tamaño según longitud del título

const longitudTitulo =
    juego.titulo.length;

if (longitudTitulo > 38) {

    titulo.classList.add(
        "titulo-muy-largo"
    );

} else if (longitudTitulo > 27) {

    titulo.classList.add(
        "titulo-largo"
    );
}


    // ======================================
    // DATOS
    // ======================================

    const datos =
        document.createElement(
            "div"
        );

    datos.classList.add(
        "datos-juego"
    );


    // HORAS

    const horas =
        document.createElement(
            "span"
        );

    horas.textContent =
        juego.horas +
        " horas";


    // FECHAS

    const fecha =
        document.createElement(
            "span"
        );

    const periodoFormateado =
        formatearPeriodoJuego(
            juego.fechaInicio,
            juego.fechaFin
        );

    fecha.textContent =
        periodoFormateado;

    fecha.dataset.periodo =
        periodoFormateado;

    fecha.dataset.inicio =
        formatearFechaCorta(
            juego.fechaInicio
        );

    fecha.dataset.fin =
        formatearFechaCorta(
            juego.fechaFin
        );


    const fechaInicioDetalle =
        document.createElement(
            "span"
        );

    fechaInicioDetalle.classList.add(
        "fecha-inicio-detalle"
    );

    fechaInicioDetalle.textContent =
        fecha.dataset.inicio;


    const fechaFinDetalle =
        document.createElement(
            "span"
        );

    fechaFinDetalle.classList.add(
        "fecha-fin-detalle"
    );


    if (
        juego.fechaInicio &&
        juego.fechaFin &&
        juego.fechaInicio !==
            juego.fechaFin
    ) {

        fechaFinDetalle.textContent =
            fecha.dataset.fin;

    } else if (
        juego.fechaInicio &&
        !juego.fechaFin
    ) {

        fechaFinDetalle.textContent =
            "En curso";

    } else {

        fechaFinDetalle.textContent =
            "";
    }


    // Quitamos el texto inicial
    // porque ahora añadimos spans internos

    fecha.textContent = "";


    fecha.appendChild(
        fechaInicioDetalle
    );

    fecha.appendChild(
        fechaFinDetalle
    );


    datos.appendChild(
        horas
    );

    datos.appendChild(
        fecha
    );


    informacion.appendChild(
        titulo
    );

    informacion.appendChild(
        datos
    );


    // ======================================
    // PANEL DE NOTAS
    // ======================================

    const panelNotas =
        crearPanelNotas(
            juego
        );


    // ======================================
    // MONTAR TARJETA
    // ======================================

    tarjeta.appendChild(
        contenedorPortada
    );

    tarjeta.appendChild(
        informacion
    );


    contenedorTarjeta.appendChild(
        tarjeta
    );

    contenedorTarjeta.appendChild(
        panelNotas
    );


    enlace.appendChild(
        contenedorTarjeta
    );


    return enlace;
}


// ==========================================
// MOSTRAR JUEGOS
// ==========================================

async function mostrarJuegos(
    listaJuegos
) {

    // Limpiamos la biblioteca

    gridJuegos.innerHTML =
        "";


    // ======================================
    // SI NO EXISTEN JUEGOS
    // ======================================

    if (
        listaJuegos.length === 0
    ) {

        mensajeVacio.style.display =
            "block";

        return;
    }


    mensajeVacio.style.display =
        "none";


    // ======================================
    // DECIDIR SI SEPARAMOS POR AÑOS
    // ======================================
    //
    // IMPORTANTE:
    //
    // Las barras de 2026, 2025, etc.
    // SOLO aparecen cuando:
    //
    // - Está seleccionado "Todos los años"
    // - Está seleccionado "Orden de añadido"
    //
    // Si ordenamos por nota, horas,
    // gráficos, narrativa, etc.,
    // desaparecen las divisiones por años.

    const mostrarPorAnios =
        selectorAnio.value ===
            "todos" &&
        selectorOrden.value ===
            "anadido";


    // ======================================
    // MOSTRAR TODOS JUNTOS
    // ======================================

    if (!mostrarPorAnios) {

        const tarjetas =
            await Promise.all(

                listaJuegos.map(
                    (juego) =>
                        crearTarjetaJuego(
                            juego
                        )
                )

            );


        tarjetas.forEach(
            (tarjeta) => {

                gridJuegos.appendChild(
                    tarjeta
                );
            }
        );


        return;
    }


    // ======================================
    // AGRUPAR POR AÑO DE FINALIZACIÓN
    // ======================================

    const juegosPorAnio =
        {};


    listaJuegos.forEach(
        (juego) => {

            if (!juego.fechaFin) {
                return;
            }


            const anio =
                juego.fechaFin
                    .split("-")[0];


            if (
                !juegosPorAnio[
                    anio
                ]
            ) {

                juegosPorAnio[
                    anio
                ] = [];
            }


            juegosPorAnio[
                anio
            ].push(
                juego
            );
        }
    );


    // ======================================
    // ORDENAR AÑOS
    // ======================================

    const anios =
        Object.keys(
            juegosPorAnio
        )
        .sort(
            (a, b) =>
                Number(b) -
                Number(a)
        );


    // ======================================
    // CREAR SECCIONES
    // ======================================

    for (
        const anio
        of anios
    ) {

        // ==================================
        // JUEGOS DE ESTE AÑO
        // ==================================

        const juegosDeEsteAnio =
            juegosPorAnio[
                anio
            ];


        // ==================================
        // ESTADÍSTICAS DEL AÑO
        // ==================================

        const cantidadJuegos =
            juegosDeEsteAnio.length;


        const horasTotalesAnio =
            juegosDeEsteAnio.reduce(
                (
                    total,
                    juego
                ) => {

                    const horas =
                        Number(
                            juego.horas
                        );

                    return (
                        total +
                        (
                            Number.isFinite(
                                horas
                            )
                                ? horas
                                : 0
                        )
                    );
                },
                0
            );


        // ==================================
        // ENCABEZADO
        // ==================================

        const encabezado =
            document.createElement(
                "button"
            );

        encabezado.type =
            "button";

        encabezado.classList.add(
            "encabezado-anio"
        );

        encabezado.setAttribute(
            "aria-expanded",
            "true"
        );


        encabezado.innerHTML = `
            <span class="numero-anio">
                ${anio}
            </span>

            <span class="estadisticas-anio">
                ${cantidadJuegos}
                ${
                    cantidadJuegos === 1
                        ? "juego"
                        : "juegos"
                }
                ·
                ${formatearHoras(
                    horasTotalesAnio
                )}
            </span>

            <span class="linea-anio"></span>

            <span class="flecha-anio">
                ▼
            </span>
        `;


        // ==================================
        // CREAR TARJETAS
        // ==================================

        const tarjetasDelAnio =
            await Promise.all(

                juegosDeEsteAnio.map(
                    (juego) =>
                        crearTarjetaJuego(
                            juego
                        )
                )

            );


        // ==================================
        // AÑADIR ENCABEZADO
        // ==================================

        gridJuegos.appendChild(
            encabezado
        );


        // ==================================
        // AÑADIR JUEGOS
        // ==================================

        tarjetasDelAnio.forEach(
            (tarjeta) => {

                gridJuegos.appendChild(
                    tarjeta
                );
            }
        );


        // ==================================
        // PLEGAR / DESPLEGAR
        // ==================================

        encabezado.addEventListener(
            "click",
            () => {

                const estaPlegado =
                    encabezado
                        .classList
                        .toggle(
                            "plegado"
                        );


                tarjetasDelAnio.forEach(
                    (tarjeta) => {

                        tarjeta.style.display =
                            estaPlegado
                                ? "none"
                                : "";
                    }
                );


                const flecha =
                    encabezado.querySelector(
                        ".flecha-anio"
                    );


                if (flecha) {

                    flecha.textContent =
                        estaPlegado
                            ? "▶"
                            : "▼";
                }


                encabezado.setAttribute(
                    "aria-expanded",
                    estaPlegado
                        ? "false"
                        : "true"
                );
            }
        );
    }
}


// ==========================================
// ACTUALIZAR ESTADÍSTICAS GLOBALES
// ==========================================

function actualizarEstadisticasGlobales() {

    const elementoJuegos =
        document.getElementById(
            "total-juegos"
        );

    const elementoHoras =
        document.getElementById(
            "total-horas"
        );


    if (
        !elementoJuegos ||
        !elementoHoras
    ) {
        return;
    }


    // ======================================
    // JUEGOS COMPLETADOS
    // ======================================
    //
    // Consideramos completado un juego
    // cuando tiene fecha de finalización.

    const juegosCompletados =
        juegos.filter(
            (juego) =>
                juego.fechaFin
        );


    // ======================================
    // HORAS TOTALES
    // ======================================

    const horasTotales =
        juegosCompletados.reduce(
            (
                total,
                juego
            ) => {

                const horas =
                    Number(
                        juego.horas
                    );


                return (
                    total +
                    (
                        Number.isFinite(
                            horas
                        )
                            ? horas
                            : 0
                    )
                );
            },
            0
        );


    // ======================================
    // MOSTRAR RESULTADOS
    // ======================================

    elementoJuegos.textContent =
        juegosCompletados.length;


    elementoHoras.textContent =
    horasTotales
        .toLocaleString(
            "es-ES",
            {
                maximumFractionDigits: 1,
                useGrouping: true
            }
        );
}

// ==========================================
// CREAR SELECTOR DE AÑOS
// ==========================================

function crearSelectorAnios() {

    // Eliminamos opciones anteriores
    // excepto "Todos los años"

    while (
        selectorAnio.options.length >
            1
    ) {

        selectorAnio.remove(
            1
        );
    }


    // ======================================
    // OBTENER AÑOS
    // ======================================

    const anios =
        juegos
            .map(
                (juego) => {

                    if (
                        !juego.fechaFin
                    ) {
                        return null;
                    }

                    return Number(
                        juego.fechaFin
                            .split("-")[0]
                    );
                }
            )
            .filter(
                (anio) =>
                    anio !== null
            );


    // ======================================
    // ELIMINAR REPETIDOS
    // ======================================

    const aniosUnicos =
        [
            ...new Set(
                anios
            )
        ];


    // ======================================
    // ORDENAR
    // ======================================

    aniosUnicos.sort(
        (a, b) =>
            b - a
    );


    // ======================================
    // CREAR OPCIONES
    // ======================================

    aniosUnicos.forEach(
        (anio) => {

            const opcion =
                document.createElement(
                    "option"
                );

            opcion.value =
                anio;

            opcion.textContent =
                anio;

            selectorAnio.appendChild(
                opcion
            );
        }
    );
}


// ==========================================
// ORDENAR BIBLIOTECA
// ==========================================

function ordenarListaJuegos(
    lista
) {

    const criterio =
        selectorOrden.value;

    const direccion =
        botonDireccion
            .dataset
            .direccion;

    const multiplicador =
        direccion === "asc"
            ? 1
            : -1;


    // ======================================
    // CATEGORÍAS DE VALORACIÓN
    // ======================================

    const categoriasValoracion = [
        "historia",
        "narrativa",
        "graficos",
        "tecnico",
        "gameplay",
        "jugabilidad",
        "musica",
        "personajes",
        "dificultad",
        "diversion"
    ];


    // ======================================
    // FECHA DE AÑADIDO
    // ======================================

    function obtenerFechaAnadido(
        juego
    ) {

        if (!juego.createdAt) {
            return null;
        }

        const fecha =
            new Date(
                juego.createdAt
            ).getTime();

        return Number.isNaN(fecha)
            ? null
            : fecha;
    }


    // ======================================
    // DESEMPATE POR ORDEN DE AÑADIDO
    // Más reciente primero
    // ======================================

    function desempatarPorAnadido(
        a,
        b
    ) {

        const fechaA =
            obtenerFechaAnadido(a);

        const fechaB =
            obtenerFechaAnadido(b);


        if (
            fechaA === null &&
            fechaB === null
        ) {
            return 0;
        }

        if (fechaA === null) {
            return 1;
        }

        if (fechaB === null) {
            return -1;
        }


        return fechaB - fechaA;
    }


    // ======================================
    // ORDENAR
    // ======================================

    return [...lista].sort(
        (a, b) => {


            // ==================================
            // ORDEN DE AÑADIDO
            // ==================================

            if (
                criterio ===
                "anadido"
            ) {

                const fechaA =
                    obtenerFechaAnadido(a);

                const fechaB =
                    obtenerFechaAnadido(b);


                if (
                    fechaA === null &&
                    fechaB === null
                ) {
                    return 0;
                }

                if (fechaA === null) {
                    return 1;
                }

                if (fechaB === null) {
                    return -1;
                }


                return (
                    fechaA -
                    fechaB
                ) *
                multiplicador;
            }


            // ==================================
            // FECHA DE FINALIZACIÓN
            // ==================================

            if (
                criterio ===
                "fecha"
            ) {

                const fechaA =
                    a.fechaFin
                        ? new Date(
                            a.fechaFin
                        ).getTime()
                        : null;

                const fechaB =
                    b.fechaFin
                        ? new Date(
                            b.fechaFin
                        ).getTime()
                        : null;


                if (
                    fechaA === null &&
                    fechaB === null
                ) {

                    return desempatarPorAnadido(
                        a,
                        b
                    );
                }


                if (fechaA === null) {
                    return 1;
                }

                if (fechaB === null) {
                    return -1;
                }


                const diferencia =
                    (
                        fechaA -
                        fechaB
                    ) *
                    multiplicador;


                if (diferencia !== 0) {
                    return diferencia;
                }


                return desempatarPorAnadido(
                    a,
                    b
                );
            }


            // ==================================
            // RESTO DE CRITERIOS
            // ==================================

            const valorA =
                a[criterio];

            const valorB =
                b[criterio];


            const vacioA =
                valorA === null ||
                valorA === undefined ||
                valorA === "";

            const vacioB =
                valorB === null ||
                valorB === undefined ||
                valorB === "";


            // Los valores vacíos SIEMPRE
            // se quedan al final

            if (
                vacioA &&
                vacioB
            ) {

                return desempatarPorAnadido(
                    a,
                    b
                );
            }


            if (vacioA) {
                return 1;
            }

            if (vacioB) {
                return -1;
            }


            // ==================================
            // CRITERIO PRINCIPAL
            // ==================================

            const diferenciaPrincipal =
                (
                    Number(valorA) -
                    Number(valorB)
                ) *
                multiplicador;


            if (
                diferenciaPrincipal !== 0
            ) {

                return diferenciaPrincipal;
            }


            // ==================================
            // DESEMPATE DE CATEGORÍAS
            // NOTA FINAL
            // ==================================

            if (
                categoriasValoracion.includes(
                    criterio
                )
            ) {

                const notaFinalA =
                    Number(
                        a.notaFinal
                    );

                const notaFinalB =
                    Number(
                        b.notaFinal
                    );


                const notaFinalValidaA =
                    !Number.isNaN(
                        notaFinalA
                    );

                const notaFinalValidaB =
                    !Number.isNaN(
                        notaFinalB
                    );


                if (
                    notaFinalValidaA &&
                    notaFinalValidaB &&
                    notaFinalA !==
                    notaFinalB
                ) {

                    // Mejor nota final primero

                    return (
                        notaFinalB -
                        notaFinalA
                    );
                }


                if (
                    notaFinalValidaA &&
                    !notaFinalValidaB
                ) {
                    return -1;
                }


                if (
                    !notaFinalValidaA &&
                    notaFinalValidaB
                ) {
                    return 1;
                }
            }


            // ==================================
            // ÚLTIMO DESEMPATE
            // ORDEN DE AÑADIDO
            // ==================================

            return desempatarPorAnadido(
                a,
                b
            );
        }
    );
}


// ==========================================
// APLICAR FILTROS Y ORDENACIÓN
// ==========================================

async function actualizarBiblioteca() {

    // ======================================
    // VALORES DE LOS FILTROS
    // ======================================

    const anioSeleccionado =
        selectorAnio.value;


    const selectorPlataforma =
        document.getElementById(
            "selector-plataforma"
        );


    const plataformaSeleccionada =
        selectorPlataforma
            ? selectorPlataforma.value
            : "todas";


    // Partimos siempre de todos los juegos

    let juegosFiltrados =
        [...juegos];


    // ======================================
    // FILTRAR POR AÑO
    // ======================================

    if (
        anioSeleccionado !==
        "todos"
    ) {

        juegosFiltrados =
            juegosFiltrados.filter(
                (juego) => {

                    if (
                        !juego.fechaFin
                    ) {
                        return false;
                    }


                    const anio =
                        Number(
                            juego.fechaFin
                                .split("-")[0]
                        );


                    return (
                        anio ===
                        Number(
                            anioSeleccionado
                        )
                    );
                }
            );
    }


    // ======================================
    // FILTRAR POR PLATAFORMA
    // ======================================

    if (
        plataformaSeleccionada !==
        "todas"
    ) {

        juegosFiltrados =
            juegosFiltrados.filter(
                (juego) =>
                    juego.plataforma ===
                    plataformaSeleccionada
            );
    }


    // ======================================
    // SOLO FAVORITOS
    // ======================================

    if (
        soloFavoritos &&
        soloFavoritos.checked
    ) {

        juegosFiltrados =
            juegosFiltrados.filter(
                (juego) =>
                    juego.destacado ===
                    true
            );
    }


    // ======================================
    // ORDENAR
    // ======================================

    const juegosOrdenados =
        ordenarListaJuegos(
            juegosFiltrados
        );


    // ======================================
    // MOSTRAR
    // ======================================

    await mostrarJuegos(
        juegosOrdenados
    );
}


// ==========================================
// EVENTOS DE FILTROS
// ==========================================


// ======================================
// AÑO
// ======================================

selectorAnio.addEventListener(
    "change",
    actualizarBiblioteca
);


// ======================================
// PLATAFORMA
// ======================================

const selectorPlataforma =
    document.getElementById(
        "selector-plataforma"
    );

if (selectorPlataforma) {

    selectorPlataforma.addEventListener(
        "change",
        actualizarBiblioteca
    );
}


// ======================================
// ORDEN
// ======================================

selectorOrden.addEventListener(
    "change",
    actualizarBiblioteca
);


// ======================================
// FAVORITOS
// ======================================

soloFavoritos.addEventListener(
    "change",
    actualizarBiblioteca
);


// ==========================================
// CAMBIAR DIRECCIÓN
// ==========================================

botonDireccion.addEventListener(
    "click",
    async () => {

        const direccionActual =
            botonDireccion
                .dataset
                .direccion;


        const nuevaDireccion =
            direccionActual ===
                "asc"
                ? "desc"
                : "asc";


        botonDireccion
            .dataset
            .direccion =
                nuevaDireccion;


        botonDireccion.classList.toggle(
            "descendente",
            nuevaDireccion ===
                "desc"
        );


        await actualizarBiblioteca();
    }
);


// ==========================================
// CERRAR MENÚS AL HACER CLIC FUERA
// ==========================================

document.addEventListener(
    "click",
    (evento) => {

        document
            .querySelectorAll(
                ".menu-opciones-juego.abierto"
            )
            .forEach(
                (menu) => {

                    const contenedor =
                        menu.parentElement;

                    const boton =
                        contenedor
                            ?.querySelector(
                                ".boton-menu-juego"
                            );


                    if (
                        !menu.contains(
                            evento.target
                        ) &&
                        !boton?.contains(
                            evento.target
                        )
                    ) {

                        menu.classList.remove(
                            "abierto"
                        );
                    }
                }
            );
    }
);


// ==========================================
// CAMBIO DE VISTA
// ==========================================

const botonVistaSencilla =
    document.getElementById(
        "vista-sencilla"
    );

const botonVistaDetallada =
    document.getElementById(
        "vista-detallada"
    );


if (
    botonVistaSencilla &&
    botonVistaDetallada
) {

    botonVistaSencilla.addEventListener(
        "click",
        () => {

            botonVistaSencilla
                .classList
                .add(
                    "activo"
                );

            botonVistaDetallada
                .classList
                .remove(
                    "activo"
                );

            document.body
                .classList
                .remove(
                    "vista-detallada"
                );


            localStorage.setItem(
                "vistaBiblioteca",
                "sencilla"
            );
        }
    );


    botonVistaDetallada.addEventListener(
        "click",
        () => {

            botonVistaDetallada
                .classList
                .add(
                    "activo"
                );

            botonVistaSencilla
                .classList
                .remove(
                    "activo"
                );

            document.body
                .classList
                .add(
                    "vista-detallada"
                );


            localStorage.setItem(
                "vistaBiblioteca",
                "detallada"
            );
        }
    );


    // ======================================
    // RECUPERAR ÚLTIMA VISTA
    // ======================================

    const vistaGuardada =
        localStorage.getItem(
            "vistaBiblioteca"
        );


    if (
        vistaGuardada ===
        "detallada"
    ) {

        document.body
            .classList
            .add(
                "vista-detallada"
            );

        botonVistaDetallada
            .classList
            .add(
                "activo"
            );

        botonVistaSencilla
            .classList
            .remove(
                "activo"
            );

    } else {

        document.body
            .classList
            .remove(
                "vista-detallada"
            );

        botonVistaSencilla
            .classList
            .add(
                "activo"
            );

        botonVistaDetallada
            .classList
            .remove(
                "activo"
            );
    }
}


// ==========================================
// CAMBIAR USUARIO
// ==========================================

const botonCambiarUsuario =
    document.getElementById(
        "cambiar-usuario"
    );


if (botonCambiarUsuario) {

    botonCambiarUsuario.addEventListener(
        "click",
        async () => {

            const { error } =
                await supabaseClient
                    .auth
                    .signOut();


            if (error) {

                console.error(
                    "Error al cerrar sesión:",
                    error
                );

                return;
            }


            window.location.href =
                "login.html";
        }
    );
}


// ==========================================
// INICIAR BIBLIOTECA
// ==========================================

async function iniciarBiblioteca() {

    try {

        // 1. Cargar juegos

        await cargarJuegosDesdeSupabase();

        // 2. Actualizar estadísticas globales

            actualizarEstadisticasGlobales();


        // 2. Orden inicial

        ordenarJuegosPorFecha();


        // 3. Crear selector de años

        crearSelectorAnios();


        // 4. Mostrar biblioteca

        await actualizarBiblioteca();


    } catch (error) {

        console.error(
            "Error cargando la biblioteca:",
            error
        );


        if (
            juegos.length === 0
        ) {

            mensajeVacio.style.display =
                "block";
        }
    }
}


// ==========================================
// ARRANCAR CHECKPOINT SELECT
// ==========================================

iniciarBiblioteca();