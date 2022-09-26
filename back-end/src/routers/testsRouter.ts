import {Router} from "express"

const router = Router();
import * as testsController from "../controllers/testsController"

router.post("/tests/reset", testsController.resetDatabase);
router.post("/tests/populate", testsController.populateDatabase)

export default router;