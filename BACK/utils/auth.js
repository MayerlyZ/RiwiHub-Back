import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// hook to hashe the password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Method to compare passwords
export const validatePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// method to generate a JWT token
export const generateAuthToken = (user) => {
  const payload = { id: user.user_id, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};
