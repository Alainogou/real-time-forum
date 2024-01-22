
let app=document.getElementById('connexion')


let ap=document.getElementById('enter')




import { renderCommentForm } from './components/commentForm.js'
import {createNewAccount} from './components/createNewAccount.js'
import {Messenger, displayCategories, headerPage, loadConnexionPage} from './components/forum.js'
import { sendForm } from './components/loginForm.js'
import {createPostbutton, fetchPosthtml, postForm} from './components/postForm.js'
import { FormMessage } from './components/privateMessages.js'





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
       
        let emptyContent= document.querySelector(".EmptyContent")
        if (response['error_class']==="emptycomment"){
            emptyContent.innerHTML=response['message']
        }
        setTimeout(() => {
            emptyContent.innerHTML=''
        }, 5000);
    }
   
       

    })
 
   .catch(error => console.error('Erreur lors de la création de l\'utilisateur:', error));
  
}


function handleSuccessfulLogin(data) {
   
    ap.style.display="none";
    headerPage(app);
    let main=document.createElement('div');
    let right = document.createElement('div');
    let center=document.createElement('div')
    center.classList.add('center');

    right.classList.add('right');
    main.classList.add('main');
    

    let globalPosts= document.createElement('div')
    globalPosts.classList.add('mainPost')
   

    
    displayCategories(main, data.User.FirstName, data.User.LastName);
    createPostbutton(center, data.User.NickName)
   
   
    fetchPost(globalPosts,data.User.Id)
   
    let postform= document.createElement('div')

    center.appendChild(globalPosts)
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
        logout(ap, data.User.NickName);
    });

    
    const socket = new WebSocket('ws://localhost:8081/ws');

    socket.onopen = (event) => {
        let message = JSON.stringify({NickName: data.User.NickName});
        socket.send(message);
        console.log('WebSocket connection opened');
    };

     // Écoutez les messages entrants
    socket.onmessage = function(event) {
        right.innerHTML=''

        let msg = JSON.parse(event.data);
        console.log('il y a un message entrant')
        let div = document.createElement('div');
        div.className = 'third_warpper';
         
        let contactTagDiv = document.createElement('div');
        contactTagDiv.classsName = 'contact_tag';
        let h2 = document.createElement('h2');
        h2.innerText = 'Contacts';
        contactTagDiv.appendChild(h2);
        div.appendChild(contactTagDiv);
        
        
            
            for (let k=0;k<msg.AllUser.length;k++){
                if (msg.AllUser[k].NickName !== data.User.NickName){
                Messenger(div, msg.AllUser[k].NickName + "  " + msg.AllUser[k].Status )
                
                setTimeout(() => {
                    let contact = document.querySelector(`.contact-${msg.AllUser[k].NickName}`)
                    
            
                    contact.addEventListener("click",()=>{
                        console.log("contact clicked");
                       
                
                       

                        fetchPrivateMessage(data.User.NickName, msg.AllUser[k].NickName) 
                        let messageFormId = document.querySelector(`#receved-${msg.AllUser[k].NickName}`)
                        
                        if (messageFormId){
                            messageFormId.addEventListener("submit",(event) =>{
                                handleMessage(event,data.User.NickName);
                                console.log('yes sent message');
                            })
                        }
                        let closeMesenger= document.querySelector(`.btn-close2-${msg.AllUser[k].NickName}`)
                        if (closeMesenger) closeMesenger.addEventListener("click",()=>{
                            
                            let clickClose = document.querySelector(`.chat-card-${msg.AllUser[k].NickName}`)
                            clickClose.remove()
                        })
                    })

                   
                }, 1000);

            }
            }
            
       
        right.appendChild(div)
    };
           

    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
        console.log(`WebSocket error: ${error}`);
    };

   
    
   
    main.appendChild(right);
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

// function fetchPrivateMessage(userFrom, toUser){

//     fetch(`http://localhost:8081/fetchPrivateMessage/${userFrom}+${toUser}`)
//     .then(response => response.json())
//     .then(data => {
//     console.log("alo",data);
   
//     console.log("userFrom from API response:", data.userFrom);

        
    
//     })
//     .catch(error => console.error('Erreur:', error));


// }

function fetchPrivateMessage(userFrom, toUser){
    // Assuming 'right' is the container where the chat should be displayed
    
    var divsRight = document.querySelectorAll('.right');
    let right=divsRight[1]
    // right.classList.add('right');
        // Append 'right' to the DOM if it's not already there
        // For example, document.body.appendChild(right);
    

    fetch(`http://localhost:8081/fetchPrivateMessage/${userFrom}+${toUser}`)
    .then(response => response.json())
    .then(data => {
        console.log("data from API response:", data);

        // Combine the received and sent messages into one array
        let allMessages = [...data.UserReceiver, ...data.UserForum];

        // Call FormMessage with the combined messages array
        FormMessage(right, toUser, allMessages);
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


function fetchPost  (globalPosts,UserId) {
    globalPosts.innerHTML=''
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
            globalPosts.appendChild(essai)
            setupLikeButton(response[i].Post_id);

          
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
                
               
                let containerComment=document.createElement('div')
                containerComment.classList.add("containerComment")
                commentForms.addEventListener('submit', function(event) {
                    
                    handleComment(event, UserId);
                    event.target.reset();
                    fetchComment(containerComment, postId)
                    let commentNumber= document.getElementById(`commentNumber-${postId}`)
                    console.log(commentNumber.textContent);
                    commentNumber.innerText= parseInt(commentNumber.textContent ) + 1 
                  

                });
                

               
                fetchComment(containerComment , postId)
                addComment.appendChild(containerComment)
                
                
           });
        }
       
    
    })
    .catch(error => console.error('Erreur:', error));


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


async function logout(ap, userName) {
    let userDeconn = {
      NickName: userName,
    }
    try {
        const response = await fetch('http://localhost:8081/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userDeconn),
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
   
    let userid= parseInt(formData.get("user_id"))
    let postContent = {
        User_id: userid,    
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
                let globalPosts=document.querySelector('.mainPost')
                fetchPost(globalPosts, userid)
                
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

function handleMessage(event, nickname){

    

    event.preventDefault();
    console.log('yes')
    
    const formData = new FormData(event.target);
   
    let newMessage = {
        FromUser: nickname,
        Message: formData.get("messagePrivite"),
        ToUser: formData.get("send-Name"),
        CreateDate: new Date().toISOString() // This will set the current date and time in ISO format
    };

    
    
    fetch('http://localhost:8081/CreateMessage', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json', 
       },
       body: JSON.stringify(newMessage),
     
    })
   .then(response => {
       if (response.ok) {
            console.log("oo",newMessage);

            // const chatBody = container.querySelector('.chat-body');
            // const newMessageDiv = document.querySelector('.outgoing');
            // // newMessageDiv.classList.add('message', 'outgoing');
            // newMessageDiv.innerHTML = `<p>${newMessage.Message}</p>`;
            // chatBody.appendChild(newMessageDiv);

            // // Optionally, clear the message input field
            // form.querySelector('input[name="messagePrivite"]').value = '';
           
        } else {       

            return response.json();
        }
    })
    .then(response => { 
       
       if (response){
       
        // let emptyContent= document.querySelector(".EmptyContent")
        // if (response['error_class']==="emptycomment"){
        //     emptyContent.innerHTML=response['message']
        // }
        // setTimeout(() => {
        //     emptyContent.innerHTML=''
        // }, 5000);
    }
   
       

    })
 
   .catch(error => console.error('Erreur lors de la création de l\'utilisateur:', error));
  

}


// export const FormMessage = (container, nickname) => {
//     // ... (existing code to create and append the form)

//     // Add the event listener for form submission
//     let form = document.querySelector(`#receved-${nickname}`);
//     if (form) {
//         form.addEventListener('submit', (event) => {
//             event.preventDefault(); // Prevent the default form submission behavior

//             const formData = new FormData(event.target); // Get the form data

//             // Create the message object
//             let newMessage = {
//                 FromUser: nickname,
//                 Message: formData.get("messagePrivite"),
//                 ToUser: formData.get("send-Name"),
//                 CreateDate: new Date().toISOString() // Set the current date and time
//             };

//             // Send the message to the server
//             fetch('http://localhost:8081/CreateMessage', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(newMessage) // Convert the message object to a JSON string
//             })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.success) {
//                     // Update the chat UI to include the new message
//                     const chatBody = container.querySelector('.chat-body');
//                     const newMessageDiv = document.createElement('div');
//                     newMessageDiv.classList.add('message', 'outgoing');
//                     newMessageDiv.innerHTML = `<p>${newMessage.Message}</p>`;
//                     chatBody.appendChild(newMessageDiv);

//                     // Optionally, clear the message input field
//                     form.querySelector('input[name="messagePrivite"]').value = '';
//                 } else {
//                     // Handle any errors, such as displaying an error message to the user
//                     console.error('Error sending message:', data.error);
//                 }
//             })
//             .catch(error => {
//                 console.error('Error sending message:', error);
//             });
//         });
//     }
// }

// function setupLikeButton(postId) {
//     console.log("fjff");
//     var likeButton = document.getElementById('likeButton-' + postId);
//     if (likeButton) {
//         likeButton.addEventListener('click', function() {
//             var likeIcon = this;
//             var likeCountElement = document.getElementById('likeCount-' + postId);
//             var likeCount = parseInt(likeCountElement.textContent, 10);
//             var isLiked = likeIcon.getAttribute('data-liked') === 'true';

//             if (isLiked) {
//                 likeCount -= 1;
//                 likeIcon.setAttribute('data-liked', 'false');
//                 likeIcon.classList.remove('liked');
//             } else {
//                 likeCount += 1;
//                 likeIcon.setAttribute('data-liked', 'true');
//                 likeIcon.classList.add('liked');
//             }

//             likeCountElement.textContent = likeCount + " Likes";
//             localStorage.setItem('likeCount-' + postId, likeCount);
//         });
        
//         // When the page loads, retrieve the like counts from local storage and update the UI
//         window.addEventListener('load', function() {
//             var likeButtons = document.querySelectorAll('[id^="likeButton-"]');
//             likeButtons.forEach(function(button) {
//                 var postId = button.id.split('-')[1];
//                 var storedLikeCount = localStorage.getItem('likeCount-' + postId);
//                 if (storedLikeCount) {
//                     var likeCountElement = document.getElementById('likeCount-' + postId);
//                     likeCountElement.textContent = storedLikeCount;
//                 }
//             });
//         });
//     }
// }

// Cette fonction configure le bouton "J'aime" pour un post spécifique.
function setupLikeButton(postId) {
    var likeButton = document.getElementById('likeButton-' + postId);
    var likeCountElement = document.getElementById('likeCount-' + postId);

    // Récupérer l'état "aimé" et le nombre de likes du localStorage
    var isLiked = localStorage.getItem('liked-' + postId) === 'true';
    var likeCount = parseInt(localStorage.getItem('likeCount-' + postId)) || 0;

    // Mettre à jour l'interface utilisateur avec les valeurs récupérées
    likeCountElement.textContent = likeCount + ' Likes';
    likeButton.setAttribute('data-liked', isLiked.toString());
    likeButton.classList.toggle('liked', isLiked);

    // Ajouter un écouteur d'événements pour gérer les clics sur le bouton "J'aime"
    likeButton.addEventListener('click', function() {
        isLiked = !isLiked;
        likeCount = isLiked ? likeCount + 1 : likeCount - 1;

        // Mettre à jour l'interface utilisateur
        likeCountElement.textContent = likeCount + ' Likes';
        likeButton.setAttribute('data-liked', isLiked.toString());
        likeButton.classList.toggle('liked', isLiked);

        // Mettre à jour le localStorage avec le nouvel état et le nouveau nombre de likes
        localStorage.setItem('liked-' + postId, isLiked.toString());
        localStorage.setItem('likeCount-' + postId, likeCount.toString());
    });
}

// Appeler setupLikeButton pour chaque post lorsque la page est chargée.
document.addEventListener('DOMContentLoaded', function() {
    var likeButtons = document.querySelectorAll('[id^="likeButton-"]');
    likeButtons.forEach(function(button) {
        var postId = button.id.split('-')[1];
        setupLikeButton(postId);
    });
});