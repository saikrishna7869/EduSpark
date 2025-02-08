import { videoupload,getvideos,getvideo,setrating,quizques,comments,addcomment,updatereply,getsubtitles} from "../controllers/videouploadController.js";

import {Router} from 'express';

const router = Router();
import multer from 'multer';
import path from 'path';
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
  
});

const upload = multer({ storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
    fieldSize: 500 * 1024 * 1024 // For non-file fields
  }
 });

router.post("/videoupload",verifyToken,upload.single("video"),videoupload);
router.get("/getvideos",getvideos);
router.get("/getvideo/:id",getvideo);
router.put("/rating/:id",setrating);
router.get("/takequiz/:id",quizques);
router.get("/comments/:id",comments);
router.post("/putcomment/:id1/:id2",addcomment);
router.post("/reply/:id/:id2",updatereply);
router.get("/subtitles/:id/:id2",getsubtitles);

export default router;