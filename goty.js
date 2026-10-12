
"use strict";

// ==========================================
// CHECKPOINT SELECT - GOTY
// ==========================================

// AÑO SELECCIONADO

const parametrosGoty = new URLSearchParams(window.location.search);
const anioGoty = Number(parametrosGoty.get("anio"));
const elementoAnioGoty = document.getElementById("goty-anio-actual");

const anioGotyValido =
    Number.isInteger(anioGoty) &&
    anioGoty >= 2022 &&
    anioGoty <= 2100;

if (!anioGotyValido) {
    window.location.replace("index.html");
} else if (elementoAnioGoty) {
    elementoAnioGoty.textContent = anioGoty;
}


// ==========================================
// CATEGORÍAS
// ==========================================

const categoriasGoty = [
    { id: "favorito", nombre: "JUEGO FAVORITO DEL AÑO", icono: "🏆", grupo: "personal" },
    { id: "ambientacion", nombre: "MEJOR MUNDO / AMBIENTACIÓN", icono: "🌍", grupo: "personal" },
    { id: "diversion", nombre: "JUEGO MÁS DIVERTIDO DEL AÑO", icono: "🎮", grupo: "personal" },
    { id: "sorpresa", nombre: "JUEGO SORPRESA DEL AÑO", icono: "✨", grupo: "personal" },
    { id: "adictivo", nombre: "JUEGO MÁS ADICTIVO DEL AÑO", icono: "🔥", grupo: "personal" },
    { id: "dificultad", nombre: "JUEGO MÁS DESAFIANTE DEL AÑO", icono: "⚔️", grupo: "personal" },

    { id: "mejor-valorado", nombre: "JUEGO MEJOR VALORADO DEL AÑO", icono: "⭐", grupo: "valoracion" },
    { id: "historia", nombre: "MEJOR HISTORIA / NARRATIVA", icono: "📖", grupo: "valoracion" },
    { id: "visuales", nombre: "MEJOR APARTADO VISUAL", icono: "🎨", grupo: "valoracion" },
    { id: "jugabilidad", nombre: "MEJOR JUGABILIDAD / GAMEPLAY", icono: "🎮", grupo: "valoracion" },
    { id: "musica", nombre: "MEJOR BANDA SONORA / SONIDO", icono: "🎵", grupo: "valoracion" },
    { id: "personajes", nombre: "MEJORES PERSONAJES", icono: "👥", grupo: "valoracion" }
];

const categoriasAutomaticasGoty = [
    "diversion", "dificultad", "mejor-valorado",
    "historia", "visuales", "jugabilidad",
    "musica", "personajes"
];


// ==========================================
// ESTADO GENERAL
// ==========================================

let juegosGoty = [];
let grupoGotyActivo = "personal";
let usuarioGoty = null;
let rankingsCargadosGoty = false;
let rankingGuardandoGoty = false;

const seleccionesGoty = {};
const origenesGoty = {};

// Arrays de IDs.
// En "notas" guardamos el orden de los empates.
// En "personal" guardamos los diez puestos.
let ordenNotasGoty = [];
let topPersonalGoty = Array(10).fill(null);


// ==========================================
// UTILIDADES
// ==========================================

function obtenerNumeroGoty(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return null;
    }

    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : null;
}

function calcularMediaGoty(valor1, valor2) {
    const a = obtenerNumeroGoty(valor1);
    const b = obtenerNumeroGoty(valor2);

    return a === null || b === null ? null : (a + b) / 2;
}

function formatearNotaGoty(nota) {
    const numero = obtenerNumeroGoty(nota);
    return numero === null ? "—" : numero.toFixed(2).replace(".", ",");
}

function obtenerNotaCategoriaGoty(juego, categoriaId) {
    switch (categoriaId) {
        case "mejor-valorado": return obtenerNumeroGoty(juego.nota_final);
        case "historia": return obtenerNumeroGoty(juego.historia);
        case "visuales": return calcularMediaGoty(juego.graficos, juego.tecnico);
        case "jugabilidad": return calcularMediaGoty(juego.jugabilidad, juego.gameplay);
        case "musica": return obtenerNumeroGoty(juego.musica);
        case "personajes": return obtenerNumeroGoty(juego.personajes);
        case "diversion": return obtenerNumeroGoty(juego.diversion);
        case "dificultad": return obtenerNumeroGoty(juego.dificultad);
        default: return null;
    }
}

function compararNotasGoty(a, b) {
    const notaA = obtenerNumeroGoty(a);
    const notaB = obtenerNumeroGoty(b);

    if (notaA === null && notaB === null) return 0;
    if (notaA === null) return 1;
    if (notaB === null) return -1;

    return notaB - notaA;
}

function ordenarJuegosGoty(categoriaId) {
    return [...juegosGoty].sort((a, b) => {
        const diferenciaCategoria = compararNotasGoty(
            obtenerNotaCategoriaGoty(a, categoriaId),
            obtenerNotaCategoriaGoty(b, categoriaId)
        );

        if (diferenciaCategoria !== 0) return diferenciaCategoria;

        const diferenciaGeneral = compararNotasGoty(
            a.nota_final,
            b.nota_final
        );

        if (diferenciaGeneral !== 0) return diferenciaGeneral;

        return (a.titulo || "").localeCompare(b.titulo || "", "es");
    });
}

function buscarJuegoGoty(id) {
    return juegosGoty.find(juego => String(juego.id) === String(id));
}

function crearImagenGoty(juego, clase = "") {
    const imagen = document.createElement("img");
    imagen.className = clase;
    imagen.alt = `Portada de ${juego.titulo}`;
    imagen.loading = "lazy";

    if (juego.portada_url) {
        imagen.src = juego.portada_url;
    }

    return imagen;
}

function obtenerUsuarioGoty() {
    if (!usuarioGoty) {
        throw new Error("Debes iniciar sesión.");
    }

    return usuarioGoty;
}


// ==========================================
// CARGAR JUEGOS DEL AÑO
// ==========================================

async function cargarJuegosGoty() {
    const usuario = obtenerUsuarioGoty();

    const { data, error } = await supabaseClient
        .from("juegos")
        .select("*")
        .eq("usuario_id", usuario.id)
        .gte("fecha_fin", `${anioGoty}-01-01`)
        .lte("fecha_fin", `${anioGoty}-12-31`);

    if (error) throw error;

    juegosGoty = data || [];

    console.log(`Juegos disponibles para GOTY ${anioGoty}:`, juegosGoty);
}


// ==========================================
// GUARDAR PREMIOS
// ==========================================

async function guardarPremioGoty(categoriaId, posicion, juegoId, origen = "manual") {
    const usuario = obtenerUsuarioGoty();

    const { data: existente, error: errorConsulta } = await supabaseClient
        .from("goty_premios")
        .select("id")
        .eq("usuario_id", usuario.id)
        .eq("anio", anioGoty)
        .eq("categoria", categoriaId)
        .eq("posicion", posicion)
        .maybeSingle();

    if (errorConsulta) throw errorConsulta;

    if (existente) {
        const { error } = await supabaseClient
            .from("goty_premios")
            .update({ juego_id: juegoId, origen })
            .eq("id", existente.id)
            .eq("usuario_id", usuario.id);

        if (error) throw error;
    } else {
        const { error } = await supabaseClient
            .from("goty_premios")
            .insert({
                usuario_id: usuario.id,
                anio: anioGoty,
                categoria: categoriaId,
                posicion,
                juego_id: juegoId,
                origen
            });

        if (error) throw error;
    }
}

async function eliminarPremioGoty(categoriaId, posicion) {
    const usuario = obtenerUsuarioGoty();

    const { error } = await supabaseClient
        .from("goty_premios")
        .delete()
        .eq("usuario_id", usuario.id)
        .eq("anio", anioGoty)
        .eq("categoria", categoriaId)
        .eq("posicion", posicion);

    if (error) throw error;

    await cargarPremiosGuardadosGoty();
}

async function intercambiarPuestosGoty(categoriaId, posicionDestino, posicionOrigen) {
    const { error } = await supabaseClient.rpc(
        "intercambiar_puestos_goty",
        {
            p_anio: anioGoty,
            p_categoria: categoriaId,
            p_posicion_destino: posicionDestino,
            p_posicion_origen: posicionOrigen
        }
    );

    if (error) throw error;
}


// ==========================================
// RECUPERAR PREMIOS
// ==========================================

async function cargarPremiosGuardadosGoty() {
    const usuario = obtenerUsuarioGoty();

    const { data, error } = await supabaseClient
        .from("goty_premios")
        .select("categoria, posicion, juego_id, origen")
        .eq("usuario_id", usuario.id)
        .eq("anio", anioGoty);

    if (error) throw error;

    Object.keys(seleccionesGoty).forEach(clave => delete seleccionesGoty[clave]);
    Object.keys(origenesGoty).forEach(clave => delete origenesGoty[clave]);

    (data || []).forEach(premio => {
        if (!seleccionesGoty[premio.categoria]) {
            seleccionesGoty[premio.categoria] = {};
        }

        if (!origenesGoty[premio.categoria]) {
            origenesGoty[premio.categoria] = {};
        }

        seleccionesGoty[premio.categoria][premio.posicion] = premio.juego_id;
        origenesGoty[premio.categoria][premio.posicion] = premio.origen;
    });

    crearCategoriasGoty();
}

function mostrarPremiosGuardadosGoty() {
    document.querySelectorAll(".goty-tarjeta").forEach(tarjeta => {
        const categoriaId = tarjeta.dataset.categoria;

        [1, 2, 3].forEach(posicion => {
            const juegoId = seleccionesGoty[categoriaId]?.[posicion];
            const juego = buscarJuegoGoty(juegoId);

            if (!juego) return;

            const puesto = tarjeta.querySelector(`.goty-puesto-${posicion}`);

            if (puesto) actualizarPuestoGoty(puesto, juego);
        });
    });
}


// ==========================================
// PODIOS
// ==========================================

function crearPuestoGoty(posicion) {
    const puesto = document.createElement("div");
    puesto.className = `goty-puesto goty-puesto-${posicion}`;

    const medallas = { 1: "🥇", 2: "🥈", 3: "🥉" };

    puesto.innerHTML = `
        <div class="goty-posicion">
            <span>${medallas[posicion]}</span>
            TOP ${posicion}
        </div>

        <div class="goty-portada-vacia">
            <span class="goty-icono-vacio">+</span>
            <span class="goty-texto-vacio">SIN SELECCIONAR</span>
        </div>

        <p class="goty-nombre-juego">Puesto disponible</p>
    `;

    return puesto;
}

function actualizarPuestoGoty(puesto, juego) {
    const portada = puesto.querySelector(".goty-portada-vacia");
    const nombre = puesto.querySelector(".goty-nombre-juego");

    portada.innerHTML = "";
    portada.classList.add("goty-portada-seleccionada");

    if (juego.portada_url) {
        portada.appendChild(crearImagenGoty(juego, "goty-imagen-portada"));
    }

    nombre.textContent = juego.titulo;
}


// ==========================================
// SELECTOR DE PREMIOS
// ==========================================

function abrirSelectorGoty(tarjeta, categoriaId, posicion) {
    document.querySelectorAll(".goty-selector").forEach(elemento => elemento.remove());

    const selector = document.createElement("div");
    selector.className = "goty-selector";

    const juegoActual = seleccionesGoty[categoriaId]?.[posicion];

    if (juegoActual !== undefined && juegoActual !== null) {
        const quitar = document.createElement("button");
        quitar.type = "button";
        quitar.className = "goty-boton-quitar";
        quitar.textContent = "✕ QUITAR SELECCIÓN";

        quitar.style.cssText = `
            display:block;
            margin:12px 0;
            padding:10px 16px;
            background:#2a1717;
            color:#ff7777;
            border:1px solid #793333;
            border-radius:8px;
            cursor:pointer;
            font-weight:800;
            font-size:12px;
        `;

        quitar.addEventListener("click", async () => {
            if (!confirm(`¿Quieres quitar este videojuego del TOP ${posicion}?`)) return;

            quitar.disabled = true;

            try {
                await eliminarPremioGoty(categoriaId, posicion);
            } catch (error) {
                console.error("Error eliminando premio:", error);
                alert(error.message || "No se ha podido quitar el premio.");
                quitar.disabled = false;
            }
        });

        selector.appendChild(quitar);
    }

    const encabezado = document.createElement("div");
    encabezado.className = "goty-selector-encabezado";

    const titulo = document.createElement("strong");
    titulo.textContent = `SELECCIONAR JUEGO · TOP ${posicion}`;

    const cerrar = document.createElement("button");
    cerrar.type = "button";
    cerrar.className = "goty-selector-cerrar";
    cerrar.textContent = "✕";
    cerrar.setAttribute("aria-label", "Cerrar selector");
    cerrar.addEventListener("click", () => selector.remove());

    encabezado.append(titulo, cerrar);
    selector.appendChild(encabezado);

    const lista = document.createElement("div");
    lista.className = "goty-selector-lista";

    ordenarJuegosGoty(categoriaId).forEach(juego => {
        const notaCategoria = obtenerNotaCategoriaGoty(juego, categoriaId);
        const notaGeneral = obtenerNumeroGoty(juego.nota_final);

        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "goty-opcion-juego";
        boton.title = juego.titulo;

        const portada = document.createElement("div");
        portada.className = "goty-opcion-portada";

        if (juego.portada_url) {
            portada.appendChild(crearImagenGoty(juego));
        }

        const notas = document.createElement("div");
        notas.className = "goty-opcion-notas";

        if (notaCategoria !== null) {
            const categoria = document.createElement("span");
            categoria.className = "goty-nota-categoria";
            categoria.textContent = `CAT. ${formatearNotaGoty(notaCategoria)}`;
            notas.appendChild(categoria);
        }

        const general = document.createElement("span");
        general.className = "goty-nota-general";
        general.textContent = `GLOBAL ${formatearNotaGoty(notaGeneral)}`;

        notas.appendChild(general);
        portada.appendChild(notas);

        const nombre = document.createElement("span");
        nombre.className = "goty-opcion-nombre";
        nombre.textContent = juego.titulo;

        boton.append(portada, nombre);

        boton.addEventListener("click", async () => {
            if (!seleccionesGoty[categoriaId]) {
                seleccionesGoty[categoriaId] = {};
            }

            const existente = Object.entries(seleccionesGoty[categoriaId])
                .find(([otroPuesto, id]) =>
                    Number(otroPuesto) !== posicion &&
                    String(id) === String(juego.id)
                );

            const posicionOrigen = existente ? Number(existente[0]) : null;

            boton.disabled = true;

            try {
                if (posicionOrigen !== null) {
                    await intercambiarPuestosGoty(
                        categoriaId,
                        posicion,
                        posicionOrigen
                    );
                } else {
                    await guardarPremioGoty(
                        categoriaId,
                        posicion,
                        juego.id,
                        "manual"
                    );
                }

                await cargarPremiosGuardadosGoty();

                if (selector.isConnected) selector.remove();
            } catch (error) {
                console.error("Error guardando premio GOTY:", error);

                alert(
                    "ERROR AL GUARDAR:\n\n" +
                    "Código: " + (error?.code || "Sin código") + "\n" +
                    "Mensaje: " + (error?.message || String(error))
                );

                boton.disabled = false;
            }
        });

        lista.appendChild(boton);
    });

    if (juegosGoty.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "No hay videojuegos terminados en este año.";
        lista.appendChild(mensaje);
    }

    selector.appendChild(lista);
    tarjeta.appendChild(selector);
}


// ==========================================
// CREAR CATEGORÍAS
// ==========================================

function crearCategoriasGoty() {
    const contenedor = document.getElementById("goty-categorias");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (grupoGotyActivo === "rankings") return;

    const categorias = categoriasGoty.filter(
        categoria => categoria.grupo === grupoGotyActivo
    );

    categorias.forEach((categoria, indice) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "goty-tarjeta";
        tarjeta.dataset.categoria = categoria.id;

        tarjeta.innerHTML = `
            <div class="goty-tarjeta-cabecera">
                <div class="goty-tarjeta-titulo">
                    <span class="goty-icono-categoria">${categoria.icono}</span>
                    <h3>${categoria.nombre}</h3>
                </div>
                <span class="goty-numero-categoria">
                    ${String(indice + 1).padStart(2, "0")}
                </span>
            </div>
            <div class="goty-podio"></div>
        `;

        const podio = tarjeta.querySelector(".goty-podio");

        [1, 2, 3].forEach(posicion => {
            const puesto = crearPuestoGoty(posicion);

            puesto.classList.add("goty-puesto-clicable");
            puesto.setAttribute("role", "button");
            puesto.setAttribute("tabindex", "0");

            const abrir = () => abrirSelectorGoty(tarjeta, categoria.id, posicion);

            puesto.addEventListener("click", abrir);

            puesto.addEventListener("keydown", evento => {
                if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    abrir();
                }
            });

            podio.appendChild(puesto);

            const juegoId = seleccionesGoty[categoria.id]?.[posicion];
            const juego = buscarJuegoGoty(juegoId);

            if (juego) actualizarPuestoGoty(puesto, juego);
        });

        contenedor.appendChild(tarjeta);
    });
}


// ==========================================
// AUTORRELLENAR PREMIOS
// ==========================================

async function autorrellenarPremiosGoty() {
    const boton = document.getElementById("goty-autorrellenar");

    if (!boton || boton.disabled) return;

    const confirmar = confirm(
        "¿Quieres autorrellenar los premios según las notas?\n\n" +
        "Se respetarán tus elecciones manuales y se actualizarán los puestos automáticos."
    );

    if (!confirmar) return;

    boton.disabled = true;
    boton.textContent = "AUTORRELLENANDO...";

    try {
        const usuario = obtenerUsuarioGoty();

        const { data, error } = await supabaseClient
            .from("goty_premios")
            .select("categoria, posicion, juego_id, origen")
            .eq("usuario_id", usuario.id)
            .eq("anio", anioGoty);

        if (error) throw error;

        const premios = data || [];
        const cambios = [];

        for (const categoriaId of categoriasAutomaticasGoty) {
            const ordenados = ordenarJuegosGoty(categoriaId);

            const manuales = premios.filter(
                premio =>
                    premio.categoria === categoriaId &&
                    premio.origen === "manual"
            );

            const usados = new Set(
                manuales.map(premio => String(premio.juego_id))
            );

            const puestosManuales = new Set(
                manuales.map(premio => Number(premio.posicion))
            );

            let indice = 0;

            for (let posicion = 1; posicion <= 3; posicion++) {
                if (puestosManuales.has(posicion)) continue;

                let elegido = null;

                while (indice < ordenados.length) {
                    const candidato = ordenados[indice++];

                    if (!usados.has(String(candidato.id))) {
                        elegido = candidato;
                        break;
                    }
                }

                if (!elegido) continue;

                usados.add(String(elegido.id));

                cambios.push({
                    categoria: categoriaId,
                    posicion,
                    juego_id: elegido.id
                });
            }
        }

        const { error: errorGuardar } = await supabaseClient.rpc(
            "guardar_autorrellenado_goty",
            {
                p_anio: anioGoty,
                p_premios: cambios
            }
        );

        if (errorGuardar) throw errorGuardar;

        await cargarPremiosGuardadosGoty();

        alert("¡Premios autorrellenados correctamente!");
    } catch (error) {
        console.error("Error autorrellenando GOTY:", error);

        alert(
            "No se han podido autorrellenar los premios.\n\n" +
            (error?.message || String(error))
        );

        try {
            await cargarPremiosGuardadosGoty();
        } catch (recuperacionError) {
            console.error("Error recuperando premios:", recuperacionError);
        }
    } finally {
        boton.disabled = false;
        boton.textContent = "AUTORRELLENAR PREMIOS";
    }
}


// ==========================================
// RANKINGS - CARGAR Y GUARDAR
// ==========================================

async function cargarRankingsGoty() {
    const usuario = obtenerUsuarioGoty();

    const { data, error } = await supabaseClient
        .from("goty_rankings")
        .select("tipo, orden_ids")
        .eq("usuario_id", usuario.id)
        .eq("anio", anioGoty);

    if (error) throw error;

    ordenNotasGoty = [];
    topPersonalGoty = Array(10).fill(null);

    (data || []).forEach(registro => {
        if (!Array.isArray(registro.orden_ids)) return;

        if (registro.tipo === "notas") {
            ordenNotasGoty = registro.orden_ids;
        }

        if (registro.tipo === "personal") {
            const idsValidos = new Set(juegosGoty.map(juego => String(juego.id)));
            const usados = new Set();

            registro.orden_ids.slice(0, 10).forEach((id, indice) => {
                if (id === null || id === undefined) return;

                const clave = String(id);

                if (!idsValidos.has(clave) || usados.has(clave)) return;

                usados.add(clave);
                topPersonalGoty[indice] = id;
            });
        }
    });

    rankingsCargadosGoty = true;
    dibujarRankingsGoty();
}

async function guardarRankingGoty(tipo, ids) {
    const usuario = obtenerUsuarioGoty();

    const { error } = await supabaseClient
        .from("goty_rankings")
        .upsert({
            usuario_id: usuario.id,
            anio: anioGoty,
            tipo,
            orden_ids: ids,
            actualizado_en: new Date().toISOString()
        }, {
            onConflict: "usuario_id,anio,tipo"
        });

    if (error) throw error;
}


// ==========================================
// RANKING POR NOTA
// ==========================================

function obtenerRankingNotasGoty() {
    const juegos = [...juegosGoty].sort((a, b) => {
        const diferencia = compararNotasGoty(a.nota_final, b.nota_final);

        if (diferencia !== 0) return diferencia;

        return (a.titulo || "").localeCompare(b.titulo || "", "es");
    });

    // El orden guardado solo afecta a juegos con la misma nota.
    // Nunca puede colocar un juego de menor nota por encima
    // de otro con mayor nota.

    const posicionesGuardadas = new Map(
        ordenNotasGoty.map((id, indice) => [String(id), indice])
    );

    let inicio = 0;

    while (inicio < juegos.length) {
        let fin = inicio + 1;

        const nota = obtenerNumeroGoty(juegos[inicio].nota_final);

        while (
            fin < juegos.length &&
            obtenerNumeroGoty(juegos[fin].nota_final) === nota
        ) {
            fin++;
        }

        const grupo = juegos.slice(inicio, fin);

        grupo.sort((a, b) => {
            const posicionA = posicionesGuardadas.get(String(a.id));
            const posicionB = posicionesGuardadas.get(String(b.id));

            if (posicionA !== undefined && posicionB !== undefined) {
                return posicionA - posicionB;
            }

            if (posicionA !== undefined) return -1;
            if (posicionB !== undefined) return 1;

            return (a.titulo || "").localeCompare(b.titulo || "", "es");
        });

        juegos.splice(inicio, grupo.length, ...grupo);
        inicio = fin;
    }

    return juegos;
}

async function moverJuegoEmpatadoGoty(indice, direccion) {
    if (rankingGuardandoGoty) return;

    const juegos = obtenerRankingNotasGoty();
    const destino = indice + direccion;

    if (destino < 0 || destino >= juegos.length) return;

    const notaActual = obtenerNumeroGoty(juegos[indice].nota_final);
    const notaDestino = obtenerNumeroGoty(juegos[destino].nota_final);

    if (notaActual === null || notaActual !== notaDestino) return;

    [juegos[indice], juegos[destino]] = [
        juegos[destino],
        juegos[indice]
    ];

    const nuevoOrden = juegos.map(juego => juego.id);

    rankingGuardandoGoty = true;

    try {
        await guardarRankingGoty("notas", nuevoOrden);
        ordenNotasGoty = nuevoOrden;
        dibujarRankingsGoty();
    } catch (error) {
        console.error("Error ordenando empate GOTY:", error);
        alert("No se ha podido guardar el orden.\n\n" + error.message);
    } finally {
        rankingGuardandoGoty = false;
    }
}


// ==========================================
// TOP 10 PERSONAL
// ==========================================

async function asignarTopPersonalGoty(posicion, juegoId) {
    if (rankingGuardandoGoty) return;

    const nuevoTop = [...topPersonalGoty];
    const indice = posicion - 1;

    if (indice < 0 || indice >= 10) return;

    if (juegoId !== null && !buscarJuegoGoty(juegoId)) return;

    if (juegoId === null) {
        nuevoTop[indice] = null;
    } else {
        const origen = nuevoTop.findIndex(
            id => id !== null && String(id) === String(juegoId)
        );

        if (origen !== -1 && origen !== indice) {
            // Si ya está en el TOP 10, intercambiar puestos.
            [nuevoTop[origen], nuevoTop[indice]] = [
                nuevoTop[indice],
                nuevoTop[origen]
            ];
        } else {
            nuevoTop[indice] = juegoId;
        }
    }

    rankingGuardandoGoty = true;

    try {
        await guardarRankingGoty("personal", nuevoTop);
        topPersonalGoty = nuevoTop;
        dibujarRankingsGoty();
    } catch (error) {
        console.error("Error guardando TOP 10:", error);
        alert("No se ha podido guardar el TOP 10.\n\n" + error.message);
    } finally {
        rankingGuardandoGoty = false;
    }
}

async function moverTopPersonalGoty(indice, direccion) {
    if (rankingGuardandoGoty) return;

    const destino = indice + direccion;

    if (destino < 0 || destino >= 10) return;

    const nuevoTop = [...topPersonalGoty];

    [nuevoTop[indice], nuevoTop[destino]] = [
        nuevoTop[destino],
        nuevoTop[indice]
    ];

    rankingGuardandoGoty = true;

    try {
        await guardarRankingGoty("personal", nuevoTop);
        topPersonalGoty = nuevoTop;
        dibujarRankingsGoty();
    } catch (error) {
        console.error("Error moviendo TOP 10:", error);
        alert("No se ha podido cambiar el puesto.\n\n" + error.message);
    } finally {
        rankingGuardandoGoty = false;
    }
}


// ==========================================
// ELEMENTOS VISUALES DE LOS RANKINGS
// ==========================================

function crearFilaRankingGoty(posicion, juego, tipo) {
    const fila = document.createElement("div");
    fila.className = `goty-ranking-fila goty-ranking-fila-${posicion}`;

    const numero = document.createElement("span");
    numero.className = "goty-ranking-posicion";
    numero.textContent = String(posicion).padStart(2, "0");

    const portada = document.createElement("div");
    portada.className = "goty-ranking-portada";

    if (juego) {
        if (juego.portada_url) {
            portada.appendChild(crearImagenGoty(juego));
        }
    } else {
        portada.textContent = "+";
        portada.classList.add("goty-ranking-portada-vacia");
    }

    const informacion = document.createElement("div");
    informacion.className = "goty-ranking-informacion";

    const titulo = document.createElement("strong");
    titulo.className = "goty-ranking-nombre";
    titulo.textContent = juego ? juego.titulo : "Seleccionar videojuego";

    informacion.appendChild(titulo);

    const nota = document.createElement("span");
    nota.className = "goty-ranking-nota";
    nota.textContent = juego
        ? formatearNotaGoty(juego.nota_final)
        : "—";

    const acciones = document.createElement("div");
    acciones.className = "goty-ranking-acciones";

    fila.append(numero, portada, informacion, nota, acciones);

    if (tipo === "personal") {
        const elegir = document.createElement("button");
        elegir.type = "button";
        elegir.className = "goty-ranking-boton goty-ranking-elegir";
        elegir.textContent = juego ? "CAMBIAR" : "ELEGIR";
        elegir.addEventListener("click", () => abrirSelectorTopPersonalGoty(posicion));

        acciones.appendChild(elegir);
    }

    return { fila, acciones };
}

function crearBotonMovimientoGoty(simbolo, titulo, deshabilitado, accion) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "goty-ranking-boton goty-ranking-mover";
    boton.textContent = simbolo;
    boton.title = titulo;
    boton.setAttribute("aria-label", titulo);
    boton.disabled = deshabilitado;
    boton.addEventListener("click", accion);

    return boton;
}


// ==========================================
// DIBUJAR RANKING POR NOTA
// ==========================================

function dibujarRankingNotasGoty() {
    const contenedor = document.getElementById("goty-ranking-notas");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    const juegos = obtenerRankingNotasGoty();

    if (!juegos.length) {
        const mensaje = document.createElement("p");
        mensaje.className = "goty-ranking-vacio";
        mensaje.textContent = "Todavía no hay videojuegos terminados este año.";
        contenedor.appendChild(mensaje);
        return;
    }

    juegos.forEach((juego, indice) => {
        const { fila, acciones } = crearFilaRankingGoty(
            indice + 1,
            juego,
            "notas"
        );

        const nota = obtenerNumeroGoty(juego.nota_final);

        const anterior = indice > 0
            ? obtenerNumeroGoty(juegos[indice - 1].nota_final)
            : null;

        const siguiente = indice < juegos.length - 1
            ? obtenerNumeroGoty(juegos[indice + 1].nota_final)
            : null;

        const puedeSubir = nota !== null && nota === anterior;
        const puedeBajar = nota !== null && nota === siguiente;

        if (puedeSubir || puedeBajar) {
            acciones.appendChild(
                crearBotonMovimientoGoty(
                    "↑",
                    "Subir entre juegos empatados",
                    !puedeSubir,
                    () => moverJuegoEmpatadoGoty(indice, -1)
                )
            );

            acciones.appendChild(
                crearBotonMovimientoGoty(
                    "↓",
                    "Bajar entre juegos empatados",
                    !puedeBajar,
                    () => moverJuegoEmpatadoGoty(indice, 1)
                )
            );
        } else {
            const candado = document.createElement("span");
            candado.className = "goty-ranking-bloqueado";
            candado.textContent = "🔒";
            candado.title = "Su posición depende de su nota";
            acciones.appendChild(candado);
        }

        contenedor.appendChild(fila);
    });
}


// ==========================================
// DIBUJAR TOP 10 PERSONAL
// ==========================================

function dibujarTopPersonalGoty() {
    const contenedor = document.getElementById("goty-ranking-personal");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    for (let indice = 0; indice < 10; indice++) {
        const juegoId = topPersonalGoty[indice];
        const juego = juegoId === null ? null : buscarJuegoGoty(juegoId);

        const { fila, acciones } = crearFilaRankingGoty(
            indice + 1,
            juego,
            "personal"
        );

        acciones.appendChild(
            crearBotonMovimientoGoty(
                "↑",
                "Subir en mi TOP 10",
                indice === 0,
                () => moverTopPersonalGoty(indice, -1)
            )
        );

        acciones.appendChild(
            crearBotonMovimientoGoty(
                "↓",
                "Bajar en mi TOP 10",
                indice === 9,
                () => moverTopPersonalGoty(indice, 1)
            )
        );

        if (juego) {
            const quitar = document.createElement("button");
            quitar.type = "button";
            quitar.className = "goty-ranking-boton goty-ranking-quitar";
            quitar.textContent = "✕";
            quitar.title = "Quitar del TOP 10";

            quitar.addEventListener("click", () => {
                asignarTopPersonalGoty(indice + 1, null);
            });

            acciones.appendChild(quitar);
        }

        contenedor.appendChild(fila);
    }
}

function dibujarRankingsGoty() {
    if (!rankingsCargadosGoty) return;

    dibujarRankingNotasGoty();
    dibujarTopPersonalGoty();
}


// ==========================================
// SELECTOR DEL TOP 10 PERSONAL
// ==========================================

function abrirSelectorTopPersonalGoty(posicion) {
    document.querySelectorAll(".goty-ranking-selector").forEach(
        elemento => elemento.remove()
    );

    const contenedor = document.getElementById("goty-ranking-personal");
    if (!contenedor) return;

    const selector = document.createElement("div");
    selector.className = "goty-ranking-selector";

    const encabezado = document.createElement("div");
    encabezado.className = "goty-ranking-selector-encabezado";

    const titulo = document.createElement("strong");
    titulo.textContent = `ELEGIR VIDEOJUEGO · TOP ${posicion}`;

    const cerrar = document.createElement("button");
    cerrar.type = "button";
    cerrar.textContent = "✕";
    cerrar.className = "goty-ranking-boton";

    cerrar.addEventListener("click", () => selector.remove());

    encabezado.append(titulo, cerrar);
    selector.appendChild(encabezado);

    const buscador = document.createElement("input");
    buscador.type = "search";
    buscador.className = "goty-ranking-buscador";
    buscador.placeholder = "Buscar videojuego...";
    buscador.setAttribute("aria-label", "Buscar videojuego");

    selector.appendChild(buscador);

    const lista = document.createElement("div");
    lista.className = "goty-ranking-selector-lista";

    selector.appendChild(lista);

    function mostrarOpciones(filtro = "") {
        lista.innerHTML = "";

        const juegos = [...juegosGoty]
            .filter(juego =>
                (juego.titulo || "")
                    .toLocaleLowerCase("es")
                    .includes(filtro.toLocaleLowerCase("es"))
            )
            .sort((a, b) =>
                (a.titulo || "").localeCompare(b.titulo || "", "es")
            );

        juegos.forEach(juego => {
            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = "goty-ranking-opcion";
            boton.title = juego.titulo;

            if (juego.portada_url) {
                boton.appendChild(crearImagenGoty(juego));
            }

            const nombre = document.createElement("span");
            nombre.textContent = juego.titulo;

            const nota = document.createElement("strong");
            nota.textContent = formatearNotaGoty(juego.nota_final);

            boton.append(nombre, nota);

            boton.addEventListener("click", async () => {
                boton.disabled = true;

                await asignarTopPersonalGoty(posicion, juego.id);

                // Al redibujar se elimina el selector.
                if (selector.isConnected) selector.remove();
            });

            lista.appendChild(boton);
        });

        if (!juegos.length) {
            const mensaje = document.createElement("p");
            mensaje.textContent = "No se encontraron videojuegos.";
            lista.appendChild(mensaje);
        }
    }

    buscador.addEventListener("input", () => {
        mostrarOpciones(buscador.value.trim());
    });

    mostrarOpciones();

    contenedor.prepend(selector);
}


// ==========================================
// PESTAÑAS
// ==========================================

function activarPestanaGoty(grupo) {
    grupoGotyActivo = grupo;

    document.querySelectorAll(".goty-pestana").forEach(boton => {
        const activa = boton.dataset.grupo === grupo;

        boton.classList.toggle("activa", activa);
        boton.setAttribute("aria-selected", String(activa));
    });

    const categorias = document.getElementById("goty-categorias");
    const rankings = document.getElementById("goty-rankings");
    const autorrellenar = document.getElementById("goty-autorrellenar");

    const titulo = document.getElementById("goty-controles-titulo");
    const etiqueta = document.getElementById("goty-controles-etiqueta");

    const esRanking = grupo === "rankings";

    if (categorias) categorias.hidden = esRanking;
    if (rankings) rankings.hidden = !esRanking;
    if (autorrellenar) autorrellenar.hidden = esRanking;

    if (titulo) {
        titulo.textContent = esRanking ? "Los rankings" : "Los premios";
    }

    if (etiqueta) {
        etiqueta.textContent = esRanking
            ? "MIS CLASIFICACIONES ANUALES"
            : "MI SELECCIÓN ANUAL";
    }

    if (esRanking) {
        dibujarRankingsGoty();
    } else {
        crearCategoriasGoty();
    }
}

function configurarPestanasGoty() {
    document.querySelectorAll(".goty-pestana").forEach(boton => {
        boton.addEventListener("click", () => {
            activarPestanaGoty(boton.dataset.grupo);
        });
    });

    activarPestanaGoty("personal");
}


// ==========================================
// INICIALIZACIÓN
// ==========================================

async function iniciarGoty() {
    configurarPestanasGoty();

    const botonAutorrellenar = document.getElementById("goty-autorrellenar");

    if (botonAutorrellenar) {
        botonAutorrellenar.disabled = true;
        botonAutorrellenar.addEventListener("click", autorrellenarPremiosGoty);
    }

    const { data: { user }, error } = await supabaseClient.auth.getUser();

    if (error) throw error;
    if (!user) throw new Error("Debes iniciar sesión.");

    usuarioGoty = user;

    await cargarJuegosGoty();
    await cargarPremiosGuardadosGoty();
    await cargarRankingsGoty();

    if (botonAutorrellenar) {
        botonAutorrellenar.disabled = false;
    }

    activarPestanaGoty(grupoGotyActivo);

    console.log("Checkpoint GOTY inicializado correctamente.");
}

if (anioGotyValido) {
    iniciarGoty().catch(error => {
        console.error("Error inicializando Checkpoint GOTY:", error);

        alert(
            "No se ha podido cargar Checkpoint GOTY.\n\n" +
            (error?.message || String(error))
        );
    });
}
