


export const FormMessage = (premierDiv, toUser, userFrom, messageRecu, messageEnvoyer) => {
    // Combine les messages reçus et envoyés dans un seul tableau
    let allMessages = messageRecu.concat(messageEnvoyer);

    // Triez tous les messages par CreateDate la plus récente
    allMessages.sort((a, b) => new Date(b.CreateDate) - new Date(a.CreateDate));

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

    // Ajoutez les messages triés au HTML
    allMessages.forEach((message) => {
        let messageClass = message.FromUser === userFrom ? 'outgoing' : 'incoming';
        chatHTML = `
            <div class="${messageClass}">
                <p class="ss">${message.ContentMessage}</p>
                <span>${messageClass === 'outgoing' ? userFrom : toUser}</span>
            </div>`+ chatHTML;
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
};

