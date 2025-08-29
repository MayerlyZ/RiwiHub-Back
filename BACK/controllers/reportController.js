import {
  getRevenueByDateRange,
  getTopServices,
  getRevenueByType,
} from "../services/reportService.js";

// Income report by range
export const revenueReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: "from and to query params required (YYYY-MM-DD)" });
    }
    const data = await getRevenueByDateRange(from, to);
    res.json({ from, to, revenue: data });
  } catch (err) {
    console.error("Error revenueReport:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Top services report
export const topServicesReport = async (req, res) => {
  try {
    const { from, to, limit } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: "from and to query params required" });
    }
    const data = await getTopServices(from, to, limit ? parseInt(limit) : 5);
    res.json({ from, to, topServices: data });
  } catch (err) {
    console.error("Error topServicesReport:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Report income by item type
export const revenueByTypeReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: "from and to query params required" });
    }
    const data = await getRevenueByType(from, to);
    res.json({ from, to, revenueByType: data });
  } catch (err) {
    console.error("Error revenueByTypeReport:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
