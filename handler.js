'use strict';

module.exports.hello = (event, context, callback) => {
  // GET PARAMS
  // console.log(event.queryStringParameters)
  // POST PARAMS
  // console.log(JSON.parse(event.body))
  // Environment
  // console.log (process.env.GOOGLE_MAPS_KEY)
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!'
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
