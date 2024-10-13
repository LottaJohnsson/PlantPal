import User from './Models/userModel';
import bcrypt from 'bcrypt';
import pool from './db';
import { FieldPacket, QueryResult, RowDataPacket } from 'mysql2';

interface userQueryResult extends RowDataPacket {
  email: string;
  password: string;
}

class Model {
  users: { [sessionId: string]: User}

  constructor() {
    this.users = {};
  }

  /**
   * Function for creating a new user account. Checks if the email is already in use, and if not, creates a new account. 
   * Haches the new password before storing it in the database. Add the account the the users object with current session id
   * @param sessionId Session ID of the session creating the account
   * @param email Email for the new account
   * @param password Password for the new account
   * @returns true if the account was successfully created, false if the email is already in use
   */
  async createUser(sessionId: string, email: string, password:string): Promise<boolean> {
    const [stmt]: [userQueryResult[], FieldPacket[]]  = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (stmt.length === 0){
      const hash = await bcrypt.hash(password, 10);
      const newUser = new User(email);
      this.users[sessionId] = newUser;
      await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash]);
      return true;
    }
    return false;
  }
  
  
  /**
   * 
   * @param sessionId Session ID of the session logging in
   * @param email Email of the account logging in
   * @param password Password of the account logging in
   * @returns reutrns true if the login was successful, false if the email or password is incorrect
   */
  async loginUser(sessionId: string, email: string, password: string){
    const [stmt]: [userQueryResult[], FieldPacket[]]  = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (stmt.length > 0){
      const user = stmt[0];
      if (await bcrypt.compare(password, user.password)){
        const newUser = new User(email);
        this.users[sessionId] = newUser;
        return true;
      }
    }
    return false
  }

  /**
   * Function for logging out a user. Deletes the user from the users object
   * @param sessionId Session ID of the session logging out
   */
  async logoutUser(sessionId: string){
    delete this.users[sessionId];
  }

  /**
   * Function for finding the user object for a session ID
   * @param sessionId Session ID of the session to find the user for
   * @returns user object for the session ID
   */
  findUserBySessionId(sessionId: string): User | undefined {
    return this.users[sessionId];
  }


  /**
   * Function to add a plant to the user's profile.
   * If it's an API plant, it uses api_plant_id, otherwise, the plant is manually added with plant_name.
   * @param plantName Name of the plant
   * @param wateringFrequency Watering frequency (e.g., "daily", "weekly")
   * @param latestWatered Latest watered date
   * @param apiPlantId Optional, plant ID from the API if the plant is fetched from the API
   * @param imageURL Optional, image URL of the plant
   * @param imageBlob Optional, image blob of the plant
   * @param email User email

   * @returns true if the plant was added successfully
   */
  async addPlantToUser(
    apiPlantId: string,
    plantName: string, 
    wateringFrequency: string, 
    latestWatered: string, 
    imageURL: string,
    imageFile: Buffer | null, // Allow for null imageFile
    email: string, 
  ): Promise<boolean> {
      try {
          const query = `
              INSERT INTO plants (plant_id, plant_name, watering_frequency, latest_watered, image_url, image_blob, user_email)
              VALUES (?, ?, ?, ?, ?, ?, ?)
          `; 
          // Execute query
          await pool.query(query, [apiPlantId, plantName, wateringFrequency, latestWatered, imageURL, imageFile, email]);
          
          return true;
      } catch (error) {
          console.error("Error adding plant to user:", error);
          return false;
      }
  }


  /**
   * Function to fetch all plants for a user
   * @param email User email
   * @returns Array of plants
   */
  async fetchPlantsForUser(email: string): Promise<RowDataPacket[]> {
    try {
        const query = `
            SELECT plant_id, plant_name, watering_frequency, latest_watered, image_url, image_blob
            FROM plants
            WHERE user_email = ?
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.query(query, [email]);
        return rows;
    } catch (error) {
        console.error("Error fetching plants for user:", error);
        return [];
    }
  }

  /**
   * Function to remove a plant from the user's profile
   */
  async deletePlantFromUser(plantName: string, email: string): Promise<boolean> {
    try {
        const query = `
            DELETE FROM plants
            WHERE plant_name = ? AND user_email = ?
        `;

        await pool.query(query, [plantName, email]);
        return true;
    } catch (error) {
        console.error("Error removing plant from user:", error);
        return false;
    }
  }

  /**
   * Function to update a plant in the user's profile
   * @param plantName Name of the plant
   * @param latestWatered Latest watered date
   * @param email User email
   * @returns true if the plant was updated successfully
   */
  async updatePlantInUser(
    plantName: string, 
    latestWatered: string, 
    email: string,
  ): Promise<boolean> {

    console.log("Updating plant in model!");
    console.log("plant data:", plantName, latestWatered, email);
      try {
          const query = `
              UPDATE plants
              SET latest_watered = ?
              WHERE plant_name = ? AND user_email = ?
          `;

          await pool.query(query, [latestWatered, plantName, email]);
          return true;
      } catch (error) {
          console.error("Error updating plant in user:", error);
          return false;
      }
  }
  


}

export default new Model();