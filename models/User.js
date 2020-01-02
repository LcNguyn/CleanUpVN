const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'user',
  {
    acc_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    acc_email: {
      type: Sequelize.STRING
    },
    acc_pass: {
      type: Sequelize.STRING
    },
    acc_username: {
      type: Sequelize.STRING
    },
    acc_profile_pic: {
      type: Sequelize.STRING
    },
    acc_description: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false
  }
)
