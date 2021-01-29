'use strict'

const connectDb = require('./db')
const { errorHandler } = require('./errorHandler')
const { sleep } = require('./utils/utils')

const RecyclerEmail = async () => {
    while(true){
        console.log('Recycler Email running...')

        //get an email pending deletion
        let db
        try {
            //get db connection
            db = await connectDb()

            //remove all trash Emails
            await db.collection('email').deleteMany({
                "remove_at":{
                    "$lt":new Date()
                }
              })
            



        } catch (error) {
            errorHandler(error)
        }


        await sleep(1000*60)
    }
}

module.exports = RecyclerEmail