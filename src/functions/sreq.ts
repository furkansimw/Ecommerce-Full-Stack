import { cookies } from "next/headers";

type methods = "GET" | "POST" | "DELETE" | "PATCH";

const _URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

const sreq = <T>(
  path: string,
  method: methods = "GET",
  body?: any
): Promise<{ status: number; data: T }> =>
  new Promise(async (resolve) => {
    try {
      if (method == "GET") body = null;
      else body = JSON.stringify(body);

      const res = await fetch(`${_URL}/api${path}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Cookie: cookies().toString(),
        },
        body,
        credentials: "include",
        method,
        next: { revalidate: 0 }, // [INFO] for not production
      });

      const data = await res.json();
      const { status } = res;
      resolve({ data, status });
    } catch (error) {
      const data: any = "Something wrong";
      const status = 500;
      resolve({ data, status });
    }
  });

export default sreq;
