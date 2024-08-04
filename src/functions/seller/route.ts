import db from "@/db/db";
import { createError, errorWrap } from "@/functions/error";
import redis from "@/redis/redis";
import { times } from "../times";
import { res } from "../res";
import {
  createSession,
  httpOnly,
  maxAge,
  secure,
} from "@/app/api/auth/login/route";
import { isEmail } from "validator";
import { v4 } from "uuid";
import { hashSync } from "bcrypt";

export const POST = errorWrap(async (req) => {
  const { email, password, name, phone, category, address, company } =
    await req.json();

  validator(email, password, name, phone, category, address, company);

  const userId = await createSellerAccount(
    email,
    password,
    name,
    phone,
    category,
    address,
    company
  );

  const session = await createSession(userId);
  await redis.setex(session, times.week, userId);

  const r = res("Successfully logged in");
  r.cookies.set("session", session, { maxAge, httpOnly, secure });
  r.cookies.set("isloggedin", "true", { maxAge });
  return r;
});

const validator = (
  email: any,
  password: any,
  name: any,
  phone: any,
  category: any,
  address: any,
  company: any
) => {
  if (typeof email !== "string" || email.trim().length < 10)
    createError("Email must be!");

  if (!isEmail(email)) createError("Email not valid!");

  if (typeof password !== "string") createError("Password must be!");

  if (password.length < 6)
    createError("Password must be at least 6 characters!");

  if (password.length > 100)
    createError("Password must be up to 100 characters!");

  if (typeof name !== "string") return createError("Name must be!");
  if (name.length > 130) createError("Name must be up to 130 characters!");
  if (typeof phone !== "string") createError("Phone must be!");
  if (typeof category !== "string") createError("Category must be!");
  if (typeof address !== "string") createError("Address must be!");
  if (typeof company !== "string") createError("Company must be!");
};

async function createSellerAccount(
  email: string,
  password: string,
  name: string,
  phone: string,
  category: string,
  address: string,
  company: string
) {
  password = hashSync(password, 12);

  const link =
    name.toLowerCase().trim().replaceAll(" ", "-") + "-" + v4().slice(0, 8);

  const seller = await db.sellers.create({
    data: {
      link,
      name,
      sellers_info: { create: { address, category, company, phone } },
    },
    select: { id: true },
  });

  const user = await db.users.create({
    data: {
      email,
      password,
      role: "seller",
      seller_id: seller.id,
      users_auth: { create: {} },
    },
    select: { id: true },
  });

  return user.id;
}
