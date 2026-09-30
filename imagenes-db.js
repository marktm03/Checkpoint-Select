// ==========================================
// CHECKPOINT SELECT
// BASE DE DATOS DE IMÁGENES
// ==========================================

const CHECKPOINT_DB_NOMBRE = "checkpoint-select-db";
const CHECKPOINT_DB_VERSION = 1;
const CHECKPOINT_DB_ALMACEN = "imagenes";


// ==========================================
// ABRIR BASE DE DATOS
// ==========================================

function abrirCheckpointDB() {

    return new Promise((resolve, reject) => {

        const peticion = indexedDB.open(
            CHECKPOINT_DB_NOMBRE,
            CHECKPOINT_DB_VERSION
        );


        peticion.onupgradeneeded = function (evento) {

            const db = evento.target.result;

            if (
                !db.objectStoreNames.contains(
                    CHECKPOINT_DB_ALMACEN
                )
            ) {

                db.createObjectStore(
                    CHECKPOINT_DB_ALMACEN
                );

            }

        };


        peticion.onsuccess = function () {

            resolve(
                peticion.result
            );

        };


        peticion.onerror = function () {

            reject(
                peticion.error
            );

        };

    });

}


// ==========================================
// GUARDAR IMAGEN
// ==========================================

async function guardarImagenCheckpoint(
    clave,
    imagen
) {

    if (!clave || !imagen) {
        return;
    }


    const db =
        await abrirCheckpointDB();


    return new Promise((resolve, reject) => {

        const transaccion =
            db.transaction(
                CHECKPOINT_DB_ALMACEN,
                "readwrite"
            );


        const almacen =
            transaccion.objectStore(
                CHECKPOINT_DB_ALMACEN
            );


        const peticion =
            almacen.put(
                imagen,
                clave
            );


        peticion.onsuccess = function () {

            resolve();

        };


        peticion.onerror = function () {

            reject(
                peticion.error
            );

        };


        transaccion.oncomplete = function () {

            db.close();

        };

    });

}


// ==========================================
// OBTENER IMAGEN
// ==========================================

async function obtenerImagenCheckpoint(
    clave
) {

    if (!clave) {
        return null;
    }


    const db =
        await abrirCheckpointDB();


    return new Promise((resolve, reject) => {

        const transaccion =
            db.transaction(
                CHECKPOINT_DB_ALMACEN,
                "readonly"
            );


        const almacen =
            transaccion.objectStore(
                CHECKPOINT_DB_ALMACEN
            );


        const peticion =
            almacen.get(
                clave
            );


        peticion.onsuccess = function () {

            resolve(
                peticion.result || null
            );

        };


        peticion.onerror = function () {

            reject(
                peticion.error
            );

        };


        transaccion.oncomplete = function () {

            db.close();

        };

    });

}


// ==========================================
// ELIMINAR IMAGEN
// ==========================================

async function eliminarImagenCheckpoint(
    clave
) {

    if (!clave) {
        return;
    }


    const db =
        await abrirCheckpointDB();


    return new Promise((resolve, reject) => {

        const transaccion =
            db.transaction(
                CHECKPOINT_DB_ALMACEN,
                "readwrite"
            );


        const almacen =
            transaccion.objectStore(
                CHECKPOINT_DB_ALMACEN
            );


        const peticion =
            almacen.delete(
                clave
            );


        peticion.onsuccess = function () {

            resolve();

        };


        peticion.onerror = function () {

            reject(
                peticion.error
            );

        };


        transaccion.oncomplete = function () {

            db.close();

        };

    });

}


// ==========================================
// CLAVES DE CADA JUEGO
// ==========================================

function clavePortadaJuego(idJuego) {

    return `juego-${idJuego}-portada`;

}


function claveFondoJuego(idJuego) {

    return `juego-${idJuego}-fondo`;

}