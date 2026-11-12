import {Router} from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "ClientFlow API is healthy",
  });
});

export default router;