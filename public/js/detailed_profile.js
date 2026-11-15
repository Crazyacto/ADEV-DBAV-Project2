function showConfirmation() {
    const filterMenu = document.getElementById("confirmation_overlay");
    filterMenu.style.display = "flex";
    
    document.body.style.overflowY = "hidden";
}

function hideConfirmation() {
    const filterMenu = document.getElementById("confirmation_overlay");
    filterMenu.style.display = "none";

    document.body.style.overflowY = "scroll";
}

function loadFullProfile() {
    var urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");
    var fetchStatement = "/animals?id=" + idParam;
    
    fetch(fetchStatement, {
        method: "GET"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error: The response was not ok, please check logs for error message.");
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("animalImage").src = "./images/" + data[0].image
        document.getElementById("animalName").innerHTML = data[0].name;
        document.getElementById("species").innerHTML = "Species: " + data[0].species;
        document.getElementById("gender").innerHTML = "Gender: " + data[0].gender;
        document.getElementById("breed").innerHTML = "Breed: " + data[0].breed;
        document.getElementById("age").innerHTML = "Age: " + data[0].age;
        document.getElementById("adoptionStatus").innerHTML = "Adoption Status: " + data[0].adoption_status;
        document.getElementById("personalityDescription").innerHTML = data[0].personality_description;
    })
    .catch(error => {
        console.error("Error: ", error);
    });
}

function deleteProfile() {
    var urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");
    var fetchStatement = "/delete?id=" + idParam;
    
    fetch(fetchStatement, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error: The response was not ok, please check logs for error message.");
        }
        return response.json();
    })
    .then(data => {
        alert("Animal profile has been deleted from the database");
        window.location = "./admin_animal_database.html";
    })
    .catch(error => {
        console.error("Error: ", error);
    });
}