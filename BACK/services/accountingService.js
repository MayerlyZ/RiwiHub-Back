// BACK/services/accountingService.js
// Purpose: compute daily sales summary based on orders in a given local day


import { Op } from "sequelize";
import Order from "../models/order.js";

/**
 * Compute a daily report for a given local date (America/Bogota).
 * @param {string} dateISO - Expected format 'YYYY-MM-DD'
 * @returns {Promise<object>} - JSON-safe summary
 */
export async function computeDailyReport(dateISO) {
  // -- Minimum entry validation
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) {
    throw new Error("Invalid date format. Use YYYY-MM-DD.");
  }

  // -- Bogotá does not handle DST; fixed offset -05:00. We put together the local range of the day
  const start = new Date(`${dateISO}T00:00:00.000-05:00`);
  const end = new Date(`${dateISO}T23:59:59.999-05:00`);

  // -- Base filter by creation date (createdAt) within the local day
  const where = {
    createdAt: { [Op.between]: [start, end] },
    // If your orders table had a status (e.g. "status" or "order_status"),
    // you could filter here only "paid"/"completed".
    // status: { [Op.in]: ["paid", "completed"] }
  };

  // -- We bring only what is necessary to add up the KPIs
  const orders = await Order.findAll({
    where,
    attributes: ["total_amount", "payment_method"], // avoids bringing extra columns
    raw: true,
  });

  // -- Basic KPI calculations
  let grossRevenue = 0;
  const byPaymentMethod = { wallet: 0, credit_card: 0, cash: 0 };

  for (const o of orders) {
    // Ensure number in JS
    const amt = Number(o.total_amount);
    grossRevenue += isNaN(amt) ? 0 : amt;

    // Sum by payment method if it's within the three defined in the model
    if (o.payment_method && byPaymentMethod.hasOwnProperty(o.payment_method)) {
      byPaymentMethod[o.payment_method] += isNaN(amt) ? 0 : amt;
    }
  }

  const ordersCount = orders.length;
  const averageTicket = ordersCount > 0 ? +(grossRevenue / ordersCount).toFixed(2) : 0;

  // -- JSON response
  return {
    date: dateISO,
    timezone: "America/Bogota",
    orders_count: ordersCount,
    gross_revenue: +grossRevenue.toFixed(2),
    average_ticket: averageTicket,
    by_payment_method: {
      wallet: +byPaymentMethod.wallet.toFixed(2),
      credit_card: +byPaymentMethod.credit_card.toFixed(2),
      cash: +byPaymentMethod.cash.toFixed(2),
    },
  };
}
