import { NextResponse } from "next/server";

export const res = (body: any = "ok", status: number = 200) =>
  NextResponse.json(body, { status });
