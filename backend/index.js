const mysql = require('mysql');
const express = require('express');
const bodyparser =  require('body-parser');
var cors = require('cors')
const request = require('request');






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


const searchSQL = async (checkHash, paramsId) => {

    var sql = "SELECT * FROM HashId WHERE EXISTS (SELECT Hash FROM HashId WHERE Hash = '"+checkHash+"')";

    mySQLconnection.query(sql, paramsId, (err,rows,fields)=>{
        if(!rows[0]){
            console.log("not found");

        }
        else{
            console.log(rows)
            console.log("searchSQL");
            return true;
          }
        })
   return false;
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


        found = searchSQL(req.body.Hash, [req.params.id]);
        var sql = "INSERT INTO `HashId` (`Hash`) VALUES ('" + req.body.Hash +  "')";
        mySQLconnection.query(sql,  [req.params.id],(err,rows,fields)=>{
            if(!err){
            
                res.send(rows);
            }
            else{
            
                console.log(err);
            }
            })
        
        
        
        
        
        
        });

      