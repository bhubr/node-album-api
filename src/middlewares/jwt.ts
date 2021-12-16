import expressJwt from 'express-jwt';

const jwtMiddleware = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: function fromHeaderOrQuerystring (req) {
    const { authorization } = req.headers;
    if (!authorization) return null;
    const [, jwt] = authorization.split(' ');
    return jwt || null;
  },
});

export default jwtMiddleware;
