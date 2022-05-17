const request = require("request");

var mySQLconnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "sql447",
  multipleStatements: true,

  /**use ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';**/
});

mySQLconnection.connect((err) => {
  if (!err) {
    console.log("CONNECTED\n\n\n");
  } else {
    console.log(JSON.stringify(err, undefined, 2));
  }
});

for (let index = 0; index < 1; index++) {
  let str = `${index}`;

  request.get(
    "https://virusshare.com/hashfiles/VirusShare_00" +
      str.padStart(3, "0") +
      ".md5",
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var lines = body;
        var cut = 0;
        lines.split(/\r?\n/).forEach((line) => {
          if ((cut > 5) & (line !== "")) {
            var sql = "INSERT INTO `HashId` (`Hash`) VALUES ('" + line + "')";
            mySQLconnection.query(sql, (err, rows, fields) => {});
          }
          cut++;
        });
      }
    }
  );
}
