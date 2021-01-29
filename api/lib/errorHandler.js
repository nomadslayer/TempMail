'use strict'

function errorHandler(error) {
    console.error(error)
    throw new Error(error)
}

module.exports = {
    errorHandler:errorHandler
}