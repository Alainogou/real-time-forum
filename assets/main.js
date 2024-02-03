
let app=document.getElementById('connexion')


let ap=document.getElementById('enter')




import { renderCommentForm } from './components/commentForm.js'
import {createNewAccount} from './components/createNewAccount.js'
import {Messenger,  displayCategories, headerPage, loadConnexionPage} from './components/forum.js'
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




function handleComment(event, userId){
    event.preventDefault();
    
    const formData = new FormData(event.target);
    let postId=parseInt(formData.get("post_id"))
    let newComment={
        UserId :parseInt(userId),
        Content: formData.get("content"),
        Post_id:postId,
        
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
            let commentNumber= document.getElementById(`commentNumber-${postId}`)
            commentNumber.innerText= parseInt(commentNumber.textContent ) + 1 
           
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

const alertMessage = (sender, Recipient ,div1) => {
    console.log("alertMessage");
    const div = document.createElement('div');
    div.className = 'notif';

    const span = document.createElement('span');
    span.className = 'welcome_text';

    span.innerHTML = `Hey, <span class="notif-user"> ${Recipient}</span>  you have a new message from <span class="notif-user"> ${sender}</span>`;

    div.appendChild(span);
    div1.appendChild(div);
}
function handleSuccessfulLogin(data) {
   
    ap.style.display="none";
    headerPage(app);
    let main=document.createElement('div');
    let right = document.createElement('div');
    let center=document.createElement('div')
    center.classList.add('center');

    right.classList.add('right');
    right.classList.add('right1');

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

        let closeForm=document.querySelector(`.btn-close`)
        console.log(closeForm);
        
        if (closeForm) closeForm.addEventListener("click", function(){
            postform.style.display='none'
          
       })

       let postForms=document.querySelector("#postForm")
       console.log(postForms)
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
    };

     // Écoutez les messages entrants
    socket.onmessage = function(event) {
        let msg = JSON.parse(event.data);
        console.log(msg);
        

        if (msg.NewConnection){
            let userConnected=document.querySelector(`.rightContact-${msg.PersonConnected}`)
            if (userConnected) {
            userConnected.innerHTML=''
            let img = document.createElement('img');
            img.src = 'assets/image/status-active-svgrepo-com.svg'; 
            img.alt = 'Online';
            img.className = 'status-icon-on'
            userConnected.appendChild(img);
                
            }
        }else if (msg.NewDeconnexion){
            let userConnected=document.querySelector(`.rightContact-${msg.PersonConnected}`)
            if (userConnected) {
            userConnected.innerHTML=''
            let img = document.createElement('img');
            img.src = 'assets/image/status-no-active-svgrepo-com.svg'; // Remplacez par le chemin de votre icône
            img.alt = 'Offline';
            img.className = 'status-icon-off'
           userConnected.appendChild(img)
            }//  PersonConnected string
            
        }else if  (msg.NewMessage===true){    
            console.log("new message");
            let nMsgElement = document.querySelector(`#Nmessage-${msg.PersonConnected}`);
            console.log( "MOMSS", nMsgElement.textContent)
            if (nMsgElement) {
                nMsgElement.innerText= parseInt(nMsgElement.textContent) + 1 
            }
             moveUserToTop(msg.PersonConnected)
            setTimeout(()=>{
               let body= document.querySelector('body')
               alertMessage(msg.PersonConnected,data.User.NickName,body)  
            },1000)
        }else{

            right.innerHTML=''
           
            let div = document.createElement('div');
            div.className = 'third_warpper';
            
            let contactTagDiv = document.createElement('div');
            contactTagDiv.classsName = 'contact_tag';
            let h2 = document.createElement('h2');
            h2.innerText = 'Contacts';
            contactTagDiv.appendChild(h2);
            div.appendChild(contactTagDiv);

            let userlist = document.createElement("div");
            userlist.className = "userlist";
            let AllUser=[...msg.MessageExist, ...msg.NotMessage]
            for (let k=0;k<AllUser.length;k++){
                if (AllUser[k].NickName !== data.User.NickName){
                    Messenger(userlist, AllUser[k].NickName, AllUser[k].Status, AllUser[k].NbreMessages )
                    
                    setTimeout(() => {
                        let contact = document.querySelector(`.contact-${AllUser[k].NickName}`)
                        
                        if (contact) contact.addEventListener("click",()=>{
                            console.log("contact clicked");
                            let premierDive= document.querySelector(`.chat-card-${AllUser[k].NickName}`)
                            if (premierDive) premierDive.remove()

                            let premierDiv = document.createElement('div');
                            premierDiv.classList.add('chat-card');
                            premierDiv.classList.add(`chat-card-${AllUser[k].NickName}`);

                            let messageOpen=document.querySelector(`#Nmessage-${AllUser[k].NickName}`)
                            if (messageOpen) messageOpen.innerHTML="0"
                            
                            
                            chatContainer(AllUser[k].NickName, data.User.NickName, premierDiv)
                            right.appendChild(premierDiv)
                        
                        })

                    
                    }, 1000);

                }
               
            }
            div.appendChild(userlist)
            right.appendChild(div)
        }
        
        
 
       
        
      
    };
           

    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
        console.log(`WebSocket error: ${error}`);
    };

   
    main.appendChild(right);
}

function moveUserToTop(userId) {
    console.log("top");
    const usersDiv = document.querySelector(".userlist");
    const userContainer = document.querySelector(`.contact-${userId}`);
    if (userContainer) {
      console.log("userContainer: ", userContainer);
      usersDiv.removeChild(userContainer);
      usersDiv.insertBefore(userContainer, usersDiv.children[0]);
      // Enregistrer l'ordre des utilisateurs dans localStorage
    
    }
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

function chatContainer(toUser, fromUser, premierDiv)  {
    
    const socket = new WebSocket(`ws://localhost:8081/communication?userFrom=${fromUser}&toUser=${toUser}`);
   
       // Écoutez les messages entrants
    socket.onmessage = function(event) {
        
        let msg = JSON.parse(event.data);
        
        FormMessage(premierDiv, toUser,fromUser, msg.UserReceiver, msg.UserForum);
        

        sendMessage(toUser, fromUser, premierDiv)
        
    };
    
             
    socket.onopen = (event) => {
       
    };

   

    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
        console.log(`WebSocket error: ${error}`);
    };

}

function sendMessage(toUser, fromUser, premierDiv)  {
    

    const socket = new WebSocket(`ws://localhost:8081/privateSocket?userFrom=${fromUser}&toUser=${toUser}`);

    socket.onopen = (event) => {

        let closeMesenger= document.querySelector(`.btn-close2-${toUser}`)
        closeMesenger.addEventListener("click",()=>{
                let clickClose = document.querySelector(`.chat-card-${toUser}`)
                clickClose.remove()
                const messageData = {
                    
                    ToUserClosed:fromUser+toUser
                };
                socket.send(JSON.stringify(messageData))

        })

        let messageFormId = document.querySelector(`.receved-${toUser}`)
       
        if (messageFormId)  messageFormId.addEventListener('submit', (event) => {
            event.preventDefault();
            const messageInput = document.querySelector(`input[name="messagePrivite-${toUser}"]`);

            const message = messageInput.value;
            let emptyMessage = document.querySelector(".emptyMsg")
            if ( message=="") {
                emptyMessage.textContent="Message empty"
                emptyMessage.style.color="red"
                setTimeout(() => {
                    emptyMessage.textContent=""
                }, 3000);
                console.log("Message empty");
            }
            const messageData = {
                FromUser: fromUser,
                ToUser: toUser,
                Message: message,
                CreateDate: new Date().toISOString()
            };
            
            socket.send(JSON.stringify(messageData));
            messageInput.value = ''; // Effacer le champ de saisie après l'envoi
            
            if(message!==""){
                moveUserToTop(toUser)
            }
            
            
          
        });


    };
    
    socket.onmessage = function(event) {
        
        let msg = JSON.parse(event.data);
       
        
        FormMessage(premierDiv, toUser,fromUser, msg.UserReceiver, msg.UserForum);
        let closeMesenger= document.querySelector(`.btn-close2-${toUser}`)
       
        closeMesenger.addEventListener("click",()=>{
                let clickClose = document.querySelector(`.chat-card-${toUser}`)
                clickClose.remove()
                const messageData = {
                    
                    ToUserClosed:fromUser+toUser
                };
                socket.send(JSON.stringify(messageData))
        })
        
       
   
        
        let messageFormId = document.querySelector(`.receved-${toUser}`)
        if (messageFormId)  messageFormId.addEventListener('submit', (event) => {
            event.preventDefault();
            const messageInput = document.querySelector(`input[name="messagePrivite-${toUser}"]`);
            const message = messageInput.value;
            const messageData = {
                FromUser: fromUser,
                ToUser: toUser,
                Message: message,
                CreateDate: new Date().toISOString()
            };
            
            socket.send(JSON.stringify(messageData));
            messageInput.value = ''; // Effacer le champ de saisie après l'envoi
            if(message!==""){
                moveUserToTop(toUser)
            }
          
        });

        
       
    };
    
             
   

   

    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
        console.log(`WebSocket error: ${error}`);
    };

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