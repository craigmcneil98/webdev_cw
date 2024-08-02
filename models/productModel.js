const nedb = require("nedb");

class ProductDAO {
  constructor(dbFilePath) {
    if (dbFilePath) {
      this.db = new nedb({ filename: dbFilePath?.filename, autoload: true });
    } else {
      this.db = new nedb();
    }
  }

  // Function to initialize the database with some sample data
  init() {
    // Sample data for initialization with the "location" field
    this.db.insert({ name: "Sample Product", price: 10.00, description: "This is a sample product.", location: "Glasgow" }, function (err, doc) {
      if (err) {
        console.log("Error inserting sample product", err);
      } else {
        console.log("Sample product inserted", doc);
      }
    });

    this.db.insert({ name: "Blue Jeans", price: 50.00, description: "This is a pair of blue jeans.", location: "Edinburgh" }, function (err, doc) {
      if (err) {
        console.log("Error inserting sample product", err);
      } else {
        console.log("Sample product inserted", doc);
      }
    });
  }

  // Function to get all products
  getAllProducts() {
    return new Promise((resolve, reject) => {
      this.db.find({}, function (err, products) {
        if (err) {
          reject(err);
        } else {
          resolve(products);
          console.log("getAllProducts() returns:", products);
        }
      });
    });
  }

  // Function to find a product by ID
  getProductById(productId) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: productId }, function (err, product) {
        if (err) {
          reject(err);
        } else {
          resolve(product);
          console.log("getProductById() returns:", product);
        }
      });
    });
  }

  // Fetch products based on location
  getProductsByLocation(location) {
    return new Promise((resolve, reject) => {
      this.db.find({ location: location }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }

  // Function to add a new product
  addProduct(name, price, description, location) {
    const product = {
      name: name,
      price: price,
      description: description,
      location: location, // Add the location field
    };
    this.db.insert(product, function (err, doc) {
      if (err) {
        console.log("Error inserting product", err);
      } else {
        console.log("Product inserted into the database", doc);
      }
    });
  }

  // Function to update a product
  updateProduct(productId, updatedProduct) {
    return new Promise((resolve, reject) => {
      this.db.update({ _id: productId }, { $set: updatedProduct }, { returnUpdatedDocs: true }, function (err, numReplaced, updatedProduct) {
        if (err) {
          reject(err);
        } else {
          resolve(updatedProduct);
          console.log("updateProduct() returns:", updatedProduct);
        }
      });
    });
  }

  // Function to delete a product
  deleteProduct(productId) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: productId }, {}, function (err, numRemoved) {
        if (err) {
          reject(err);
        } else {
          resolve(numRemoved);
          console.log("deleteProduct() returns:", numRemoved);
        }
      });
    });
  }
}

module.exports = ProductDAO;