function renderCommentForm(container, userId, postId) {
    // Rendu du formulaire de commentaire
    container.innerHTML = `
        <hr>
        
        <div class="comment_warpper">
       
        
            <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                <i class="fa-solid fa-user" ></i>
        
            </div>
            <div class="comment_search">
                <form>
                        <input type="hidden" name="post_id" value="${userId}">
                        <input class="nc-ct" type="text" name="content" placeholder=    "write your comment here...">
                        <div class="nc-cm-btn-p">
                        </br>
                         
                        <button class="submit-comment-${postId}" type="submit"><i class="fa-solid fa-paper-plane"></i>Add comment</button>
                        </div>
                </form>
            </div>

           
      
        </div>
    `;

   
}

export {renderCommentForm}


{/* <div class="comment_search">
<input type="text" name="commentText" placeholder="Write a comment">
<input type="hidden" name="user_commented" value="${userId}">

<i class="fa-solid fa-paper-plane"></i>  
        
</div> */}