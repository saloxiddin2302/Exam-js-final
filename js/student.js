const homeRow = document.querySelector(".home__body");
const loader = document.querySelector('.book')
const homeTop = document.querySelector('.home__top')
const totalStudents = document.querySelector('.home__total span')
const pagination = document.querySelector(".pagination");
const searchInput = document.querySelector("#search");
const modal = document.querySelector('.modal');
const cancelBtn = document.querySelector('.cancel-btn');
const xMark = document.querySelector('.fa-xmark')
const studentFrom = document.querySelector(".teacher-form");
const modalBtn = document.querySelector(".modal-btn");
const addBtn = document.querySelector(".modal__btn");
const selectFilter = document.querySelector(".filter-select");
const header = document.querySelector('.home__top__left h2');

let query = new URLSearchParams(location.search);

let teacherID = query.get("id");


let search = "";
let page = 1;
let selected = null;
let order = "asc";
let pages;


function getStudentCard({ teacherName,firstName, lastName, avatar, id, email, phoneNumber, isWork, field, birthday }) {
  return `
  <div class="home__card">
        <div class="home__card__img">
            <img src="${avatar}" alt="">
        </div>
        <div class="home__card__info">
            <p>Teacher's Name: ${teacherName}</p>
            <p>Name: ${firstName}</p>
            <p>Surname: ${lastName}</p>
            <p>Birthday: ${birthday.split('T', 1)}</p>
            <p>Is Work: ${isWork ? 'Yes' : 'No'}</p>
            <p>Field: ${field}</p>
            <p>E-mail: ${email}</p>
            <p>Phone Number: ${phoneNumber}</p>
            <div class='home__card__btns'>
                <button onclick="editStudent(${id})" class='editBtn'>Edit</button>
                <button onclick="deleteStudent(${id})" class="deleteBtn">Delete</button>
            </div>
        </div>
    </div>
  `;
}

function getStudent() {
  async function getStudentData() {
    homeRow.innerHTML = "...Loading";

    let params = { firstName: search, page, limit: LIMIT, orderBy: "name", order };
    let { data: student } = await request.get(`teacher/${teacherID}/student`, {params});
    let resTotal = await request.get(`teacher/${teacherID}/student`, { params: { firstName: search } });
    pages = Math.ceil(resTotal.data.length / LIMIT);
    getPagination();
    totalStudents.textContent = resTotal.data.length;

    let {
      data: { firstName },
    } = await request.get(`teacher/${teacherID}`);
    header.innerHTML = `Information about ${firstName}'s Students`
    console.log(student);

    homeRow.innerHTML = "";
    student.map((student) => {
        homeRow.innerHTML += getStudentCard({ ...student, teacherName: firstName });
    });
  }

  getStudentData();
}

getStudent();

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
  getStudent();
}

searchInput.addEventListener("keyup", function () {
  search = this.value;
  page = 1;
  getStudent();
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

studentFrom.addEventListener("submit", async function (e) {
  e.preventDefault();
    try {
      let student = {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        avatar: this.avatar.value,
        birthday: this.birthday.value,
        isWork: this.isWork.checked,
        field: this.field.value,
        phoneNumber: this.phoneNumber.value,
        email: this.email.value,
      };
      let pattern = /^https?:\/\/\S+\.(?:png|jpe?g|gif|bmp|svg)$/;
      if (pattern.test(student.avatar)) {
        student.avatar;
      }else {
        student.avatar = 'https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg'
      }

      if (selected === null) {
        await request.post(`teacher/${teacherID}/student`, student);
      } else {
        await request.put(`teacher/${teacherID}/student/${selected}`, student);
      }
      getStudent();
      this.reset();
      modal.style.top = '-100%'
    } catch (err) {
      console.log(err);
    }
});


async function editStudent(id) {
  selected = id;
  addBtn.textContent = "Save";
  modal.style.top = '0%';
  let {
    data: { avatar, firstName, lastName, birthday, isWork,field, phoneNumber, email },
  } = await request(`teacher/${teacherID}/student/${id}`);

  studentFrom.firstName.value = firstName;
  studentFrom.lastName.value = lastName
  studentFrom.avatar.value = avatar,
  studentFrom.birthday.value = birthday,
  studentFrom.isWork.checked = isWork,
  studentFrom.field.value = field,
  studentFrom.phoneNumber.value = phoneNumber,
  studentFrom.email.value = email

  let pattern = /^https?:\/\/\S+\.(?:png|jpe?g|gif|bmp|svg)$/;
  if (pattern.test(student.avatar)) {
    student.avatar;
  }else {
    student.avatar = 'https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg'
  }

}

modalBtn.addEventListener("click", () => {
  selected = null;
  addBtn.textContent = "Add";
});

async function deleteStudent(id) {
  let confirmDelete = confirm("Do you really want to delete this Student?");
  if (confirmDelete) {
    await request.delete(`teacher/${teacherID}/student/${id}`);
    page = 1;
    getStudent();
  }
}




