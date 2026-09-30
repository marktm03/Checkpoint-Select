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
// LISTA DE JUEGOS
// ==========================================

let juegos = [];


// ==========================================
// CARGAR JUEGOS DESDE SUPABASE
// ==========================================

async function cargarJuegosDesdeSupabase() {

    try {

        // Obtenemos el usuario que ha iniciado sesión
        const {
            data: { user },
            error: errorUsuario
        } = await supabaseClient.auth.getUser();


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
// PORTADA SEGÚN USUARIO
// ======================================

const ID_ESTELA =
    "bb88520e-c78e-4fd4-a6d1-bf1e2db29f49";

const hero =
    document.querySelector(".hero");

if (hero) {

    if (user.id === ID_ESTELA) {

        hero.classList.add(
            "portada-estela"
        );

    } else {

        hero.classList.remove(
            "portada-estela"
        );

    }

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

    if (user.id === ID_ESTELA) {

        nombreUsuario.textContent =
            "Estela";

    } else {

        nombreUsuario.textContent =
            "Marcos";

    }

}


// ======================================
// CARGAR JUEGOS DEL USUARIO
// ======================================

// Pedimos a Supabase únicamente los juegos
// pertenecientes al usuario conectado

const {
    data,
    error
} = await supabaseClient
    .from("juegos")
    .select("*")
    .eq("usuario_id", user.id);


if (error) {

    console.error(
        "Error cargando juegos desde Supabase:",
        error
    );

    juegos = [];

    return;
}


// ======================================
// ADAPTAMOS LOS NOMBRES DE SUPABASE
// AL FORMATO QUE USA CHECKPOINT SELECT
// ======================================

juegos = (data || []).map(
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


        // ==============================
        // NOTAS POR CATEGORÍA
        // ==============================

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


        // ==============================
        // OPINIÓN
        // ==============================

        opinion:
            juego.opinion,


        // ==============================
        // COLORES
        // ==============================

        colorPrincipal:
            juego.color_principal,

        colorSecundario:
            juego.color_secundario,

        colorAcento:
            juego.color_acento,


        // ==============================
        // OTROS DATOS
        // ==============================

        destacado:
            juego.destacado,

        // Las imágenes vienen directamente
        // de Supabase Storage

        portada:
            juego.portada_url,

        fondo:
            juego.fondo_url

    })
);


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
// ORDENAR POR FECHA
// ==========================================

// ==========================================
// ORDENAR POR ORDEN DE AÑADIDO
// ==========================================

function ordenarJuegosPorFecha() {

    juegos.sort((a, b) => {

        if (!a.createdAt && !b.createdAt) {
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
    });
}


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

function formatearPeriodoJuego(fechaInicio, fechaFin) {

    if (!fechaInicio && !fechaFin) {
        return "";
    }

    const formatearMesAnio = (fecha) => {

        if (!fecha) {
            return null;
        }

        const [anio, mes] =
            fecha.split("-");

        const meses = [
            "ene", "feb", "mar", "abr",
            "may", "jun", "jul", "ago",
            "sep", "oct", "nov", "dic"
        ];

        return `${meses[Number(mes) - 1]} ${anio}`;
    };


    const inicio =
        formatearMesAnio(fechaInicio);

    const fin =
        formatearMesAnio(fechaFin);


    // Si solo tenemos fecha final

    if (!inicio) {
        return fin;
    }


    // Si todavía no hay fecha final

    if (!fin) {
        return `${inicio} — En curso`;
    }


    // Si empezó y terminó el mismo mes

    if (inicio === fin) {
        return inicio;
    }


    return `${inicio} — ${fin}`;
}


// ==========================================
// FORMATEAR NOTA
// ==========================================

function formatearNota(nota) {

    const numero =
        Number(nota);

    if (Number.isNaN(numero)) {
        return "--";
    }

    return numero
        .toFixed(2)
        .replace(".", ",");
}


// ==========================================
// OBTENER PORTADA
// ==========================================

async function obtenerPortadaJuego(juego) {

    /*
        Las imágenes ya están almacenadas
        en Supabase Storage.

        juego.portada contiene directamente
        la URL guardada en portada_url.

        Ya NO buscamos imágenes en IndexedDB.
    */

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
// CREAR TARJETA DE JUEGO
// ==========================================

async function crearTarjetaJuego(juego) {


    // ======================================
    // ENLACE
    // ======================================

    const enlace =
        document.createElement("a");

    enlace.classList.add(
        "enlace-juego"
    );

    enlace.href =
        "juego.html?id=" +
        juego.id;


    // ======================================
    // TARJETA
    // ======================================

    const contenedorTarjeta =
    document.createElement("div");

contenedorTarjeta.classList.add(
    "contenedor-tarjeta"
);

    const tarjeta =
        document.createElement("article");

    tarjeta.classList.add(
        "tarjeta-juego"
    );


    // ======================================
    // CONTENEDOR PORTADA
    // ======================================

    const contenedorPortada =
        document.createElement("div");

    contenedorPortada.classList.add(
        "contenedor-portada"
    );


    // ======================================
    // PORTADA
    // ======================================

    const portada =
        document.createElement("img");

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
// BOTÓN DESTACADO
// ======================================

const botonDestacado =
    document.createElement("button");

botonDestacado.classList.add(
    "boton-destacado"
);

botonDestacado.type = "button";

// Si ya está destacado, mostramos la estrella activa
if (juego.destacado === true) {
    botonDestacado.classList.add("activo");
}

botonDestacado.setAttribute(
    "aria-label",
    "Añadir a juegos destacados"
);

botonDestacado.innerHTML = `
    <svg viewBox="0 0 24 24">
        <path
            d="M12 2.7
               14.8 8.4
               21.1 9.3
               16.6 13.7
               17.7 20
               12 17
               6.3 20
               7.4 13.7
               2.9 9.3
               9.2 8.4
               Z"
        />
    </svg>
`;

botonDestacado.addEventListener(
    "click",
    async (evento) => {

        evento.preventDefault();
        evento.stopPropagation();

        const nuevoEstado =
            !botonDestacado.classList.contains(
                "activo"
            );

        // Guardamos el cambio en Supabase
        const { error } =
            await supabaseClient
                .from("juegos")
                .update({
                    destacado: nuevoEstado
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

            return;
        }

        // Actualizamos también el objeto local
        juego.destacado =
            nuevoEstado;

        // Cambiamos visualmente la estrella
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

        // Animación
        botonDestacado.classList.remove(
            "animando"
        );

        void botonDestacado.offsetWidth;

        botonDestacado.classList.add(
            "animando"
        );
    }
);




    // ======================================
    // NOTA
    // ======================================

    const nota =
        document.createElement("div");

    nota.classList.add(
        "nota-portada"
    );

    nota.textContent =
        formatearNota(
            juego.notaFinal
        );

    // COLOR SEGÚN LA NOTA

const numeroNota =
    Number(juego.notaFinal);

let colorNota;

if (numeroNota < 4) {
    colorNota = "#ef4444";
} else if (numeroNota < 5) {
    colorNota = "#f97316";
} else if (numeroNota < 6) {
    colorNota = "#eab308";
} else if (numeroNota < 7) {
    colorNota = "#84cc16";
} else if (numeroNota < 8) {
    colorNota = "#22c55e";
} else if (numeroNota < 9) {
    colorNota = "#10b981";
} else {
    colorNota = "#00e676";
}

nota.style.background =
    colorNota;

// ======================================
// BOTÓN MENÚ
// ======================================

const botonMenu =
    document.createElement("button");

botonMenu.classList.add(
    "boton-menu-juego"
);

botonMenu.type = "button";

botonMenu.setAttribute(
    "aria-label",
    "Opciones del juego"
);

botonMenu.innerHTML = `
    <span>⋮</span>
`;

// Creamos el menú que aparecerá al pulsar los tres puntos

const menuOpciones =
    document.createElement("div");

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

const botonEliminar =
    menuOpciones.querySelector(
        ".opcion-eliminar"
    );

    botonEliminar.addEventListener(
    "click",
    (evento) => {

        evento.preventDefault();
        evento.stopPropagation();

        const confirmar =
            window.confirm(
                `¿Seguro que quieres eliminar "${juego.titulo}"?\n\nEsta acción no se puede deshacer.`
            );

        if (!confirmar) {
            return;
        }

        const botonEliminar =
    menuOpciones.querySelector(
        ".opcion-eliminar"
    );

botonEliminar.addEventListener(
    "click",
    async (evento) => {

        evento.preventDefault();
        evento.stopPropagation();

        // Preguntamos antes de borrar
        const confirmar =
            window.confirm(
                `¿Seguro que quieres eliminar "${juego.titulo}"?\n\nEsta acción no se puede deshacer.`
            );

        // Si pulsa Cancelar, no hacemos nada
        if (!confirmar) {
            return;
        }

        try {

            // Obtenemos el usuario que tiene la sesión iniciada
            const {
                data: { user }
            } =
                await supabaseClient.auth.getUser();

            if (!user) {
                return;
            }

            // Eliminamos el juego de Supabase
            const {
                error
            } =
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

            // Quitamos la tarjeta de la pantalla
            enlace.remove();

        } catch (error) {

            console.error(
                "Error al eliminar el juego:",
                error
            );

            alert(
                "No se ha podido eliminar el juego."
            );
        }
    }
);
    }
);

botonMenu.addEventListener(
    "click",
    (evento) => {

        evento.preventDefault();
        evento.stopPropagation();

        // Comprobamos si este menú ya estaba abierto
        const estabaAbierto =
            menuOpciones.classList.contains(
                "abierto"
            );

        // Cerramos cualquier menú que esté abierto
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

        // Si este menú estaba cerrado, lo abrimos
        if (!estabaAbierto) {
            menuOpciones.classList.add(
                "abierto"
            );
        }

    }
);

document.addEventListener(
    "click",
    (evento) => {

        if (
            !menuOpciones.contains(evento.target) &&
            !botonMenu.contains(evento.target)
        ) {
            menuOpciones.classList.remove(
                "abierto"
            );
        }

    }
);

    // ======================================
    // PORTADA + NOTA
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

const mostrarNota = (valor) => {
    return valor === null ||
           valor === undefined ||
           valor === ""
        ? "—"
        : valor;
};

// ======================================
// PANEL DE NOTAS DETALLADAS
// ======================================

const panelNotas =
    document.createElement("div");

panelNotas.classList.add(
    "panel-notas"
);

panelNotas.innerHTML = `
    <div class="fila-nota" data-categoria="historia">
        <span>HISTORIA</span>
        <strong>${mostrarNota(juego.historia)}</strong>
    </div>

    <div class="fila-nota" data-categoria="graficos">
        <span>GRÁFICOS</span>
        <strong>${mostrarNota(juego.graficos)}</strong>
    </div>

    <div class="fila-nota" data-categoria="tecnico">
        <span>APAR. TEC. VISUAL</span>
        <strong>${mostrarNota(juego.tecnico)}</strong>
    </div>

    <div class="fila-nota" data-categoria="gameplay">
        <span>GAMEPLAY</span>
        <strong>${mostrarNota(juego.gameplay)}</strong>
    </div>

    <div class="fila-nota" data-categoria="jugabilidad">
        <span>JUGABILIDAD</span>
        <strong>${mostrarNota(juego.jugabilidad)}</strong>
    </div>

    <div class="fila-nota" data-categoria="musica">
        <span>MÚSICA / SONIDO</span>
        <strong>${mostrarNota(juego.musica)}</strong>
    </div>

    <div class="fila-nota" data-categoria="personajes">
        <span>PERSONAJES</span>
        <strong>${mostrarNota(juego.personajes)}</strong>
    </div>

    <div class="fila-nota" data-categoria="dificultad">
        <span>DIFICULTAD</span>
        <strong>${mostrarNota(juego.dificultad)}</strong>
    </div>

    <div class="fila-nota" data-categoria="diversion">
        <span>DIVERSIÓN</span>
        <strong>${mostrarNota(juego.diversion)}</strong>
    </div>
`;

// ======================================
// DESTACAR CATEGORÍA USADA PARA ORDENAR
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

    // ======================================
    // INFORMACIÓN
    // ======================================

    const informacion =
        document.createElement("div");

    informacion.classList.add(
        "info-juego"
    );


    // ======================================
    // TÍTULO
    // ======================================

    const titulo =
        document.createElement("h3");

    titulo.textContent =
        juego.titulo;


    // ======================================
    // DATOS
    // ======================================

    const datos =
        document.createElement("div");

    datos.classList.add(
        "datos-juego"
    );


    // HORAS

    const horas =
        document.createElement("span");

    horas.textContent =
        juego.horas +
        " horas";


    // FECHA INICIO - FINALIZACIÓN

const fecha =
    document.createElement("span");

const periodoFormateado =
    formatearPeriodoJuego(
        juego.fechaInicio,
        juego.fechaFin
    );

fecha.textContent =
    periodoFormateado;

fecha.dataset.periodo =
    periodoFormateado;

    const formatearFechaCorta = (fechaValor) => {

    if (!fechaValor) {
        return "";
    }

    const [anio, mes] =
        fechaValor.split("-");

    const meses = [
        "ene", "feb", "mar", "abr",
        "may", "jun", "jul", "ago",
        "sep", "oct", "nov", "dic"
    ];

    return `${meses[Number(mes) - 1]} ${anio}`;
};

fecha.dataset.inicio =
    formatearFechaCorta(
        juego.fechaInicio
    );

fecha.dataset.fin =
    formatearFechaCorta(
        juego.fechaFin
    );

    const fechaInicioDetalle =
    document.createElement("span");

fechaInicioDetalle.classList.add(
    "fecha-inicio-detalle"
);

fechaInicioDetalle.textContent =
    fecha.dataset.inicio;


const fechaFinDetalle =
    document.createElement("span");

fechaFinDetalle.classList.add(
    "fecha-fin-detalle"
);

if (
    juego.fechaInicio &&
    juego.fechaFin &&
    juego.fechaInicio !== juego.fechaFin
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

// AÑADIMOS LAS DOS FECHAS AL SPAN PRINCIPAL

fecha.appendChild(
    fechaInicioDetalle
);

fecha.appendChild(
    fechaFinDetalle
);


    // ======================================
    // MONTAMOS DATOS
    // ======================================

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
// MONTAMOS TARJETA
// ======================================

// Dentro de la tarjeta dejamos
// exactamente lo que ya tenía
tarjeta.appendChild(
    contenedorPortada
);

tarjeta.appendChild(
    informacion
);

// La tarjeta normal va dentro
// del nuevo contenedor
contenedorTarjeta.appendChild(
    tarjeta
);

// El panel de notas va AL LADO,
// no dentro de tarjeta-juego
contenedorTarjeta.appendChild(
    panelNotas
);

// Todo el conjunto va dentro del enlace
enlace.appendChild(
    contenedorTarjeta
);

return enlace;
}


// ==========================================
// MOSTRAR LOS JUEGOS
// ==========================================

async function mostrarJuegos(listaJuegos) {

    // Limpiamos la biblioteca
    gridJuegos.innerHTML = "";


    // ======================================
    // SI NO EXISTEN JUEGOS
    // ======================================

    if (listaJuegos.length === 0) {

        mensajeVacio.style.display =
            "block";

        return;
    }

    mensajeVacio.style.display =
        "none";


    // ======================================
    // COMPROBAR SI MOSTRAMOS TODOS LOS AÑOS
    // ======================================

    const mostrarPorAnios =
        selectorAnio.value === "todos";


    // ======================================
    // SI HAY UN AÑO CONCRETO SELECCIONADO
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
    // AGRUPAR JUEGOS POR AÑO
    // ======================================

    const juegosPorAnio = {};

    listaJuegos.forEach(
        (juego) => {

            if (!juego.fechaFin) {
                return;
            }

            const anio =
                juego.fechaFin.split("-")[0];

            if (!juegosPorAnio[anio]) {

                juegosPorAnio[anio] = [];

            }

            juegosPorAnio[anio].push(
                juego
            );

        }
    );


    // ======================================
    // ORDENAR AÑOS
    // MÁS RECIENTE → MÁS ANTIGUO
    // ======================================

    const anios =
        Object.keys(juegosPorAnio)
            .sort(
                (a, b) =>
                    Number(b) - Number(a)
            );


    // ======================================
    // CREAR CADA SECCIÓN DE AÑO
    // ======================================

    for (const anio of anios) {

        // ==================================
        // ENCABEZADO DEL AÑO
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
            <span class="numero-anio">${anio}</span>
            <span class="linea-anio"></span>
            <span class="flecha-anio">▼</span>
        `;


        // ==================================
        // JUEGOS DEL AÑO
        // ==================================

        const juegosDeEsteAnio =
            juegosPorAnio[anio];

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
        // AÑADIR TARJETAS
        // ==================================

        tarjetasDelAnio.forEach(
            (tarjeta) => {

                gridJuegos.appendChild(
                    tarjeta
                );

            }
        );


        // ==================================
        // PLEGAR / DESPLEGAR AÑO
        // ==================================

        encabezado.addEventListener(
            "click",
            () => {

                const estaPlegado =
                    encabezado.classList.toggle(
                        "plegado"
                    );


                // Ocultamos o mostramos
                // únicamente los juegos
                // pertenecientes a este año

                tarjetasDelAnio.forEach(
                    (tarjeta) => {

                        tarjeta.style.display =
                            estaPlegado
                                ? "none"
                                : "";

                    }
                );


                // ==================================
                // CAMBIAR FLECHA
                // ==================================

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


                // ==================================
                // ACCESIBILIDAD
                // ==================================

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
// CREAR SELECTOR DE AÑOS
// ==========================================

// ==========================================
// CREAR SELECTOR DE AÑOS
// ==========================================

function crearSelectorAnios() {

    // Eliminamos los años anteriores,
    // pero conservamos "Todos los años"

    while (
        selectorAnio.options.length > 1
    ) {
        selectorAnio.remove(1);
    }


    // Sacamos el año de fechaInicio

    const anios =
        juegos
            .map(
                (juego) => {

                    if (!juego.fechaFin) {
    return null;
}

return Number(
    juego.fechaFin.split("-")[0]
);
                }
            )
            .filter(
                (anio) =>
                    anio !== null
            );


    // Quitamos años repetidos

    const aniosUnicos =
        [...new Set(anios)];


    // Ordenamos de más reciente a más antiguo

    aniosUnicos.sort(
        (a, b) =>
            b - a
    );


    // Creamos las opciones del selector

    aniosUnicos.forEach(
        (anio) => {

            const opcion =
                document.createElement("option");

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

function ordenarListaJuegos(lista) {

    const criterio =
        selectorOrden.value;

    const direccion =
    botonDireccion.dataset.direccion;

    const multiplicador =
        direccion === "asc"
            ? 1
            : -1;


    return [...lista].sort(
        (a, b) => {

            // ==================================
            // ORDEN DE AÑADIDO
            // ==================================

            if (criterio === "anadido") {

                const fechaA =
                    a.createdAt
                        ? new Date(a.createdAt).getTime()
                        : null;

                const fechaB =
                    b.createdAt
                        ? new Date(b.createdAt).getTime()
                        : null;


                if (fechaA === null) {
                    return 1;
                }

                if (fechaB === null) {
                    return -1;
                }


                return (
                    fechaA - fechaB
                ) * multiplicador;
            }


            // ==================================
            // FECHA DE FINALIZACIÓN
            // ==================================

            if (criterio === "fecha") {

                const fechaA =
                    a.fecha
                        ? new Date(
                            a.fecha + "-01T00:00:00"
                        ).getTime()
                        : null;

                const fechaB =
                    b.fecha
                        ? new Date(
                            b.fecha + "-01T00:00:00"
                        ).getTime()
                        : null;


                if (fechaA === null) {
                    return 1;
                }

                if (fechaB === null) {
                    return -1;
                }


                return (
                    fechaA - fechaB
                ) * multiplicador;
            }


            // ==================================
            // RESTO DE CRITERIOS NUMÉRICOS
            // ==================================

            const valorA =
                a[criterio];

            const valorB =
                b[criterio];


            // Los "NO APLICA" siempre al final

            const vacioA =
                valorA === null ||
                valorA === undefined ||
                valorA === "";

            const vacioB =
                valorB === null ||
                valorB === undefined ||
                valorB === "";


            if (vacioA && vacioB) {
                return 0;
            }

            if (vacioA) {
                return 1;
            }

            if (vacioB) {
                return -1;
            }


            return (
                Number(valorA) -
                Number(valorB)
            ) * multiplicador;
        }
    );
}

// ==========================================
// APLICAR FILTROS Y ORDENACIÓN
// ==========================================

async function actualizarBiblioteca() {

    const anioSeleccionado =
        selectorAnio.value;


    let juegosFiltrados =
        [...juegos];


    // ======================================
// FILTRAR POR AÑO
// ======================================

if (anioSeleccionado !== "todos") {

    juegosFiltrados =
        juegosFiltrados.filter(
            (juego) => {

                if (!juego.fechaFin) {
    return false;
}

const anio =
    Number(
        juego.fechaFin.split("-")[0]
    );

                return (
                    anio ===
                    Number(anioSeleccionado)
                );
            }
        );
}

    // ======================================
// MOSTRAR SOLO FAVORITOS
// ======================================

if (
    soloFavoritos &&
    soloFavoritos.checked
) {

    juegosFiltrados =
        juegosFiltrados.filter(
            (juego) =>
                juego.destacado === true
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
// FILTROS Y ORDENACIÓN
// ==========================================

selectorAnio.addEventListener(
    "change",
    actualizarBiblioteca
);


selectorOrden.addEventListener(
    "change",
    actualizarBiblioteca
);

soloFavoritos.addEventListener(
    "change",
    actualizarBiblioteca
);


botonDireccion.addEventListener(
    "click",
    async () => {

        const direccionActual =
            botonDireccion.dataset.direccion;

        const nuevaDireccion =
            direccionActual === "asc"
                ? "desc"
                : "asc";

        botonDireccion.dataset.direccion =
            nuevaDireccion;

        botonDireccion.classList.toggle(
            "descendente",
            nuevaDireccion === "desc"
        );

        await actualizarBiblioteca();
    }
);


// ==========================================
// INICIAR BIBLIOTECA
// ==========================================

async function iniciarBiblioteca() {

    try {

        // 1. Cargar los juegos del usuario
        // desde Supabase
        await cargarJuegosDesdeSupabase();


        // 2. Ordenarlos
        ordenarJuegosPorFecha();


        // 3. Crear automáticamente
        // los años disponibles
        crearSelectorAnios();


        // 4. Mostrar los juegos
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

// ======================================
// CAMBIO DE VISTA
// ======================================

const botonVistaSencilla =
    document.getElementById(
        "vista-sencilla"
    );

const botonVistaDetallada =
    document.getElementById(
        "vista-detallada"
    );

botonVistaSencilla.addEventListener(
    "click",
    () => {

        botonVistaSencilla.classList.add(
            "activo"
        );

        botonVistaDetallada.classList.remove(
            "activo"
        );

        document.body.classList.remove(
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

        botonVistaDetallada.classList.add(
            "activo"
        );

        botonVistaSencilla.classList.remove(
            "activo"
        );

        document.body.classList.add(
            "vista-detallada"
        );

        localStorage.setItem(
    "vistaBiblioteca",
    "detallada"
);

    }
);

// ======================================
// RECUPERAR ÚLTIMA VISTA UTILIZADA
// ======================================

const vistaGuardada =
    localStorage.getItem(
        "vistaBiblioteca"
    );

if (vistaGuardada === "detallada") {

    document.body.classList.add(
        "vista-detallada"
    );

    botonVistaDetallada.classList.add(
        "activo"
    );

    botonVistaSencilla.classList.remove(
        "activo"
    );

} else {

    document.body.classList.remove(
        "vista-detallada"
    );

    botonVistaSencilla.classList.add(
        "activo"
    );

    botonVistaDetallada.classList.remove(
        "activo"
    );

}

// ==========================================
// ARRANCAR CHECKPOINT SELECT
// ==========================================

iniciarBiblioteca();

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
                await supabaseClient.auth.signOut();

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