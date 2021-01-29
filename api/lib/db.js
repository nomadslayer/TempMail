'use strict'

const { MongoClient } = require('mongodb')
const { errorHandler } = require('./errorHandler')

require('dotenv').config()

const {
  DB_USER,
  DB_PASSSWD,
  DB_HOST,
  DB_PORT,
  DB_NAME
} = process.env


const mongoUrl = `mongodb://${DB_USER}:${DB_PASSSWD}@${DB_HOST}:${DB_PORT}`;
let connection

async function connectDB(){
     if(connection) return connection;

     let client

     try {
       client = await MongoClient.connect(mongoUrl, {
         useNewUrlParser:true
       })
       connection = client.db(DB_NAME)
     } catch (e) {
      errorHandler('Could not connect to db')
       process.exit(1)
     }

     return connection;
}


module.exports = connectDB
