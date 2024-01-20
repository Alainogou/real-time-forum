export const  FormMessage=(container, nickname )=>{
 let premierDiv= document.createElement('div');
 premierDiv.classList.add('chat-card');
 premierDiv.classList.add(`chat-card-${nickname}`);

    premierDiv.innerHTML =`
           
            <div class="chat-header">
            <div class="h2">
                <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                    <i class="fa-solid fa-user" ></i>
                </div>
                <p>${nickname}  </p>
                <button class="btn-close2 btn-close2-${nickname}" >X</button>
            </div>
            </div>
            <div class="chat-body">
            <div class="message incoming">
                <p>Hello, how can I assist you today?</p>
            </div>
            <div class="message outgoing">
                <p>I have a question about your services.</p>
            </div>
            <div class="message incoming">
                <p>Sure, I'm here to help. What would you like to know?</p>
            </div>
            
            </div>
            <form  enctype="multipart/form-data" id="receved-${nickname}"  >
            <input type="hidden" name="send-Name" value="${nickname}">


            <div class="chat-footer">
            <input placeholder="Type your message" type="text" name="messagePrivite">
            <button>Send</button>
            </div>
            </form>
 
  
    `
    container.appendChild(premierDiv)
}