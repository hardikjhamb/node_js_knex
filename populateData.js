const knex = require("./MySqlConnection");
const axios = require('axios');
let populatedCount = 0;
let Status = false;
async function populateData(){
    if(!Status){
        Status = true;
        do{
            await axios.get('https://randomuser.me/api/').then(resp => {
                // console.log(resp.data);
                if(resp.data.results.length>0){
                    let Result = resp.data.results[0];
                    // Person
                    knex("person").select("person_id").where({uuid:Result.login.uuid}).then(async function(dataCheck){
                        if(dataCheck.length>0){
                            let personInfo = dataCheck[0];
                            await knex("person").update({
                                first_name: Result.name.first,
                                last_name: Result.name.last,
                                dob: new Date(Result.dob.date)
                            }).where({person_id: personInfo.person_id});
                            await knex("Address").update({
                                street_number: Result.location.street.name,
                                city: Result.location.city
                            }).where({person_id: personInfo.person_id});
                            await knex("Phone").update({
                                phone_no: Result.phone+","+Result.cell
                            }).where({person_id: personInfo.person_id});
                            await knex("email").update({
                                email: Result.email
                            }).where({person_id: personInfo.person_id});
                        }else{
                            await knex("person").insert({
                                uuid: Result.login.uuid,
                                first_name: Result.name.first,
                                last_name: Result.name.last,
                                dob: Result.dob.date
                            });
                            await knex("person").select("person_id").where({uuid:Result.login.uuid}).then(async function(person){
                                let personInfo = person[0];
                                await knex("Address").insert({
                                    person_id: personInfo.person_id,
                                    street_number: Result.location.street.name,
                                    city: Result.location.city
                                })
                                await knex("Phone").insert({
                                    person_id: personInfo.person_id,
                                    phone_no: Result.phone+","+Result.cell
                                })
                                await knex("email").insert({
                                    person_id: personInfo.person_id,
                                    email: Result.email
                                })
                            })
                        }
                    })
                }
            });
            populatedCount += 1;
            if(populatedCount===10){
                Status = false;
                populatedCount = 0;
            }
            console.log("populatedCount: "+populatedCount)
        }while(populatedCount>0&&populatedCount<100)
    }else{
        console.log({status:200, Message:"Data populate in-progress", populatedCount:populatedCount})
    }
}
exports.populateData=populateData