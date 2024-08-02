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
  async insertUser(user) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.db.insert(user, (err, doc) => {
          if (err) reject(err);
          else resolve(doc);
        });
      });
      return result;
    } catch (err) {
      console.error("Error inserting user", err);
      throw err;
    }
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
  async findOne(query) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.db.findOne(query, (err, doc) => {
          if (err) reject(err);
          else resolve(doc);
        });
      });
      return result;
    } catch (err) {
      console.error("Error finding user", err);
      throw err;
    }
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
  async find(query) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.db.find(query, (err, docs) => {
          if (err) reject(err);
          else resolve(docs);
        });
      });
      return result;
    } catch (err) {
      console.error("Error finding users", err);
      throw err;
    }
  }

  // Delete a user by ID
  async deleteUserById(userId) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.db.remove({ _id: userId }, {}, (err, numRemoved) => {
          if (err) reject(err);
          else resolve(numRemoved);
        });
      });
      return result;
    } catch (err) {
      console.error("Error deleting user", err);
      throw err;
    }
  }
}

module.exports = UserDAO;
