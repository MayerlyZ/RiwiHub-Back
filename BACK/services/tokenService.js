import TokenTransaction from '../models/TokenTransaction.js';

// Create a new token transaction
export const createTransaction = async (data) => {
  return await TokenTransaction.create(data);
};

// Get all token transactions
export const getAllTransactions = async () => {
  return await TokenTransaction.findAll();
};

// Get a single token transaction by ID
export const getTransactionById = async (id) => {
  return await TokenTransaction.findByPk(id);
};

// Update an existing token transaction
export const updateTransaction = async (id, data) => {
  const [updated] = await TokenTransaction.update(data, { where: { transaction_id: id } });
  if (!updated) return null;
  return await TokenTransaction.findByPk(id);
};

// Delete an existing token transaction
export const deleteTransaction = async (id) => {
  return await TokenTransaction.destroy({ where: { transaction_id: id } });
};


