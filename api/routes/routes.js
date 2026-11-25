import express from "express";

const router = express.Router();

router.get("/salud", (req, res) => {
  res.json({
    ok: true,
  });
});


router.get("/prueba-error", () => {
  throw new Error("prueba");
});

export default router;
