import * as z from "zod";

export const formSchema = z.object({
    propt: z.string().min(1,{
        message: "Propt is requred",
    })
})