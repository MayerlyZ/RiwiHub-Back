// BACK/controllers/inventoryController.js

import {
  createInventoryEntry,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  checkLowStock,
} from "../services/inventoryService.js";

//Create inventory (admin and sellers only)
export const createInventory = async (req, res) => {
  try {
    const entry = await createInventoryEntry(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//List inventory (admin sees all, seller only yours)
export const listInventory = async (req, res) => {
  try {
    const where = {};
    if (req.user.role === "seller") {
      where["$Item.seller_id$"] = req.user.id;
    }
    const inventory = await getAllInventory(where);
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Get an inventory by id
export const getInventory = async (req, res) => {
  try {
    const inv = await getInventoryById(req.params.id);
    if (!inv) return res.status(404).json({ error: "Not found" });

    // Seller can only see their own products
    if (req.user.role === "seller" && inv.Item.seller_id !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(inv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update inventory
export const updateInventoryController = async (req, res) => {
  try {
    const inv = await getInventoryById(req.params.id);
    if (!inv) return res.status(404).json({ error: "Not found" });

    if (req.user.role === "seller" && inv.Item.seller_id !== req.user.id) {
      return res.status(403).json({ error: "You cannot update another seller's inventory" });
    }

    const updated = await updateInventory(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete inventory (admin and seller only)
export const deleteInventoryController = async (req, res) => {
  try {
    const inv = await getInventoryById(req.params.id);
    if (!inv) return res.status(404).json({ error: "Not found" });

    if (req.user.role === "seller" && inv.Item.seller_id !== req.user.id) {
      return res.status(403).json({ error: "You cannot delete another seller's inventory" });
    }

    const result = await deleteInventory(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Low stock alerts
export const lowStockAlert = async (req, res) => {
  try {
    const where = {};
    if (req.user.role === "seller") {
      where["$Item.seller_id$"] = req.user.id;
    }
    const alerts = await checkLowStock(where);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
