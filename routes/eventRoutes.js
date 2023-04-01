import express from "express"
const router = express.Router();
import EventController from "../controllers/eventController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";
import multer from "multer";
const storage = multer.memoryStorage()
const upload = multer({ storage })
router.post('/add',checkUserAuth,upload.single("file"),EventController.addEvent);
router.post('/list',checkUserAuth,EventController.eventList);
export default router;