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

/*/photo

const photoInput = document.getElementById("photo");
const previewContainer = document.getElementById("previewContainer");
const photoCount = document.getElementById("photoCount");

let selectedFiles = [];

photoInput.addEventListener("change", function () {

    const newFiles = Array.from(this.files);

    // Ajouter les nouvelles images
    newFiles.forEach(file => {

        if (!file.type.startsWith("image/")) {
            return;
        }

        // Éviter les doublons
        const alreadyExists = selectedFiles.some(
            existingFile =>
                existingFile.name === file.name &&
                existingFile.size === file.size
        );

        if (!alreadyExists && selectedFiles.length < 5) {
            selectedFiles.push(file);
        }
    });

    updatePreview();

    // Réinitialiser le champ pour pouvoir
    // sélectionner à nouveau les mêmes images
    this.value = "";
});


function updatePreview() {

    previewContainer.innerHTML = "";

    selectedFiles.forEach((file, index) => {

        const reader = new FileReader();

        reader.onload = function (event) {

            const preview = document.createElement("div");
            preview.classList.add("preview-item");

            preview.innerHTML = `
                <img src="${event.target.result}" alt="Image">

                <button
                    type="button"
                    class="remove-photo"
                    onclick="removePhoto(${index})">
                    <i class="fa-solid fa-xmark"></i>
                </button> `
            ;

            previewContainer.appendChild(preview);
        };

        reader.readAsDataURL(file);
    });

    photoCount.textContent = selectedFiles.length;
}


function removePhoto(index) {

    selectedFiles.splice(index, 1);

    updatePreview();
} */
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




//options (modifier//supprimer)

function Option(id){
    chambreId = id;
    document.getElementById('acceuil').style.display= 'none';
    document.getElementById('profil').style.display= 'none';
    document.getElementById('option').style.display = 'block';
    
}
// supprimer
function Supprimer(){
    document.querySelector('.supp').addEventListener("click",
    async function(e) {
        e.preventDefault();
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        const resp = await fetch(`/supprimer_chambre/${chambreId}`,{
            method: 'POST',
            headers :{
                'X-CSRFToken': csrftoken
            }
        });
        const rep = await resp.json();
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


//Profil
function profil() {
    const contenu = document.getElementById('profil');
    const contenair = document.createElement('div');
    contenair.className = 'pro';

fetch('/profil/')
.then(rep =>rep.json())
.then(data => {
    //console.log("donnéez json reçus:",data)
    contenu.innerHTML = '';
   // contenu.style.display = 'block';

    contenair.innerHTML += `
               <h3 class="prof"><strong>${data.nom} </strong></h3>
               <img src="${data.photo}" alt="photo de profile" >
               <p>${data.ville} secteur ${data.secteur} </p>
               <p>Téléphone:+226 ${data.tel}</p>
               <p>Address E-mail :${data.email}</p>
               <a href="${data.localisation}">localisation de votre hôtel</a>
               <hr>
               <br>
               <h4>Vos chambres enrégistrer</h4> <br>


    `;
    contenu.appendChild(contenair);
    return fetch('/enregistrer/')
})
.then(rep => rep.json())
.then(data =>{
    if(data.length ===0){
        contenair.innerHTML += `
        <h5>Aucune chambres enregistrer pour le moment</h5>
        `;
    }
    data.forEach(c =>{
        contenair.innerHTML += `
            <div class="tete"><h3>Air+${c.etage} <br> <p>Chambre ${c.numero}</p></h3> <button class="opt" onclick="Option(${c.id})">☰</button></div>
            <img src="${c.photo} ">
            <p><strong>Chambre </strong> </p>
            <div class="tarif">
                <div class="heure">${c.prix_heure} Fcfa/Heure</div>
                <div class="jour">${c.prix_jour} Fcfa/jour</div> 
                <div class="mois"> ${c.prix_mois} Fcfa/mois</div>
            </div>
            <br>

    `;
    contenu.appendChild(contenair);
    })

})
.catch(error => console.error("Erreur los du chargement des données !", error));
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
                  <h4><strong>  Chambre n°${d.numero} <br></strong>Air+${d.etage} </h4> <hr>
                 <p>🙎🏾‍♂️ Client ------------- <strong>${d.nom} ${d.prenom}  </strong> </p>
                 <p>📆 reservée le -------------------  <strong> ${d.date} </strong> </p>
                  <p>🕐 Durée ----------------------------------------- <strong> ${d.temps} ${d.tarif} </strong> </p>
                 <p>📞Téléphone --------------------------<strong> +226 ${d.tel}</strong></p> <hr>
                   <p>Total payé  <br> <strong class="total">${Number(d.total).toLocaleString('fr-FR')} FCFA</strong></p>
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
