'use strict'
const articles = require('../data/articles')

const getArticles = async () => {
  try {
    const response = {
      statusCode: 200,
      body: JSON.stringify(articles)
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
