export function createPostbutton(container, nickname) {
    container.innerHTML = `
    <div class="my_post">
        <div class="post_top">
       
            
             <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                <i class="fa-solid fa-user" ></i>
            </div>
          
            <div class="showPostForm">
              <button type="submit" >Add your post here, ${nickname}</button>
            </div>
        </div>
        <hr>
       
    </div>
    `;
    // Ajoutez des gestionnaires d'événements ou des fonctionnalités spécifiques à la page d'accueil
}

export function postForm(container, userId){
    container.innerHTML=` 
    <div class="modal-main-f" id="modal-f">
        <div class="modal">
        <div class="modal-header">
            <p class="tilte-modal">
                New Post
            </p>
            <button class="btn-close" >X</button>


        </div>

        <form  enctype="multipart/form-data"  class="form-modal" id='postForm'>
            <input type="hidden" name="user_id" value="${userId}">
            <div class="input-form-m">
            <div><span class="errorStyle messageErrorTitle"></span></div> 
                <label for="title-form">Title</label>
                <input type="text" name="title" placeholder="Title"  id="title-form">
            </div>
    
            <div class="box">
            <div><span class="errorStyle messageErrorCategorie"></span></div> 
                <details>
                    <summary>Categories</summary>
                    <ul>
                            <label><input type="checkbox" name="cat" value="1" />Education</label>
                            <label><input type="checkbox" name="cat" value="2" />Games</label>
                            <label><input type="checkbox" name="cat" value="3" />Education</label>
                            <label><input type="checkbox" name="cat" value="4" />Games</label>

                    </ul>
                </details>
            </div>
            
            <div class="input-form-m">
            <div><span class="errorStyle messageErrorImage"></span></div> 
                <label for="postimage"> <i class="fa-solid fa-images green"></i> Image</label>
                <input type="file" name="postimage" id="postimage">
                <div id="imgfile"></div>
            </div>
    
            <div class="input-form-m">
            <div><span class="errorStyle messageErrorContent"></span></div> 
                <label for="content-form">Content</label>
                <textarea  name="content" id="content-form" cols="30" rows="10"></textarea>
            </div>
            <button id="submitbtn" class="post-submit" type="submit">Send</button>
        </form>
        </div>
    </div> 
    
`
}


export function fetchPosthtml(postImage, friendName, postTime, postText, likeCount, commentCount, shareCount, profileImage) {
    return `
      <div class="friends_post">
          <div class="friend_post_top">
              <div class="img_and_name">
                 
              <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
              <i class="fa-solid fa-user" ></i>
              </div>
             
                  <div class="friends_name">
                      <p class="friends_name">
                          ${friendName}
                      </p>
                      
                      <p class="time">${postTime}<i class="fa-solid fa-user-group"></i></p>
                  </div>
              </div>
              <div class="menu">
                  <i class="fa-solid fa-ellipsis"></i>
              </div>
          </div>
          <div>
              <p>${postText}</p>
              <br></br>
          </div>
          <img src="${postImage}">
          <div class="info">
              <div class="emoji_img">
                  <img src="/assets/image/like.png">
                  <img src="/assets/image/haha.png">
                  <img src="/assets/image/heart.png">
                  <p>${likeCount}</p>
              </div>
              <div class="comment">
                  <p>${commentCount} Comments</p>
                
              </div>
          </div>
          <hr>
          <div class="like">
              <div class="like_icon">
                  <i class="fa-solid fa-thumbs-up activi"></i>
                  <p>Like</p>
              </div>
              <div class="like_icon">
                  <i class="fa-solid fa-message"></i>
                  <p>Comments</p>
              </div>
            
          </div>
          <hr>
          <div class="comment_warpper">
          
          <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
          <i class="fa-solid fa-user" ></i>
         
          </div>
        
          

            
              <div class="comment_search">
                  <input type="text" placeholder="Write a comment">
                  <i class="fa-regular fa-face-smile"></i>
                  <i class="fa-solid fa-camera"></i>
                  <i class="fa-regular fa-note-sticky"></i>
              </div>
          </div>
      </div>`;
  }

// onchange="ValideFile()"