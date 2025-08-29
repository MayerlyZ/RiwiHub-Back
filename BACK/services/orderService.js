import Order from '../models/order.js';

// Create a new order
export const createOrder = async (orderData) => {
  const order = await Order.create(orderData);
  return order;
};

// Get all orders
export const getAllOrders = async () => {
  return await Order.findAll();
};

// Get a single order by ID
export const getOrderById = async (id) => {
  return await Order.findByPk(id);
};

// Update an existing order
export const updateOrder = async (id, updateData) => {
  const [updated] = await Order.update(updateData, { where: { order_id: id } });
  if (!updated) return null;
  return await Order.findByPk(id);
};

// Delete an order
export const deleteOrder = async (id) => {
  const order = await Order.findByPk(id);
  if (!order) return null;
  await order.destroy();
  return order;
};
