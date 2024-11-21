import { User } from "@prisma/client";
import { z } from "zod";
export const userAuthschema = z.object({
  username: z
    .string()
    .refine(
        (val) => val.length >= 3 && val.length <= 10,
        { message: 'Username should be between 3 and 10 characters long' }
      ),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

export const AddContentschema = z.object({
    type: z.enum(["IMAGE", "VIDEO", "ARTICLE", "AUDIO"], { message: "Invalid content type" }),
    link: z.string(),
    title:z.string(),
    tags: z.array(z.string())
})

export const shareBrainLinkschema = z.object({
  share : z.boolean()
})



declare global {
  namespace Express {
    interface Request {
      user?: User;  
    }
  }
}