const { db, DataTypes, Model } = require("../db/config.js");

class Card extends Model {}

Card.init(
  {
    name: DataTypes.TEXT,
    mojo: DataTypes.INTEGER,
    stamina: DataTypes.INTEGER,
    imgUrl: DataTypes.TEXT,
  },
  {
    sequelize: db,
    modelName: "Card",
  }
);

module.exports = { Card };
