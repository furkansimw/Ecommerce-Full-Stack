"use client";

type methods = "GET" | "POST" | "DELETE" | "PATCH";

const _URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

const req = <T>(
  path: string,
  method: methods = "GET",
  body?: any
): Promise<T> =>
  new Promise(async (resolve, reject) => {
    try {
      if (method == "GET") body = null;
      else body = JSON.stringify(body);

      const res = await fetch(`${_URL}/api${path}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body,
        credentials: "include",
        method,
        next: { revalidate: 0 }, // [INFO] for not production
      });
      const data = await res.json();

      const { status } = res;

      if (status >= 200 && status < 300) {
        resolve(data);
      } else if (status == 401) {
        if (typeof window != "undefined") {
          window.location.href = "/login?next=" + window.location.href;
        }
        reject(data);
      } else {
        reject(data);
      }
    } catch (error) {
      reject("Something wrong");
    }
  });

export default req;
