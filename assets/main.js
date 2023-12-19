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
        console.log("c'est  bien ici");
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
    console.log(formData);
    let newUser={
        Id:1,
        LastName :formData.get("last-name"),
        FirstName: formData.get("first-name"),
        NickName:formData.get("nickname"),
        Password:formData.get("password"),
        Email:formData.get("email"),
        Age : parseInt(formData.get("age")),
        Gender:formData.get("gender"),
        ConfirmPassword:formData.get("ConfirmPassword")
    }   

    let errpassword = document.querySelector(".messageErro")
    let errnicknam = document.querySelector(".messageErro1")
    let erremailUser = document.querySelector(".messageErro2")
   
   
    errpassword.style.color="red"
    errnicknam.style.color="red"
    errpassword.style.marginLeft="10px"
    errnicknam.style.marginLeft="10px"
    erremailUser.style.color="red"
    erremailUser.style.marginLeft="10px"


    fetch('http://localhost:8081/register', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json', 
       },
       body: JSON.stringify(newUser),
     
   })
   .then(response => {
       if (response.ok) {
        
        window.location.hash = '#forum'
        console.log("yes");
        console.log(response);
        } else {
            
            console.log("bakhoul");
            // console.log(response.status);
            window.location.hash = '#createNewAccount';
            registrationForm.reset();

             return response.json();
        //    console.error('Erreur lors de la création de l\'utilisateur:', response.status);
        }
    })
    .then(response => { 
        // response.JSON()
        console.log("ass1",response['message']);
        if (response['message_pawword']!=="") {
            errpassword.innerHTML=response['message_pawword']
           
        }else if (response['message_emailUser']!==""){
            erremailUser.innerHTML=response['message_emailUser']
        }else (response['message']==="Enter at least 4 input characters") ;{
            errnicknam.innerHTML=response['message']
        }
        setTimeout(function() {
            errpassword.innerHTML = '';
            errnicknam.innerHTML= ''
            erremailUser.innerHTML=''
        }, 5000);
        // console.log("ass1",response['message']);


    })
   .catch(error => console.error('Erreur lors de la création de l\'utilisateur:', error));
  
   
}


// Fonction pour gérer la connexion
function handleLogin(event) {
   event.preventDefault();
    window.location.hash = '#forum'
   
}