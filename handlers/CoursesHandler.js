'use strict'
const courses = require('../data/courses')

const getCourses = async () => {
  try {
    const response = {
      statusCode: 200,
      body: JSON.stringify(courses)
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
  getCourses
}
