import { Op, fn, col, literal } from "sequelize";
import Order from "../models/order.js";
import OrderItem from "../models/orderItem.js";
import Item from "../models/item.js";

// Revenue by date range (for line charts)
export async function getRevenueByDateRange(from, to) {
  return Order.findAll({
    where: {
      createdAt: { [Op.between]: [new Date(from), new Date(to)] },
      status: "paid", // only paid orders
    },
    attributes: [
      [fn("DATE", col("createdAt")), "date"],
      [fn("SUM", col("total")), "totalRevenue"],
    ],
    group: [literal("DATE(createdAt)")],
    order: [literal("DATE(createdAt)")],
    raw: true,
  });
}

// Top selling services
export async function getTopServices(from, to, limit = 5) {
  return OrderItem.findAll({
    include: [{
      model: Item,
      attributes: ["name", "type"],
      where: { type: "service" },
    }],
    where: {
      createdAt: { [Op.between]: [new Date(from), new Date(to)] },
    },
    attributes: [
      "item_id",
      [fn("SUM", col("quantity")), "totalSold"],
    ],
    group: ["item_id", "Item.name", "Item.type"],
    order: [[literal("totalSold"), "DESC"]],
    limit,
    raw: true,
  });
}

// Revenue grouped by item type (for pie charts)
export async function getRevenueByType(from, to) {
  return OrderItem.findAll({
    include: [{
      model: Item,
      attributes: ["type"],
    }],
    where: {
      createdAt: { [Op.between]: [new Date(from), new Date(to)] },
    },
    attributes: [
      [col("Item.type"), "type"],
      [fn("SUM", literal("quantity * unit_price")), "totalRevenue"],
    ],
    group: ["Item.type"],
    raw: true,
  });
}
