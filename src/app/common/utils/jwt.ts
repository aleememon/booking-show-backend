import jwt from "jsonwebtoken";

export interface UserTokenPayload {
  id: string;
}

export const createUserToken = (payload: UserTokenPayload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return token;
};

export const verifyUserToken = (token: string) => {
  try {
    const verify = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as UserTokenPayload;
    return verify;
  } catch (error) {
    return null;
  }
};
