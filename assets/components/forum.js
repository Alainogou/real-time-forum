export const headerPage=(container)=>{

    container.innerHTML= `
    <nav>
        <div class="left">
            <div class="logo">
                <h1 class='mnele'>REAL TIME FORUM</h1>
                <!-- <img src="/assets/image/logo.png"> -->
            </div>
        <!-- <div class="search_bar">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Search">
        </div> -->
                    
        </div> 
        <div class="right">
        
            <div class="nav-connection">
                <!-- <i class="fa-solid fa-list-ul"></i> -->
                <i class="fa-brands fa-facebook-messenger" id = "messageHeader"></i>
                <i class="fa-solid fa-user" id = "userHeader"></i>
                <i  class="fa-solid fa-right-from-bracket" id ="logoutHeader"></i>
                <!-- <img src="/assets/images/profil.png"> -->
            </div>         
        </div>
    </nav>
    
    `
}


export const displayCategories=(container, firstName, lastName)=>{
    container.innerHTML=`
        <div class="left">
        <div>
            <div class="img">
                <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                 <i class="fa-solid fa-user" ></i>
                 </div>
                <p>${firstName} ${lastName}</p>
            </div>
            <hr>
        </div>
    
        <h2>Categories</h2>
        
        <div class="shortcuts">
            <img src="/assets/image/sport.avif">
            <p>Sport</p>
        </div>
        <div class="shortcuts">
            <img src="/assets/image/art.avif">
            <p>Art</p>
        </div>
        <div class="shortcuts">
            <img src="/assets/image/informatique.avif">
            <p>Informatics</p>
        </div>
        <div class="shortcuts">
            <img src="/assets/image/religion.avif">
            <p>Religion</p>
        </div>
        <div class="shortcuts">
            <img src="/assets/image/game.avif">
            <p>Game</p>
        </div>
        
    </div>`
}

{/* <div class="online-indicator"></div> */}
export const Messenger= (container, nickname)=>{
    container.innerHTML=`
         <div class="right">
    


            <div class="third_warpper">

                <div class="contact_tag">

                    <h2>Contacts</h2>
                </div>

                <div class="contact">
                    <div class="user-image">
                         <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                <i class="fa-solid fa-user" ></i>
            </div>
                     
                    </div>
                    <p>ALdji Malick</p>
                </div>

                <div class="contact">
                    <div class="user-image">
                         <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                <i class="fa-solid fa-user" ></i>
            </div>
                        
                    </div>
                    <p>ALdji Malick</p>
                </div>

                <div class="contact">

                     <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                <i class="fa-solid fa-user" ></i>
            </div>
                    <p>ALdji Malick</p>

                </div>

                <div class="contact">
                    <div class="user-image">
                         <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                <i class="fa-solid fa-user" ></i>
            </div>
                        
                    </div>
                    <p>ALdji Malick</p>
                </div>

                <div class="contact">
                    <div class="user-image">
                         <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                <i class="fa-solid fa-user" ></i>
            </div>
                        
                    </div>
                    <p>ALdji Malick</p>
                </div>

                <div class="contact">
                    <div class="user-image">
                         <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                <i class="fa-solid fa-user" ></i>
            </div>
                        
                    </div>
                    <p>ALdji Malick</p>
                </div>

                <div class="contact">
                    <div class="user-image">
                         <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                <i class="fa-solid fa-user" ></i>
            </div>
                        
                    </div>
                    <p>ALdji Malick</p>
                </div>

                <div class="contact">

                <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                <i class="fa-solid fa-user" ></i>
            </div>
                    <p>ALdji Malick</p>

                </div>

                <div class="contact">
                <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                <i class="fa-solid fa-user" ></i>
            </div>
                    <p>ALdji Malick</p>

                </div>

                <div class="contact">

                <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                <i class="fa-solid fa-user" ></i>
            </div>
                    <p>Sandra</p>

                </div>
                <div class="contact">
                    <div class="user-image">
                         <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                <i class="fa-solid fa-user" ></i>
            </div>
                        
                    </div>
                    <p>Sandra</p>
                </div>

              

            </div>

         </div>
    `
    
}


export const loadConnexionPage=(container, name) =>{

    container.innerHTML = `
    
   
   

<div class="main">
    <!------------------left------------------->
    
    <div class="left">
        <div>
            <div class="img">
                <img src="/assets/image/profile.png">
                <p>John Deo</p>
            </div>
            <hr>
        </div>
       
        <h2>Categories</h2>
        
        <div class="shortcuts">
            <img src="/assets/image/shortcuts_1.png">
            <p>MOBILE GAMES</p>
        </div>
        <div class="shortcuts">
            <img src="/assets/image/shortcuts_2.jpeg">
            <p>Online Education</p>
        </div>
        <div class="shortcuts">
            <img src="/assets/image/shortcuts_3.webp">
            <p>Food Lovers</p>
        </div>
        <div class="shortcuts">
            <img src="/assets/image/shortcuts_4.png">
            <p>Social Media Academy</p>
        </div>
        <div class="shortcuts">
            <img src="/assets/image/shortcuts_5.webp">
            <p>PC Shop</p>
        </div>
        <div class="shortcuts">
            <img src="/assets/image/down_arrow.png">
            <p>See more</p>
        </div>
    </div>
    <!------------center---------------------->
    <div class="center">
    
        <div class="my_post">
            <div class="post_top">
                <img src="/assets/image/profile.png">
                <input type="text" placeholder="What's on you mind, John?">
            </div>
            <hr>
            <div class="post_bottom">
                <div class="post_icon">
                    <i class="fa-solid fa-video red"></i>
                    <p>Live video</p>
                </div>
                <div class="post_icon">
                    <i class="fa-solid fa-images green"></i>
                    <p>Photo/video</p>
                </div>
                <div class="post_icon">
                    <i class="fa-regular fa-face-grin yellow"></i>
                    <p>Feeling/activity</p>
                </div>
               
            </div>
        </div>
       
        <div class="friends_post">
            <div class="friend_post_top">
                <div class="img_and_name">
                    <img src="/assets/image/post_1.jpg">
                    <div class="friends_name">
                        <p class="friends_name">
                            Senuda De Silva
                        </p>
                        
                        <p class="time">16h.<i class="fa-solid fa-user-group"></i></p>
                        
                    
                    </div>
                    
                </div>
                <div class="menu">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
                
            </div>
            <div>
                <p>I have been developing, updating, and supporting this extension 
                    for over three years. It's amazing to see that we have over 600,000 daily users, and all of these people have been able to migrate to Firefox permanently.
                </p>
                <br></br>
            </div>
           
            <img src="/assets/image/post_1.jpg">
            <div class="info">
                <div class="emoji_img">
                    <img src="/assets/image/like.png">
                    <img src="/assets/image/haha.png">
                    <img src="/assets/image/heart.png">
                    <p>You, Charith Disanayaka and 25K others</p>
                </div>
                <div class="comment">
                    <p>421 Comments</p>
                    <p>1.3K Shares</p>
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
                <div class="like_icon">
                    <i class="fa-solid fa-share"></i>
                    <p>Share</p>
                </div>
            </div>
            <hr>
            <div class="comment_warpper">
                <img src="/assets/image/profile.png">
                <div class="circle"></div>
                <div class="comment_search">
                    <input type="text" placeholder="Write a comment">
                    <i class="fa-regular fa-face-smile"></i>
                    <i class="fa-solid fa-camera"></i>
                    <i class="fa-regular fa-note-sticky"></i>
                </div>
            </div>
        </div>
        <div class="friends_post">
            <div class="friend_post_top">
                <div class="img_and_name">
                    <img src="/assets/image/profile_9.png">
                    <div class="friends_name">
                        <p class="friends_name">
                            Senuda De Silva
                        </p>
                        <p class="time">16h.<i class="fa-solid fa-user-group"></i></p>
                    </div>
                    
                </div>
                <div class="menu">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            <img src="/assets/image/post_2.jpg">
            <div class="info">
                <div class="emoji_img">
                    <img src="/assets/image/like.png">
                    <img src="/assets/image/haha.png">
                    <img src="/assets/image/heart.png">
                    <p>You, Charith Disanayaka and 25K others</p>
                </div>
                <div class="comment">
                    <p>421 Comments</p>
                    <p>1.3K Shares</p>
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
                <div class="like_icon">
                    <i class="fa-solid fa-share"></i>
                    <p>Share</p>
                </div>
            </div>
            <hr>
            <div class="comment_warpper">
                <img src="/assets/image/profile.png">
                <div class="circle"></div>
                <div class="comment_search">
                    <input type="text" placeholder="Write a comment">
                    <i class="fa-regular fa-face-smile"></i>
                    <i class="fa-solid fa-camera"></i>
                    <i class="fa-regular fa-note-sticky"></i>
                </div>
            </div>
        </div>
        <div class="friends_post">
            <div class="friend_post_top">
                <div class="img_and_name">
                    <img src="/assets/image/profile_10.png">
                    <div class="friends_name">
                        <p class="friends_name">
                            Senuda De Silva
                        </p>
                        <p class="time">16h.<i class="fa-solid fa-user-group"></i></p>
                    </div>
                    
                </div>
                <div class="menu">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            <img src="/assets/image/post_3.png">
            <div class="info">
                <div class="emoji_img">
                    <img src="/assets/image/like.png">
                    <img src="/assets/image/haha.png">
                    <img src="/assets/image/heart.png">
                    <p>You, Charith Disanayaka and 25K others</p>
                </div>
                <div class="comment">
                    <p>421 Comments</p>
                    <p>1.3K Shares</p>
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
                <div class="like_icon">
                    <i class="fa-solid fa-share"></i>
                    <p>Share</p>
                </div>
            </div>
            <hr>
            <div class="comment_warpper">
                <img src="/assets/image/profile.png">
                <div class="circle"></div>
                <div class="comment_search">
                    <input type="text" placeholder="Write a comment">
                    <i class="fa-regular fa-face-smile"></i>
                    <i class="fa-solid fa-camera"></i>
                    <i class="fa-regular fa-note-sticky"></i>
                </div>
            </div>
        </div>
        <div class="friends_post">
            <div class="friend_post_top">
                <div class="img_and_name">
                    <img src="/assets/image/profile_11.png">
                    <div class="friends_name">
                        <p class="friends_name">
                            Senuda De Silva
                        </p>
                        <p class="time">16h.<i class="fa-solid fa-user-group"></i></p>
                    </div>
                    
                </div>
                <div class="menu">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            <img src="/assets/image/post_4.jpg">
            <div class="info">
                <div class="emoji_img">
                    <img src="/assets/image/like.png">
                    <img src="/assets/image/haha.png">
                    <img src="/assets/image/heart.png">
                    <p>You, Charith Disanayaka and 25K others</p>
                </div>
                <div class="comment">
                    <p>421 Comments</p>
                    <p>1.3K Shares</p>
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
                <div class="like_icon">
                    <i class="fa-solid fa-share"></i>
                    <p>Share</p>
                </div>
            </div>
            <hr>
            <div class="comment_warpper">
                <img src="/assets/image/profile.png">
                <div class="circle"></div>
                <div class="comment_search">
                    <input type="text" placeholder="Write a comment">
                    <i class="fa-regular fa-face-smile"></i>
                    <i class="fa-solid fa-camera"></i>
                    <i class="fa-regular fa-note-sticky"></i>
                </div>
            </div>
        </div>
        <div class="friends_post">
            <div class="friend_post_top">
                <div class="img_and_name">
                    <img src="/assets/image/profile_12.jpg">
                    <div class="friends_name">
                        <p class="friends_name">
                            Senuda De Silva
                        </p>
                        <p class="time">16h.<i class="fa-solid fa-user-group"></i></p>
                    </div>
                    
                </div>
                <div class="menu">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            <img src="/assets/image/post_5.jpg">
            <div class="info">
                <div class="emoji_img">
                    <img src="/assets/image/like.png">
                    <img src="/assets/image/haha.png">
                    <img src="/assets/image/heart.png">
                    <p>You, Charith Disanayaka and 25K others</p>
                </div>
                <div class="comment">
                    <p>421 Comments</p>
                    <p>1.3K Shares</p>
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
                <div class="like_icon">
                    <i class="fa-solid fa-share"></i>
                    <p>Share</p>
                </div>
            </div>
            <hr>
            <div class="comment_warpper">
                <img src="/assets/image/profile.png">
                <div class="circle"></div>
                <div class="comment_search">
                    <input type="text" placeholder="Write a comment">
                    <i class="fa-regular fa-face-smile"></i>
                    <i class="fa-solid fa-camera"></i>
                    <i class="fa-regular fa-note-sticky"></i>
                </div>
            </div>
        </div>
        <div class="loard">
            <button>Loard More</button>
        </div>
       
    </div>
        <!------------------right------------------>
        <div class="right">
    


            <div class="third_warpper">

                <div class="contact_tag">

                    <h2>Contacts</h2>
                </div>

                <div class="contact">
                    <div class="user-image">
                        <img src="/assets/image/contact_1.jpg">
                        <div class="online-indicator"></div>
                    </div>
                    <p>Sandra</p>
                </div>

                <div class="contact">
                    <div class="user-image">
                        <img src="/assets/image/contact_1.jpg">
                        <div class="online-indicator"></div>
                    </div>
                    <p>Sandra</p>
                </div>

                <div class="contact">

                     <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                <i class="fa-solid fa-user" ></i>
            </div>
                    <p>Sandra</p>

                </div>

                <div class="contact">
                    <div class="user-image">
                         <div class="user" style="background-color:#efefef; height:30px;width:30px; text-align:center; border-radius:50%; padding-top:4px">
                <i class="fa-solid fa-user" ></i>
            </div>
                        <div class="online-indicator"></div>
                    </div>
                    <p>Sandra</p>
                </div>

                <div class="contact">
                    <div class="user-image">
                        <img src="/assets/image/contact_1.jpg">
                        <div class="online-indicator"></div>
                    </div>
                    <p>Sandra</p>
                </div>

                <div class="contact">
                    <div class="user-image">
                        <img src="/assets/image/contact_1.jpg">
                        <div class="online-indicator"></div>
                    </div>
                    <p>Sandra</p>
                </div>

                <div class="contact">
                    <div class="user-image">
                        <img src="/assets/image/contact_1.jpg">
                        <div class="online-indicator"></div>
                    </div>
                    <p>Sandra</p>
                </div>

                <div class="contact">

                    <img src="/assets/image/profile_3.jpg">
                    <p>Sandra</p>

                </div>

                <div class="contact">
                    <img src="/assets/image/profile_4.png">
                    <p>Sandra</p>

                </div>

                <div class="contact">

                    <img src="/assets/image/profile_5.png">
                    <p>Sandra</p>

                </div>
                <div class="contact">
                    <div class="user-image">
                        <img src="/assets/image/contact_1.jpg">
                        <div class="online-indicator"></div>
                    </div>
                    <p>Sandra</p>
                </div>

                <div class="contact">

                    <img src="/assets/image/profile_7.png">
                    <p>Sandra</p>

                </div>

            </div>

        </div>

    </div>
</div>


    `;
    
}