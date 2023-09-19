const username = document.querySelector('#username')
const password = document.querySelector('#password')
const submitBtn = document.querySelector('.submit-btn')

let userJson = localStorage.getItem("loginRequest");
let user = JSON.parse(userJson) || [];

let infoJson = localStorage.getItem('user');
let info = JSON.parse(infoJson);

let usernameValue = ""
let passwordValue = ""


username.addEventListener("keyup", function () {
    usernameValue = this.value.trim().toLowerCase();
});

password.addEventListener('keyup', function () {
    passwordValue = this.value.trim().toLowerCase();
})

submitBtn.addEventListener('click', function() {
    userInfo = {
        username: usernameValue,
        password: passwordValue
    };
    if (usernameValue !== '' && passwordValue !== '') {
        let hasDuplicate = false;
        for (let i = 0; i < user.length; i++) {
            if (userInfo.username == user[i].username.toLowerCase() && userInfo.password == user[i].password) {
                hasDuplicate = true;
            }
        }
        if (hasDuplicate == false) {
            user.push(userInfo);
        }
        console.log(user);
        localStorage.setItem('loginRequest', JSON.stringify(user))
        if (info == null) {
            document.querySelector('.invalidPassword').textContent = 'Not found, please register if you have not an account'
        } else{
            for (let j = 0; j < info.length; j++) {
                if (usernameValue === info[j].username && passwordValue === info[j].password) {
                    localStorage.setItem('lastUser', JSON.stringify(info[j]))
                    window.location.href = "account.html"; 
                }else{
                    document.querySelector('.invalidPassword').textContent = 'Invalid password'
                    console.log(document.querySelector('.invalidPassword'));
                }
            }
        }
    }

    
    
})



