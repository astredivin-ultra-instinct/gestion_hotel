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
    msg.style.border = '1px solid';
    msg.style.borderColor = 'rgb(239, 22, 22)'
    if(type === 'success') {
        msg.style.color = 'rgb(11, 93, 22)';
        msg.style.backgroundColor = 'rgb(53, 142, 62)'
    } else {
        msg.style.color = 'rgba(230, 14, 14, 0.99)';
        //msg.style.backgroundColor = 'rgba(234, 232, 232, 0.93)'
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
        //window.location.href = rep.redirect_url;
    } else {
        Message(rep.message, 'error');
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

