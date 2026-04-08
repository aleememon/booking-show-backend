import {z} from "zod";

export const signupPayloadDTO = z.object({
    firstName: z.string().min(3),
    lastName: z.string().optional(),
    email: z.email(),
    password: z.string().min(4),
});


export const signinPayloadDTO = z.object({
    email: z.email(),
    password: z.string().min(4),
});