![Website Snippet](https://i.imgur.com/DOTZVXM.png)

# About This Project 
Virus Checker is a web application which, at a basic level, allows the user to enter a hash into a text field and checks if the given hash represents a virus or is malicious.  The Virus Checker system has its own database, but in order to provide consistent service, the system uses third party programs and API calls in order to fill in any gaps not covered by the Virus Checker database.  The database native to Virus Checker itself stores hashes as a key and associated metadata with said key in a table for the user to access via submitting a hash in the text field.  If the hash that was entered does not exist in the database, Virus Checker uses API calls in order to find the metadata on the hash from the VirusTotal website.  After entering a hash, the user will be shown the relevant information regardless of where the data is requested from (the native database or the 3rd party database).  If an API call is used, the metadata that is output will be saved in the Virus Checker native database so that an API call will not be needed in the future for the same hash.

Virus Checker includes a user login account system.  Users are able to create simple accounts in order to use Virus Checker. Each account will have a username and password and will store simple data within for the user’s convenience.  Such data will include the amount of time a particular user has made an API call via hash check requests as well as previous hashes that the user has searched before. Because these API calls are limited over specific amounts of time, Virus Checkers can use this data to warn the user when they are reaching the limit of API calls.  In addition, the account system will include password encryption in order to maintain a measure of security for Virus Checker users.


# How to Run

## Required Software
### To run this project you will need a [MySQL database](https://www.mysql.com/downloads/), and [Node.js](https://nodejs.org/en/download/) installed
### To handle API calls to Virus Total if the default key does not work you may have to create your own [Virus Total Account](https://www.virustotal.com/) and get a public API key.

## Initializing the Database
To initialize the database the file `DatabaseInit.sql` contains the required sql code for initialization it is recomended when creating the database to use the the default port and password if any of these are different the sql connection variables in `backend\index.js` must be adjusted too. The default database password is `password` and the default port is `3306`

It is recommended to use [MySQL Workbench](https://www.mysql.com/products/workbench/) to initialize the database. After creating a database, connect to it with MySQL workbench and click File->Open SQL Script to open DatabaseInit.sql. You can now run the script and it will setup the database schemea, this only needs to be done once.

## Installing Node.JS Packages
Once Node.JS is installed using a command line terminal move to the `frontend` directory and run the command 

`npm install`

Once this finishes move to the `backend` directory and once again run the command

`npm install`

If the default API key does not work you will now have to insert your own. In the file `backend\node_modules\node-virustotal\v3.js` set the variable `defaultKey` to the public API key obtained from Virus Total.

## Starting the Front End and Back End
Once the database is running and the packages are installed running the website requires two command terminals one for the front end and one for the back end

### Back End
With one of the terminals move to the `backend` directory and run the command:

`node index.js`

### Front End
With the other terminal move to the `frontend` directory and run the command:

`npm start`

Now that both the front end and backend are running open a web browser and go to the site `localhost:3000` to access the working website