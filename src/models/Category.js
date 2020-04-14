const conn = require("../db/db");
const Category = conn.model(
  "Category",
  new mongoose.Schema({
    name: String,
    description: String
  })
);

module.exports = Category;
