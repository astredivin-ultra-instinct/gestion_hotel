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
        msg.style.borderColor = 'rgb(19, 108, 19)'
    } else {
        msg.style.color = 'rgba(241, 15, 15, 0.92)';
        msg.style.backgroundColor = 'rgba(237, 233, 233, 0.91)';
        msg.style.borderColor = 'rgb(253, 21, 21)'
    }
    setTimeout( () => {
        msg.style.display = 'none';
        }, 5000);
}

async function soummette() {
    const load = document.querySelector('.loadind');
    if(load){
        load.style.display = 'block';
        document.getElementById('form').style.display = 'none';
    }
    const d = document.getElementById('form');
    const data  = new FormData(d);
    //data.append('username', document.querySelector('#username').value);
    //data.append('password', document.querySelector('#password').value);
    const rep = await sendReq('/connexion/', data);
    if (rep.success) {
        load.style.display = 'none';
        document.getElementById('form').style.display = 'none';
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
