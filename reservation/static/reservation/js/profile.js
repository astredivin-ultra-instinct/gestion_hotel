function afficherPage(page) {
    document.querySelectorAll('.page').forEach( p => p.style.display='none');
    document.getElementById(page).style.display ="block";
}