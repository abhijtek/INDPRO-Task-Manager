import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  login,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  userChangePasswordValidator,
  userLoginValidator,
  userRegisterValidator,
} from "../validators/index.js";

const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, login);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/current-user").get(verifyJWT, getCurrentUser);
router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangePasswordValidator(),
    validate,
    changeCurrentPassword,
  );
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
