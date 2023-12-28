
let app=document.getElementById('add')


let ap=document.getElementById('add1')




import {createNewAccount} from './components/createNewAccount.js'
import {loadConnexionPage} from './components/forum.js'


document.addEventListener('DOMContentLoaded', () => {
    // let tabContents = document.querySelectorAll('.tab');
    // console.log(tabContents);
    
    // tabContents.forEach(function (tabContent) {
    //     tabContent.classList.remove('active');
    // });
   
  
    
    fetch('http://localhost:8081/auth')
    .then(response => response.json())
    .then(data => {
        

        if (data.IsAuth){
          
           ap.remove()
           loadConnexionPage(app)
        }else{
            let divz=document.createElement('div')
            divz.innerHTML=`<div class="container flex"  id="part1"  >
            <div class="home-view flex">
              <div class="text">
                <h1>REAL TIME FORUM</h1>
                <p>Connect, Collaborate, Communicate<br>  
                   Real-Time Conversations Unleashed! </p>
              </div>
              
              <div class="loginForm" id="login">
                <div><span class="errorStyle logNotMatch"></span></div> 
                <form id="loginForm">
                    <input type="text"  name="email-nickname" placeholder="Nickname or email" >
                    <input type="password"  name="password" placeholder="Password">
                    <div class="link">
                      <button type="submit" class="login">Login</button>
                    </div>
                </form>
             
                <hr>
                <div class="button-new-account">
                    <button type="submit" class="login">Create new account</button>
                </div>
              </div>
            </div>
        
          </div>
        
          <div class="registration" style="display: none;" id="part2">
            <button class="close" id="close-register-form">X</button>
            <form id="registrationForm">
              
            </form>
          </div>
         `
           ap.appendChild(divz)
           let loginForm=document.getElementById('loginForm')

           let registrationForm=document.getElementById('registrationForm')
           const homeView = document.querySelector(".home-view");
           
           let register= document.querySelector(".registration")
           let closeForm=document.querySelector("#close-register-form")
        
            registrationForm.addEventListener('submit', handleRegistration);
            loginForm.addEventListener('submit', handleLogin);
            
            document.querySelector(".button-new-account").addEventListener("click", function(event){
                homeView.style.display="none"
                register.style.display="block"
                createNewAccount(registrationForm)
            })

            closeForm.addEventListener("click", function(){
                register.style.display="none"
                homeView.style.display="flex"
              
               
            })
         
        }   
       
    
    })
    .catch(error => console.error('Erreur:', error));




});





function loadNotFoundPage(container) {
    container.innerHTML = '<h1>Page non trouvée</h1>';
}











function handleRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
   
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

    let errPassword = document.querySelector(".messageErrorPassword")
    let errNickname = document.querySelector(".messageErrorNickname")
    let errEmail = document.querySelector(".messageErrorEmail")
    let errFirstName = document.querySelector(".messageErrorFName")
    let errLastName = document.querySelector(".messageErrorLName")
    let errAge = document.querySelector(".messageErrorAge")
    let errGender= document.querySelector(".messageErrorGender")
    // let errorStyle= document.querySelectorAll(".errorStyle")
    
   

    fetch('http://localhost:8081/register', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json', 
       },
       body: JSON.stringify(newUser),
     
   })
   .then(response => {
       if (response.ok) {
        const homeView = document.querySelector(".home-view");
        let register= document.querySelector(".registration")
        register.remove()
        homeView.style.display="flex"
      
       
        } else {

           
            // console.log(response.status);
            // window.location.hash = '#createNewAccount';
            registrationForm.reset();

            return response.json();
        //    console.error('Erreur lors de la création de l\'utilisateur:', response.status);
        }
    })
    .then(response => { 
        // response.JSON()
       
        if (response['error_class']==="errNickname"){
            errNickname.innerHTML=response['message']
        }else if (response['error_class']==="errAge"){
            errAge.innerHTML=response['message']
        }else if (response['error_class']==="errGender"){
            errGender.innerHTML=response['message']
        }else if (response['error_class']==="errLastName"){
            errLastName.innerHTML=response['message']
        }else if (response['error_class']==="errFirstName"){
            errFirstName.innerHTML=response['message']
        }else if (response['error_class']==="errEmail"){
            errEmail.innerHTML=response['message']
        }else if (response['error_class']==="errPassword"){
            errPassword.innerHTML=response['message']
        }else if (response['error_class']==="errEmailorNickname"){
            errNickname.innerHTML=response['message']
            errEmail.innerHTML=response['message']
        }
        
        setTimeout(function() {
            errPassword.innerHTML = '';
            errNickname.innerHTML= ''
            errEmail.innerHTML=''
            errFirstName.innerHTML=''
            errLastName.innerHTML=''
            errAge.innerHTML=''
            errGender.innerHTML=''
            
        }, 5000);
      ;


    })
 
   .catch(error => console.error('Erreur lors de la création de l\'utilisateur:', error));
  
   
}




// Fonction pour gérer la connexion
async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    let logRequest = {
        EmailOrUsername: formData.get("email-nickname"),
        Password: formData.get("password")
    }

    try {
        const response = await fetch('http://localhost:8081/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logRequest),
        });

        if (response.ok) {
            ap.remove()
            loadConnexionPage(app)
        } else {
            const data = await response.json();
            let logNotMatch = document.querySelector(".logNotMatch");
            
            if (data['error_class'] === "logNotMatch") {
                logNotMatch.innerHTML = data['message']
            }
            

            setTimeout(function () {
            
                logNotMatch.innerHTML = ''
            }, 5000);
        }
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
    }
}