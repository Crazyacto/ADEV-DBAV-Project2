const password = "adev"

const form = document.querySelector("#main_content form")
form.addEventListener("submit", function (e){
    e.preventDefault();
    const submittedPassword = new FormData(form).get("password");

    if (submittedPassword !== password) {
        alert("Wrong password! Please try again later!")
        console.log(submittedPassword)
    } else {
        console.log("Access granted")
        window.location.href = "./admin_animal_database.html"
    }
});