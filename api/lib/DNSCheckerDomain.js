'use strict'

const { sleep } = require('./utils/utils')
const dns = require('dns')
const connectDb = require('./db')
const { errorHandler } = require('./errorHandler')
const {ObjectID} = require('mongodb')
require('dotenv').config()


const deleteDomain = async (id) => {
    // console.log(id)
    //delete the domain

    //get db connection
    let db = await connectDb()

    //delete
    await db.collection('domain').deleteOne({
        "_id":ObjectID(id)
      })
}

const DNSCheckerDomain = async () => {
    //set default dns (cloudflare)
    dns.setServers(['1.1.1.1', '1.0.0.1'])

    while(true){
        console.log('DNS checker domain running...')

        //obtener db
        let db
        try {
            //get db connection
            db = await connectDb()

            //remove all trash Emails
            let domain = await db.collection('domain').findOne({
                "last_checked":{
                    "$lt":new Date((new Date().getTime() - 60*15*1000))//valid for 15 minutes
                },
                "created_at":{
                    "$lt":new Date((new Date().getTime() - 60*15*1000))//15 minutes for new dns
                }
              })

            //invalid domain
            // console.log(domain)
            if (!domain){
                await sleep(1000*60)//stop 1 minute
                continue
            }

            //lookup dns
            await new Promise(function(resolve, reject){

                
                  dns.resolveMx(domain.host, async function (err, addresses, family) {

                      //no records
                      if (!addresses) {
                          await deleteDomain(domain._id)
                          resolve()
                          return true;
                      }

                      //0 or 2/more records
                      if (addresses.length == 0 || addresses.length >= 2) {
                        await deleteDomain(domain._id)
                        resolve()
                        return true;
                      }

                      //check the records is the same
                      if (addresses[0].exchange != process.env.MX_RECORD) {
                        await deleteDomain(domain._id)
                        resolve()
                        return true;
                      }


                      /*the records is OK*/

                      //update valid time
                      await db.collection('domain').updateOne({
                        "_id":ObjectID(domain._id)
                      }, {
                          "$set":{
                              "status":true,
                              "last_checked":new Date()
                          }
                      })

                      resolve()


                    }); //end resolveMx
            })//end promise
        } catch (error) {
            errorHandler(error)
        }       
    }
}

module.exports = DNSCheckerDomain
