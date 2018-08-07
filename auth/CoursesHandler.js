'use strict';

module.exports.getCourses = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify([
      {
        id: 1,
        title: 'course 1'
      }
    ]),
  };

  callback(null, response);
};
