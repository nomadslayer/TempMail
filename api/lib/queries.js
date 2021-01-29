'use strict'

const connectDb = require('./db')
const {ObjectID} = require('mongodb')
const { errorHandler } = require('./errorHandler')

module.exports = {

  /* Domains */
  getDomain: async (root, {id}) => {
    let db = null;
    let domain = null
    try {
      db = await connectDb()
      domain = await db.collection('domain').findOne({_id:ObjectID(id)})
    } catch (e) {
      errorHandler(e)
    }

    return domain
  },


  getDomains: async () => {
    let db = null;
    let domains = []
    try {
      db = await connectDb()
      domains = await db.collection('domain').find().toArray()
    } catch (e) {
      errorHandler(e)
    }

    return domains
  },
  /*END Domains */

  /* Emails */

  getEmail: async (root, {id}) => {
    let db = null;
    let email = null
    try {
      db = await connectDb()
      email = await db.collection('email').findOne({_id:ObjectID(id)})
    } catch (e) {
      errorHandler(e)
    }

    return email
  },

}
