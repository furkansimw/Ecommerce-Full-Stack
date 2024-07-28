"use client";

import { Badge, BadgeFull, Loading } from "@/components/general/badge";
import GoogleButton from "@/components/google/google";
import req from "@/functions/req";
import { useQuery, useStatus } from "@/hooks/status";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const next = () => (window.location.href = searchParams.get("next") || "/");
  // const [status, setStatus] = useState<IStatus>({});
  const { setData, setError, status, setLoading } = useStatus();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const a = e.target as any;
    const email = a.email.value;
    const password = a.password.value;

    setLoading();
    req<string>("/auth/login", "POST", { email, password })
      .then((r) => {
        setData(r);
        setTimeout(next, 1000);
      })
      .catch(setError);
  };

  const googleLoginFunc = (token: string) => {
    setLoading();
    req<string>("/auth/login/google", "POST", { token })
      .then((r) => {
        setData(r);
        setTimeout(next, 1000);
      })
      .catch(setError);
  };

  return (
    <>
      <div className="flex mt-[-50px]  min-h-screen flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/mark.svg"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 bg-white sm:mx-auto sm:w-full sm:max-w-lg p-10 rounded-lg ">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="label" htmlFor="email">
                Email address
              </label>
              <div className="mt-2">
                <input
                  tabIndex={2}
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="input"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label" htmlFor="password">
                  Password
                </label>
                <div className="text-sm">
                  <Link href="/forgot-password" className="a">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  tabIndex={3}
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  maxLength={72}
                  autoComplete="current-password"
                  className="input"
                />
              </div>
            </div>
            <BadgeFull status={status} />
            <div>
              <button tabIndex={4} className="button" type="submit">
                Sign in
              </button>
            </div>
          </form>

          <div className="center my-6">
            <span className="h-[1px] bg-gray-200 w-full"></span>
            <p className="font-medium text-gray-600 mx-4 whitespace-nowrap">
              Or continue with
            </p>
            <span className="h-[1px] bg-gray-200 w-full"></span>
          </div>
          <div className="center">
            <GoogleButton onError={() => {}} onSuccess={googleLoginFunc} />
          </div>
        </div>
        <div className="wrap sm:w-full sm:max-w-lg !pt-6 text-sm">
          <div className="center">
            <p>Not a member? </p>
            <Link className="ml-1 a" href={"/signup"}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
