import express, { Request, Response, Router } from "express";
import multer from "multer";
import asyncHandler from "../middleware/asyncHandler";
import authControllers from "../controllers/auth.controllers";
import { protectRoute } from "../middleware/protectRoute";

const router: Router = express.Router();
type Route = Record<string, any>;

const upload = multer();

const mapRoutesToController = (routes: Route[]) => {
  routes.forEach(({ method, path, controller, middleware }) => {
    switch (method) {
      case "GET":
        router.get(path, middleware, asyncHandler(controller));
        break;
      case "POST":
        router.post(path, middleware, asyncHandler(controller));
        break;
      default:
        router.all(path, (req: Request, res: Response) => {
          res.status(405).json({
            error: `HTTP method ${req.method} is not allowed for ${path}`,
          });
        });
    }
  });
};

// Define routes
const routes: Route[] = [
  {
    method: "POST",
    path: "/signup",
    controller: authControllers.signUpUser,
    middleware: [upload.single("profilePic")],
  },
  {
    method: "POST",
    path: "/login",
    controller: authControllers.login,
    middleware: [],
  },
  {
    method: "POST",
    path: "/reset-password",
    controller: authControllers.resetPassword,
    middleware: [protectRoute],
  },
];

mapRoutesToController(routes);

export default router;
