const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('recipe', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    summaryDish: {
      type: DataTypes.TEXT,
      allowNull:false,
    },
    healthScore: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    stepByStep: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull:false,
    },
  });
};