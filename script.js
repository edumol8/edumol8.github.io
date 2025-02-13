const apiArtistas = "https://noted-phalanx-419223.rj.r.appspot.com/api/artistas";
const apiAlbumes = "https://noted-phalanx-419223.rj.r.appspot.com/api/albumes";
const apiCanciones = "https://noted-phalanx-419223.rj.r.appspot.com/api/canciones";

// Mostrar sección correspondiente y cargar datos
function showSection(section) {
    document.getElementById("artistas-section").classList.add("hidden");
    document.getElementById("albumes-section").classList.add("hidden");
    document.getElementById("canciones-section").classList.add("hidden");

    if (section === "artistas") {
        document.getElementById("artistas-section").classList.remove("hidden");
        loadArtists();
    } else if (section === "albumes") {
        document.getElementById("albumes-section").classList.remove("hidden");
        loadAlbums();
    } else if (section === "canciones") {
        document.getElementById("canciones-section").classList.remove("hidden");
        loadSongs();
    }
}

// Cargar artistas en la tabla
function loadArtists() {
    fetch(apiArtistas)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("#tabla-artistas tbody");
            tbody.innerHTML = "";

            data.forEach(artista => {
                const row = `<tr>
                    <td>${artista.id}</td> 
                    <td>${artista.nombre}</td>
                    <td>${artista.genero}</td>
                    <td>${artista.pais}</td>
                    <td>${artista.fechaNacimiento}</td>
                    <td>
                        <button onclick="openEditModal('artista', ${artista.id}, '${artista.nombre}', '${artista.genero}', '${artista.pais}', '${artista.fechaNacimiento}')">Editar</button>
                    </td>
                </tr>`;
                tbody.innerHTML += row;
            });
        })
        .catch(error => console.error("Error al cargar los artistas:", error));
}

// Cargar álbumes en la tabla
function loadAlbums() {
    fetch(apiAlbumes)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("#tabla-albumes tbody");
            tbody.innerHTML = "";

            data.forEach(album => {
                const row = `<tr>
                    <td>${album.id}</td>
                    <td>${album.titulo}</td>
                    <td>${album.fechaLanzamiento}</td>
                    <td>${album.artista.nombre}</td>
                    <td>
                        <button onclick="openEditModal('album', ${album.id}, '${album.titulo}', '${album.fechaLanzamiento}', ${album.artista.id})">Editar</button>
                    </td>
                </tr>`;
                tbody.innerHTML += row;
            });
        })
        .catch(error => console.error("Error al cargar los álbumes:", error));
}

// Cargar canciones en la tabla
function loadSongs() {
    fetch(apiCanciones)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("#tabla-canciones tbody");
            tbody.innerHTML = "";

            data.forEach(cancion => {
                const albumNombre = cancion.album ? cancion.album.titulo : "Sin Álbum";
                const artistaNombre = cancion.album && cancion.album.artista ? cancion.album.artista.nombre : "Desconocido";
                const idAlbum = cancion.album ? cancion.album.id : "N/A";

                const row = `<tr>
                    <td>${cancion.id}</td>
                    <td>${cancion.titulo}</td>
                    <td>${artistaNombre}</td> 
                    <td>${cancion.duracion}</td>
                    <td>${albumNombre}</td>
                    <td>${idAlbum}</td>
                    <td>
                        <button onclick="openEditModal('cancion', ${cancion.id}, '${cancion.titulo}', '${cancion.duracion}', ${idAlbum})">Editar</button>
                        <button onclick="deleteSong(${cancion.id})" style="color: red;">Eliminar</button>
                    </td>
                </tr>`;
                tbody.innerHTML += row;
            });
        })
        .catch(error => console.error("Error al cargar las canciones:", error));
}

// 📌 Función para abrir el modal de AGREGAR
function openAddModal(type) {
    document.getElementById("modal-title").innerText = "Agregar " + type;
    document.getElementById("modal-fields").innerHTML = type === "artista"
        ? `<input type="text" id="nombre" placeholder="Nombre">
           <input type="text" id="genero" placeholder="Género">
           <input type="text" id="pais" placeholder="País">
           <input type="date" id="fechaNacimiento">`
        : type === "album"
        ? `<input type="text" id="titulo" placeholder="Título">
           <input type="date" id="fechaLanzamiento">
           <input type="number" id="idArtista" placeholder="ID del Artista">`
        : `<input type="text" id="titulo" placeholder="Título">
           <input type="text" id="duracion" placeholder="Duración">
           <input type="number" id="idAlbum" placeholder="ID del Álbum">`;

    document.getElementById("modal").dataset.type = type;
    document.getElementById("modal").dataset.id = "";
    document.getElementById("modal").classList.remove("hidden");

    document.querySelector("#modal button").setAttribute("onclick", "saveEntity()");
}

// 📌 Función para abrir el modal de EDICIÓN
function openEditModal(type, id, nombre, genero, pais, fechaNacimiento) {
    document.getElementById("modal-title").innerText = "Editar " + type;
    document.getElementById("modal-fields").innerHTML = type === "artista"
        ? `<input type="text" id="nombre-edit" value="${nombre}">
           <input type="text" id="genero-edit" value="${genero}">
           <input type="text" id="pais-edit" value="${pais}">
           <input type="date" id="fechaNacimiento-edit" value="${fechaNacimiento}">`
        : type === "album"
        ? `<input type="text" id="titulo-edit" value="${nombre}">
           <input type="date" id="fechaLanzamiento-edit" value="${genero}">
           <input type="number" id="idArtista-edit" value="${pais}">`
        : `<input type="text" id="titulo-edit" value="${nombre}">
           <input type="text" id="duracion-edit" value="${genero}">
           <input type="number" id="idAlbum-edit" value="${pais}">`;

    document.getElementById("modal").dataset.type = type;
    document.getElementById("modal").dataset.id = id;
    document.getElementById("modal").classList.remove("hidden");

    document.querySelector("#modal button").setAttribute("onclick", "editEntity()");
}

// 📌 Guardar una nueva entidad (artista, álbum o canción)
function saveEntity() {
    const type = document.getElementById("modal").dataset.type;
    let apiUrl, entity;

    if (type === "artista") {
        apiUrl = apiArtistas;
        entity = {
            nombre: document.getElementById("nombre").value,
            genero: document.getElementById("genero").value,
            pais: document.getElementById("pais").value,
            fechaNacimiento: document.getElementById("fechaNacimiento").value
        };
    } else if (type === "album") {
        const idArtista = parseInt(document.getElementById("idArtista").value);
        if (isNaN(idArtista)) {
            alert("El ID del artista no es válido.");
            return;
        }
        apiUrl = `${apiAlbumes}/artista/${idArtista}`; // URL correcta
        entity = {
            titulo: document.getElementById("titulo").value,
            fechaLanzamiento: document.getElementById("fechaLanzamiento").value
        };
    } else if (type === "cancion") {
        const idAlbum = parseInt(document.getElementById("idAlbum").value);
        if (isNaN(idAlbum)) {
            alert("El ID del álbum no es válido.");
            return;
        }
        apiUrl = `${apiCanciones}/album/${idAlbum}`;
        entity = {
            titulo: document.getElementById("titulo").value,
            duracion: document.getElementById("duracion").value
        };
    }

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entity)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(() => {
        alert(`${type} agregado correctamente.`);
        closeModal();
        showSection(type === "artista" ? "artistas" : type === "album" ? "albumes" : "canciones");
    })
    .catch(error => {
        console.error(`Error al agregar ${type}:`, error);
        alert(`Error al agregar ${type}: ${error.message}`);
    });
}

// 📌 Editar una entidad existente (artista, álbum o canción)
function editEntity() {
    const type = document.getElementById("modal").dataset.type;
    const id = document.getElementById("modal").dataset.id;
    const url = type === "artista" ? `${apiArtistas}/${id}` : type === "album" ? `${apiAlbumes}/${id}` : `${apiCanciones}/${id}`;

    const data = type === "artista"
        ? {
            nombre: document.getElementById("nombre-edit").value,
            genero: document.getElementById("genero-edit").value,
            pais: document.getElementById("pais-edit").value,
            fechaNacimiento: document.getElementById("fechaNacimiento-edit").value
        }
        : type === "album"
        ? {
            titulo: document.getElementById("titulo-edit").value,
            fechaLanzamiento: document.getElementById("fechaLanzamiento-edit").value,
            idArtista: parseInt(document.getElementById("idArtista-edit").value)
        }
        : {
            titulo: document.getElementById("titulo-edit").value,
            duracion: document.getElementById("duracion-edit").value,
            idAlbum: parseInt(document.getElementById("idAlbum-edit").value)
        };

    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
        alert(`${type} editado correctamente.`);
        closeModal();
        showSection(type === "artista" ? "artistas" : type === "album" ? "albumes" : "canciones");
    })
    .catch(error => console.error(`Error al editar ${type}:`, error));
}

// 📌 Eliminar una canción
function deleteSong(id) {
    if (confirm("¿Estás seguro de que quieres eliminar esta canción?")) {
        fetch(`${apiCanciones}/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            alert("Canción eliminada correctamente.");
            loadSongs();
        })
        .catch(error => console.error("Error al eliminar la canción:", error));
    }
}

// 📌 Cerrar modal
function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}