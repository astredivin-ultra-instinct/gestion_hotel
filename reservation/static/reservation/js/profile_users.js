// page de profile

function afficherPage(page) {
    document.querySelectorAll('.page').forEach( p => p.style.display='none');
    document.getElementById(page).style.display ="block";
}

async function sendReq(url, data){
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const resp = await fetch(url, {
        method: 'POST',
        headers : {
            'X-CSRFToken': csrftoken
        },
        body : data
    });
    return await resp.json();
}

//Message
function Message(texte, type){
    const msg = document.getElementById('message');
    msg.textContent = texte;
    msg.style.display = 'block';
    msg.style.fontSize = '17px';
    
   
    if(type === 'success') {
        msg.style.color = 'rgb(11, 93, 22)';
        msg.style.backgroundColor = 'rgb(199, 244, 204)'
        msg.style.border = '1px solid';
        msg.style.borderColor = 'rgb(13, 163, 46)'
    } else {
        msg.style.color = 'rgba(230, 14, 14, 0.99)';
        msg.style.backgroundColor = 'rgba(232, 211, 211, 0.93)'
        msg.style.border = '1px solid';
        msg.style.borderColor = 'rgb(239, 22, 22)'
        
    }
    setTimeout( () =>{
        msg.style.display = 'none';
    }, 5000);
}

// affichage dynamique des chambres
let chambreId = null;
function affichageChambre() {
    fetch('/affichage/')
    .then(response => response.json())
    .then(data => {
        const contenu = document.querySelector('.contenu');
        contenu.innerHTML = '';
        data.forEach((c, index) => {
            const chambreCard = document.createElement('div');
            chambreCard.className = 'chambre-card';
            //const date = new Date();
           // console.log("jour:",date);
           const toff = c.photos.map((url, i) =>
        `<img src="${url}" class="slide ${i ===0 ? 'active': ''}" > `) .join('');
           const bulle = c.photos.map((_, i) =>`
           <span class="bullet ${i ===0? 'active' : ''}" onclick="goToSlide(${index}, ${i})"></span>`).join('');
            chambreCard.innerHTML = `
                        <div class="tete"><h3>Hôtel ${c.hotel}</h3>
                            <img class="room-photo"
                            src="${c.hotel_tof}"
                            alt="Chambre ${c.numero}">
                        </div>
                        <div class="slider" id="slider-${index}">
                            ${toff}
                            <button class="prev" onclick="slidePhoto(${index}, -1)">&#8249;</button>
                            <button class="next" onclick="slidePhoto(${index}, 1)">&#8250;</button>
                            <div class ="bullets">${bulle} </div>
                        </div>
                        <p><strong> chambre n°</strong>${c.numero} <strong>Etage </strong>${c.etage}</p>
                        <p></p>
                        <div class="tarif">
                        <div class="heure">${Number(c.prix_heure).toLocaleString('fr-FR')} Fcfa/Heure</div> <br>
                        <div class="jour">${Number(c.prix_jour).toLocaleString('fr-FR')} Fcfa/jour</div> <br>
                        <div class="mois"> ${Number(c.prix_mois).toLocaleString('fr-FR')} Fcfa/mois</div></div></p>                    
                        <p><strong><h7><i class="ti ti-phone"></i></h7> Téléphone : </strong>+266 ${c.tel} </p>
                        <a href="${c.localisation}" ><strong><h7><i class="ti ti-building-community"></i></h7>${c.ville} secteur ${c.secteur}<br>
                        <h7><i class="ti ti-map-pin"></i></h7>Cliquer ici pour voir la localisation :</strong> ${c.hotel}</a>
<button class="btn ${c.reserver ? 'btn-grise' : ''}" 
        id="btn-reserver-${c.id}"
        ${c.reserver ? 'disabled' : `onclick="reserverChambre(${c.id})"`}>
    ${c.reserver 
        ? `<span id="countdown-${c.id}">Réservé...</span>` 
        : 'Réserver'}
</button>                         ` ;
            contenu.appendChild(chambreCard);
            if (c.reserver && c.date_fin) {
                lancerCountdown(c.id, c.date_fin);
}

        });

    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));
}
document.addEventListener('DOMContentLoaded', affichageChambre);
//function compte à rebour
function lancerCountdown(id, dateFin) {
    const fin = new Date(dateFin).getTime();

    const interval = setInterval(() => {
        const reste = fin - Date.now();
        const btn = document.getElementById(`btn-reserver-${id}`);
        const span = document.getElementById(`countdown-${id}`);

        if (!btn || !span) { clearInterval(interval); return; }

        if (reste <= 0) {
            clearInterval(interval);
            btn.disabled = false;
            btn.classList.remove('btn-grise');
            btn.setAttribute('onclick', `reserverChambre(${id})`);
            btn.innerHTML = 'Réserver';
            return;
        }

        const h = Math.floor(reste / 3600000);
        const m = Math.floor((reste % 3600000) / 60000);
        const s = Math.floor((reste % 60000) / 1000);

        if (h === 0) {
          span.textContent = `Réservée pour ${m}m ${s}s`;  
        } else if (m === 0) {
            span.textContent = `Réservée pour ${s}s`;
        } else {
            span.textContent = `Réservée pour ${h}h ${m}m ${s}s`;
        }
    }, 1000);
}
//navigatigon slider 
function slidePhoto(index, direction) {
    const slider = document.getElementById(`slider-${index}`);
    const slides = slider.querySelectorAll('.slide');
    const bullets = slider.querySelectorAll('.bullet');
    let current = [...slides].findIndex(s => s.classList.contains('active'));

    slides[current].classList.remove('active');
    bullets[current].classList.remove('active');

    current = (current + direction + slides.length) % slides.length;

    slides[current].classList.add('active');
    bullets[current].classList.add('active');
}

function goToSlide(index, i) {
    const slider = document.getElementById(`slider-${index}`);
    const slides = slider.querySelectorAll('.slide');
    const bullets = slider.querySelectorAll('.bullet');

    slides.forEach(s => s.classList.remove('active'));
    bullets.forEach(b => b.classList.remove('active'));

    slides[i].classList.add('active');
    bullets[i].classList.add('active');
}
//Reservation de chambre
function reserverChambre(id) {
    chambreId = id;
    console.log(chambreId);
    document.getElementById('acceuil').style.display = 'none';
    document.getElementById('contenu_recherche').style.display = 'none';
    document.getElementById('reservation').style.display = 'block';}
    //const d = document.getElementById('reservation');

document.querySelector('#Rform').addEventListener('submit',
    async function(e) {
        e.preventDefault();
        const data = new FormData();
        data.append('nom', document.querySelector('#nom').value);
        data.append('prenom', document.querySelector('#prenom').value);
        data.append('tel', document.querySelector('#tel').value);
        data.append('tarif', document.querySelector('#tarif').value);
        data.append('temps', document.querySelector('#temps').value);
        const rep = await sendReq(`/reservation/${chambreId}`, data);

        if (rep.success) {
            Message(rep.message, 'success');
            console.log(rep.message);
            document.getElementById('Rform').reset();
            window.location.href = `/users/`;

        } else {
            Message(rep.message, 'error');
            console.log(rep.error);
        }
    }
);

//Rechercher

function Rechercher() {
    const find = document.querySelector('.rechercher').value;
    console.log(find);
    if (find === '' | find ===' ') {
        console.log("Aucun élément saisi");
        const msg = document.querySelector('.rechercher');
        msg.placeholder = "Veuillez entrez un élement à rechercher!";
        //Message("Veuillez entrez un élement à rechercher!", 'error');
        return;
    }
    fetch(`/recherche/?q=${encodeURIComponent(find)}`)
    .then(rep => rep.json())
    .then(hotel =>{
        if (hotel.success === false){
            const contenu = document.getElementById('contenu_recherche');
            document.getElementById('acceuil').style.display = 'none';
            const hotel_trouve = document.createElement('div');
            contenu.style.display = 'block';
            //document.getElementById('reservations').style.display ='none';
            //document.getElementById('profil').style.display ='none';
            contenu.innerHTML = '';
            hotel_trouve.innerHTML = `
            <h5>Aucun hotel correspond à cette recherche</h5>
            `;
            contenu.appendChild(hotel_trouve);
            document.querySelector('.rechercher').value = '';
            return;
        }
        const contenu = document.getElementById('contenu_recherche');
        document.getElementById('acceuil').style.display = 'none';
        contenu.innerHTML = '';
        contenu.style.display = 'block';
        hotel.forEach((h, index) =>{
            const hotel_trouve = document.createElement('div');
            hotel_trouve.className = 'rech_ok';
            const toff = h.photos.map((url, i) =>
              `<img src="${url}" class="slide ${i ===0 ? 'active': ''}" > `).join('');
           const bulle = h.photos.map((_, i) =>`
           <span class="bullet ${i ===0? 'active' : ''}" onclick="goToSlide(${index}, ${i})"></span>`).join('');
            hotel_trouve.innerHTML = `
                        <div class="tete"><h3>Hôtel ${h.nom} </h3>
                            <img class="room-photo"
                            src="${h.tof}"
                            alt="Chambre ${h.numero}">
                        </div>
                        <div class="slider" id="slider-${index}">
                            ${toff}
                            <button class="prev" onclick="slidePhoto(${index}, -1)">&#8249;</button>
                            <button class="next" onclick="slidePhoto(${index}, 1)">&#8250;</button>
                            <div class ="bullets">${bulle} </div>
                        </div>
                        <div>Ch. n° ${h.numero} Etage. ${h.etage} </div>
                        <div class="tarif">
                        <div class="heure">${h.prix_heure} Fcfa/Heure</div>
                        <div class="jour">${h.prix_jour} Fcfa/jour</div> 
                        <div class="mois"> ${h.prix_mois} Fcfa/mois</div></div></p>
                        <p><strong>
                        <i class="ti ti-building-community" ></i>Ville :</strong>${h.ville} secteur ${h.secteur} </p>
                        <p><strong>
                        <i class="ti ti-phone" ></i>Téléphone :</strong>+226 ${h.tel} </p>
                        <a href="${h.localisation}">
                        <i class="ti ti-map-pin" ></i>Cliquer ici pour voir la localisation de l'hôtel: ${h.nom}</a> <br>
                        <button class="btn" onclick="reserverChambre(${h.id})">Réserver</button> <br> <br>        
            `;
            contenu.appendChild(hotel_trouve);
        });

    })
    .catch(error => console.error("Erreur lors du chargement des données:", error))
}


//style css

const btn = document.querySelectorAll('.head');

btn.forEach(bt =>{
    bt.addEventListener('click',
        function() {
            btn.forEach(b =>{
                b.classList.remove('active')
            });
            this.classList.add('active')
        }
    );
})


            /* Date et heure actu
            const dt = new Date();
            const jour = dt.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
            const heure = dt.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });*/
