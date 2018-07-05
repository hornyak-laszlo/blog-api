const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs-then');

/* 
 * Functions
 */
module.exports.login = (event, context) => {
    return login(JSON.parse(event.body))
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: { stack: err.stack, message: err.message }
    }));
};

module.exports.register = (event, context) => {
    return register(JSON.parse(event.body))
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message
    }));
};

module.exports.me = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return me(event.requestContext.authorizer.principalId) // the decoded.id from the VerifyToken.auth will be passed along as the principalId under the authorizer
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: { stack: err.stack, message: err.message }
    }));
};


/* 
 * Helpers
 */
function login(eventBody) {
  return User.findOne({ email: eventBody.email })
    .then(user =>
      !user
        ? Promise.reject(new Error('User with that email does not exits.'))
        : comparePassword(eventBody.password, user.password, user._id)
    )
    .then(token => ({ auth: true, token: token }));
}

function comparePassword(eventPassword, userPassword, userId) {
  return bcrypt.compare(eventPassword, userPassword)
    .then(passwordIsValid =>
      !passwordIsValid
        ? Promise.reject(new Error('The credentials do not match.'))
        : signToken(userId)
    );
}

function signToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: 86400 // expires in 24 hours
  });
}

function checkIfInputIsValid(eventBody) {
  if (
    !(eventBody.password &&
      eventBody.password.length >= 7)
  ) {
    return Promise.reject(new Error('Password error. Password needs to be longer than 8 characters.'));
  }

  if (
    !(eventBody.name &&
      eventBody.name.length > 5 &&
      typeof eventBody.name === 'string')
  ) return Promise.reject(new Error('Username error. Username needs to longer than 5 characters'));

  if (
    !(eventBody.email &&
      typeof eventBody.name === 'string')
  ) return Promise.reject(new Error('Email error. Email must have valid characters.'));

  return Promise.resolve();
}

function register(eventBody) {
  return checkIfInputIsValid(eventBody) // validate input
    /*
      User.findOne({ email: eventBody.email }) // check if user exists
      Promise.reject(new Error('User with that email exists.'))
    */
    .then(() =>
      bcrypt.hash(eventBody.password, 8) // hash the pass
    )
    .then(hash => {
      const docClient = new AWS.DynamoDB.DocumentClient();
      const params = {
        TableName: 'blog-api-dev-users',
        Item:{
            'name': eventBody.name,
            'email': eventBody.email,
            'password': hash
        }
      }
      // User.create({ name: eventBody.name, email: eventBody.email, password: hash }) 
      docClient.put(params, function(err, user) {
        if (err) {
          return Promise.reject(new Error('Unable to add item.'));
        } else {
          return { auth: true, token: signToken(user._id) }
        }
      })
    })
}

function me(userId) {
  return User.findById(userId, { password: 0 })
    .then(user =>
      !user
        ? Promise.reject('No user found.')
        : user
    )
    .catch(err => Promise.reject(new Error(err)));
}
