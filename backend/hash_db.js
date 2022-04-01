const request = require('request');

/**for (let index = 0; index < 200; index++) {

    let str = `${index}`;
    
    request.get('https://virusshare.com/hashfiles/VirusShare_00'+str.padStart(3, "0")+'.md5', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var lines = body;
        var cut=0;
        lines.split(/\r?\n/).forEach(line =>  {

            if ((cut > 5) & (line !== '')){
                var sql = "INSERT INTO `HashId` (`Hash`) VALUES ('" + line +  "')";
                mySQLconnection.query(sql, (err,rows,fields)=>{
            
            });
            }
            cut++;
          });

    }
});
    


}**/
