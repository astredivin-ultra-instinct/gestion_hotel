// pour ls envoi de reqet
async function sendReq(url, data){
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            //'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken //getCookie('csrftoken')
        },
        body: data //JSON.stringify(donnees)
    });
    return await resp.json();
}
//message utilitaire
function Message(texte, type) {
    const container = document.getElementById('message');
    
    container.textContent = texte;
    container.style.display = 'block';
    
    // type
    if (type === 'success') {
        container.style.backgroundColor = '#d4edda';
        container.style.color = '#155724';
    } else {
        container.style.backgroundColor = '#f8d7da';
        container.style.color = '#721c24'; 
    }

    // Effacer le message automatiquement après 5 secondes
    setTimeout(() => {
        container.style.display = 'none';
    }, 5000);
}

//Creation du cmpt hotel
async function soummette() {
    const data = new FormData();
    data.append('nom', document.querySelector('#nom').value);
    data.append('ville', document.querySelector('#ville').value);
    data.append('secteur', document.querySelector('#secteur').value);
    data.append('localisation', document.querySelector('#localisation').value);
    data.append('tel', document.querySelector('#tel').value);
    data.append('email', document.querySelector('#email').value);
    data.append('password', document.querySelector('#password').value);
    data.append('conf_pass', document.querySelector('#conf_password').value);
    const toff = document.querySelector('#photo');
    if (toff.files[0]) {
        data.append('photo', toff.files[0]);}
    /*if (data.get('password') && data.get('conf_pass') && data.get('pass') !== data.get('conf_pass')) {
        const cont = document.getElementById('message');
        cont.textContent ="les mots de passe ne correspondent pas";
        cont.style.display = 'block';
        cont.style.color = '#fa0e25';
        cont.style.backgroundColor = 'rgb(205, 122, 122)'
        setTimeout( () => {
            cont.style.display = 'none';
        }, 5000);
        return;
    }*/
    const rest = await sendReq('/creation_compte/', data);
    if (rest.success) {
        alert(rest.message);
        Message(rest.message, 'success');
        document.getElementById('form').reset();
        window.location.href = rest.redirect_url;
        console.log("lien vers:", rest.redirect_url);


    } else {
        console.log('Erreurs:', rest);
        Message(rest.error, 'error');
        return;
    }
}
const monF = document.querySelector('#monF');
console.log('le formulaire est:', monF);
document.querySelector('#form').addEventListener('submit',
    async function(e) { e.preventDefault();
        await soummette();
    }
);




/*const data = {
    nom: document.querySelector('#nom').value,
    email: document.querySelector('#email').value,
    localisaton: document.querySelector('#localisation').value,
    ville: document.querySelector('#ville').value,
    secteur: document.querySelector('#secteur').value,
    tel: document.querySelector('#tel').value,
    const addTof = new FormData();
    addTof.append('photo', document.querySelector('#photo').files[0]);
    addTof.append('numero', 101);
};
const rest = await sendReq('creation_compte/',data)*/