// ==========================================
// CHECKPOINT SELECT
// FICHA AUTOMÁTICA DE VIDEOJUEGO
// ==========================================


// ==========================================
// NOMBRES DE LAS CATEGORÍAS
// ==========================================

const nombresCategorias = {
    historia: "Historia",
    graficos: "Gráficos",
    tecnico: "Apartado técnico visual",
    gameplay: "Gameplay",
    jugabilidad: "Jugabilidad",
    musica: "Música / Sonido",
    personajes: "Personajes",
    dificultad: "Dificultad",
    diversion: "Diversión"
};


// ==========================================
// PALETA POR DEFECTO
// ==========================================

const PALETA_DEFECTO = {
    principal: "#64748B",
    secundario: "#475569",
    acento: "#94A3B8"
};


// ==========================================
// HEX → RGB
// ==========================================

function hexARgb(hex) {

    if (!hex) {
        return null;
    }

    const limpio = hex.replace("#", "");

    if (limpio.length !== 6) {
        return null;
    }

    return {
        r: parseInt(limpio.substring(0, 2), 16),
        g: parseInt(limpio.substring(2, 4), 16),
        b: parseInt(limpio.substring(4, 6), 16)
    };
}


// ==========================================
// RGB TRANSPARENTE
// ==========================================

function colorRGBA(hex, opacidad) {

    const rgb = hexARgb(hex);

    if (!rgb) {
        return `rgba(100, 116, 139, ${opacidad})`;
    }

    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacidad})`;
}


// ==========================================
// ACLARAR COLOR
// ==========================================

function aclararColor(hex, cantidad = 0.35) {

    const rgb = hexARgb(hex);

    if (!rgb) {
        return "#94A3B8";
    }

    const r = Math.round(
        rgb.r + (255 - rgb.r) * cantidad
    );

    const g = Math.round(
        rgb.g + (255 - rgb.g) * cantidad
    );

    const b = Math.round(
        rgb.b + (255 - rgb.b) * cantidad
    );

    return "#" + [r, g, b]
        .map(valor =>
            valor
                .toString(16)
                .padStart(2, "0")
        )
        .join("");
}


// ==========================================
// OSCURECER COLOR
// ==========================================

function oscurecerColor(hex, cantidad = 0.65) {

    const rgb = hexARgb(hex);

    if (!rgb) {
        return "#15181D";
    }

    const factor = 1 - cantidad;

    const r = Math.round(rgb.r * factor);
    const g = Math.round(rgb.g * factor);
    const b = Math.round(rgb.b * factor);

    return "#" + [r, g, b]
        .map(valor =>
            valor
                .toString(16)
                .padStart(2, "0")
        )
        .join("");
}


// ==========================================
// LUMINOSIDAD
// ==========================================

function luminosidadColor(hex) {

    const rgb = hexARgb(hex);

    if (!rgb) {
        return 150;
    }

    return (
        rgb.r * 0.299 +
        rgb.g * 0.587 +
        rgb.b * 0.114
    );
}


// ==========================================
// COLOR VISIBLE
// ==========================================

function obtenerColorVisible(hex) {

    const luminosidad =
        luminosidadColor(hex);

    if (luminosidad < 95) {
        return aclararColor(hex, 0.48);
    }

    if (luminosidad < 135) {
        return aclararColor(hex, 0.25);
    }

    return hex;
}


// ==========================================
// OBTENER IMÁGENES DEL JUEGO
// ==========================================

async function obtenerImagenesJuego(juego) {

    return {
        portada: juego.portada || "",
        fondo: juego.fondo || ""
    };
}


// ==========================================
// APLICAR TEMA DEL JUEGO
// ==========================================

function aplicarTemaJuego(
    juego,
    fondoJuego = ""
) {

    document.body.classList.add(
    "tema-juego-activo"
);

    const paleta =
        juego.paleta ||
        PALETA_DEFECTO;

    const principal =
        paleta.principal ||
        PALETA_DEFECTO.principal;

    const secundario =
        paleta.secundario ||
        PALETA_DEFECTO.secundario;

    const acento =
        paleta.acento ||
        PALETA_DEFECTO.acento;


    const principalVisible =
        obtenerColorVisible(principal);

    const secundarioVisible =
        obtenerColorVisible(secundario);

    const acentoVisible =
        obtenerColorVisible(acento);


    const raiz =
        document.documentElement;


    // ======================================
    // COLORES BASE
    // ======================================

    raiz.style.setProperty(
        "--juego-principal",
        principal
    );

    raiz.style.setProperty(
        "--juego-secundario",
        secundario
    );

    raiz.style.setProperty(
        "--juego-acento",
        acento
    );


    // ======================================
    // VERSIONES VISIBLES
    // ======================================

    raiz.style.setProperty(
        "--juego-principal-visible",
        principalVisible
    );

    raiz.style.setProperty(
        "--juego-secundario-visible",
        secundarioVisible
    );

    raiz.style.setProperty(
        "--juego-acento-visible",
        acentoVisible
    );


    // ======================================
    // VERSIONES OSCURAS
    // ======================================

    raiz.style.setProperty(
        "--juego-principal-oscuro",
        oscurecerColor(
            principal,
            0.68
        )
    );

    raiz.style.setProperty(
        "--juego-principal-muy-oscuro",
        oscurecerColor(
            principal,
            0.82
        )
    );

    raiz.style.setProperty(
        "--juego-secundario-oscuro",
        oscurecerColor(
            secundario,
            0.72
        )
    );

    raiz.style.setProperty(
        "--juego-acento-oscuro",
        oscurecerColor(
            acento,
            0.72
        )
    );


    // ======================================
    // TRANSPARENCIAS PRINCIPAL
    // ======================================

    raiz.style.setProperty(
        "--juego-principal-05",
        colorRGBA(principal, 0.05)
    );

    raiz.style.setProperty(
        "--juego-principal-08",
        colorRGBA(principal, 0.08)
    );

    raiz.style.setProperty(
        "--juego-principal-12",
        colorRGBA(principal, 0.12)
    );

    raiz.style.setProperty(
        "--juego-principal-18",
        colorRGBA(principal, 0.18)
    );

    raiz.style.setProperty(
        "--juego-principal-25",
        colorRGBA(principal, 0.25)
    );

    raiz.style.setProperty(
        "--juego-principal-35",
        colorRGBA(principal, 0.35)
    );

    raiz.style.setProperty(
        "--juego-principal-50",
        colorRGBA(principal, 0.50)
    );

    raiz.style.setProperty(
        "--juego-principal-65",
        colorRGBA(principal, 0.65)
    );


    // ======================================
    // TRANSPARENCIAS SECUNDARIO
    // ======================================

    raiz.style.setProperty(
        "--juego-secundario-08",
        colorRGBA(secundario, 0.08)
    );

    raiz.style.setProperty(
        "--juego-secundario-12",
        colorRGBA(secundario, 0.12)
    );

    raiz.style.setProperty(
        "--juego-secundario-20",
        colorRGBA(secundario, 0.20)
    );

    raiz.style.setProperty(
        "--juego-secundario-30",
        colorRGBA(secundario, 0.30)
    );

    raiz.style.setProperty(
        "--juego-secundario-45",
        colorRGBA(secundario, 0.45)
    );


    // ======================================
    // TRANSPARENCIAS ACENTO
    // ======================================

    raiz.style.setProperty(
        "--juego-acento-10",
        colorRGBA(acento, 0.10)
    );

    raiz.style.setProperty(
        "--juego-acento-20",
        colorRGBA(acento, 0.20)
    );

    raiz.style.setProperty(
        "--juego-acento-35",
        colorRGBA(acento, 0.35)
    );

    raiz.style.setProperty(
        "--juego-acento-50",
        colorRGBA(acento, 0.50)
    );


    // ======================================
    // FONDO PERSONALIZADO
    // ======================================

    const contenedorFondo =
        document.querySelector(
            ".fondo-juego"
        );

    if (
        fondoJuego &&
        typeof fondoJuego === "string" &&
        fondoJuego.trim() !== ""
    ) {

        document.body.classList.add(
            "tiene-fondo-juego"
        );

        if (contenedorFondo) {

            contenedorFondo.style.backgroundImage =
                `
                linear-gradient(
                    to bottom,
                    rgba(8, 10, 14, 0.25) 0%,
                    rgba(8, 10, 14, 0.42) 50%,
                    rgba(8, 10, 14, 0.95) 100%
                ),
                url("${fondoJuego}")
                `;

            contenedorFondo.style.backgroundSize =
                "cover";

            contenedorFondo.style.backgroundPosition =
                "center center";

            contenedorFondo.style.backgroundRepeat =
                "no-repeat";
        }

        console.log(
            "Fondo aplicado directamente."
        );

    } else {

        document.body.classList.remove(
            "tiene-fondo-juego"
        );

        if (contenedorFondo) {

            contenedorFondo.style.backgroundImage =
                "none";
        }
    }
}


// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearPeriodo(fechaInicio, fechaFin) {

    const formatearMesAnio = (fecha) => {

        if (!fecha) {
            return null;
        }

        const [anio, mes] =
            fecha.split("-");

        const meses = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        ];

        return `${meses[Number(mes) - 1]} ${anio}`;
    };


    const inicio =
        formatearMesAnio(fechaInicio);

    const fin =
        formatearMesAnio(fechaFin);


    if (inicio && fin) {

    if (inicio === fin) {
        return inicio;
    }

    return `${inicio} - ${fin}`;
}

    if (inicio) {
        return `${inicio} - En curso`;
    }

    if (fin) {
        return fin;
    }

    return "Sin fecha";
}


// ==========================================
// FORMATEAR NOTAS
// ==========================================

function formatearNota(nota) {

    if (
        nota === null ||
        nota === undefined ||
        nota === ""
    ) {
        return "--";
    }

    const numero =
        Number(nota);

    if (
        Number.isNaN(numero)
    ) {
        return "--";
    }

    if (
        Number.isInteger(numero)
    ) {
        return numero.toString();
    }

    return numero
        .toString()
        .replace(".", ",");
}

// ==========================================
// COLOR DE LA NOTA FINAL
// ==========================================

function aplicarColorNotaFinal(nota) {

    const circulo =
        document.querySelector(".nota-final");

    if (!circulo) {
        return;
    }

    const numero = Number(nota);

    if (Number.isNaN(numero)) {
        return;
    }

    let color;

    if (numero < 4) {
        color = "#ef4444";      // Rojo
    } else if (numero < 5) {
        color = "#f97316";      // Naranja
    } else if (numero < 6) {
        color = "#eab308";      // Amarillo
    } else if (numero < 7) {
        color = "#84cc16";      // Lima
    } else if (numero < 8) {
        color = "#22c55e";      // Verde claro
    } else if (numero < 9) {
        color = "#10b981";      // Verde esmeralda
    } else {
        color = "#00e676";      // Verde intenso
    }

    circulo.style.setProperty(
        "--color-nota",
        color
    );
}

// ==========================================
// CREAR VALORACIONES
// ==========================================

function crearValoraciones(valoraciones) {

    const lista =
        document.querySelector(
            "#lista-valoraciones"
        );

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    if (!valoraciones) {

        lista.innerHTML =
            "<p>No hay valoraciones disponibles.</p>";

        return;
    }


    // ======================================
    // ICONOS DE LAS CATEGORÍAS
    // ======================================

    const iconosCategorias = {

        historia: "book-open",

        graficos: "monitor",

        tecnico: "settings",

        gameplay: "gamepad-2",

        jugabilidad: "joystick",

        musica: "headphones",

        personajes: "users",

        dificultad: "skull",

        diversion: "sparkles"

    };

    const descripcionesCategorias = {

    historia:
        "Se valora la narrativa, su desarrollo y ambientación, así como la historia de los personajes, su evolución y trasfondo.",

    graficos:
        "Se valora el apartado gráfico dentro del estilo del propio juego, ya sea realista, pixel art, etc. También aspectos como la iluminación, el nivel de detalle y el acabado visual.",

    tecnico:
        "Se valoran el rendimiento, fluidez, menús, IA, partículas, bugs y otros aspectos técnicos. También se tiene en cuenta la dirección artística general.",

    gameplay:
        "Se valora cómo se siente la experiencia al jugar: exploración, linealidad, repetición, ritmo y cómo se integran las distintas mecánicas y recursos con el mundo y la experiencia.",

    jugabilidad:
        "Se valoran las posibilidades que ofrece el juego al controlarlo: variedad de mecánicas, controles y sensaciones tanto con mando como con teclado y ratón.",

    musica:
        "Se valoran los sonidos del entorno y del juego, su calidad y capacidad de transmitir sensaciones. También la música, su integración en cada situación y la calidad de la banda sonora.",

    personajes:
        "Se valora la calidad por encima de la cantidad: protagonistas, secundarios, villanos, enemigos, criaturas, jefes y NPCs. Se tienen en cuenta su personalidad, trasfondo, diseño, atractivo personal y doblaje.",

    dificultad:
        "No se premia simplemente que un juego sea muy difícil. Se valora que la dificultad sea justa y equilibrada, el aprendizaje de sus mecánicas y la existencia de retos y combates secundarios exigentes.",

    diversion:
        "La categoría principal y más importante. Se valora cuánto he disfrutado el tiempo dedicado al juego, si la experiencia ha merecido la pena y las emociones que me ha hecho sentir."

};


    let valoracionesCreadas = 0;

    const categoriasExcluidas = [];


    // ======================================
    // CREAR CATEGORÍAS INCLUIDAS
    // ======================================

    Object.keys(nombresCategorias).forEach(
        (categoria) => {

            const valor =
                valoraciones[categoria];


            // ==================================
            // CATEGORÍA FUERA DE VALORACIÓN
            // ==================================

            if (
                valor === null ||
                valor === undefined ||
                valor === ""
            ) {

                categoriasExcluidas.push(
                    nombresCategorias[categoria]
                );

                return;
            }


            const nota =
                Number(valor);


            if (Number.isNaN(nota)) {
                return;
            }


            const porcentaje =
                Math.max(
                    0,
                    Math.min(
                        100,
                        nota * 10
                    )
                );


            const elemento =
                document.createElement(
                    "div"
                );


            elemento.classList.add(
                "valoracion"
            );


            elemento.innerHTML = `

                <button
    class="icono-valoracion boton-info-valoracion"
    type="button"
    data-categoria="${categoria}"
    aria-label="Ver qué se valora en ${nombresCategorias[categoria]}"
>

    <i
        data-lucide="${iconosCategorias[categoria]}"
    ></i>

</button>


                <div class="contenido-valoracion">

                    <div class="nombre-valoracion">

                        <span>
                            ${nombresCategorias[categoria]}
                        </span>

                        <strong>
                            ${formatearNota(nota)}
                        </strong>

                    </div>


                    <div class="barra">

                        <div
                            class="relleno"
                            style="width: ${porcentaje}%"
                        ></div>

                    </div>

                </div>
            `;

            const botonInfo =
    elemento.querySelector(
        ".boton-info-valoracion"
    );

if (botonInfo) {

    botonInfo.addEventListener(
        "click",
        () => {

            mostrarInfoValoracion(
                categoria,
                nombresCategorias[categoria],
                descripcionesCategorias[categoria]
            );

        }
    );
}


            lista.appendChild(
                elemento
            );


            valoracionesCreadas++;
        }
    );


    // ======================================
    // SI NO HAY NINGUNA VALORACIÓN
    // ======================================

    if (valoracionesCreadas === 0) {

        lista.innerHTML =
            "<p>No hay valoraciones disponibles.</p>";
    }


    // ======================================
    // MOSTRAR CATEGORÍAS EXCLUIDAS
    // ======================================

    if (
        categoriasExcluidas.length > 0 &&
        valoracionesCreadas > 0
    ) {

        const aviso =
            document.createElement(
                "div"
            );


        aviso.classList.add(
            "aviso-categorias-excluidas"
        );


        const nombres =
            categoriasExcluidas.join(
                " · "
            );


        const textoApartado =
            categoriasExcluidas.length === 1
                ? "Fuera de valoración"
                : "Fuera de valoración";


        const explicacion =
            categoriasExcluidas.length === 1
                ? "Este apartado no se ha tenido en cuenta al no ser aplicable a este videojuego."
                : "Estos apartados no se han tenido en cuenta al no ser aplicables a este videojuego.";


        aviso.innerHTML = `

            <div class="icono-aviso-valoracion">

                <i data-lucide="info"></i>

            </div>


            <div class="texto-aviso-valoracion">

                <p>
                    <strong>
                        ${textoApartado}:
                    </strong>

                    <span>
                        ${nombres}
                    </span>
                </p>

                <small>
                    ${explicacion}
                </small>

            </div>
        `;


        lista.appendChild(
            aviso
        );
    }


    // ======================================
    // ACTIVAR ICONOS LUCIDE
    // ======================================

    if (window.lucide) {
        lucide.createIcons();
    }

}


// ==========================================
// CREAR ANÁLISIS
// ==========================================

function crearAnalisis(opinion) {

    const contenido =
        document.querySelector(
            "#contenido-analisis"
        );

    if (!contenido) {
        return;
    }


    contenido.innerHTML = "";


    if (
        !opinion ||
        typeof opinion !== "string" ||
        opinion.trim() === ""
    ) {

        contenido.innerHTML =
            "<p>Todavía no he escrito mi análisis de este videojuego.</p>";

        return;
    }


    /*
        La opinión se guarda ahora como un único
        texto en Supabase.

        Si escribimos varios párrafos separados
        por saltos de línea, se mostrarán como
        párrafos independientes.
    */

    const parrafos =
        opinion
            .trim()
            .split(/\n\s*\n/)
            .filter(
                parrafo =>
                    parrafo.trim() !== ""
            );


    parrafos.forEach(
        texto => {

            const parrafo =
                document.createElement(
                    "p"
                );

            parrafo.textContent =
                texto.trim();

            contenido.appendChild(
                parrafo
            );
        }
    );
}


// ==========================================
// CARGAR FICHA
// ==========================================

async function cargarJuego(juego) {

    // ======================================
    // CARGAR IMÁGENES
    // ======================================

    const imagenes =
        await obtenerImagenesJuego(
            juego
        );


    // ======================================
    // TEMA + FONDO
    // ======================================

    aplicarTemaJuego(
        juego,
        imagenes.fondo
    );


    // ======================================
    // TÍTULO DE LA PESTAÑA
    // ======================================

    document.title =
        juego.titulo +
        " | Checkpoint Select";


    // ======================================
    // INFORMACIÓN PRINCIPAL
    // ======================================

    document
        .querySelector(
            "#ficha-titulo"
        )
        .textContent =
        juego.titulo;


    const portada =
        document.querySelector(
            "#ficha-portada"
        );


    if (imagenes.portada) {

        portada.src =
            imagenes.portada;

        portada.style.display =
            "";

    } else {

        portada.removeAttribute(
            "src"
        );
    }


    portada.alt =
        "Portada de " +
        juego.titulo;


    document
    .querySelector(
        "#ficha-fecha"
    )
    .textContent =
    formatearPeriodo(
        juego.fechaInicio,
        juego.fechaFin
    );


    document
        .querySelector(
            "#ficha-horas"
        )
        .textContent =
        juego.horas !== null &&
        juego.horas !== undefined
            ? juego.horas + " horas"
            : "Sin indicar";


    document
        .querySelector(
            "#ficha-plataforma"
        )
        .textContent =
        juego.plataforma ||
        "Sin indicar";


    document
        .querySelector(
            "#ficha-anio"
        )
        .textContent =
        juego.anioJuego ??
        "Sin indicar";


    // ======================================
    // NOTA FINAL
    // ======================================

    document
        .querySelector(
            "#ficha-nota-final"
        )
        .textContent =
        formatearNota(
            juego.notaFinal
        );

        aplicarColorNotaFinal(
    juego.notaFinal
);

// ======================================
// ESTRELLA DE JUEGO DESTACADO
// ======================================

const estrellaDestacado =
    document.querySelector(
        "#estrella-destacado-ficha"
    );

if (estrellaDestacado) {

    estrellaDestacado.style.display =
        juego.destacado
            ? "block"
            : "none";
}


    document
    .querySelector(
        "#titulo-valoracion"
    )
    .textContent =
    "Puntuación personal de " +
    juego.titulo;


    document
        .querySelector(
            "#titulo-analisis"
        )
        .textContent =
        "Lo que me ha parecido " +
        juego.titulo;


    // ======================================
    // VALORACIONES
    // ======================================

    crearValoraciones(
        juego.valoraciones
    );


    // ======================================
    // ANÁLISIS
    // ======================================

    crearAnalisis(
        juego.opinion
    );
}

// ==========================================
// MOSTRAR INFORMACIÓN DE VALORACIÓN
// ==========================================

function mostrarInfoValoracion(
    categoria,
    nombre,
    descripcion
) {

    // Cerramos cualquier popup que ya esté abierto

    const popupAnterior =
        document.querySelector(
            ".popup-info-valoracion"
        );

    if (popupAnterior) {
        popupAnterior.remove();
    }


    // Localizamos el botón pulsado

    const boton =
        document.querySelector(
            `.boton-info-valoracion[data-categoria="${categoria}"]`
        );

    if (!boton) {
        return;
    }


    // Creamos el popup

    const popup =
        document.createElement("div");

    popup.classList.add(
        "popup-info-valoracion"
    );


    popup.innerHTML = `

        <div class="popup-info-cabecera">

            <strong>
                ${nombre}
            </strong>

            <button
                class="cerrar-popup-valoracion"
                type="button"
                aria-label="Cerrar"
            >
                ×
            </button>

        </div>

        <p>
            ${descripcion}
        </p>
    `;


    // Lo colocamos junto al icono

    boton.appendChild(
        popup
    );


    // Evitamos que pulsar dentro cierre accidentalmente

    popup.addEventListener(
        "click",
        (evento) => {
            evento.stopPropagation();
        }
    );


    // Botón cerrar

    popup
        .querySelector(
            ".cerrar-popup-valoracion"
        )
        .addEventListener(
            "click",
            () => {
                popup.remove();
            }
        );
}


// ==========================================
// OBTENER ID DE LA URL
// ==========================================

const parametros =
    new URLSearchParams(
        window.location.search
    );


const idJuego =
    Number(
        parametros.get("id")
    );


// ==========================================
// MOSTRAR ERROR
// ==========================================

function mostrarErrorJuego() {

    const pagina =
        document.querySelector(
            ".pagina-juego"
        );

    if (!pagina) {
        return;
    }


    pagina.innerHTML = `
        <section class="seccion-valoracion">

            <p class="etiqueta">
                ERROR
            </p>

            <h1>
                No se ha encontrado el videojuego
            </h1>

            <p>
                Vuelve a la biblioteca y selecciona
                un videojuego.
            </p>

            <br>

            <a
                href="index.html#coleccion"
                class="boton-principal"
            >
                VOLVER A LA BIBLIOTECA
            </a>

        </section>
    `;
}


// ==========================================
// CONVERTIR JUEGO DE SUPABASE
// AL FORMATO QUE USA LA FICHA
// ==========================================

function adaptarJuegoSupabase(juegoDB) {

    return {

        // ======================================
        // DATOS PRINCIPALES
        // ======================================

        id:
            juegoDB.id,

        destacado:
            juegoDB.destacado,

        titulo:
            juegoDB.titulo,

        plataforma:
            juegoDB.plataforma,

        anioJuego:
            juegoDB.anio_juego,

        horas:
            juegoDB.horas,

        fechaInicio:
            juegoDB.fecha_inicio,

        fechaFin:
            juegoDB.fecha_fin,

        notaFinal:
            juegoDB.nota_final,


        // ======================================
        // IMÁGENES
        // ======================================

        portada:
            juegoDB.portada_url || "",

        fondo:
            juegoDB.fondo_url || "",


        // ======================================
        // PALETA
        // ======================================

        paleta: {

            principal:
                juegoDB.color_principal ||
                PALETA_DEFECTO.principal,

            secundario:
                juegoDB.color_secundario ||
                PALETA_DEFECTO.secundario,

            acento:
                juegoDB.color_acento ||
                PALETA_DEFECTO.acento
        },


        // ======================================
        // VALORACIONES
        // ======================================

        valoraciones: {

            historia:
                juegoDB.historia,

            graficos:
                juegoDB.graficos,

            tecnico:
                juegoDB.tecnico,

            gameplay:
                juegoDB.gameplay,

            jugabilidad:
                juegoDB.jugabilidad,

            musica:
                juegoDB.musica,

            personajes:
                juegoDB.personajes,

            dificultad:
                juegoDB.dificultad,

            diversion:
                juegoDB.diversion
        },


        // ======================================
        // OPINIÓN / ANÁLISIS
        // ======================================

        opinion:
            juegoDB.opinion || ""
    };
}


// ==========================================
// CARGAR JUEGO DESDE SUPABASE
// ==========================================

async function obtenerJuegoSupabase() {

    // ======================================
    // COMPROBAR ID
    // ======================================

    if (
        !idJuego ||
        Number.isNaN(idJuego)
    ) {

        throw new Error(
            "El ID del videojuego no es válido."
        );
    }


    // ======================================
    // COMPROBAR SESIÓN
    // ======================================

    const {
        data: { user },
        error: userError
    } =
        await supabaseClient
            .auth
            .getUser();


    if (
        userError ||
        !user
    ) {

        throw new Error(
            "No hay ningún usuario conectado."
        );
    }


    // ======================================
    // BUSCAR JUEGO
    // ======================================

    const {
        data,
        error
    } =
        await supabaseClient
            .from("juegos")
            .select("*")
            .eq(
                "id",
                idJuego
            )
            .eq(
                "usuario_id",
                user.id
            )
            .single();


    if (error) {

        console.error(
            "Error obteniendo el videojuego:",
            error
        );

        throw error;
    }


    if (!data) {

        throw new Error(
            "No se ha encontrado el videojuego."
        );
    }


    return adaptarJuegoSupabase(
        data
    );
}


// ==========================================
// INICIAR FICHA
// ==========================================

async function iniciarFicha() {

    try {

        const juego =
            await obtenerJuegoSupabase();


        console.log(
            "Juego cargado desde Supabase:",
            juego
        );


        await cargarJuego(
            juego
        );

    } catch (error) {

        console.error(
            "Error cargando la ficha del videojuego:",
            error
        );


        mostrarErrorJuego();
    }
}


// ==========================================
// ARRANCAR
// ==========================================

// ==========================================
// EDITAR VIDEOJUEGO
// ==========================================

const botonEditarJuego =
    document.getElementById(
        "boton-editar-juego"
    );

if (botonEditarJuego) {

    botonEditarJuego.addEventListener(
        "click",
        () => {

            window.location.href =
                `admin.html?id=${idJuego}`;

        }
    );

}


// ==========================================
// ELIMINAR VIDEOJUEGO
// ==========================================

const botonEliminarJuego =
    document.getElementById(
        "boton-eliminar-juego"
    );

if (botonEliminarJuego) {

    botonEliminarJuego.addEventListener(
        "click",
        async () => {

            const confirmar =
                confirm(
                    "¿Estás seguro de que quieres eliminar este videojuego?"
                );

            if (!confirmar) {
                return;
            }


            try {

                // Comprobar usuario

                const {
                    data: { user },
                    error: userError
                } =
                    await supabaseClient
                        .auth
                        .getUser();


                if (
                    userError ||
                    !user
                ) {

                    throw new Error(
                        "No hay ningún usuario conectado."
                    );

                }


                // Eliminar juego

                const {
                    error
                } =
                    await supabaseClient
                        .from("juegos")
                        .delete()
                        .eq(
                            "id",
                            idJuego
                        )
                        .eq(
                            "usuario_id",
                            user.id
                        );


                if (error) {
                    throw error;
                }


                // Volver a la biblioteca

                window.location.href =
                    "index.html#coleccion";


            } catch (error) {

                console.error(
                    "Error eliminando el videojuego:",
                    error
                );

                alert(
                    "No se ha podido eliminar el videojuego."
                );

            }

        }
    );

}


// ==========================================
// ARRANCAR
// ==========================================

iniciarFicha();

// ==========================================
// CERRAR POPUP AL PULSAR FUERA
// ==========================================

document.addEventListener(
    "click",
    (evento) => {

        const popup =
            document.querySelector(
                ".popup-info-valoracion"
            );

        if (!popup) {
            return;
        }

        const boton =
            popup.closest(
                ".boton-info-valoracion"
            );

        // Si hemos pulsado dentro del popup
        // o sobre el propio icono, no hacemos nada
        if (
            popup.contains(evento.target) ||
            boton?.contains(evento.target)
        ) {
            return;
        }

        popup.remove();
    }
);