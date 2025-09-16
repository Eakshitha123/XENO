import express from "express";
import { Customer, Order, Campaign, CommunicationLog } from "./models.js";
import { ensureAuth } from "./authMiddleware.js"; // middleware to check login

const router = express.Router();

// ----------------- Ingest Customers -----------------
router.post("/customers", ensureAuth, async (req, res) => {
  try {
    const data = req.body;
    const arr = Array.isArray(data) ? data : [data];
    const docs = await Customer.insertMany(arr);
    res.json({ inserted: docs.length, docs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Ingest Orders -----------------
router.post("/orders", ensureAuth, async (req, res) => {
  try {
    const { customerId, amount } = req.body;
    const order = await Order.create({ customerId, amount });

    // update customer totals
    await Customer.findByIdAndUpdate(customerId, {
      $inc: { total_spend: amount, visits: 1 },
      $set: { last_order_date: order.createdAt }
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Campaign: Preview Audience -----------------
router.post("/campaigns/preview", ensureAuth, async (req, res) => {
  try {
    const { rules } = req.body;
    if (!rules || rules.length === 0) {
      return res.status(400).json({ error: "No rules provided" });
    }

    const mongoQuery = {};
    rules.forEach(rule => {
      if (rule.field === "spend") mongoQuery.total_spend = { [rule.operator]: rule.value };
      if (rule.field === "visits") mongoQuery.visits = { [rule.operator]: rule.value };
      if (rule.field === "inactive_days") {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - rule.value);
        mongoQuery.last_order_date = { $lt: cutoff };
      }
    });

    const audience_size = await Customer.countDocuments(mongoQuery);
    res.json({ audience_size });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Campaign: Save -----------------
router.post("/campaigns", ensureAuth, async (req, res) => {
  try {
    const { rules, audience_size } = req.body;
    if (!rules || audience_size == null) {
      return res.status(400).json({ error: "Rules and audience size required" });
    }

    const campaign = new Campaign({ rules, audience_size });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Campaign: History -----------------
router.get("/campaigns", ensureAuth, async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Delivery Receipt -----------------
router.post("/campaigns/delivery-receipt", ensureAuth, async (req, res) => {
  try {
    const { logId, status } = req.body;
    const log = await CommunicationLog.findByIdAndUpdate(
      logId,
      { status },
      { new: true }
    );
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Send Campaign Messages -----------------
router.post("/campaigns/send/:campaignId", ensureAuth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.campaignId);
    const customers = await Customer.find(); // You could filter by segment rules
    const logs = [];

    for (const c of customers) {
      const status = Math.random() < 0.9 ? "SENT" : "FAILED"; // 90% sent
      const message = `Hi ${c.name}, here’s 10% off on your next order!`;

      const log = await CommunicationLog.create({
        campaignId: campaign._id,
        customerId: c._id,
        message,
        status,
      });

      logs.push(log);

      // Simulate delivery receipt hitting backend
      await fetch("http://localhost:5000/api/campaigns/delivery-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId: log._id, status }),
      });
    }

    res.json({ sent: logs.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
