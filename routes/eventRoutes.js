import express from "express"
const router = express.Router();
import EventController from "../controllers/eventController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";
import multer from "multer";
const storage = multer.memoryStorage()
const upload = multer({ storage })
router.post('/add', checkUserAuth, upload.single("file"), EventController.addEvent);
router.get('/download/:id', checkUserAuth, EventController.signedURL);
router.get('/files/:id', EventController.download);
router.get('/list', checkUserAuth, EventController.eventList);

router.delete('/remove',checkUserAuth,EventController.removeFile);


export default router;