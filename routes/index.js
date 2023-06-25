
import express from "express";

const router = express.Router();
import { cabRequest, allBlogs, blogPost } from "../handler/requestHandler.js";

router.post("/cabrequest", cabRequest)

router.get("/blog", allBlogs)
router.get("/blog/:slug", blogPost)



export default router; 