import type { Request, Response } from "express";
import { signinPayloadDTO, signupPayloadDTO } from "./dto.js";
import APIError from "../../common/utils/api-error.js";
import { db } from "../../common/config/db/index.js";
import { usersTable } from "../../common/config/db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import APIResponse from "../../common/utils/api-response.js";
import { createUserToken } from "../../common/utils/jwt.js";

const handleSignUp = async (req: Request, res: Response) => {
  const validationResult = await signupPayloadDTO.safeParseAsync(req.body);

  if (validationResult.error) {
    return APIError.badRequest(validationResult.error.issues);
  }

  const { firstName, lastName, email, password } = validationResult.data;

  const [exsistingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (exsistingUser)
    return APIError.badRequest(`user with ${email} already exists`);

  const salt = await bcrypt.genSalt(12);

  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await db
    .insert(usersTable)
    .values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      salt,
    })
    .returning({
      id: usersTable.id,
    });

  return APIResponse.created(res, "user is created", user);
};

const handleLogin = async (req: Request, res: Response) => {
  const validationResult = await signinPayloadDTO.safeParseAsync(req.body);

  if (!validationResult.success)
    return APIError.badRequest(validationResult.error.issues);

  const { email, password } = validationResult.data;

  const [exsistingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!exsistingUser) return APIError.badRequest(`incorrect ${email}`);

  const isCorrectPassword = bcrypt.compare(password, exsistingUser.password);

  if (!isCorrectPassword) return APIError.badRequest("Incorrect Password");

  // generate JWT Token for user logging in
  const token = createUserToken({
    id: exsistingUser.id,
  });

  // generate cookie
  res.cookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000
  });
  return APIResponse.ok(
    res,
    `${exsistingUser.firstName} has logged in successfully`,
    { data: token },
  );
};

export const handleLogout = async (req: Request, res: Response) => {
  res.clearCookie("acessToken");

  return APIResponse.noContent(res);
}



export { handleSignUp, handleLogin };
