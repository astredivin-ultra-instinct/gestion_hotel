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
        data.forEach(c => {
            const chambreCard = document.createElement('div');
            chambreCard.className = 'chambre-card';
            //const date = new Date();
           // console.log("jour:",date);
            chambreCard.innerHTML = `
                         <div class="tete"><h3>Hôtel ${c.hotel}</h3></div>
                         <img src="${c.photo}" alt="Image de chambres" >
                         <p><strong>Numéro de chambre: </strong>${c.numero}</p>
                         <p><strong>Etage : </strong>${c.etage}</p>
                         <div class="tarif">
                         <div class="heure">${c.prix_heure} Fcfa/Heure</div> <br>
                         <div class="jour">${c.prix_jour} Fcfa/jour</div> <br>
                         <div class="mois"> ${c.prix_mois} Fcfa/mois</div></div></p>                    
                         <p><strong>Téléphone : </strong>+266 ${c.tel} </p>
                         <a href="${c.localisation}" ><strong>📍${c.ville} secteur ${c.secteur}📍<br>Cliquer ici pour voir la localisation :</strong> ${c.hotel}</a>
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
        hotel.forEach(h =>{
            const hotel_trouve = document.createElement('div');
            hotel_trouve.className = 'rech_ok';
            hotel_trouve.innerHTML = `
                        <div class="tete"><h3>Hôtel ${h.nom} </h3> </div>
                        <img src="${h.photo}" alt="images">
                        <div class="tarif">
                        <div class="heure">${h.prix_heure} Fcfa/Heure</div>
                        <div class="jour">${h.prix_jour} Fcfa/jour</div> 
                        <div class="mois"> ${h.prix_mois} Fcfa/mois</div></div></p>
                        <p><strong>Ville:</strong>${h.ville} secteur ${h.secteur} </p>
                        <p><strong>Téléphone:</strong>+226 ${h.tel} </p>
                        <a href="${h.localisation}">Cliquer ici pour voir la localisation de l'hôtel: ${h.nom}</a> <br>
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
