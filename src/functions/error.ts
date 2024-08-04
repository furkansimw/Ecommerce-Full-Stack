import { IApiParams } from "@/interfaces/IParams";
import { NextRequest } from "next/server";
import { res } from "./res";

export class CustomError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export const createError = (
  message: string = "Bad request",
  status: number = 400
) => {
  throw new CustomError(message, status);
};

export const errorWrap = (
  fn: (req: NextRequest, params: IApiParams["params"]) => Promise<any>
) => {
  return async (req: NextRequest, params: IApiParams) => {
    try {
      return await fn(req, params["params"]);
    } catch (error) {
      if (error instanceof CustomError) {
        return res(error.message, error.status);
      } else {
        return res("Internal Server Error", 500);
      }
    }
  };
};
