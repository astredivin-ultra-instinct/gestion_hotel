let chambreId = null;
let selectedFiles = [];

function afficherPage(page, bouton = null) {
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active-page');
    });

    const element = document.getElementById(page);

    if (element) {
        element.classList.add('active-page');
    }

    document.querySelectorAll('.head').forEach(b => {
        b.classList.remove('active');
    });

    if (bouton) {
        bouton.classList.add('active');
    }

    if (page === 'acceuil') {
        ChargerChambres();
    }

    if (page === 'reservations') {
        Reservation();
    }

    if (page === 'profil') {
        profil();
    }
}

async function sendReq(url, data) {
    const token = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRFToken': token
        },
        body: data
    });

    return await resp.json();
}

function Message(texte, type) {
    const msg = document.getElementById('message');

    msg.textContent = texte;
    msg.style.display = 'block';

    if (type === 'success') {
        msg.style.color = '#15803d';
        msg.style.backgroundColor = '#dcfce7';
        msg.style.border = '1px solid #22c55e';
    } else {
        msg.style.color = '#dc2626';
        msg.style.backgroundColor = '#fee2e2';
        msg.style.border = '1px solid #ef4444';
    }

    setTimeout(() => {
        msg.style.display = 'none';
    }, 5000);
}

//   CHARGEMENT DES CHAMBRES

async function ChargerChambres() {
    const contenu = document.getElementById('rooms');

    try {
        const resp = await fetch('/enregistrer/');
        const data = await resp.json();

        contenu.innerHTML = '';

        document.getElementById('totalChambres').textContent = data.length;

        if (data.length === 0) {
            contenu.innerHTML = `
                <div class="stat">
                    <span>Aucune chambre enregistrée.</span>
                </div>
            `;
            return;
        }

        data.forEach(c => {
            let photo = '';

            if (c.photos && c.photos.length > 0) {
                photo = c.photos[0];
            } else if (c.photo) {
                photo = c.photo;
            }

            const room = document.createElement('div');

            room.className = 'room';

            room.innerHTML = `
                <img class="room-photo"
                     src="${photo}"
                     alt="Chambre ${c.numero}">

                <div class="room-info">
                    <h3>Chambre ${c.numero}</h3>
                    <p>Étage ${c.etage}</p>
                </div>

                <span class="${c.reserver ? "occupe" : "status"}">
                    ${c.reserver ? 'Occupé' : 'Disponible'}
                </span>

                <div class="price">
                    ${Number(c.prix_jour || 0).toLocaleString('fr-FR')} FCFA
                    <small>/ jour</small>
                </div>

                <div class="actions">

                    <button class="action edit"
                            onclick="Modifier(${c.id})">
                        <i class="ti ti-edit"></i>
                    </button>

                    <button class="action delete"
                            onclick="Option(${c.id})">
                        <i class="ti ti-trash"></i>
                    </button>

                </div>
            `;

            contenu.appendChild(room);
        });

    } catch (error) {
        console.error('Erreur chargement chambres :', error);
    }
}

//   OPTIONS CHAMBRE

function Option(id) {
    chambreId = id;
    afficherPage('option');
}

function Modifier(id) {
    chambreId = id;

    fetch('/enregistrer/')
    .then(resp => resp.json())
    .then(data => {
        const chambre = data.find(c => c.id === id);

        if (!chambre) {
            Message('Chambre introuvable', 'error');
            return;
        }

        document.getElementById('mod_numero').value = chambre.numero || '';
        document.getElementById('mod_etage').value = chambre.etage || '';
        document.getElementById('mod_nombre').value = chambre.nombre || '';
        document.getElementById('mod_prix_heure').value = chambre.prix_heure || '';
        document.getElementById('mod_prix_jour').value = chambre.prix_jour || '';
        document.getElementById('mod_prix_mois').value = chambre.prix_mois || '';

        afficherPage('modifier');
    });
}

//   SUPPRESSION

document.querySelector('.supp').addEventListener('click', async function() {
    const token = document.querySelector('[name=csrfmiddlewaretoken]').value;
    console.log(chambreId)
    if (!chambreId) {
        return;
    }


    try {
        const resp = await fetch(`/supprimer_chambre/${chambreId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': token,
            },
        });

        const rep = await resp.json();

        if (rep.success) {
            Message(rep.message, 'success');
            chambreId = null;
            afficherPage('acceuil');
        } else {
            Message(rep.message, 'error');
        }

    } catch (error) {
        console.error('Erreur:',error, 'status:',rep?.status, 'ok?:', rep.ok);
        Message('Erreur lors de la suppression', 'error');

    }
});

  // MODIFICATION

document.getElementById('Mod_form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const data = new FormData(this);

    const rep = await sendReq(`/modifier_chambre/${chambreId}/`, data);

    if (rep.success) {
        Message(rep.message, 'success');
        this.reset();
        afficherPage('acceuil');
    } else {
        Message(rep.message, 'error');
        console.log(rep.error);
    }
});

  // AJOUT CHAMBRE

document.getElementById('form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const data = new FormData();

    data.append('numero', document.getElementById('numero').value);
    data.append('etage', document.getElementById('etage').value);
    data.append('nombre', document.getElementById('nombre').value);
    data.append('prix_heure', document.getElementById('prix_heure').value);
    data.append('prix_jour', document.getElementById('prix_jour').value);
    data.append('prix_mois', document.getElementById('prix_mois').value);

    selectedFiles.forEach(file => {
        data.append('photos', file);
    });

    try {
        const rep = await sendReq('/ajouter_chambre/', data);

        if (rep.success) {
            Message(rep.message, 'success');

            this.reset();

            selectedFiles = [];

            updatePreview();

            afficherPage('acceuil');
        } else {
            Message(rep.message, 'error');
            console.log(rep.error);
        }

    } catch (error) {
        console.error(error);
        Message('Erreur lors de l’ajout de la chambre', 'error');
    }
});

//   PHOTOS

const photoInput = document.getElementById('photo');
const previewContainer = document.getElementById('previewContainer');

photoInput.addEventListener('change', function() {
    const files = Array.from(this.files);

    files.forEach(file => {
        if (!file.type.startsWith('image/')) {
            return;
        }

        if (selectedFiles.length >= 5) {
            return;
        }

        const existe = selectedFiles.some(f =>
            f.name === file.name &&
            f.size === file.size
        );

        if (!existe) {
            selectedFiles.push(file);
        }
    });

    this.value = '';

    updatePreview();
});

function updatePreview() {
    previewContainer.innerHTML = '';

    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();

        reader.onload = function(e) {
            const div = document.createElement('div');

            div.className = 'preview-item';

            div.innerHTML = `
                <img src="${e.target.result}" alt="Photo">
                <button type="button"
                        class="remove-photo"
                        onclick="removePhoto(${index})">
                    ×
                </button>
            `;

            previewContainer.appendChild(div);
        };

        reader.readAsDataURL(file);
    });
}

function removePhoto(index) {
    selectedFiles.splice(index, 1);
    updatePreview();
}

/* =========================
   PROFIL
========================= */

async function profil() {
    const contenu = document.getElementById('profil');

    try {
        const resp = await fetch('/profil/');
        const data = await resp.json();

        let chambreHTML = '';

        const chambreResp = await fetch('/enregistrer/');
        const chambres = await chambreResp.json();

        chambres.forEach(c => {
            let photo = '';

            if (c.photos && c.photos.length > 0) {
                photo = c.photos[0];
            } else if (c.photo) {
                photo = c.photo;
            }

            chambreHTML += `
                <div class="room">
                    <img class="room-photo"
                         src="${photo}"
                         alt="Chambre ${c.numero}">

                    <div class="room-info">
                        <h3>Chambre ${c.numero}</h3>
                        <p>Étage ${c.etage}</p>
                    </div>

                    <div class="price">
                        ${Number(c.prix_heure || 0).toLocaleString('fr-FR')}
                        FCFA
                        <small>/ heure</small>
                        ${Number(c.prix_jour || 0).toLocaleString('fr-FR')}
                        FCFA
                        <small>/ jour</small>
                        ${Number(c.prix_mois || 0).toLocaleString('fr-FR')}
                        FCFA
                        <small>/ mois</small>
                    </div>
                </div>
            `;
        });

        contenu.innerHTML = `
            <div class="title">
                <h2>Mon profil</h2>
            </div>

            <div class="profile-card">

                <img class="profile-photo"
                     src="${data.photo || ''}"
                     alt="Photo de profil">

                <h2>${data.nom || 'Hôtel'}</h2>

                <div class="profile-info">
                    <p>${data.ville || ''} secteur ${data.secteur || ''}</p>
                    <p>Téléphone : +226 ${data.tel || ''}</p>
                    <p>Email : ${data.email || ''}</p>
                    <p>
                        <a href="${data.localisation || '#'}" target="_blank">
                            Voir la localisation
                        </a>
                    </p>
                </div>

                <div class="profile-rooms">
                    <h3 class="section-title">Mes chambres</h3>
                    <div class="rooms">
                        ${chambreHTML || '<p>Aucune chambre enregistrée.</p>'}
                    </div>
                </div>

            </div>
        `;

        document.getElementById('hotelNom').textContent = data.nom || 'Hôtel';

    } catch (error) {
        console.error('Erreur profil :', error);
    }
}

//   RESERVATIONS list

async function Reservation() {
    const contenu = document.querySelector('.reservation_list');

    try {
        const resp = await fetch('/reservations/');
        const data = await resp.json();

        contenu.innerHTML = '';

        document.getElementById('totalReservations').textContent = data.length;
        const res = await fetch('/enregistrer/');
        const chambre = await res.json();
        console.log(data.length > 0 && chambre.length > 0)
        if(data.length > 0 && chambre.length > 0) {
            document.getElementById('occupation').textContent= ((data.length / chambre.length) * 100).toFixed(2) + "%";
        } else {
            document.getElementById('occupation').textContent = 0 + "%";

        }


        if (data.length === 0) {
            contenu.innerHTML = `
                <div class="stat">
                    <span>Aucune réservation en cours.</span>
                </div>
            `;
            return;
        }
        let total = 0;

        data.forEach(d => {
            total += Number(d.total);
            const reservation = document.createElement('div');

            reservation.className = 'reservation';

            reservation.innerHTML = `
                <div class="reservation-top">
                    <h3>
                        Chambre ${d.numero} <br>
                        <small>Air+ ${d.etage} </small>
                    </h3>
                   


                </div>
                 <hr>

                <p>
                    <i class="ti ti-user"></i>
                    Client n°${d.id} :
                    <strong>${d.nom || ''} ${d.prenom || ''}</strong>
                </p>
                <p>
                    <i class="ti ti-clipboard-list"></i>
                    Motif :
                    <strong>${d.motif|| ''}</strong>
                </p>

                <p>
                    <i class="ti ti-calendar"></i>
                    Date début :
                    <strong>${d.date || ''}</strong>
                </p>

                <p>
                    <i class="ti ti-clock"></i>
                    Durée :
                    <strong>${d.temps || ''} ${d.tarif || ''}</strong>
                </p>
                <p>
                    <i class="ti ti-calendar"></i>
                    Date fin :
                    <strong>${d.date_fin || ''}</strong>
                </p>
                <p>
                    <i class="ti ti-phone"></i>
                    Téléphone :
                    <strong>+226 ${d.tel || ''}</strong>
                </p>
                <hr>
                <p>Total payé <br><br>
                        <strong class="total">
                        ${Number(d.total || 0).toLocaleString('fr-FR')}
                        FCFA
                    </strong>
                </p>
            `;

            contenu.appendChild(reservation);
            document.getElementById('revenus').textContent = total.toLocaleString('fr-FR') + " FCFA";

        });

    } catch (error) {
        console.error('Erreur réservations :', error);
    }
}

/* =========================
   DECONNEXION
========================= */

document.querySelector('.dec').addEventListener('click', async function(e) {
    e.preventDefault();

    const token = document.querySelector('[name=csrfmiddlewaretoken]').value;

    try {
        const resp = await fetch('/deconnexion/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': token
            }
        });

        const rep = await resp.json();

        if (rep.success) {
            Message(rep.message, 'success');
            window.location.href = rep.redirect_url;
        } else {
            Message(rep.message, 'error');
        }

    } catch (error) {
        console.error(error);
    }
});

/* =========================
   INITIALISATION
========================= */

document.addEventListener('DOMContentLoaded', function() {
    ChargerChambres();
    Reservation();
    profil();
});