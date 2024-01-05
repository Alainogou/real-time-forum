export function createPostbutton(container, lastName) {
    container.innerHTML = `
    <div class="my_post">
        <div class="post_top">
            <img src="/assets/image/profile.png">
            <div class="showPostForm">
              <button type="submit" >What's on you mind, ${lastName}?</button>
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
                <label for="title-form">Title</label>
                <input type="text" name="title" placeholder="Title"  id="title-form">
            </div>
    
            <div class="box">
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
                <label for="postimage"> <i class="fa-solid fa-images green"></i> Photo</label>
                <input type="file" name="postimage" id="postimage" >
                <div id="imgfile"></div>
            </div>
    
            <div class="input-form-m">
                <label for="content-form">Content</label>
                <textarea  name="content" id="content-form" cols="30" rows="10"></textarea>
            </div>
            <button id="submitbtn" class="post-submit" type="submit">Send</button>
        </form>
        </div>
    </div> 
    
`
}


// onchange="ValideFile()"