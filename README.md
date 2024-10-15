# PlantPal

## Description
PlantPal is a user-friendly platform designed to help plant lovers, whether they are beginners or seasoned enthusiasts, provide the best care for their plants. Our website offers personalized plant care tips that are tailored to the specific needs of each plant species.

With PlantPal, you can easily manage your plants' watering schedules, understand their sunlight requirements, and follow expert guidance to ensure they thrive. Our goal is to make plant care simple, intuitive, and accessible for everyone, so you can keep your plants healthy and happy with minimal effort.

### Demo

## Setup

### Built with
* React
* Express
* Node.js
* MySQL
* Redux
* Material UI

### Prerequisites
You need to create a .env file and add variables for the following:
* MYSQL_HOST
* MYSQL_USER
* MYSQL_PASSWORD
* MYSQL_DATABASE
* PERENUA_API_KEY

### MySQL Database setup

#### Installation

1. Install mysql
```bash
brew install mysql
```

2. Start mysql services with with

```bash
brew services start mysql
```

3. run installation with

```bash
mysql_secure_installation
```

#### Database setup

You have to create a user and database that matches the `.env` file configuration so that the website can connect.

### Installation for development server

1. Install npm dependenicies with

```bash
npm install
```

2. Build the application with

```bash
npm run build:dev
```

3. Run server and client

```bash
npm run dev
```

4. Access the website at https://localhost:3000

## Endpoints

### Auth

| Method | Endpoint            | Description                                                                 | Required Queries/Body Parameters |
|--------|---------------------|-----------------------------------------------------------------------------|----------------------------------|
| GET    | /auth/isAuthenticated    | Checks if a user is authenticated                                            | None                             |
| POST   | /auth/register           | Creates a new user account. Checks if the email is already in use            | `email`, `password`              |
| POST   | /auth/login              | Logs in a user. Checks if the email and password are correct                 | `email`, `password`              |
| POST   | /auth/logout             | Logs out a user     

| Middleware   | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| requireAuth  | Middleware for checking if a user is authenticated     

### Plant

| Method | Endpoint            | Description                                                                 | Required Queries/Body Parameters |
|--------|---------------------|-----------------------------------------------------------------------------|----------------------------------|
| POST   | /plants/add                | Adds a plant to the user's profile                                           | `id`, `plantName`, `wateringFrequency`, `lastWatered`, `imageURL`, `imageFile` |
| POST   | /plants/delete             | Deletes a plant from the user's profile                                      | `plantName`                      |
| POST   | /plants/update             | Updates a plant in the user's profile                                        | `plantName`, `lastWatered`       |
| GET    | /plants/get                | Retrieves all plants associated with the user                                | None                             |
| GET    | /plants/search             | Searches for plant species                                                   | `query`                          |
| GET    | /plants/care_advice        | Retrieves care advice for a specific plant                                   | `query`                          |

#### Deploy on gcloud


docker build . -t plantpal --platform linux/amd64

docker tag plantpal europe-west2-docker.pkg.dev/plant-pal-438113/plantpal/plantpal:latest

docker push europe-west2-docker.pkg.dev/plant-pal-438113/plantpal/plantpal:latest 