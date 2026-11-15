const forbiddenChars = ['&', '=', '?', '#', '/', '%', '+', ':', '@', '"', "'", '<', '>', '\\', '.']; 

function blockChars(event) {
    if (forbiddenChars.includes(event.key)) {
        event.preventDefault(); 
        alert(`The character "${event.key}" is not allowed.`);
    }
}

const textInput = document.querySelector('.typing_input');      
const textArea = document.querySelector('#personality_description_input');    

textInput.addEventListener('keydown', blockChars);
textArea.addEventListener('keydown', blockChars);


const speciesAndBreedDict = {
    Cat : ["American_Shorthair", "Maine_Coon"],
    Dog : ["Golden_Retriever", "Japanese_Spitz"],
    Rabbit : ["American_Fuzzy_Lop", "Polish_Rabbit"]
};

function hideRest (value) {
        const breedKey = value;
        const breedArray = speciesAndBreedDict[breedKey];

        for (let i in breedArray) {
            const label = document.querySelector("label[for=" + breedArray[i] + "]");
            label.style.display = "block";
        }

        for (let i = 0; i < Object.keys(speciesAndBreedDict).length; i++) {
            const newKey = Object.keys(speciesAndBreedDict)[i];
            if (newKey != breedKey) {
                const newValue = Object.values(speciesAndBreedDict)[i];

                for (let z in newValue) {
                const label = document.querySelector("label[for=" + newValue[z] + "]");
                const radio = document.querySelector("#" + newValue[z]);
                radio.checked = false;
                label.style.display = "none";
                }
            }
        }
}


const query = window.location.search; 
const params = new URLSearchParams(query);
const id = params.get("id");   
const form = document.querySelector("#main_content form") 
form.addEventListener("submit", function (e){ //apply filters
    e.preventDefault();
    const formData = new FormData(form)
    const newAnimalInfo = { 
        name: formData.get("name"),
        image: String(formData.get("imageName")) + ".png",
        age: formData.getAll("age"),
        gender_id: formData.getAll("gender"),
        species_id: formData.getAll("species"),
        breed_id: formData.getAll("breed"),
        adoption_status_id: formData.getAll("adoptionStatus"),
        personality_description: formData.getAll("personalityDescription"),
        id: id
    };

    var constructedStatement = "/update?name=" + newAnimalInfo.name +
    "&image=" + newAnimalInfo.image + 
    "&age=" + newAnimalInfo.age + 
    "&species_id=" + newAnimalInfo.species_id + 
    "&breed_id=" + newAnimalInfo.breed_id + 
    "&gender_id=" + newAnimalInfo.gender_id + 
    "&personality_description=" + newAnimalInfo.personality_description + 
    "&adoption_status_id=" + newAnimalInfo.adoption_status_id +
    "&id=" + id;

    console.log(constructedStatement);

    fetch(constructedStatement, {
        method: "PUT"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error: The response was not ok, please check logs for error message.");
        }
        return response.json();
    })
    .then(data => {
        alert("Animal profile successfully updated");
        //window.location = "./admin_animal_database.html";
    })
    .catch(error => {
        console.error("Error: ", error);
    });
});


function retrieveProfileInfo() {
    const query = window.location.search;
    const fetchStatement = "/animals" + query;

    fetch(fetchStatement , {
        method: "GET"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error: The response was not ok, please check logs for error message.");
        }
        return response.json();
    })
    .then(data => {
        loadProfileInfo(data);
    })
    .catch(error => {
        console.error("Error: ", error);
    });
}

function loadProfileInfo(data) {
    const profileInfo = data[0];
    
    for (let i = 0; i < Object.keys(profileInfo).length; i++) {
        const key = Object.keys(profileInfo)[i];
        var value = Object.values(profileInfo)[i];
        console.log(key)
    
        if (key != "id") {
            if (key == "breed") {
                value = value.replaceAll(" ", "_");
            }
            
            var element = document.getElementById(value);
            if (element && element.type === "radio") {
                if (key == "species") {
                    hideRest (value)
                }
                element.checked = true;
            } else if (key == "personality_description") {
                element = document.getElementById("personality_description_input");
                element.value = value;
            } else if (key == "image") {
                element = document.getElementById("image");
                const newValue = value.replace(".png", "")
                element.value = newValue;
            } else {
                element = document.getElementById(key);
                element.value = value;
            }
        }
    }
}