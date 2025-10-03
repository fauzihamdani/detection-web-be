import { ZodObject, ZodRawShape } from "zod";
import { Request, Response, NextFunction } from "express";

export default (schema: ZodObject<ZodRawShape>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, params: req.params, query: req.query });
      next();
    } catch (err: any) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: err.errors });
    }
  };
