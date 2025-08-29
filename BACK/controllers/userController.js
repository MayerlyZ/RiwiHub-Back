import * as userService from "../services/userService.js";
import { isNonEmptyString, isValidEmail, isPositiveNumber } from "../utils/validators.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await userService.deleteUser(id);
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  const { name, email, password, wallet_balance, role } = req.body;
  // Validations
  if (!isNonEmptyString(name)) {
    return res.status(400).json({ error: "The name is required and must be a valid string." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "The email is not valid." });
  }
  if (!isNonEmptyString(password)) {
    return res.status(400).json({ error: "The password is required and must be a valid string." });
  }
  if (wallet_balance !== undefined && !isPositiveNumber(Number(wallet_balance))) {
    return res.status(400).json({ error: "The wallet_balance must be a positive number." });
  }
  try {
    const newUser = await userService.createUser({
      name,
      email,
      password,
      wallet_balance,
      role, // If not provided, Sequelize will use the default value
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, wallet_balance, role } = req.body;

  // Validations (only if fields are present in the body)
  if (name !== undefined && !isNonEmptyString(name)) {
    return res.status(400).json({ error: "The name must be a valid string." });
  }
  if (email !== undefined && !isValidEmail(email)) {
    return res.status(400).json({ error: "The email is not valid." });
  }
  if (password !== undefined && !isNonEmptyString(password)) {
    return res.status(400).json({ error: "The password must be a valid string." });
  }
  if (wallet_balance !== undefined && !isPositiveNumber(Number(wallet_balance))) {
    return res.status(400).json({ error: "The wallet_balance must be a positive number." });
  }

  // Build the data object only with the fields sent
  const data = {};
  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email;
  if (password !== undefined) data.password = password;
  if (wallet_balance !== undefined) data.wallet_balance = wallet_balance;
  if (role !== undefined) data.role = role;

  try {
    const updatedUser = await userService.updateUser(id, data);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




