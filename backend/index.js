const mysql = require('mysql');
const express = require('express');
const bodyparser =  require('body-parser');
var cors = require('cors')
const request = require('request');
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const flatten = require('flat').flatten;
let hashExists = false ;






let app= express();
app.use(cors());





app.use(bodyparser.json());

var mySQLconnection = mysql.createConnection({
host: 'localhost',
user:'root',
password:'password',
database: 'sql447',
multipleStatements: true

/**use ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';**/

});

mySQLconnection.connect((err)=> {
if(!err){
console.log("CONNECTED\n\n\n");
}
else{

    console.log(JSON.stringify(err, undefined, 2));
}



});



app.listen(5000, ()=>console.log("Express server is running at port no :5000"));


function entryExists(checkHash, paramsId) {
    var sql = "SELECT * FROM HashId WHERE EXISTS (SELECT Hash FROM HashId WHERE Hash = '"+checkHash+"')";

    mySQLconnection.query(sql, paramsId, (err,rows,fields)=>{
        console.log("Printing rows:");
        console.log(rows);

        if(!rows[0]) { hashExists = false; return; }
        else{hashExists = true; return;}
        
     }
    );
    console.log(hashExists);
    
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


        entryExists(req.body.Hash, [req.params.id]);

        setTimeout(() => {
            console.log("running SQL search", hashExists );
            if(hashExists === false)
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
                    
                        console.log(rows);
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
    
               console.log("IS A VIRUS!!!");
               res.send({"This is a virus":" This is a virus"});
    
    
    
            }
    
        }, 15000);

       
        
        
        });

      /**
       * 
       * sdk['file-info']({

                id: req.body.Hash,
              
                'x-apikey': '7a1937dfdad30b004dae4dd55fd49d28efa658d464dab3df61b5c91b15934eea'
              
              }
            )
                .then(rem => console.log(rem))
                .catch(err => console.error(err)); 
       * 
       * 
      */
