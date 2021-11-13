// const Sequelize = require('sequelize');
import {Sequelize} from 'sequelize'
import { keys } from 'config'

export const db = new Sequelize(keys.db.database, keys.db.user, keys.db.password, {
  host: keys.db.host,
  port: keys.db.port,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});