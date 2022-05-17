CREATE SCHEMA sql447;
CREATE TABLE sql447.HashId(
    Id INT  PRIMARY KEY AUTO_INCREMENT,
    Hash VARCHAR(255),
    PopularName VARCHAR(255),
    FileType VARCHAR(255),
    MD5rep   VARCHAR(255),
    Sha256rep   VARCHAR(255),
    Threat VARCHAR(255),
    FileSize INT,
    FirstSub INT,
    LastSub INT,
    NumTimeSub   INT,
    NumEnginesDetected INT,
    NumEnginesUndetected INT
);

CREATE SCHEMA 447UserCred;
CREATE TABLE 447UserCred.userCredTable(
    PersonId INT PRIMARY KEY AUTO_INCREMENT,
    FullName VARCHAR(255),
    Email VARCHAR(255),
    Username VARCHAR(255),
    PasswordHash VARCHAR(255)
);