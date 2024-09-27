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


}

export default new Model();