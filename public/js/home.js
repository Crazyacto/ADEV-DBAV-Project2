//age, species_id, breed_id, gender_id, adoption_status_id, id, min_age, max_age


//for home page

function retrieveLandingPageProfiles(){

    fetch("/animals?adoption_status_id=3", {
        method: "GET"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error: The response was not ok, please check logs for error message.");
        }
        return response.json();
    })
    .then(data => {
        loadLandingPageProfiles(data);
    })
    .catch(error => {
        console.error("Error: ", error);
    });

}

function loadLandingPageProfiles(data){
    const profileContainer = document.getElementById("profile_container");
    profileContainer.innerHTML = ""; //remove the loading text
    for (let i = 0; i < 3; i++){
        profileContainer.innerHTML += "<a class='mini_animal_profile' href='./detailed_profile.html?id=" + data[i].id +
        "'><img src='./images/" + data[i].image +
        "'><div id='profile_big_text'>" + data[i].name +
        "</div><div id='profile_small_text'>" + data[i].breed + 
        "</div><div id='profile_small_text'>" + data[i].age +
        " years old</div></a>"
    }
}


