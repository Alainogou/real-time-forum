export const  FormMessage=(container)=>{
 let premierDiv= document.createElement('div');
 premierDiv.classList.add('chat-card');
    premierDiv.innerHTML =`
           
            <div class="chat-header">
            <div class="h2">
                <p>Private Messenger</p>
                <button class="btn-close2" >X</button>
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
            <div class="chat-footer">
            <input placeholder="Type your message" type="text">
            <button>Send</button>
            </div>
 
  
    `
    container.appendChild(premierDiv)
}