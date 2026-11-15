var express = require("express");
var db = require("./db-connections")
var app = express();

app.use(express.json());
app.use(express.static("./public"));

app.listen(8080, "127.0.0.1");
console.log("web server running @http://127.0.0.1:8080");

app.route("/animals").get(function (req,res){
    //age, species_id, breed_id, gender_id, adoption_status_id, id, min_age, max_age
    var sql = "SELECT animals.id, animals.name, animals.image, animals.age, species.species AS species, breed.breed AS breed, gender.gender AS gender, animals.personality_description, adoption_status.status AS adoption_status FROM animal_database.animals JOIN animal_database.gender ON animals.gender_id = gender.id JOIN animal_database.species ON animals.species_id = species.id JOIN animal_database.breed ON animals.breed_id = breed.id JOIN animal_database.adoption_status ON animals.adoption_status_id = adoption_status.id WHERE 1 = 1 ";
    const query_params = req.query;
    
    for (let i = 0; i < Object.keys(query_params).length; i++){
        const key = Object.keys(query_params)[i];
        const item = Object.values(query_params)[i];
        if (key == "min_age") {
            sql += " AND age" + " >= " + String(item);
        } else if (key == "max_age") {
            sql += " AND age" + " <= " + String(item);
        } else if (item.includes(",")) {
            const itemArray = item.split(",");
            for (let i = 0; i < itemArray.length; i++) {
                if (i === 0) {
                    sql += " AND (" + String(key) + " = " + String(itemArray[i]);
                } else if (i === itemArray.length - 1) {
                    sql += " OR " + String(key) + " = " + String(itemArray[i]) + ")";
                } else {
                    sql += " OR " + String(key) + " = " + String(itemArray[i]);
                }
            }
        } else {
            sql += " AND animals." + String(key) + " = " + String(item);
        }
    };
    sql += ";"; //end the query

    console.log(sql)

    db.query(sql, function (error, result) {
        if (error) {
            throw error;
        } else {
            res.json(result);
        }
    })
})

app.route("/add").post(function (req,res){
    var sql = "INSERT INTO animal_database.animals (name, image, age, species_id, breed_id, gender_id, personality_description, adoption_status_id) VALUES (";
    const query_params = req.query;

    for (let i =0; i < Object.keys(query_params).length; i++){
        const key = Object.keys(query_params)[i];
        const item = Object.values(query_params)[i];
        
        if (i === Object.keys(query_params).length - 1) {
            sql += item + ");";
        } else if (key == "name" || key == "image" || key == "personality_description") {
            sql += "'" + item + "'" + ", ";
        } else {
            sql += item + ", ";
        }
    };

    db.query(sql, function (error, result) {
        if (error) {
            throw error;
        } else {
            res.json(result);
            console.log(result);
        }
    })
})  

app.route("/update").put(function (req,res){
    var sql = "UPDATE animal_database.animals SET ";
    const query_params = req.query;

    for (let i =0; i < Object.keys(query_params).length; i++){
        const key = Object.keys(query_params)[i];
        const item = Object.values(query_params)[i];
        if (i === Object.keys(query_params).length - 2) {
            sql += key + " = " + item;
        } else if (i === Object.keys(query_params).length - 1) {
            sql += " WHERE id = " + item + ";";
        } else if (key == "name" || key == "image" || key == "personality_description") {
            sql += key + " = '" + item + "', ";
        } else {
            sql += key + " = " + item + ", ";
        }
    };

    db.query(sql, function (error, result) {
        if (error) {
            throw error;
        } else {
            res.json(result);
            console.log(result);
        }
    })
})

app.route("/delete").delete(function (req,res){
    const query_params = req.query;
    const id = Object.values(query_params)[0];
    var sql = "DELETE FROM animal_database.animals WHERE id=" + id + ";";

    db.query(sql, function (error, result) {
        if (error) {
            throw error;
        } else {
            res.json(result);
            console.log(result);
        }
    })
})


/*
Passing data in requests
app.route('/user/:id').get( function (req, res) {
    const userId = req.params.id; //save parameter value in variable

    Accessing the query string, /user/123?type=admin
    const userType = req.query.type;

    res.send(`User ID is ${userId}, User Type is ${userType}`);
});
http://127.0.0.1:8080/user/1?type=yup
*/