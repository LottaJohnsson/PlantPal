# PlantPal

## Start local development

### Installation

Install with

`npm install`

Run server and client with

`npm run dev`

If needed, rebuild with

`npm run build:prod`

### MySQL Database setup

#### Installation

Must install MySQL first. Use script mysql_setup.sh by running `./mysql_setup.sh` in termnial. Need to have brew. If that does not work, do a manual installation as follows

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