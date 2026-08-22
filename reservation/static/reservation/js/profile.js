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
    
   
    if(type === 'success') {
        msg.style.color = 'rgb(11, 93, 22)';
        msg.style.backgroundColor = 'rgb(199, 244, 204)'
        msg.style.border = '1px solid';
        msg.style.borderColor = 'rgb(13, 163, 46)'
    } else {
        msg.style.color = 'rgba(230, 14, 14, 0.99)';
        msg.style.backgroundColor = 'rgba(227, 181, 181, 0.93)'
        msg.style.border = '1px solid';
        msg.style.borderColor = 'rgb(239, 22, 22)'
    }
    setTimeout( () =>{
        msg.style.display = 'none';
    }, 5000);
}

// Ajout de chambre

async function add_chambre() {
    //const d = document.getElementById('form');
    const data = new FormData();
    data.append('numero', document.querySelector('#numero').value);
    data.append('etage', document.querySelector('#etage').value);
    data.append('nombre', document.querySelector('#nombre').value);
    data.append('prix_heure', document.querySelector('#prix_heure').value);
    data.append('prix_jour', document.querySelector('#prix_jour').value);
    data.append('prix_mois', document.querySelector('#prix_mois').value);
    data.append('photo', document.querySelector('#photo').files[0]);
    const rep = await sendReq('/ajouter_chambre/', data);
    if (rep.success) {
        console.log(rep.message);
        Message(rep.message, 'success');
        document.getElementById('form').reset();
        window.location.href = rep.redirect_url;
    } else {
        Message(rep.message, 'error');
        document.getElementById('form').reset();
        console.log(rep.message);
        return;
    }
}
// Ajout de chambre
//const doc = document.querySelector('#form');
document.querySelector('#form').addEventListener('submit',
    async function(e) {
        e.preventDefault();
        await add_chambre();
    }
);

//Deconnection
document.querySelector('.dec').addEventListener("click",
    async function(e){
        e.preventDefault();
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        const dec = await fetch('/deconnexion/', {
        method: 'POST',
        headers: {
            'X-CSRFToken':csrftoken
        },
    });
         const rep = await dec.json();
        if (rep.success) {
            Message(rep.message, 'success');
            window.location.href = rep.redirect_url;
        } else {
            Message(rep.message, 'error');
        }
    }
);


// affichage dynamique des chambres
let chambreId = null;
function affichageChambre() {
    fetch('/affichage/')
    .then(response => response.json())
    .then(data => {
        const contenu = document.querySelector('.contenu');
        contenu.innerHTML = '';
        data.forEach(c => {
            const chambreCard = document.createElement('div');
            chambreCard.className = 'chambre-card';
            //const date = new Date();
           // console.log("jour:",date);
            chambreCard.innerHTML = `
                         <div class="tete"><h3>Hôtel : ${c.hotel}</h3> <button class="opt" onclick="Option(${c.id})">☰</button></div>
                         <img src="${c.photo}" alt="Image de chambres" >
                         <p><strong>Numéro de chambre:</strong>${c.numero}</p>
                         <p><strong>Etage :</strong>${c.etage}</p>
                         <p><strong>Tarifs:</strong>${c.prix_heure} fcfa /heure | ${c.prix_jour} fcfa/jour | ${c.prix_mois}fcfa /mois </p>
                         <p><strong>Téléphone :</strong>+266 ${c.tel} </p>
                         <a href="${c.localisation}" ><strong>📍${c.ville} secteur ${c.secteur}📍<br>Cliquer ici pour voir la localisation :</strong>  💎${c.hotel}💎</a>
                         <button class="btn" onclick="reserverChambre(${c.id})">Reserver</button>
                         ` ;
            // ajout de la carte chambre dans le conteneur principal
            contenu.appendChild(chambreCard);

        });

    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));
}
document.addEventListener('DOMContentLoaded', affichageChambre);

//Reservation de chambre
function reserverChambre(id) {
    chambreId = id;
    console.log(chambreId);
    document.getElementById('acceuil').style.display = 'none';
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
            window.location.href = `/profiles/`;

        } else {
            Message(rep.message, 'error');
            console.log(rep.error);
        }
    }
);

//options (modifier//supprimer)

function Option(id){
    chambreId = id;
    document.getElementById('acceuil').style.display= 'none';
    document.getElementById('option').style.display = 'block';
    
}
// supprimer
function Supprimer(){
    document.querySelector('.supp').addEventListener("click",
    async function(e) {
        e.preventDefault();
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        const rep = await fetch(`/supprimer_chambre/${chambreId}`,{
            method: 'POST',
            headers :{
                'X-CSRFToken': csrftoken
            }
        });
        if (rep.success){
            Message(rep.message, 'success');
            console.log(rep.success);
            window.location.href = rep.redirect_url;
        } else {
            Message(rep.message);
            console.log(rep.message);
            console.log(rep.error);
            return;
        }
    }
)
}

//Modifier
async function ModChambre(){
    const d = document.getElementById('Mod_form');
    const data = new FormData(d);
    const rep = await sendReq(`/modifier_chambre/${chambreId}`, data);
    if (rep.success){
        Message(rep.message, 'success');
        document.getElementById('Mod_form').reset();
        window.location.href = '/profiles/';
    } else {
        Message(rep.message, 'error');
        console.log(rep.error);
        return;
    }
}
function ModifierChambre() {
document.querySelector('#Mod_form').addEventListener("submit",
    async function(e) {
        e.preventDefault();
        await ModChambre();
    }
)
}
//annulé modification
document.querySelector('.annule').addEventListener('click', 
    async function(e) {
        e.preventDefault();
        document.getElementById('Mod_form').reset();
        window.location.href = '/profiles/';
    }
)



//document.querySelector('#Oform').addEventListener()

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
        console.log(hotel.success === false)
        if (hotel.success === false){
            const contenu = document.getElementById('contenu_recherche');
            document.getElementById('acceuil').style.display = 'none';
            const hotel_trouve = document.createElement('div');
            contenu.style.display = 'block';
            document.getElementById('reservations').style.display ='none';
            document.getElementById('profil').style.display ='none';
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
        hotel.forEach(h =>{
            const hotel_trouve = document.createElement('div');
            hotel_trouve.className = 'rech_ok';
            hotel_trouve.innerHTML = `
                        <h3>Hôtel:${h.nom} </h3>
                        <img src="${h.photo}" alt="images">
                        <p><strong>Tarifs:</strong>${h.prix_heure} fcfa/heure ${h.prix_jour} fcfa/jour ${h.prix_mois} fcfa/mois</p>
                        <p><strong>Ville:</strong>${h.ville} secteur ${h.secteur} </p>
                        <p><strong>Téléphone:</strong>+226 ${h.tel} </p>
                        <a href="${h.localisation}">Cliquer ici pour voir la localisation de l'hôtel: ${h.nom}</a> <br>
                        <button class="btn" onclick="reserverChambre(${h.id})">Réserver</button>          
            `;
            contenu.appendChild(hotel_trouve);
        });

    })
    .catch(error => console.error("Erreur lors du chargement des données:", error))
}

//Profil
function profil() {
fetch('/profil/')
.then(rep =>rep.json())
.then(data => {
    //console.log("donnéez json reçus:",data)
    const contenu = document.getElementById('profil');
    contenu.innerHTML = '';
   // contenu.style.display = 'block';
    const contenair = document.createElement('div');
    contenair.className = 'pro';
    contenair.innerHTML = `
               <h3><strong>${data.nom} </strong></h3>
               <img src="${data.photo}" alt="photo de profile" >
               <p>${data.ville} secteur ${data.secteur} </p>
               <p>Téléphone:+226 ${data.tel}</p>
               <p>Address E-mail :${data.email}</p>
               <a href="${data.localisation}">localisation de votre hôtel</a>

    `;
    contenu.appendChild(contenair);
})
.catch(error => console.error("Erreur los du chargement des données !", error))
}

document.addEventListener('DOMContentLoaded', profil)

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


//List des reservations
function Reservation() {
    fetch('/reservations/')
    .then(rep => rep.json())
    .then(data =>{
        console.log("data:",data)
        const contenu = document.querySelector('.reservation_list');
        contenu.innerHTML = '';
        if(data.length === 0) {
            contenu.style.display = "block";
            contenu.innerHTML = `
            <h5>Aucune reservations en cours</h5>
            `;
        }
        //document.getElementById('acceuil').style.display= 'none';
        //contenu.style.display ='block';
        data.forEach(d => {
            const list = document.createElement('div');
            list.className = 'list';
            list.innerHTML = `
                  <h4><strong>Air + ${d.etage}: Chambre numero ${d.numero} </strong> </h4>
                   <p>reservée par <strong>${d.nom} ${d.prenom} le ${d.date} </strong> </p>
                   <p>Total payé :<strong>${d.total}fcfa pour ${d.temps} ${d.tarif} </strong></p>
                    <p><strong>Téléphone: +226 ${d.tel}</strong></p>
                    <hr>
                    <hr>
        `;
        contenu.appendChild(list);
        });
    })
    .catch(error =>console.error("erreurs lors du chargement des données!", error))
}

document.addEventListener('DOMContentLoaded', Reservation);


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