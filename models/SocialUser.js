const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
    'social_user',
    {
        user_id: {
            type: Sequelize.STRING,
            primaryKey: true,
            autoIncrement: true
        },
        user_name: {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
)
