import express from "express";
import { protegerRuta } from "../middleware/protegerRuta.js";
import { soloRol } from "../middleware/soloRol.js";

const router = express.Router();

router.use(protegerRuta, soloRol("admin"));

router.get("/ping", (req, res) => res.json({ ok: true }));

export default router;
