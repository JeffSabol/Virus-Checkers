const mysql = require('mysql');
const express = require('express');
const bodyparser =  require('body-parser');
var cors = require('cors')
const request = require('request');
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const flatten = require('flat').flatten;
var crypto = require('crypto');
const { stringify } = require('querystring');
const sha256Length = 64;

let hashExists;
let entryExists;
let hashDetailsExist;
let usernameExists;
let emailExists;

let app= express();

app.use(cors());
app.use(bodyparser.json());






var mySQLconnection = mysql.createPool({
host: 'localhost',
user:'root',
password:'password',
database: 'sql447',
multipleStatements: true

/**use ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';**/

});

var userCredDatabase = mysql.createPool({
    host: 'localhost',
    user:'root',
    password:'password',
    database: '447UserCred',
    multipleStatements: true
    
    /**use ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';**/
    
});





app.listen(5000, ()=>console.log("Express server is running at port no :5000"));


function hashEntryExists (checkHash, paramsId) {

    var sql = "SELECT * FROM HashId WHERE EXISTS (SELECT Hash FROM HashId WHERE Hash = '"+checkHash+"');";

      mySQLconnection.query(sql, paramsId, (err,rows,fields)=>{
        if(!rows[0]) { entryExists = false; }
        else{entryExists = true; }

     }
    );
    
}

function hashEntryExistsMD5 (checkHash, paramsId) {

    var sql = "SELECT * FROM HashId WHERE EXISTS (SELECT MD5rep FROM HashId WHERE MD5rep = '"+checkHash+"');";

      mySQLconnection.query(sql, paramsId, (err,rows,fields)=>{
        if(!rows[0]) { hashExists = false; }
        else{hashExists = true; }

     }
    );
    
}

function hashEntryExistsSha256 (checkHash, paramsId) {

    var sql = "SELECT * FROM HashId WHERE EXISTS (SELECT Sha256rep FROM HashId WHERE Sha256rep = '"+checkHash+"');";

      mySQLconnection.query(sql, paramsId, (err,rows,fields)=>{
        if(!rows[0]) { hashExists = false; }
        else{hashExists = true; }

     }
    );
    
}

function hashDetailExists (checkHash, paramsId) {

    var sql = "(SELECT FileType FROM HashId WHERE Hash = '"+checkHash+"' );";

      mySQLconnection.query(sql, paramsId, (err,rows,fields)=>{
        if(rows[0]) {
             if (rows[0].FileType === ""){  hashDetailsExist = false;  } 
            else{hashDetailsExist = true; }   
    }

       

     }
    );
    
}


function usernameEntryExists(checkUsername, paramsId) {

    var sql = "SELECT * FROM userCredTable WHERE EXISTS (SELECT Username FROM userCredTable WHERE Username = '"+checkUsername+"');";

      userCredDatabase.query(sql, paramsId, (err,rows,fields)=>{
        if(!rows[0]) { usernameExists = false; }
        else{usernameExists = true; }
      
     }
    );
    
}

function emailEntryExists(checkEmail, paramsId) {

    var sql = "SELECT * FROM userCredTable WHERE EXISTS (SELECT Email FROM userCredTable WHERE Email = '"+checkEmail+"');";

     userCredDatabase.query(sql, paramsId, (err,rows,fields)=>{
        if(!rows[0]) { emailExists = false; }
        else{emailExists = true; }

     }
    );

}



app.get('/hashes',   (req, res)=>{
mySQLconnection.query('SELECT * FROM HashId',(err,rows,fields)=>{

    if(!err){
        
        res.send(rows);
        
    }
    else{
    
        console.log(err);
    }
 
    })

});


app.get('/hashes/:id', (req, res)=>{
    mySQLconnection.query('SELECT * FROM HashId WHERE Id = ?', [req.params.id],(err,rows,fields)=>{
        if(!err){
        
            res.send(rows);
        }
        else{
        
            console.log(err);
        }
        })

    });


app.post('/users', (req, res)=>{




        let token = atob(req.body.token);
        var sql = "(SELECT Username,Email,FullName FROM userCredTable WHERE Username = '"+token +"');";
        userCredDatabase.query(sql, [req.params.id],(err,rows,fields)=>{
            if(!err){
            
                res.send(
                    {
                        Username: token,
                        FullName:rows[0].FullName,
                        Email: rows[0].Email


                    }

                );
            }
            else{
            
                console.log(err);
            }
            })
    
        });



app.post('/hashes', (req, res)=> {
            hashEntryExists(req.body.Hash, [req.params.id]); 

        if ((req.body.Hash.length) === sha256Length){
            hashEntryExistsSha256(req.body.Hash, [req.params.id]);  

        }
        else{
            hashEntryExistsMD5(req.body.Hash, [req.params.id]);
        }
        hashDetailExists(req.body.Hash, [req.params.id]);

        
        //wait for sql reply and edit
        setTimeout(() => {
            if(!(hashExists && hashDetailsExist))
                {
        
                    
                    //API virus total
                    //7a1937dfdad30b004dae4dd55fd49d28efa658d464dab3df61b5c91b15934eea         
                    //change default key in v3
                    const theSameObject = defaultTimedInstance.fileLookup(req.body.Hash, function(err, resp){
                        if (err) {
                          console.log('Well, crap.');
                         res.send(err);
                          return;
                        }
                        resp = flatten(JSON.parse(resp));

                        if(entryExists){
                            console.log("updating hash details ")
                            var updateQuery = "UPDATE HashId  SET  PopularName = '"+ resp["data.attributes.meaningful_name"] +  "',FileType='" + resp["data.attributes.type_description"]  +  "',MD5rep='"  + resp["data.attributes.md5"]  + "',Sha256rep='"  + resp["data.attributes.sha256"]  +  "',Threat='" + resp["data.attributes.popular_threat_classification.suggested_threat_label"]  + "',FileSize="  + resp["data.attributes.size"]+  ",FirstSub="   +  resp["data.attributes.first_submission_date"]  +  ",LastSub="  + resp["data.attributes.last_submission_date"] +  ",NumTimeSub=" + resp["data.attributes.times_submitted"] + ",NumEnginesDetected="  + resp["data.attributes.last_analysis_stats.malicious"] +  ",NumEnginesUndetected=" + resp["data.attributes.last_analysis_stats.undetected"] +" WHERE  Hash = '" +req.body.Hash+"' ;";
                            mySQLconnection.query(updateQuery,  [req.params.id],(err,rows,fields)=>{
                                if(!err){
                                
                                    console.log("VIRUS Hash  Details Updated");                    
                                }
                                else{
                                
                                    console.log(err);
                                }
                         }
                                )

                        }
                        else{
                            console.log("Hash doesn't exist in our database... checking external databases");

                            var sql = "INSERT INTO `HashId` (`Hash`, `PopularName`, `FileType`, `MD5rep`,`Sha256rep`, `Threat`, `FileSize`, `FirstSub`, `LastSub`, `NumTimeSub` , `NumEnginesDetected` , `NumEnginesUndetected` ) VALUES('" + req.body.Hash +  "','" + resp["data.attributes.meaningful_name"] +  "','" + resp["data.attributes.type_description"]  +   "','" + resp["data.attributes.md5"]  +  "','" + resp["data.attributes.sha256"]  +  "','" + resp["data.attributes.popular_threat_classification.suggested_threat_label"]  +  "'," + resp["data.attributes.size"]+  ","   +  resp["data.attributes.first_submission_date"]  +  "," + resp["data.attributes.last_submission_date"] +  "," + resp["data.attributes.times_submitted"] +","+ resp["data.attributes.last_analysis_stats.malicious"] +  "," + resp["data.attributes.last_analysis_stats.undetected"] +  ")";
                            mySQLconnection.query(sql,  [req.params.id],(err,rows,fields)=>{
                                if(!err){
                                
                                    console.log("VIRUS HASH FOUND- ADDED TO DATABASE");                    
                                }
                                else{
                                
                                    console.log(err);
                                }
                         }
                                )
                        }

                     
    
                       res.send(resp);
                        return resp;
                      });
        
                }
                else
                {
                    console.log("THIS EXISTS IN OUR DATABASE- NOW DISPLAYING DATA");


                    var sql = "(SELECT * FROM HashId WHERE  Hash = '"+req.body.Hash +"'  OR Sha256rep = '"+req.body.Hash +"'  OR  MD5rep = '"+req.body.Hash +"'  );";
                    mySQLconnection.query(sql, [req.params.id],(err,rows,fields)=>{
                        if(!err){
                        
                            res.send(
                                
                        
                                {
    
                                    "data.attributes.last_analysis_stats.malicious": rows[0].NumEnginesDetected ,
                                    "data.attributes.last_analysis_stats.undetected": rows[0].NumEnginesUndetected ,
                                    "data.attributes.meaningful_name": rows[0].PopularName ,
                                    "data.attributes.size":rows[0].FileSize ,
                                    "data.attributes.type_description": rows[0].FileType,
                                    "data.attributes.popular_threat_classification.suggested_threat_label": rows[0].Threat  ,
                                    "data.attributes.md5": rows[0].MD5rep  ,
                                    "data.attributes.sha256": rows[0].Sha256rep ,
                                    "data.attributes.times_submitted": rows[0].NumTimeSub ,
                                    "data.attributes.first_submission_date": rows[0].FirstSub,
                                    "data.attributes.last_submission_date":rows[0]. LastSub
                                
                                
                                }
            
                            );
                        }
                        else{
                        
                            console.log(err);
                        }
                        });


                }

        }, 1000);
      





        });

app.post('/hashes', (req, res)=> {

        hashEntryExists(req.body.Hash, [req.params.id]);
        
        //wait for sql reply sand edit
        setTimeout(() => {
            if(!hashExists)
                {
        
                    console.log("Hash doesn't exist in our database... checking external databases");
        
                    //API virus total
                    //7a1937dfdad30b004dae4dd55fd49d28efa658d464dab3df61b5c91b15934eea         
                    //change default key in v3
                    const theSameObject = defaultTimedInstance.fileLookup(req.body.Hash, function(err, resp){
                        if (err) {
                          console.log('Well, crap.');
                         res.send(err);
                          return;
                        }
    
                        resp = flatten(JSON.parse(resp));
                        

                        var sql = "INSERT INTO `HashId` (`Hash`, `PopularName`, `FileType`, `MD5rep`,`Sha256rep`, `Threat`, `FileSize`, `FistSub`, `LastSub`, `NumTimeSub` ) VALUES('" + req.body.Hash +  "','" + resp.data["data.attributes.meaningful_name"] +  "','" + resp.body.FileType  +   "','" + resp.body.MD5rep  +  "','" + resp.body.Sha256rep  +  "','" + resp.body.Threat  +  "','" + resp.body.FileSize  +  resp.body.FirstSub  +  "','" + resp.body.LastSub  +  "','" + resp.body.NumTimeSub  +  "')";
                    mySQLconnection.query(sql,  [req.params.id],(err,rows,fields)=>{
                        if(!err){
                        
                            console.log("VIRUS HASH FOUND- ADDED TO DATABASE");   
                            
                 
                        }
                        else{
                        
                            console.log(err);
                        }
                 }
                        )
    
                       res.send(resp);
                        return resp;
                      });
                      //res.send({name:"test read this!!!! 01984e93jinc jmd jwc "});   
        
                }
                else
                {
                    
        
                    console.log("THIS EXISTS IN OUR DATABASE- NOW DISPLAYING METADATA");
    
                    const theSameObject = defaultTimedInstance.fileLookup(req.body.Hash, function(err, resp){
                        if (err) {
                          console.log('Well, crap.');
                         res.send(err);
                          return;
                        }
                        
    
                       res.send(flatten(JSON.parse(resp)));
                        return resp;
                      });  
                }
        }, 15000);
      

        });




app.post('/login', (req, res)=> {

            console.log(req.body.Username+" tried to login")
           
            var sql = "(SELECT Username,PasswordHash FROM userCredTable WHERE Username = '"+req.body.Username +"');";
 //SELECT * FROM userCredTable WHERE EXISTS 
     let hashPass = crypto.createHash('sha256').update(req.body.PasswordHash).digest('base64');
            userCredDatabase.query(sql, [req.params.id], (err,rows,fields)=>{
             console.log("hello");
             console.log(rows); 
             if(!rows[0]) {
                 console.log("0");  
                 res.send({login:"failure"}); }
             else{
                 
                 if(rows[0].Username ===req.body.Username && rows[0].PasswordHash ===hashPass  ){
                    let token = btoa(rows[0].Username);
                     res.send({login:"success", token:token});
                   
                 }
                 console.log("1");
                 }
       
            })
         
             });   
        


app.post('/signup', (req, res)=> {

           
                console.log(req.body.FullName+" tried to SignUp")

               usernameEntryExists(req.body.Username,[req.params.id])
                emailEntryExists(req.body.Email,[req.params.id])

                setTimeout(() => {
                    console.log("Emailexists: "+emailExists)
                    console.log("Unameexists: "+usernameExists) 

                    if(usernameExists && emailExists){

                        return res.send({hiddenU:"Username",hiddenE:"Email"});

                    }

                    else if(usernameExists){


                        return res.send({hiddenU:"Username",hiddenE:""});
                    }
                   else if(emailExists){


                        return res.send({hiddenU:"",hiddenE:"Email"});
                    }
                    //PASSOWRD ENCRYPTION HERE
                    const hashPass = crypto.createHash('sha256').update(req.body.PasswordHash).digest('base64');

                    //console.log("pass hash:", hashPass);

                    var sql ="INSERT INTO `userCredTable` (`FullName`, `Email`,`Username`,`PasswordHash`) VALUES ('" + req.body.FullName +  "','" + req.body.Email  +  "','" + req.body.Username  +  "','" + hashPass  +  "')";
                    userCredDatabase.query(sql,  [req.params.id],(err,rows,fields)=>{
                       if(!err){
                            
                           console.log("New user created "); 
                           return res.send({status:"success"});                   
                       }
                       else{
                       
                           console.log(err);
                           return res.send({status:"failure"}); 
                       }
                }
                       )
                }, 1000);
                


                

    
            });  


           
            




            /**
             * 
             * 
CREATE SCHEMA sql447;
CREATE TABLE sql447.HashId(
Id INT  Primary key AUTO_INCREMENT,
Hash Varchar(255),
PopularName Varchar(255),
FileType varchar(255),
MD5rep   varchar(255),
Sha256rep   varchar(255),
Threat Varchar(255),
FileSize INT,
FirstSub INT,
LastSub INT,
NumTimeSub   INT,
NumEnginesDetected INT,
NumEnginesUndetected INT


);
             */