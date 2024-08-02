const { db, DataTypes, Model } = require("../db/config.js");

class User extends Model {}

User.init(
  {
    username: DataTypes.TEXT,
  },
  {
    sequelize: db,
    modelName: "User",
  }
);

module.exports = { User };
