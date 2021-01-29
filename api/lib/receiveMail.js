'use strict'

const mailin = require('mailin');
const connectDb = require('./db')
const { errorHandler } = require('./errorHandler')


      const ReceiveMail = () => {

        //start service
        mailin.start({
            port: 25,
            disableWebhook: true, // Disable the webhook posting.
            smtpOptions:{
                disableDNSValidation:true
            }
          });

          //new mail
          mailin.on('message', async function (connection, data, content) {

            //email data
            let Mail = {
                content:data.html,
                from:data.from[0].address,
                received_at:new Date(),
                subject:data.subject
            }

            //destination
            let to = data.to[0].address

            

            //save mail
            let db
            try {
                //get db connection
                db = await connectDb()

                //add the mail to the destination
                await db.collection('email').updateOne({
                    "email":{
                        "$eq":to
                    }
                  }, {
                    "$push":{
                        "mails":{
                            "$each":[Mail],
                            "$position":0
                        }
                    }
                  })



            } catch (error) {
                errorHandler(error)
            }

            

          });
        


      }

  module.exports = ReceiveMail