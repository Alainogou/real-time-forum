export const createNewAccount=(container) =>{
    container.innerHTML = `
        
   
    <form>
        <input type="text" id="nickname" name="nickname" placeholder="Nickname">
        <input type="number" id="age" name="age" placeholder="Age">
        <select id="gender" name="gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
        </select>
        <input type="text" id="first-name" name="first-name" placeholder="First Name" required>
        <input type="text" id="last-name" name="last-name" placeholder="Last Name" required>
        <input type="email" id="email" name="email" placeholder="E-mail" required>
        <input type="password" id="password" name="password" placeholder="Password" required>
        <input type="password" id="ConfirmPassword" name="ConfirmPassword" placeholder="Confirm password" required>

        <div class="link submitRegister" class="">
            <button type="submit" class="login">Register</button>
        </div>   
    </form>


    `;
    
}