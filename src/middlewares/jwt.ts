import expressJwt from 'express-jwt';

const jwtMiddleware = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: function fromHeaderOrQuerystring (req) {
    const { jwt } = req.cookies;
    return jwt || null;
  },
});

export default jwtMiddleware;
