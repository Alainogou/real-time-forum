let app=document.getElementById('app')
let loginForm=document.getElementById('loginForm')

let registrationForm=document.getElementById('registrationForm')
const homeView = document.querySelector(".home-view");

let register= document.querySelector("#registration-form")
let closeForm=document.querySelector("#close-register-form")


import {createNewAccount} from './components/createNewAccount.js'
import {loadConnexionPage} from './components/forum.js'


document.addEventListener('DOMContentLoaded', () => {
   
    navigate();
});

register.style.display="none"   

window.addEventListener('hashchange', navigate);

function navigate() {
    let route = window.location.hash.slice(1) || 'accueil';
    
    
    if (route==="createNewAccount"){
        
        register.style.display="block"
        homeView.style.display="none"
        createNewAccount(registrationForm)
    }else if (route=="forum"){ 
        loadConnexionPage(app)
    }
    // import(`./components/${route}.js`)
    //     .then((module) => {
    //         const container = document.querySelector(".home-view");?#createNewAccount
    //         module.default(container);
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //         loadNotFoundPage(document.getElementById('app'));
    //     });
}



function loadNotFoundPage(container) {
    container.innerHTML = '<h1>Page non trouvée</h1>';
}


document.querySelector(".button-new-account").addEventListener("click", function(event){
    window.location.hash = '#createNewAccount'
})

closeForm.addEventListener("click", function(){
    register.style.display="none"
    homeView.style.display="flex"
    window.location.hash = ''
   
})

registrationForm.addEventListener('submit', handleRegistration);
loginForm.addEventListener('submit', handleLogin);


function handleRegistration(event) {
    event.preventDefault();
   
    const formData = new FormData(event.target);
    window.location.hash = '#forum'
}

// Fonction pour gérer la connexion
function handleLogin(event) {
   event.preventDefault();
    window.location.hash = '#forum'
   
}