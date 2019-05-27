'use strict'

const getArticles = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify([
      {
        id: 1,
        title: 'article 1'
      }
    ])
  }

  return callback(null, response)
}

module.exports = {
  getArticles
}
