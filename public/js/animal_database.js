var storedFilters = {}

function showFilterMenu() {
    const filterMenu = document.getElementById("filter_menu");
    filterMenu.style.display = "flex";
    
    document.body.style.overflowY = "hidden";
}

function hideFilterMenu() {
    const filterMenu = document.getElementById("filter_menu");
    filterMenu.style.display = "none";

    document.body.style.overflowY = "scroll";
}

function checkFilters (filter) {
    for (let key in filter) {
        const value = filter[key];
        if (Array.isArray(value) === true) {
            if (value.length > 0) {return false;}
        } else {
            if (value !== null && value !== "") {return false;}
        }
    }
    return true;
}

function cleanFilters (filter) {
    var cleaned = {};
    for (let key in filter) {
        const value = filter[key];
        if (Array.isArray(value) === true) {
            if (value.length > 0) {cleaned[key] = value}
        } else {
            if (value !== null && value !== "") {cleaned[key] = value}
        }
    }
    return cleaned;
}
function selectFilters(formData) {

    const filter = { //leave it like this so that when displaying the names on the filter, its easier
        minAge: formData.get("minAge"),
        maxAge: formData.get("maxAge"),
        adoptionStatus: formData.getAll("adoptionStatus"),
        gender: formData.getAll("gender"),
        species: formData.getAll("species"),
        breed: formData.getAll("breed")
    };

    isEmpty = checkFilters(filter);

    if (isEmpty === true) {
        console.log("No filters selected??");
        return false;
    } else {
        storedFilters = cleanFilters(filter);
        console.log(storedFilters)
        return true;
    }
}

function activateFilterRemover(elementId) {
    const miniFilterDisplay = document.getElementById(elementId);
    const closeButton = miniFilterDisplay.querySelector("input");
    closeButton.addEventListener("click", function(e){
        miniFilterDisplay.remove();
        delete storedFilters[elementId];
    });
}

//structure: <div class="mini_filter_display"><input type="image" src="./images/close_icon.png"> age: 6767</div>
function displayFilters() {
    var constructedHTMLCode = "";
    const activeFilters = document.getElementById("active_filters");

    for (let key in storedFilters) {
        var name = key;
        const value = storedFilters[key];

        if (Array.isArray(value) === true) {
            if (name === "adoptionStatus" ) {
                name = "adoption status: ";
            } else {
                name += ": ";
            }
            var reconstructedList = ""
            for (let i = 0; i < value.length; i++) {
                if (i === value.length - 1) {
                    const trueValue = valueConverter(key, value[i])
                    reconstructedList += String(trueValue);
                } else {
                    const trueValue = valueConverter(key, value[i])
                    reconstructedList += String(trueValue) + ", ";
                }
            }
            constructedHTMLCode += "<div class='mini_filter_display' id='" + key + "'><input type='image' src='./images/close_icon.png'>" + name + reconstructedList + "</div>";
        } else {
            if (name == "minAge") {
                name = "min age: ";
            } else {
                name = "max age: ";
            }
            constructedHTMLCode += "<div class='mini_filter_display' id='" + key + "'><input type='image' src='./images/close_icon.png'>" + name + String(value) + "</div>";
        }
    }
    activeFilters.innerHTML = constructedHTMLCode
    for (let key in storedFilters) {
        activateFilterRemover(key);
    }
}

function applyFilters(domain) {
    if (Object.keys(storedFilters).length === 0) {
        alert("Please select filters before applying!!!");
        return;
    } else {
        const animalDisplay = document.getElementById("animal_display");
        const animalDisplayText = animalDisplay.querySelector("#big_text");
        const profileContainer = animalDisplay.querySelector("#profile_container");

        animalDisplayText.innerHTML = "Filter results"
        profileContainer.innerHTML = "<div id='big_text'>Loading animals...</div>"

        retrieveFilteredProfiles(domain)
    }
}

const form = document.querySelector("#filter_menu form") 
form.addEventListener("submit", function (e){ //apply filters
    e.preventDefault();
    var success = selectFilters(new FormData(form));
    if (success === true) {
        document.getElementById("active_filters").innerHTML = "";
        displayFilters();
        hideFilterMenu();
    } else {
        alert("Please select filters before submitting!");
    }
});





//API stuff

//age, species_id, breed_id, gender_id, adoption_status_id, id, min_age, max_age
function retrieveAllProfiles(domain){

    fetch("/animals", {
        method: "GET"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error: The response was not ok, please check logs for error message.");
        }
        return response.json();
    })
    .then(data => {
        loadProfiles(data, domain);
    })
    .catch(error => {
        console.error("Error: ", error);
    });

}
//age, species_id, breed_id, gender_id, adoption_status_id, id, min_age, max_age
function retrieveFilteredProfiles(domain){

    const entries = Object.entries(storedFilters)
    var fetchStatement = "/animals?";
    for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i];
        const convertedKey = convertKeyToSQLFormat(key)

        if (Array.isArray(value) === true) {
            fetchStatement += convertedKey + "="
            for (let z = 0; z < value.length; z++) {
                fetchStatement +=  + value[z]
                if (z !== value.length - 1) {
                    fetchStatement += ","
                }
            }
            fetchStatement += "&"
        } else {
            fetchStatement += convertedKey + "=" + value + "&"
        }

    }

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
        loadProfiles(data, domain);
    })
    .catch(error => {
        console.error("Error: ", error);
    });

}

const profilesPerRow = 4;
function loadProfiles(data, domain){
    if (data.length === 0) {
        document.getElementById("profile_container").innerHTML = "<div id='big_text'>Sorry we were not able find any results...</div>"
    } else {
        const profileContainer = document.getElementById("profile_container");
        profileContainer.innerHTML = ""; //remove the loading text
        var urlDomain = ""
        if (domain === 'admin') {
            urlDomain = "./admin_detailed_profile.html?id="
        } else {
            urlDomain = "./detailed_profile.html?id="
        }

        for (let i = 0; i < data.length; i += profilesPerRow){
            var HTMLCode = ""
            for (let z = 0; z < profilesPerRow && i + z < data.length; z++){
                HTMLCode += "<a class='mini_animal_profile' href='" + urlDomain + data[i + z].id +
                "'><img src='./images/" + data[i + z].image +
                "'><div id='profile_big_text'>" + data[i + z].name +
                "</div><div id='profile_small_text'>" + data[i + z].breed + 
                "</div><div id='profile_small_text'>" + data[i + z].age +
                " years old</div></a>"
            }

            profileContainer.innerHTML += "<div class='profile_row'>" + HTMLCode + "</div>"
        }
    }
}

function convertKeyToSQLFormat(key) {
    if (key === "minAge") {
        return "min_age";
    } else if (key === "maxAge") {
        return "max_age";
    } else if (key === "adoptionStatus") {
        return "adoption_status_id";
    } else if (key === "gender") {
        return "gender_id";
    } else if (key === "species") {
        return "species_id";
    } else if (key === "breed") {
        return "breed_id";
    }
}

function valueConverter(key, value) {
    if (key === "adoptionStatus") {
        if (value == 1) {
            return "Avaliable";
        } else if (value == 2) {
            return "Reserved";
        } else {
            return "Adopted";
        }
    } else if (key === "gender") {
        if (value == 1) {
            return "Male";
        } else {
            return "Female";
        }
    } else if (key === "species") {
        if (value == 1) {
            return "Cat";
        } else if (value == 2) {
            return "Dog";
        } else {
            return "Rabbit";
        }
    } else if (key === "breed") {
        if (value == 1) {
            return "American Shorthair";
        } else if (value == 2) {
            return "Maine Coon";
        }  else if (value == 3) {
            return "Golden Retriever";
        } else if (value == 4) {
            return "Japanese Spitz";
        } else if (value == 5) {
            return "American Fuzzy Lop";
        }else {
            return "Polish Rabbit";
        }
    }
}