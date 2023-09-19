const firstName = document.querySelector('#firstName');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const submitBtn = document.querySelector(".submit-btn");

let userJson = localStorage.getItem("user");
let user = JSON.parse(userJson) || [];


let firstNameValue = ''
let lastNameValue = ''
let usernameValue = ''
let passwordValue = ''


firstName.addEventListener("keyup", function () {
    firstNameValue = this.value.trim().toLowerCase();
});

username.addEventListener("keyup", function () {
    usernameValue = this.value.trim().toLowerCase();
});

password.addEventListener('keyup', function () {
    passwordValue = this.value.trim().toLowerCase();
})

submitBtn.addEventListener('click', function () {
    createUser = {
        firstName: firstNameValue,
        lastName: lastNameValue,
        username: usernameValue,
        password: passwordValue
    };
    user.push(createUser)
    console.log(user);
    localStorage.setItem('user', JSON.stringify(user))

    let inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].hasAttribute("required") && inputs[i].value === "") {
        document.querySelector('.fill').textContent = 'Please Fill All Inputs!'
        return;
      }
    }
    window.location.href = "login-regstr.html"; 
})