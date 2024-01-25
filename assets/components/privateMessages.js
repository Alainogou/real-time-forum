


// export const FormMessage = (premierDiv, toUser, userFrom, messageRecu, messageEnvoyer) => {
//     // Combine les messages reçus et envoyés dans un seul tableau
//     let allMessages = messageRecu.concat(messageEnvoyer);

//     // Triez tous les messages par CreateDate la plus récente
//     allMessages.sort((a, b) => new Date(b.CreateDate) - new Date(a.CreateDate));

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
//         let messageClass = message.FromUser === userFrom ? 'outgoing' : 'incoming';
//         chatHTML = `
//             <div class="${messageClass}">
//                 <p class="ss">${message.ContentMessage}</p>
//                 <span>${messageClass === 'outgoing' ? userFrom : toUser}</span>
//             </div>`+ chatHTML;
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

    // Triez tous les messages par CreateDate la plus récente
    allMessages.sort((a, b) => new Date(b.CreateDate) - new Date(a.CreateDate));

    // Function to fetch and display messages
    const loadMessages = (startIndex = 0, limit = 10) => {
        // Sort the messages by CreateDate
        allMessages.sort((a, b) => new Date(b.CreateDate) - new Date(a.CreateDate));

        // Clear the chat body
    
        // Display the messages
        for (let i = startIndex; i < startIndex + limit && i < allMessages.length; i++) {
            let message = allMessages[i];
            let messageElement = document.createElement('div');
            messageElement.className = message.FromUser === userFrom ? 'outgoing' : 'incoming';

            let contentElement = document.createElement('p');
            contentElement.className = 'ss';
            contentElement.innerText = `${message.ContentMessage}`;

            let timeElement = document.createElement('span');
            timeElement.innerText = `${new Date(message.CreateDate).toLocaleString()}`;

            let userElement = document.createElement('span');
            userElement.innerText = `${message.FromUser}`;

            messageElement.appendChild(contentElement);
            messageElement.appendChild(timeElement);
            messageElement.appendChild(userElement);

            chatBody.appendChild(messageElement);
        }
    };

    // Load initial messages
    loadMessages();


    chatBody.addEventListener('scroll', () => {
        if (chatBody.scrollTop === 0) {
            spinner.style.display='block'
            throttledLoadMessages();
        }
    });

    
    const throttledLoadMessages = throttle(() => {
        const currentMessageCount = chatBody.childNodes.length;
        loadMessages(currentMessageCount, 10);
    }, 2000); // Limite l'exécution à une fois par seconde

    
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
