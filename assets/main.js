
let app=document.getElementById('connexion')


let ap=document.getElementById('enter')




import { renderCommentForm } from './components/commentForm.js'
import {createNewAccount} from './components/createNewAccount.js'
import {displayCategories, headerPage, loadConnexionPage} from './components/forum.js'
import { sendForm } from './components/loginForm.js'
import {createPostbutton, fetchPosthtml, postForm} from './components/postForm.js'



document.addEventListener('DOMContentLoaded', () => {

    
    fetch('http://localhost:8081/auth')
    .then(response => response.json())
    .then(data => {
        

        if (data.IsAuth){
            handleSuccessfulLogin(data) 
        
        }else{
           
           sendForm(ap)
           let loginForm=document.getElementById('loginForm')

           let registrationForm=document.getElementById('registrationForm')
           const homeView = document.querySelector(".home-view");
           
           let register= document.querySelector(".registration")
           let closeForm=document.querySelector("#close-register-form")
        
           if (registrationForm) registrationForm.addEventListener('submit', handleRegistration);
           if (loginForm) loginForm.addEventListener('submit', handleLogin);
            
            let creatNewacc=document.querySelector(".button-new-account")

            if (creatNewacc) creatNewacc.addEventListener("click", function(){
                homeView.style.display="none"
                register.style.display="block"
                createNewAccount(registrationForm)
            })
            

            if (closeForm) closeForm.addEventListener("click", function(){
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


function handleComment(event, userId){
    event.preventDefault();
    console.log('yes')
    
    const formData = new FormData(event.target);
   
    let newComment={
        UserId :parseInt(userId),
        Content: formData.get("content"),
        Post_id:parseInt(formData.get("post_id")),
        
    } 
    
    fetch('http://localhost:8081/createComment', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json', 
       },
       body: JSON.stringify(newComment),
     
    })
   .then(response => {
       if (response.ok) {
            console.log(newComment);
           
        } else {       

            return response.json();
        }
    })
    .then(response => { 
       
       if (response){
        console.log("ici");
        let emptyContent= document.querySelector(".EmptyContent")
        if (response['error_class']==="emptycomment"){
            emptyContent.innerHTML=response['message']
        }
        setTimeout(() => {
            emptyContent.innerHTML=''
        }, 5000);
    }
    //         errNickname.innerHTML=response['message']
    //     }else if (response['error_class']==="errAge"){
    //         errAge.innerHTML=response['message']
    //     }else if (response['error_class']==="errGender"){
    //         errGender.innerHTML=response['message']
    //     }else if (response['error_class']==="errLastName"){
    //         errLastName.innerHTML=response['message']
    //     }else if (response['error_class']==="errFirstName"){
    //         errFirstName.innerHTML=response['message']
    //     }else if (response['error_class']==="errEmail"){
    //         errEmail.innerHTML=response['message']
    //     }else if (response['error_class']==="errPassword"){
    //         errPassword.innerHTML=response['message']
    //     }else if (response['error_class']==="errEmailorNickname"){
    //         errNickname.innerHTML=response['message']
    //         errEmail.innerHTML=response['message']
    //     }
        
    //     setTimeout(function() {
    //         errPassword.innerHTML = '';
    //         errNickname.innerHTML= ''
    //         errEmail.innerHTML=''
    //         errFirstName.innerHTML=''
    //         errLastName.innerHTML=''
    //         errAge.innerHTML=''
    //         errGender.innerHTML=''
            
    //     }, 5000);
    //   ;
    //    }
       


    })
 
   .catch(error => console.error('Erreur lors de la création de l\'utilisateur:', error));
  
}

function handleSuccessfulLogin(data) {
   
    ap.style.display="none";
    headerPage(app);
    let main=document.createElement('div');
    let center=document.createElement('div')
    center.classList.add('center');

    main.classList.add('main');
    displayCategories(main, data.User.FirstName, data.User.LastName);
    createPostbutton(center, data.User.NickName)
    

    fetch('http://localhost:8081/fetchPost')
    .then(response => response.json())
    .then(response => {
        
        // postImage, friendName, postTime, postText, likeCount, commentCount, title, category

        for (let i=0; i<response.length;i++){

            let essai=document.createElement('div');
            const postHtml = fetchPosthtml(
                response[i].Post_id,
                './assets/imageUpload/'+response[i].ImageName,
                response[i].NickName,
                '16h.',
                response[i].Content,
                response[i].Nbrlike + ' Likes',
                response[i].NbrComments,      
                response[i].Title,
               
                response[i].Category,
                
            );
            essai.innerHTML=postHtml
            center.appendChild(essai)
          
        }
      
        

        
        let commentButtons = document.querySelectorAll('.comment_btn');
       
        
        for (let i = 0; i < commentButtons.length; i++) {
           let commentButton = commentButtons[i];
           
            

           commentButton.addEventListener("click", (event) => {
               let postId = commentButton.querySelector('input[name="post_id"]').value;
               let addComment = document.querySelector(`.addComment_${postId}`);

               event.preventDefault();
               renderCommentForm(addComment, postId)
               
               if (addComment.style.display !== 'block') {
                   addComment.style.display = 'block';
               } else {
                   addComment.style.display = 'none';
               }

                let commentForms=document.querySelector(`.commentform-${postId}`)
                
               console.log(commentForms);
                let containerComment=document.createElement('div')
                containerComment.classList.add("containerComment")
                commentForms.addEventListener('submit', function(event) {
                    
                    handleComment(event, data.User.Id);
                    event.target.reset();
                    fetchComment(containerComment, postId)
                  

                });
                

               
                fetchComment(containerComment , postId)
                addComment.appendChild(containerComment)
                
                
           });
        }
        
     
       
       
        // if (data.IsAuth){
           
        
        // }else{
             
         
        // }   
       
    
    })
    .catch(error => console.error('Erreur:', error));




    let postform= document.createElement('div')


    main.appendChild(center)
    app.appendChild(postform)
    app.appendChild(main);

    let showPostForm= document.querySelector(".showPostForm")
    if (showPostForm) showPostForm.addEventListener("click", function(event){
        postform.style.display='block'

        postform.style.position = "relative"
        postform.style.top = "0px"
        postForm(postform, data.User.Id)

        let closeForm=document.querySelector(".btn-close")
        
        if (closeForm) closeForm.addEventListener("click", function(){
            postform.style.display='none'
          
       })

       let postForms=document.querySelector("#postForm")
       if (postForms) {
            postForms.addEventListener('submit', function(event) {
                handleCreatePost(event, postform);
            });
       }
      
    })

    

    let logoutHeader=document.getElementById("logoutHeader");
    if (logoutHeader) logoutHeader.addEventListener("click",()=>{
        logout(ap);
    });

}



function fetchComment(addcomment, postId){

    fetch(`http://localhost:8081/fetchComment/${postId}`)
    .then(response => response.json())
    .then(data => {
        addcomment.innerHTML=''

        for (let p=0;p<data.length;p++){
            let comment=data[p]

            let mainComment= document.createElement('div')
            mainComment.classList.add("mainComment")


            let commentProfile= document.createElement('div')
            commentProfile.classList.add("commentProfile")

            let iconeProfile= document.createElement('div')
            iconeProfile.innerHTML=`<div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                                        <i class="fa-solid fa-user" ></i>
                                     </div>`
            iconeProfile.classList.add("iconeProfile")
        
            let userComment= document.createElement('p')
            userComment.classList.add("userComment")
            userComment.innerText=`${comment.NickName} :`
            commentProfile.append(iconeProfile,userComment);
            // commentProfile.appendChild(userComment);

            let contentComment= document.createElement('div')
            let pContent= document.createElement('p')

            contentComment.classList.add("contentComment")

            pContent.innerText=`${comment.Content}`
            contentComment.appendChild(pContent)
            mainComment.appendChild(commentProfile)
            mainComment.appendChild(contentComment)


          
           
            addcomment.appendChild(mainComment)
            
        }
 
        
    
    })
    .catch(error => console.error('Erreur:', error));


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
   
            registrationForm.reset();

            return response.json();
        //    console.error('Erreur lors de la création de l\'utilisateur:', response.status);
        }
    })
    .then(response => { 
        // response.JSON()
       if (response){
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
       }
       


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
            // handleSuccessfulLogin(await response.json());
            ap.style.display="none"
            app.style.display="block"
            fetch('http://localhost:8081/auth')
            .then(response => response.json())
            .then(data => {
                if (data.IsAuth){
                    handleSuccessfulLogin(data) 

                }  
            
            })
            .catch(error => console.error('Erreur:', error));
            
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


async function logout(ap) {
    
    try {
        const response = await fetch('http://localhost:8081/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            
        });

        if (response.ok) {
            
            app.style.display="none"
            ap.style.display="block"
            sendForm(ap)
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


            // loadConnexionPage(app)
        } else {
           
        
        }
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
    }
}

function handleCreatePost(event, postform) {
    event.preventDefault();
    const formData = new FormData(event.target);
   
    let postContent = {
        User_id: parseInt(formData.get("user_id")),    
        Title: formData.get("title"),
        Content: formData.get("content"),     
        Category: Array.from(formData.getAll("cat")).map(Number),
    }
    
    let file = document.querySelector('input[type="file"]').files[0];
    let reader = new FileReader();

    reader.onloadend = function() {
        let base64File = reader.result
        console.log(base64File)
        if (file) {
            postContent.Image = base64File;
        }

        fetch('http://localhost:8081/createPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(postContent),
        })
        .then(response => {
            if (response.ok) {
                postform.style.display = 'none';
                
            } else {
                return response.json();
            }
        })
        .then(errorResponse => {
            if (errorResponse) {
               
                
                switch (errorResponse ['error_class']) {
                    case 'categoryNofound':
                        showError(".messageErrorCategorie", errorResponse['message']);
                        break;
                    case 'titleNoFound':
                        showError(".messageErrorTitle", errorResponse['message']);
                        break;
                    case 'contentNofound':
                        showError(".messageErrorContent", errorResponse['message']);
                        break;
                    case 'imageNoCorrect':
                        showError(".messageErrorImage", errorResponse['message']);
                        break;
                    default:
                        console.error('Erreur inattendue:', errorResponse);
                }
            }
        })
        .catch(error => {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
        });
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        reader.onloadend();
    }
}

function showError(selector, message) {
    let errorElement = document.querySelector(selector);
    errorElement.innerHTML = message;
    setTimeout(() => {
        errorElement.innerHTML = '';
    }, 5000);
}

