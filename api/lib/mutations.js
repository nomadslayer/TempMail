'use strict'
const generateName = require('./utils/Email/generateName')
const connectDb = require('./db')
const {ObjectID} = require('mongodb')
const { errorHandler } = require('./errorHandler')
const isValidDomain = require('is-valid-domain')

module.exports = {


  //add a new domain
  createDomain: async (root, {input}) => {
    
    //validate host
    if(!isValidDomain(input.host, {
      subdomain: false, wildcard: false
    })) errorHandler('invalid domain')

    //default values
    const defaults = {
      status: false,
      created_at: new Date(),
      modified_at: new Date(),
      last_checked: new Date(),
      count_emails: 0
    }

    //apply default values
    const newDomain = Object.assign(defaults, input)
    let db
    let domain


    try {
      //get db connection
      db = await connectDb()

      //find duplicate domains
      let duplicated = await db.collection('domain').findOne({
        "host":{
          "$eq":newDomain.host
        }
      })

      //prevent duplicate domains
      if ( duplicated ){
        errorHandler('Duplicated domain')
      }

      //add new domain
      domain = await db.collection('domain').insertOne(newDomain)
      newDomain._id = domain.insertedId//add the generated id
    } catch (e) {
      errorHandler(e)
    }

    //return a OK domain added
    return newDomain
  },

 

  //edit a domain

  editDomain: async (root, {domain_id, input}) => {


    //default values
    const defaults = {
      modified_at: new Date()
    }

    //apply default values
     input = Object.assign(defaults, input)

    let db
    let domain

    //get db connection
    db = await connectDb()

    try {
           //find the domain
           domain = await db.collection('domain').findOne({
             "_id":ObjectID(domain_id)
           })
     
           //prevent not found domain
           if ( !domain ){
             errorHandler('Domain not found')
           }
  
      } catch (e) {
           errorHandler(e)
      }


    try {   
         //try update
        //set params
         await db.collection('domain').updateOne({
           "_id":ObjectID(domain_id)
         }, {
           "$set":input
         })

   
         //get the modified domain
         domain = await db.collection('domain').findOne({
          "_id":ObjectID(domain_id)
          })

       } catch (e) {
            errorHandler(e)
       }


      

    //return a OK domain added
    return domain
  },

  




    //add a new Email
    createEmail: async () => {

      //Email
      const Email = {
        email: null,
        created_at: new Date(),
        remove_at: new Date((new Date().getTime() + 3600*6*1000)),//email valid for 6 hours
        mails: []
      }

  
      let db  
      try {
        //get db connection
        db = await connectDb()

        //get count of valid domains
        let domain_count = await db.collection('domain').find({"status":true}).count()

        //prevent error when domain_count is 0
        if(domain_count == 0) errorHandler('Don\'t have a valid domains')

        //generate a random skip
        let random_skip = Math.floor(Math.random() * Math.floor(domain_count))

        //get a domain
        let domain = await db.collection('domain').find({"status":true}).skip(random_skip).limit(1).toArray()
        Email.email = generateName(domain[0].host)//get the first

        //add new Email
        let newEmail = await db.collection('email').insertOne(Email)
        Email._id = newEmail.insertedId//add the generated id
      } catch (e) {
        errorHandler(e)
      }
  
      //return a OK Email added
      return Email
    },
  


 }
