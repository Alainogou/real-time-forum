export const createNewAccount=(container) =>{
    container.innerHTML = `
        
   
    <form>
        <div><span class="start" >*</span><span class="messageErro1"></span></div> 
        <input type="text" id="nickname" name="nickname" placeholder="Nickname">
        <input type="number" id="age" name="age" placeholder="Age">
        <select id="gender" name="gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
        </select>
        <input type="text" id="first-name" name="first-name" placeholder="First Name" >
        <input type="text" id="last-name" name="last-name" placeholder="Last Name" >
        <div><span class="start" >*</span><span class="messageErro2"></span></div> 
        <input type="email" id="email" name="email" placeholder="E-mail" >
        <div><span class="start">*</span><span class="messageErro"></span></div> 
        <input type="password" id="password" name="password" placeholder="Password" >
        <input type="password" id="ConfirmPassword" name="ConfirmPassword" placeholder="Confirm password" >
        

        <div class="link submitRegister" class="">
            <button type="submit" class="login">Register</button>
        </div>   
    </form>


    ;`
    
}
