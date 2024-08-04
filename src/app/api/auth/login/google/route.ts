import db from "@/db/db";
import { createError, errorWrap } from "@/functions/error";
import { res } from "@/functions/res";
import { AwsClient, OAuth2Client } from "google-auth-library";
import { createSession, httpOnly, maxAge, secure } from "../route";
import redis from "@/redis/redis";
import { times } from "@/functions/times";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

const client = new OAuth2Client({ clientId });

export const POST = errorWrap(async (req) => {
  const { token } = await req.json();

  if (!token) createError("Token not found!");

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: clientId,
  });

  const payload = ticket.getPayload();

  if (!payload) return createError("Paylod not found!");

  const { email, name } = payload;

  if (!email) return res("Email not found!");

  let userId = await findUserWithGoogle(email);

  if (!userId) userId = await createUserWithGoogle(email, name?.slice(0, 100));

  const session = await createSession(userId);
  await redis.setex(session, times.week, userId);

  const r = res("Successfully logged in");
  r.cookies.set("session", session, { maxAge, httpOnly, secure });
  r.cookies.set("isloggedin", "true", { maxAge });
  return r;
});

const findUserWithGoogle = (email: string) =>
  db.users
    .findUnique({ where: { email }, select: { id: true } })
    .then((r) => r?.id);

export const createUserWithGoogle = (email: string, name?: string) =>
  db.users
    .create({
      data: { email, method: "google", name, users_auth: { create: {} } },
      select: { id: true },
    })
    .then((r) => r.id);
