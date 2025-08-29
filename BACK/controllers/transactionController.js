import * as tokenService from "../services/tokenService.js";
import { isPositiveNumber, isInEnum, isNonEmptyString } from "../utils/validators.js";

//Get all transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await tokenService.getAllTransactions();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Get a transaction by ID
export const getTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await tokenService.getTransactionById(id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Create a new transaction
export const createTransaction = async (req, res) => {
  const { user_id, amount, transaction_type, description, balance_after } = req.body;
  if (!isPositiveNumber(Number(user_id))) {
    return res.status(400).json({ error: "The user_id is required and must be a positive number." });
  }
  if (!isPositiveNumber(Number(amount))) {
    return res.status(400).json({ error: "The amount must be a positive number." });
  }
  if (!isInEnum(transaction_type, ["earn", "spend", "refund"])) {
    return res.status(400).json({ error: "The transaction type is not valid." });
  }
  if (description !== undefined && description !== null && !isNonEmptyString(description)) {
    return res.status(400).json({ error: "The description must be a valid string or null." });
  }
  if (!isPositiveNumber(Number(balance_after))) {
    return res.status(400).json({ error: "The balance_after must be a positive number." });
  }
  const data = {};
  if (user_id !== undefined) data.user_id = user_id;
  if (amount !== undefined) data.amount = amount;
  if (transaction_type !== undefined) data.transaction_type = transaction_type;
  if (description !== undefined) data.description = description;
  if (balance_after !== undefined) data.balance_after = balance_after;

  try {
    const newTransaction = await tokenService.createTransaction(data);
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a transaction
export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, transaction_type, description, balance_after } = req.body;
  if (amount !== undefined && !isPositiveNumber(Number(amount))) {
    return res.status(400).json({ error: "The amount must be a positive number." });
  }
  if (transaction_type !== undefined && !isInEnum(transaction_type, ["earn", "spend", "refund"])) {
    return res.status(400).json({ error: "The transaction type is not valid." });
  }
  if (description !== undefined && description !== null && !isNonEmptyString(description)) {
    return res.status(400).json({ error: "The description must be a valid string or null." });
  }
  if (balance_after !== undefined && !isPositiveNumber(Number(balance_after))) {
    return res.status(400).json({ error: "The balance_after must be a positive number." });
  }

  const data = {};
  if (amount !== undefined) data.amount = amount;
  if (transaction_type !== undefined) data.transaction_type = transaction_type;
  if (description !== undefined) data.description = description;
  if (balance_after !== undefined) data.balance_after = balance_after;

  try {
    const updatedTransaction = await tokenService.updateTransaction(id, data);
    if (!updatedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ message: "Transaction updated successfully" });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await tokenService.deleteTransaction(id);
    if (!deleted) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
