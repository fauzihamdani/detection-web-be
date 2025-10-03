import express, { type Request, type Response } from "express";
import {
  // createReport,
  // deleteReport,
  // getReports,
  updateReport,
} from "../controller/report.controller";
// import { getUsers, login, register } from "../controller/user.controller";
// import { authMiddleware } from "../middlewares/authMiddleware";
// import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";
// import { createComment, getComments } from "../controller/comment.controller";
// import { getFromWebui, getModels } from "../controller/test.controller";
import { createCamera, getCamera } from "../controller/camera.controller";
import { getCamNetwork } from "../controller/scannerCam.controller";
import { getCamNetwork2 } from "../controller/scannerCam2.controller";
import { getPtzController } from "../controller/ptzController.contoller";

const router = express.Router();
const apiString = "/api";

// router.post(`${apiString}/user`, register);
// router.post(`${apiString}/login`, login);
// router.get(`${apiString}/users`, getUsers);

// router.get(`${apiString}/reports`, authMiddleware, getReports);
// router.post(`${apiString}/report`, authMiddleware, createReport);
// router.patch(`${apiString}/report/:id`, adminAuthMiddleware, updateReport);
// router.delete(`${apiString}/report/:id`, authMiddleware, deleteReport);

// router.get(`${apiString}/comments`, getComments);
// router.post(`${apiString}/comment`, authMiddleware, createComment);

router.get(`${apiString}/cameras`, getCamera);
router.post(`${apiString}/camera`, createCamera);
router.patch(`${apiString}/camera/:id`, updateReport);

router.get(`${apiString}/camera-scan`, getCamNetwork);
// router.get(`${apiString}/camera-scan-2`, getCamNetwork2);
router.post(`${apiString}/camera-scan-2`, getCamNetwork2);

router.get(`${apiString}/ptz`, getPtzController);

export default router;
