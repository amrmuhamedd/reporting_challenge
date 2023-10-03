module.exports = {
          sendErrorResponse,
          throwNewError
}

async function sendErrorResponse (err, req, res, next) {
          res.status(err.statusCode ||500)
          .json({message : err.message || "Internal Server Error"})
          .end()
}


function throwNewError(statusCode , message){
          const error = new Error(message)
          error.statusCode = statusCode

          throw error
}