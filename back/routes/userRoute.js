import express from "express"
import { getAllUsers, login, modifyUser, register, suspendUser } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";

const userRouter = express.Router()

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/users', authenticateToken, getAllUsers);
userRouter.put('/update/:id', authenticateToken, modifyUser);
userRouter.delete('/remove/:id', authenticateToken, suspendUser);


export default userRouter;