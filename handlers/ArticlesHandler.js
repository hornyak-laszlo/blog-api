'use strict'

const getArticles = async () => {
  try {
    const response = {
      statusCode: 200,
      body: JSON.stringify([
        {
          id: 1,
          title: 'article 1'
        }
      ])
    }
    return response
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(err)
    }
  }
}

module.exports = {
  getArticles
}
