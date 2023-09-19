const home = document.querySelector('.home__options')
const manager = document.querySelector('.manager')
const developer = document.querySelector('.developer')


// let peopleJson = localStorage.getItem("position")
// let people = JSON.parse(peopleJson) || []
let people = [];

function getPosition({id, name, img}) {
    return `
        <a href="login.html" onClick="choosePosition('${name}')">
            <img src="${img}" alt="">
            <h4>${name.toUpperCase()}</h4>
        </a>
    `
}

position.map((el) => {
    home.innerHTML += getPosition(el)
})


function choosePosition(name) {
    localStorage.setItem('position', JSON.stringify(name))
}

