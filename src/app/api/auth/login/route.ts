import db from "@/db/db";
import { createError, errorWrap } from "@/functions/error";
import { res } from "@/functions/res";
import { pass, times } from "@/functions/times";
import redis from "@/redis/redis";

export const secure = process.env.NODE_ENV == "production";
export const httpOnly = true;
export const maxAge = times.month * 3;

export const POST = errorWrap(async (req) => {
  const { email, password } = await req.json();
  validator(email, password);

  const user = await findUser(email, password);
  if (user == null) return createError("User not found!");
  if (!user.active) createError("Account not active please contact support!");

  if (user.method !== "password")
    createError(`Cannot login with password sign in with ${user.method}`);

  if (
    user.users_auth!.pass_wrong_count >= 5 &&
    pass(user.users_auth!.pass_wrong_date, times.min * 10)
  ) {
    createError(
      "You have entered too many wrong passwords, please try again later!"
    );
  }

  let passed;

  if (passed) {
    await pingOkPassword(user.id);
  } else {
    await pingWrongPassword(user.id);
    createError("Password wrong!");
  }

  const session = await createSession(user.id);
  await redis.setex(session, times.week, user.id);

  const r = res("Successfully logged in");
  r.cookies.set("session", session, { maxAge, httpOnly, secure });
  r.cookies.set("isloggedin", "true", { maxAge });
  return r;
});

const validator = (email: any, password: any) => {
  if (typeof email !== "string" || email.trim().length < 10)
    createError("Email must be!");

  //[INFO] todo isemail

  if (typeof password !== "string") createError("Password must be!");

  if (password.length < 6)
    createError("Password must be at least 6 characters!");

  if (password.length > 100)
    createError("Password must be up to 100 characters!");
};

const findUser = (email: string, password: string) =>
  db.users.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      active: true,
      password: true,
      method: true,
      users_auth: { select: { pass_wrong_count: true, pass_wrong_date: true } },
    },
  });

const pingWrongPassword = (user_id: string) =>
  db.users_auth.update({
    where: { user_id },
    data: {
      pass_wrong_count: { increment: 1 },
      pass_wrong_date: new Date(),
    },
    select: {},
  });

const pingOkPassword = (user_id: string) =>
  db.users_auth.update({
    where: { user_id },
    data: { login_date: new Date(), pass_wrong_count: 0 },
    select: {},
  });

export const createSession = (user_id: string) =>
  db.sessions
    .create({ data: { user_id }, select: { session: true } })
    .then((r) => r.session);
