const { db, DataTypes, Model } = require("../db/config.js");

class Deck extends Model {}

Deck.init(
  {
    name: DataTypes.TEXT,
    xp: DataTypes.INTEGER,
  },
  {
    sequelize: db,
    modelName: "Deck",
  }
);

module.exports = { Deck };
