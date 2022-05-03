const mysql = require('mysql');
const express = require('express');
const bodyparser =  require('body-parser');
var cors = require('cors')
const request = require('request');
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const flatten = require('flat').flatten;
var crypto = require('crypto');


let hashExists;
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
        if(!rows[0]) { hashExists = false; }
        else{hashExists = true; }

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




app.post('/hashes', (req, res)=> {

        hashEntryExists(req.body.Hash, [req.params.id]);
        
        //wait for sql reply and edit
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
    
                        
                        var sql = "INSERT INTO `HashId` (`Hash`) VALUES ('" + req.body.Hash +  "')";
                    mySQLconnection.query(sql,  [req.params.id],(err,rows,fields)=>{
                        if(!err){
                        
                            console.log("VIRUS HASH FOUND- ADDED TO DATABASE");                    
                        }
                        else{
                        
                            console.log(err);
                        }
                 }
                        )
    
                       res.send(flatten(JSON.parse(resp)));
                        return resp;
                      });
        
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
    
                        
                        var sql = "INSERT INTO `HashId` (`Hash`) VALUES ('" + req.body.Hash +  "')";
                    mySQLconnection.query(sql,  [req.params.id],(err,rows,fields)=>{
                        if(!err){
                        
                            console.log("VIRUS HASH FOUND- ADDED TO DATABASE");                    
                        }
                        else{
                        
                            console.log(err);
                        }
                 }
                        )
    
                       res.send(flatten(JSON.parse(resp)));
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
          
           var sql = "SELECT * FROM userCredTable WHERE EXISTS (SELECT Username FROM userCredTable WHERE Username = '"+req.body.Username +"');";

           userCredDatabase.query(sql, paramsId, (err,rows,fields)=>{
              if(!rows[0]) { if(rows[0].Username ===req.body.Username && rows[0].PasswordHash ===req.body.PasswordHash  ){res.send({login:"success"});}  }
              else{res.send({login:"success"});}
      
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

