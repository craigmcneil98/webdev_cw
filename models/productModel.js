const nedb = require("nedb");

class ProductDAO {
  constructor(dbFilePath) {
    this.db = dbFilePath ? new nedb({ filename: dbFilePath.filename, autoload: true }) : new nedb();
  }

  async init() {
    try {
      await this.insert({ name: "Vintage Vinyl Records", price: 15.00, description: "A collection of classic vinyl records from the 70s and 80s.", location: "Glasgow" });
      console.log("Sample product inserted for Glasgow");
      await this.insert({ name: "Woolen Sweater", price: 25.00, description: "A cozy woolen sweater, perfect for chilly days.", location: "Edinburgh" });
      console.log("Sample product inserted for Edinburgh");
      await this.insert({ name: "Antique Wooden Chair", price: 40.00, description: "A beautifully crafted wooden chair with an antique finish.", location: "Falkirk" });
      console.log("Sample product inserted for Falkirk");
      await this.insert({ name: "Collector’s Edition Books", price: 60.00, description: "A set of rare collector's edition books, great for any literary enthusiast.", location: "Dundee" });
      console.log("Sample product inserted for Dundee");
    } catch (err) {
      console.error("Error inserting sample products", err);
    }
  }

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
