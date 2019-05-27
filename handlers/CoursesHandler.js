'use strict'

const getCourses = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify([
      {
        id: 1,
        title: 'course 1'
      }
    ])
  }

  return callback(null, response)
}

module.exports = {
  getCourses
}
