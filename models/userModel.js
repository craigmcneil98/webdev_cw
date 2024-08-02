const Datastore = require("nedb");
const bcrypt = require("bcrypt");

const saltRounds = 10;

class UserDAO {
  constructor(dbFilePath) {
    this.db = new Datastore({ filename: dbFilePath?.filename, autoload: true });
  }

  // Initialize the database with users
  async init() {
    const demoUsers = [
      { user: 'Admin', password: await bcrypt.hash('Admin', saltRounds), role: 'admin', location: 'Glasgow' },
      { user: 'John', password: await bcrypt.hash('John', saltRounds), role: 'normalUser', location: 'Edinburgh' }
    ];

    try {
      for (const user of demoUsers) {
        await this.insertUser(user);
        console.log("Demo user inserted:", user);
      }
    } catch (err) {
      console.error("Error inserting demo users", err);
    }
  }

  // Insert a user
  insertUser(user) {
    return new Promise((resolve, reject) => {
      this.db.insert(user, (err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  }

  // Create a new user with hashed password and location
  async create(username, password, role, location) {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = { user: username, password: hashedPassword, role, location };
      await this.insertUser(newUser);
      console.log("User created:", newUser);
    } catch (err) {
      console.error("Error creating user:", username, err);
    }
  }

  // Lookup user by username
  async lookup(username) {
    try {
      const user = await this.findOne({ user: username });
      console.log("User lookup result:", user);
      return user;
    } catch (err) {
      console.error("Error looking up user:", username, err);
      return null;
    }
  }

  // Find a single user
  findOne(query) {
    return new Promise((resolve, reject) => {
      this.db.findOne(query, (err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  }

  // Get all users
  async getAllUsers() {
    try {
      const users = await this.find({});
      console.log("getAllUsers() returns:", users);
      return users;
    } catch (err) {
      console.error("Error getting all users", err);
      throw err;
    }
  }

  // Find users
  find(query) {
    return new Promise((resolve, reject) => {
      this.db.find(query, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }

  // Delete a user by ID
  deleteUserById(userId) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: userId }, {}, (err, numRemoved) => {
        if (err) {
          reject(err);
        } else {
          resolve(numRemoved);
        }
      });
    });
  }
}

module.exports = UserDAO;
