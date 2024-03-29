// all '/register' actions

import { Request, Response } from "express";
import { StatusCodes } from "../utils/status-codes";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/crypt";

const userModel = new PrismaClient().user;

class RegisterController {
    public getRegisterPage(_req: Request, res: Response) {
        res.render("register", { layout: "forms" });
    }

    public async registerUser(req: Request, res: Response) {
        const {
            email,
            username,
            password,
        }: { email: string; username: string; password: string } =
            req.body["user"]; // -> destructure as strings

        if (!email || !username || !password) {
            res.status(StatusCodes.BAD_REQUEST).send("Missing fields");
            return;
        }
        try {
            const userRegistered = await userModel.create({
                data: { email, username, password: hashPassword(password) },
            });
            res.status(StatusCodes.CREATED).send(
                "User created with id: " + userRegistered.userId
            );
        } catch (e: any) {
            res.status(StatusCodes.BAD_REQUEST).send(e.message);
        }
    }
}

export default new RegisterController();
