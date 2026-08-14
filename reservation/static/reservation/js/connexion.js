async function sendReq(url, data) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const resp = await fetch(url, { 
        method : 'POST',
        headers: {
            //'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body : data //JSON.stringify(data),
    })
    return await resp.json(); 
}
//msg utilitaire
function message(texte, type) {
    const msg = document.getElementById('message');
    msg.textContent = texte;
    msg.style.display = 'block';
    if(type) {
        msg.style.color = 'rgb(20, 80, 23)';
        msg.style.backgroundColor = 'rgb(158, 206, 168)';
    } else {
        msg.style.color = 'rgba(241, 15, 15, 0.92)';
        msg.style.backgroundColor = 'rgba(200, 146, 146, 0.91)';
    }
    setTimeout( () => {
        msg.style.display = 'none';
        }, 5000);
}

async function soummette() {
    const d = document.getElementById('form');
    const data  = new FormData(d);
    //data.append('username', document.querySelector('#username').value);
    //data.append('password', document.querySelector('#password').value);
    const rep = await sendReq('/connexion/', data);
    if (rep.success) {
        message(rep.message, 1);
        document.getElementById('form').reset();
        window.location.href = rep.redirect_url;
    } else {
        message(rep.message, 0);
        console.log(rep.error);
        return;
    }

};
document.querySelector('#form').addEventListener('submit',
    async function(e) {
        e.preventDefault();
        await soummette();
        
    }
);
