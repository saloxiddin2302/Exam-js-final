const homeRow = document.querySelector(".home__body");
const loader = document.querySelector('.book')
const homeTop = document.querySelector('.home__top')
const totalTeachers = document.querySelector('.home__total span')
const pagination = document.querySelector(".pagination");
const searchInput = document.querySelector("#search");
const modal = document.querySelector('.modal');
const cancelBtn = document.querySelector('.cancel-btn');
const xMark = document.querySelector('.fa-xmark')
const teacherForm = document.querySelector(".teacher-form");
const modalBtn = document.querySelector(".modal-btn");
const addBtn = document.querySelector(".modal__btn");
const selectFilter = document.querySelector(".filter-select");

let search = "";
let page = 1;
let selected = null;
let order = "asc";
let pages;

function getTeachersCard({ firstName, lastName, avatar, id, email, phoneNumber, isMarried, groups }) {
  return `
  <div class="home__card">
        <div class="home__card__img" href="students.html?id=${id}">
            <img class="avatar" src="${avatar}" alt="">
        </div>
        <div class="home__card__info">
            <p>Name: ${firstName}</p>
            <p>Surname: ${lastName}</p>
            <p>E-mail: ${email}</p>
            <p>Phone Number: ${phoneNumber}</p>
            <p>Is Married: ${isMarried ? 'Yes' : 'No'}</p>
            <p>Groups: ${groups}</p>
            <div class='home__card__btns'>
                <button class='changePage' onclick="changeLocation(${id})">See Students</button>
                <button onclick="editTeacher(${id})" class='editBtn'>Edit</button>
                <button onclick="deleteTeacher(${id})" class="deleteBtn">Delete</button>
            </div>
        </div>
    </div>
  `;
}

function changeLocation(id) {
    location = `students.html?id=${id}`
}

function getTeachers() {
  async function getTeachersData() {

    homeRow.innerHTML = ''

    let params = { firstName: search, page, limit: LIMIT, orderBy: "name", order };
    let res = await request.get("teacher", { params });
    let resTotal = await request.get("teacher", { params: { firstName: search } });

    pages = Math.ceil(resTotal.data.length / LIMIT);
    getPagination();
    totalTeachers.textContent = resTotal.data.length;

    homeRow.innerHTML = "";
    console.log(res.data);
    res.data.map((teacher) => {
        homeRow.innerHTML += getTeachersCard(teacher);
    });
  }

  getTeachersData();
}

getTeachers();

function getPagination() {
  if (pages > 1) {
    pagination.innerHTML = `<button onClick="getPage('-')" ${page == 1 ? 'disabled' : ''}>Prev</button>`

    for (let i = 1; i <= pages; i++) {
      pagination.innerHTML += `<button onClick="getPage(${i})" class="${page == i ? 'active' : ''}">${i}</button>`;
    }

    pagination.innerHTML += `<button onClick="getPage('+')" ${page == pages ? 'disabled' : ''}>Next</button>`;
  } else {
    pagination.innerHTML = "";
  }
}

function getPage(i) {
  if (i === "+") {
    page++;
  } else if (i === "-") {
    page--;
  } else {
    page = i;
  }
  getTeachers();
}

searchInput.addEventListener("keyup", function () {
  search = this.value;
  console.log(search);
  page = 1;
  getTeachers();
});

modalBtn.addEventListener('click', function (){
    modal.style.top = '0%';
});
cancelBtn.addEventListener('click', function (e) {
    e.preventDefault();
    modal.style.top = '-100%'
})

xMark.addEventListener('click', () => {
    modal.style.top = '-100%';
})

teacherForm.addEventListener("submit", async function (e) {
  e.preventDefault();
    try {
      let teacher = {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        avatar: this.avatar.value,
        groups: [this.groups.value.split(',')],
        isMarried: this.isMarried.checked,
        phoneNumber: this.phoneNumber.value,
        email: this.email.value,
      };
      let pattern = /^https?:\/\/\S+\.(?:png|jpe?g|gif|bmp|svg)$/;
      if (pattern.test(teacher.avatar)) {
        teacher.avatar;
      }else {https:encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNfxah8hHy18Ukw7OYIIWNAoYS_lElzw26x0sVnzpI2A&s
        teacher.avatar = ''
      }
      if (selected === null) {
        await request.post("teacher", teacher);
      } else {
        await request.put(`teacher/${selected}`, teacher);
      }
      getTeachers();
      this.reset();
      modal.style.top = '-100%'
    } catch (err) {
      console.log(err);
    }
});
async function editTeacher(id) {
  selected = id;
  addBtn.textContent = "Save";
  modal.style.top = '0%';
  let {
    data: { avatar, firstName, lastName, groups, isMarried, phoneNumber, email },
  } = await request(`teacher/${id}`);

  teacherForm.firstName.value = firstName;
  teacherForm.avatar.value = avatar;
  teacherForm.lastName.value = lastName
  teacherForm.groups.value = groups,
  teacherForm.isMarried.checked = isMarried,
  teacherForm.phoneNumber.value = phoneNumber,
  teacherForm.email.value = email

  let pattern = /^https?:\/\/\S+\.(?:png|jpe?g|gif|bmp|svg)$/;
  if (pattern.test(teacher.avatar)) {
    teacher.avatar;
  }else {
    teacher.avatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNfxah8hHy18Ukw7OYIIWNAoYS_lElzw26x0sVnzpI2A&s'
  }

}

modalBtn.addEventListener("click", () => {
  selected = null;
  addBtn.textContent = "Add";
});

async function deleteTeacher(id) {
  let confirmDelete = confirm("Do you really want to delete this teacher?");
  if (confirmDelete) {
    await request.delete(`teacher/${id}`);
    page = 1;
    getTeachers();
  }
}
