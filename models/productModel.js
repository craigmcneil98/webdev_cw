const nedb = require("nedb");

class ProductDAO {
  constructor(dbFilePath) {
    this.db = dbFilePath ? new nedb({ filename: dbFilePath.filename, autoload: true }) : new nedb();
  }

  // Function to initialize the database with some sample data
  async init() {
    try {
      // Sample data for initialization with the "location" field
      await this.insert({ name: "Sample Product", price: 10.00, description: "This is a sample product.", location: "Glasgow" });
      console.log("Sample product inserted");

      await this.insert({ name: "Blue Jeans", price: 50.00, description: "This is a pair of blue jeans.", location: "Edinburgh" });
      console.log("Sample product inserted");
    } catch (err) {
      console.error("Error inserting sample products", err);
    }
  }

  // Helper method to wrap database operations in Promises
  async insert(product) {
    return new Promise((resolve, reject) => {
      this.db.insert(product, (err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  }

  async getAllProducts() {
    try {
      const products = await new Promise((resolve, reject) => {
        this.db.find({}, (err, docs) => {
          if (err) reject(err);
          else resolve(docs);
        });
      });
      console.log("getAllProducts() returns:", products);
      return products;
    } catch (err) {
      console.error("Error getting all products", err);
      throw err;
    }
  }

  async getProductById(productId) {
    try {
      const product = await new Promise((resolve, reject) => {
        this.db.findOne({ _id: productId }, (err, doc) => {
          if (err) reject(err);
          else resolve(doc);
        });
      });
      console.log("getProductById() returns:", product);
      return product;
    } catch (err) {
      console.error("Error getting product by ID", err);
      throw err;
    }
  }

  async getProductsByLocation(location) {
    try {
      const products = await new Promise((resolve, reject) => {
        this.db.find({ location }, (err, docs) => {
          if (err) reject(err);
          else resolve(docs);
        });
      });
      return products;
    } catch (err) {
      console.error("Error getting products by location", err);
      throw err;
    }
  }

  async addProduct(product) {
    try {
      const result = await this.insert(product);
      console.log("Product inserted into the database", result);
      return result;
    } catch (err) {
      console.error("Error inserting product", err);
      throw err;
    }
  }

  async updateProduct(productId, updatedProduct) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.db.update({ _id: productId }, { $set: updatedProduct }, { returnUpdatedDocs: true }, (err, numReplaced, doc) => {
          if (err) reject(err);
          else resolve(doc);
        });
      });
      console.log("updateProduct() returns:", result);
      return result;
    } catch (err) {
      console.error("Error updating product", err);
      throw err;
    }
  }

  async deleteProduct(productId) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.db.remove({ _id: productId }, {}, (err, numRemoved) => {
          if (err) reject(err);
          else resolve(numRemoved);
        });
      });
      console.log("deleteProduct() returns:", result);
      return result;
    } catch (err) {
      console.error("Error deleting product", err);
      throw err;
    }
  }
}

module.exports = ProductDAO;
