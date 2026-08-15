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
const doc = document.querySelector('#form');
console.log("le document est :", doc);
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
            chambreCard.innerHTML = `
                         <h3>Hôtel : ${c.hotel} </h3>
                         <img src="${c.photo}" alt="Image de chambres" >
                         <p><strong>Numéro de chambre:</strong>${c.numero}</p>
                         <p><strong>Etage :</strong>${c.etage}</p>
                         <p><strong>Tarifs:</strong>${c.prix_heure} / heure | ${c.prix_jour} / jour | ${c.prix_mois} / mois </p>
                         <button class="btn" onclick="reserverChambre(${c.id})">Reserver</button>
                         <hr> 
                         `;
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
