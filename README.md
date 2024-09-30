# PlantPal

### Installation

Install with

`npm install`

Run server and client with

`npm run dev`

### MySQL Database setup

Just follow steps, copy paste :D

#### Installation
Must install MySQL first

`brew install mysql`

Start mysql services with with

`brew services start mysql`

run installation with

`mysql_secure_installation`

IMPORTANT use password "StrongPassword123!"

#### Database setup

start MySQL in terminal `mysql -u root -p`

Now create a plantpal user

`CREATE USER 'plantpal'@'localhost' IDENTIFIED BY 'StrongPassword123!';`

`GRANT ALL PRIVILEGES ON plantpalDB.* TO 'plantpal'@'localhost';`

Apply changes
`FLUSH PRIVILEGES;`

create database `CREATE DATABASE plantpalDB;`

Done! now run `npm run dev`