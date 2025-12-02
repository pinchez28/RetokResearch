import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role }, // keep capitalization, e.g. 'Admin'
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export default generateToken;
