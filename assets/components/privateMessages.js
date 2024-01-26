


// export const FormMessage = (premierDiv, toUser, userFrom, messageRecu, messageEnvoyer) => {
//     // Combine les messages reçus et envoyés dans un seul tableau
//     let allMessages = messageRecu.concat(messageEnvoyer);

//     // Triez tous les messages par CreateDate la plus récente
//     allMessages.sort((a, b) => new Date(a.CreateDate) - new Date(b.CreateDate));

//     // Créez le HTML de base pour le chat
//     let chatHTML = `
//         <div class="chat-header">
//             <div class="h2">
//                 <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
//                     <i class="fa-solid fa-user"></i>
//                 </div>
//                 <p>${toUser}</p>
//                 <button class="btn-close2 btn-close2-${toUser}">X</button>
//             </div>
//         </div>
//         <div class="chat-body">`;

//     // Ajoutez les messages triés au HTML
//     allMessages.forEach((message) => {
        // let messageClass = message.FromUser === userFrom ? 'outgoing' : 'incoming';
        // let formattedDate = new Date(message.CreateDate).toLocaleString(); // Format the date to a readable format

        // chatHTML += `
        //     <div class=" messageSMS ${messageClass}">
        //       <div class="contentMessage">
        //         <p class="message-conten">${message.ContentMessage}</p>
        //         <span class="message-sender">${messageClass === 'outgoing' ? userFrom : toUser}</span>

        //         </div>
                

        //     </div>`;
        //     chatHTML += `
        //     <div class="message-date">${formattedDate}</div> `
//     });

//     // Terminez le HTML avec le formulaire de saisie de message
//     chatHTML += `
//         </div>
//         <form enctype="multipart/form-data" class="receved-${toUser}">
//             <input type="hidden" name="send-Name" value="${userFrom}">
//             <div class="chat-footer">
//                 <input placeholder="Type your message" type="text" name="messagePrivite">
//                 <button>Send</button>
//             </div>
//         </form>`;

//     // Définissez le HTML interne de premierDiv et ajoutez-le au conteneur
//     premierDiv.innerHTML = chatHTML;
// };





export const FormMessage = (right, toUser, userFrom, messageRecu, messageEnvoyer) => {
    // Initialize the chat body
    let spinner=document.createElement('div');
    spinner.classList.add('spinner');
    spinner.classList.add('center')
   
    spinner.style.display='none'

    let premierDiv = document.createElement('div');
    premierDiv.classList.add('chat-card');
    premierDiv.classList.add(`chat-card-${toUser}`);

    let chatBody = document.createElement('div');
    chatBody.className = 'chat-body';

    let allMessages = messageRecu.concat(messageEnvoyer);
    allMessages.sort((a, b) => new Date(a.CreateDate) - new Date(b.CreateDate));

  
    if (allMessages.length<10){
        loadMessages(0,allMessages.length, chatBody, allMessages, userFrom);
    }else{
      
        loadMessages(0, 10, chatBody, allMessages, userFrom)
        chatBody.scrollTop = chatBody.scrollHeight;
        
        var countLoader=0;
        chatBody.addEventListener('scroll',(event)=>{
            if (event.target.scrollTop === 0) {
                let scrollHeightBefore = chatBody.scrollHeight;
                if (countLoader==0) {   
                    spinner.style.display='block'                     
                    countLoader++;
                }

                setTimeout(() => {                        
                    spinner.style.display='none'
                    countLoader=0;
                }, 499);
            
                let scrollHeightAfter = chatBody.scrollHeight;
                chatBody.scrollTop = chatBody.scrollTop + (scrollHeightAfter - scrollHeightBefore);
            }
        });

        allMessages=allMessages.slice(10, allMessages.length)
        console.log(allMessages.length)
        chatBody.addEventListener('scroll', throttle((event) => {
        // Check if user has scrolled to the top
            if (event.target.scrollTop === 0) {
                let scrollHeightBefore = chatBody.scrollHeight;
                loadMessages(0, Math.min(10, allMessages.length), chatBody, allMessages, userFrom)
                
                
                allMessages=allMessages.slice(Math.min(10, allMessages.length), allMessages.length)
                console.log(allMessages.length, allMessages, "tyo c'estyyyyy")

                // Adjust scroll position to prevent jumping
                let scrollHeightAfter = chatBody.scrollHeight;
                chatBody.scrollTop = chatBody.scrollTop + (scrollHeightAfter - scrollHeightBefore);
            }
        }, 500));

    }

     // Create the chat header
     let chatHeader = document.createElement('div');
     chatHeader.className = 'chat-header';
     chatHeader.innerHTML = `
         <div class="h2">
             <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                 <i class="fa-solid fa-user"></i>   
             </div>
             <p>${toUser}</p>
             <button class="btn-close2 btn-close2-${toUser}">X</button>
         </div>
     `;
 
     // Create the chat footer
     let chatFooter = document.createElement("div");
     chatFooter.innerHTML=` 
             <form enctype="multipart/form-data" class="receved-${toUser}">
                <input type="hidden" name="send-Name" value="${userFrom}">
                <div class="chat-footer">
                    <input placeholder="Type your message" type="text" name="messagePrivite">
                    <button>Send</button>
                </div>
            </form>
            
    `
 
     
     // Append everything to the premierDiv
     premierDiv.appendChild(chatHeader);
     premierDiv.appendChild(spinner)
     premierDiv.appendChild(chatBody);
     premierDiv.appendChild(chatFooter);
     right.appendChild(premierDiv);
 
};

function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

function loadMessages (startIndex , limit, chatBody , messages, userFrom) {
       
    for (let i = startIndex; i <  limit; i++) {
        let message = messages[i];
       
        let messageElement = document.createElement('div');
        messageElement.classList.add( message.FromUser === userFrom ? 'outgoing' : 'incoming');

        messageElement.classList.add('messageSMS')
        let contentMessage = document.createElement('div');
        contentMessage.classList.add("contentMessage")

        let contentElement = document.createElement('p');
        contentElement.classList.add( "message-conten");
        contentElement.innerText = `${message.ContentMessage}`;
        let userElement = document.createElement('span');
        userElement.classList.add("message-sender")
        userElement.innerText = `${message.FromUser}`;

        let timeElement = document.createElement('div');
        timeElement.classList.add("message-date")
        timeElement.innerText = `${new Date(message.CreateDate).toLocaleString()}`;

    
        contentMessage.appendChild(contentElement)
        contentMessage.appendChild(userElement)
        messageElement.appendChild(contentMessage);
        
      
        chatBody.appendChild(messageElement);
        chatBody.appendChild(timeElement);
     
    }
};

