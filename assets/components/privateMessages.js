// export const  FormMessage=(container, nickname )=>{
//  let premierDiv= document.createElement('div');
//  premierDiv.classList.add('chat-card');
//  premierDiv.classList.add(`chat-card-${nickname}`);

//     premierDiv.innerHTML =`
           
//             <div class="chat-header">
//             <div class="h2">
//                 <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
//                     <i class="fa-solid fa-user" ></i>
//                 </div>
//                 <p>${nickname}  </p>
//                 <button class="btn-close2 btn-close2-${nickname}" >X</button>
//             </div>
//             </div>
//             <div class="chat-body">
//             <div class="messageRecu">
//                 <p>Hello, how can I assist you today?</p>
//             </div>
//             <div class="messageEnvoyer">
//                 <p>I have a question about your services.</p>
//             </div>
//             <div class="message incoming">
//                 <p>Sure, I'm here to help. What would you like to know?</p>
//             </div>
            
//             </div>
//             <form  enctype="multipart/form-data" id="receved-${nickname}"  >
//             <input type="hidden" name="send-Name" value="${nickname}">


//             <div class="chat-footer">
//             <input placeholder="Type your message" type="text" name="messagePrivite">
//             <button>Send</button>
//             </div>
//             </form>
 
  
//     `
//     container.appendChild(premierDiv)
// }
// export const FormMessage = (container, nickname, messagesReceived, messagesSent) => {

//     console.log("hbbfl.f");
//     let premierDiv = document.createElement('div');
//     premierDiv.classList.add('chat-card');
//     premierDiv.classList.add(`chat-card-${nickname}`);

//     // Commencez par créer le HTML de base pour le chat
//     let chatHTML = `
//         <div class="chat-header">
//             <div class="h2">
//                 <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
//                     <i class="fa-solid fa-user"></i>
//                 </div>
//                 <p>${nickname}</p>
//                 <button class="btn-close2 btn-close2-${nickname}">X</button>
//             </div>
//         </div>
//         <div class="chat-body">`;

//     // Ajoutez les messages reçus au HTML
//     messagesReceived.forEach((message) => {
//         chatHTML += `
//             <div class="message incoming">
//                 <p>${message.ContentMessage}</p>
//             </div>`;
//     });

//     // Ajoutez les messages envoyés au HTML
//     messagesSent.forEach((message) => {
//         chatHTML += `
//             <div class="message outgoing">
//                 <p>${message.ContentMessage}</p>
//             </div>`;
//     });

//     // Terminez le HTML avec le formulaire de saisie de message
//     chatHTML += `
//         </div>
//         <form enctype="multipart/form-data" id="receved-${nickname}">
//             <input type="hidden" name="send-Name" value="${nickname}">
//             <div class="chat-footer">
//                 <input placeholder="Type your message" type="text" name="messagePrivite">
//                 <button>Send</button>
//             </div>
//         </form>`;

//     // Définissez le HTML interne de premierDiv et ajoutez-le au conteneur
//     premierDiv.innerHTML = chatHTML;
//     container.appendChild(premierDiv);
// };

export const FormMessage = (container, toUser,userFrom, messageRecu ,messageEnvoyer) => {
    
    let premierDiv = document.createElement('div');
    premierDiv.classList.add('chat-card');
    premierDiv.classList.add(`chat-card-${toUser}`);

    // Triez les messages par date de création
    messageRecu.sort((a, b) => new Date(b.CreateDate) - new Date(a.CreateDate));

    // Créez le HTML de base pour le chat
    let chatHTML = `
        <div class="chat-header">
            <div class="h2">
                <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                    <i class="fa-solid fa-user"></i>
                </div>
                <p>${toUser}</p>
                <button class="btn-close2 btn-close2-${toUser}">X</button>
            </div>
        </div>
        <div class="chat-body">`;

    // Ajoutez les messages au HTML
    messageRecu.forEach((message) => {
        chatHTML += `
            <div class="${message.UserReceiver} message incoming">
                    

                <p class= "ss">${message.ContentMessage} </p>
                <span>${toUser}</span>
            </div>`

    });

    messageEnvoyer.forEach((message) => {
        chatHTML += `
        <div class="${message.UserForum} message outgoing">
                    

        <p class= "ss">${message.ContentMessage} </p>
        <span>${userFrom}</span>
    </div>`;

    });

 
    // Terminez le HTML avec le formulaire de saisie de message
    chatHTML += `
        </div>
        <form enctype="multipart/form-data" class="receved-${toUser}">
            <input type="hidden" name="send-Name" value="${userFrom}">
            <div class="chat-footer">
                <input placeholder="Type your message" type="text" name="messagePrivite">
                <button>Send</button>
            </div>
        </form>`;

    // Définissez le HTML interne de premierDiv et ajoutez-le au conteneur
    premierDiv.innerHTML = chatHTML;
    container.appendChild(premierDiv);
};

// messages.forEach((message) => {
//     // let divClass = message.UserForum ? 'message outgoing' : message.UserReceiver ? 'message incoming' : 'message';

//     chatHTML += `
//         <div class="${divClass}">
//             <p class= "ss">${message.ContentMessage}</p>
//         </div>`; 
// });
