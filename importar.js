// ==========================================
// CHECKPOINT SELECT
// RECUPERAR IMÁGENES ANTIGUAS
// ==========================================

const inputJuegos =
    document.getElementById("backupJuegos");

const inputImagenes =
    document.getElementById("backupImagenes");

const botonImportar =
    document.getElementById("importarImagenes");

const estado =
    document.getElementById("estado");


// ==========================================
// CONVERTIR DATA URL EN BLOB
// ==========================================

function dataURLaBlob(dataURL) {

    const partes =
        dataURL.split(",");

    if (partes.length !== 2) {
        throw new Error(
            "Una de las imágenes del backup no tiene un formato válido."
        );
    }

    const cabecera = partes[0];
    const datos = partes[1];

    const coincidencia =
        cabecera.match(/data:(.*?);base64/);

    if (!coincidencia) {
        throw new Error(
            "No se ha podido reconocer el tipo de una imagen."
        );
    }

    const mimeType =
        coincidencia[1];

    const binario =
        atob(datos);

    const bytes =
        new Uint8Array(binario.length);

    for (
        let i = 0;
        i < binario.length;
        i++
    ) {

        bytes[i] =
            binario.charCodeAt(i);

    }

    return new Blob(
        [bytes],
        {
            type: mimeType
        }
    );

}


// ==========================================
// OBTENER EXTENSIÓN
// ==========================================

function obtenerExtension(blob) {

    switch (blob.type) {

        case "image/png":
            return "png";

        case "image/jpeg":
            return "jpg";

        case "image/webp":
            return "webp";

        default:
            return "jpg";

    }

}


// ==========================================
// BUSCAR JUEGO ANTIGUO POR ID
// ==========================================

function buscarJuegoAntiguo(
    juegos,
    idAntiguo
) {

    return juegos.find(
        juego =>
            String(juego.id) ===
            String(idAntiguo)
    );

}


// ==========================================
// EXTRAER INFORMACIÓN DE LA CLAVE
// ==========================================

function analizarClaveImagen(clave) {

    /*
        Ejemplo:

        juego-1790516952142-portada

        Resultado:

        {
            idAntiguo: "1790516952142",
            tipo: "portada"
        }
    */

    const coincidencia =
        String(clave).match(
            /^juego-(.+)-(portada|fondo)$/
        );

    if (!coincidencia) {
        return null;
    }

    return {

        idAntiguo:
            coincidencia[1],

        tipo:
            coincidencia[2]

    };

}


// ==========================================
// SUBIR IMAGEN
// ==========================================

async function subirImagen(
    user,
    juegoSupabase,
    tipo,
    dataURL
) {

    const blob =
        dataURLaBlob(dataURL);

    const extension =
        obtenerExtension(blob);


    /*
        Las políticas que hemos creado
        esperan que la primera carpeta
        sea el UUID del usuario.

        Ejemplo:

        UUID/1/portada.png
    */

    const ruta =
        `${user.id}/${juegoSupabase.id}/${tipo}.${extension}`;


    const {
        error: uploadError
    } =
        await supabaseClient
            .storage
            .from("imagenes-juegos")
            .upload(
                ruta,
                blob,
                {
                    contentType:
                        blob.type,

                    upsert:
                        true
                }
            );


    if (uploadError) {

        throw new Error(
            `No se pudo subir ${tipo} de "${juegoSupabase.titulo}": ${uploadError.message}`
        );

    }


    // ======================================
    // OBTENER URL PÚBLICA
    // ======================================

    const {
        data
    } =
        supabaseClient
            .storage
            .from("imagenes-juegos")
            .getPublicUrl(ruta);


    if (
        !data ||
        !data.publicUrl
    ) {

        throw new Error(
            `No se pudo obtener la URL de ${tipo} de "${juegoSupabase.titulo}".`
        );

    }


    return data.publicUrl;

}


// ==========================================
// IMPORTAR
// ==========================================

botonImportar.addEventListener(
    "click",
    async () => {

        const archivoJuegos =
            inputJuegos.files[0];

        const archivoImagenes =
            inputImagenes.files[0];


        // ==================================
        // COMPROBACIONES
        // ==================================

        if (!archivoJuegos) {

            estado.textContent =
                "Selecciona el backup antiguo de juegos.";

            return;

        }


        if (!archivoImagenes) {

            estado.textContent =
                "Selecciona el backup antiguo de imágenes.";

            return;

        }


        botonImportar.disabled =
            true;


        try {

            // ==================================
            // 1. COMPROBAR SESIÓN
            // ==================================

            estado.textContent =
                "Comprobando sesión...";


            const {
                data: {
                    user
                },
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
                    "No hay ningún usuario conectado. Inicia sesión primero."
                );

            }


            // ==================================
            // 2. LEER BACKUP DE JUEGOS
            // ==================================

            estado.textContent =
                "Leyendo backup de juegos...";


            const textoJuegos =
                await archivoJuegos.text();


            const juegosAntiguos =
                JSON.parse(
                    textoJuegos
                );


            if (
                !Array.isArray(
                    juegosAntiguos
                )
            ) {

                throw new Error(
                    "El backup de juegos no tiene el formato esperado."
                );

            }


            // ==================================
            // 3. LEER BACKUP DE IMÁGENES
            // ==================================

            estado.textContent =
                "Leyendo backup de imágenes...";


            const textoImagenes =
                await archivoImagenes.text();


            const imagenes =
                JSON.parse(
                    textoImagenes
                );


            if (
                !imagenes ||
                typeof imagenes !== "object" ||
                Array.isArray(imagenes)
            ) {

                throw new Error(
                    "El backup de imágenes no tiene el formato esperado."
                );

            }


            const clavesImagenes =
                Object.keys(imagenes);


            if (
                clavesImagenes.length === 0
            ) {

                throw new Error(
                    "El backup de imágenes está vacío."
                );

            }


            // ==================================
            // 4. OBTENER JUEGOS DE SUPABASE
            // ==================================

            estado.textContent =
                "Buscando tus juegos en Supabase...";


            const {
                data: juegosSupabase,
                error: juegosError
            } =
                await supabaseClient
                    .from("juegos")
                    .select(
                        "id, titulo, portada_url, fondo_url"
                    )
                    .eq(
                        "usuario_id",
                        user.id
                    );


            if (juegosError) {

                throw new Error(
                    "No se pudieron obtener los juegos de Supabase: " +
                    juegosError.message
                );

            }


            // ==================================
            // CONTADORES
            // ==================================

            let subidas = 0;
            let ignoradas = 0;


            // ==================================
            // 5. RECORRER IMÁGENES
            // ==================================

            for (
                let i = 0;
                i < clavesImagenes.length;
                i++
            ) {

                const clave =
                    clavesImagenes[i];


                estado.textContent =
                    `Procesando imagen ${i + 1} de ${clavesImagenes.length}...\n${clave}`;


                // ------------------------------
                // Analizar clave
                // ------------------------------

                const info =
                    analizarClaveImagen(
                        clave
                    );


                if (!info) {

                    console.warn(
                        "Clave ignorada:",
                        clave
                    );

                    ignoradas++;

                    continue;

                }


                // ------------------------------
                // Buscar juego antiguo
                // ------------------------------

                const juegoAntiguo =
                    buscarJuegoAntiguo(
                        juegosAntiguos,
                        info.idAntiguo
                    );


                if (!juegoAntiguo) {

                    console.warn(
                        "No se encontró el juego antiguo para:",
                        clave
                    );

                    ignoradas++;

                    continue;

                }


                // ------------------------------
                // Buscar el mismo juego
                // actualmente en Supabase
                // ------------------------------

                const juegoSupabase =
                    juegosSupabase.find(
                        juego =>
                            juego.titulo
                                ?.trim()
                                .toLowerCase()
                            ===
                            juegoAntiguo.titulo
                                ?.trim()
                                .toLowerCase()
                    );


                if (!juegoSupabase) {

                    console.warn(
                        "No se encontró en Supabase:",
                        juegoAntiguo.titulo
                    );

                    ignoradas++;

                    continue;

                }


                // ------------------------------
                // Subir imagen
                // ------------------------------

                const url =
                    await subirImagen(
                        user,
                        juegoSupabase,
                        info.tipo,
                        imagenes[clave]
                    );


                // ------------------------------
                // Elegir columna
                // ------------------------------

                const columna =
                    info.tipo === "portada"
                        ? "portada_url"
                        : "fondo_url";


                // ------------------------------
                // Guardar URL en el juego
                // ------------------------------

                const {
                    error: updateError
                } =
                    await supabaseClient
                        .from("juegos")
                        .update({
                            [columna]:
                                url
                        })
                        .eq(
                            "id",
                            juegoSupabase.id
                        )
                        .eq(
                            "usuario_id",
                            user.id
                        );


                if (updateError) {

                    throw new Error(
                        `La imagen de "${juegoSupabase.titulo}" se subió, pero no se pudo guardar ${columna}: ${updateError.message}`
                    );

                }


                subidas++;

            }


            // ==================================
            // 6. TERMINADO
            // ==================================

            estado.textContent =
                `¡IMPORTACIÓN TERMINADA!

Imágenes subidas: ${subidas}
Imágenes ignoradas: ${ignoradas}

Ya puedes comprobar Storage y tu biblioteca.`;

        }

        catch (error) {

            console.error(
                "Error importando imágenes:",
                error
            );


            estado.textContent =
                "ERROR:\n" +
                error.message;

        }

        finally {

            botonImportar.disabled =
                false;

        }

    }
);