import express from "express";

const router = express.Router();

router.get("/salud", (req, res) => {
  res.json({
    ok: true,
  });
});

export default router;
