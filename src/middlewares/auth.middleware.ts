import { Response, NextFunction } from "express";
import { UserRequest } from "../types/express";
import { StatusCodes } from "../utils/status-codes";
import { decodeToken } from "../utils/token";
import { PrismaClient } from "@prisma/client";

const userModel = new PrismaClient().user;

export default async function authMiddleware(
    req: UserRequest,
    res: Response,
    next: NextFunction
) {
    const token = req.cookies["authorization"];
    if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).redirect("/login");
        return;
    }
    try {
        const decodedUserData = decodeToken(token);
        const { email, username } = decodedUserData;
        const userData = await userModel.findFirst({
            where: { email, username },
        });
        if (!userData) {
            res.clearCookie("authorization");
            res.status(StatusCodes.UNAUTHORIZED).redirect("/login");
            return;
        }
        req.user = userData;
        next();
    } catch (e: any) {
        res.clearCookie("authorization");
        res.status(StatusCodes.BAD_REQUEST).redirect("/login");
    }
}
