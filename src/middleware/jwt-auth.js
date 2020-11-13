'use strict';

const AuthService = require('../auth/auth-service');

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || '';

  let bearerToken;
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'missing bearer token' });
  } else {
    bearerToken = authToken.split(' ')[1];
  }

  try {
    const payload = AuthService.verifyJwt(bearerToken);

    AuthService.getUserWithUserName(req.app.get('db'), payload.sub)
      .then((user) => {
        if (!user)
          return res.status(401).json({
            error: 'unauthorized request: no user with that name',
          });

        req.user = user;
        next();
      })
      .catch((err) => {
        console.error('heres the err', err);
        next(err);
      });
  } catch (error) {
    console.log('heres err', error);
    res
      .status(401)
      .json({ error: 'unauthorized request: who knows ' });
  }
}

module.exports = {
  requireAuth,
};
