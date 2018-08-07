'use strict';

module.exports.getArticles = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify([
        {
            id: 1,
            title: 'article 1'
        }
    ])
  };

  callback(null, response);
};
