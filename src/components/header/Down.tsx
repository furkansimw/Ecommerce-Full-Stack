"use client";

import { classNames } from "@/functions/classnames";
import { ICategory } from "@/interfaces/ICategory";
import Link from "next/link";
import React, { useState } from "react";
import Out from "../general/out";

type Props = { cl: ICategory[] };

function Down({ cl }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const clickUpList = (link: string) =>
    setActive((p) => (p == link ? null : link));

  const closeP = () => setActive(null);

  return (
    <div className="bg-white">
      <div className="wrap h-[64px] relative">
        <div className="h-[1px] absolute bottom-0 bg-gray-200 w-full"></div>
        <div className="h-full flex items-center justify-between">
          <div className="h-full flex items-center pt-1">
            <div className="h-9 w-9">
              <Link onClick={closeP} href={"/"}>
                <img src="/mark.svg" alt="mark" />
              </Link>
            </div>
            <Out tap={() => setActive(null)}>
              <ul className="flex h-16">
                {cl.map((cl, aa) => {
                  const isactive = cl.link == active;
                  return (
                    <li
                      key={`nav-${cl.link}-${aa}`}
                      onClick={() => clickUpList(cl.link)}
                      className={classNames(
                        "ml-8 center relative cursor-pointer h-full pt-1"
                      )}
                    >
                      <p
                        className={classNames(
                          isactive && "text-indigo-600",
                          "text-gray-700 font-medium"
                        )}
                      >
                        {cl.name}
                      </p>
                      {isactive && (
                        <div className="bg-indigo-600 h-[2px] absolute bottom-[2px] z-100 left-0 w-full"></div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div
                className={classNames(
                  active
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none",
                  "fixed transition-all duration-300 top-[106px] bg-white z-50 w-screen left-0"
                )}
              >
                <div className="wrap relative flex justify-between h-full !py-8">
                  {cl
                    .find((_cl) => _cl.link == active)
                    ?.subcategories.map((sc, ii) => (
                      <ul key={`sc-${sc.link}-${ii}`} className="w-full mr-10">
                        <li className="mb-4 font-medium whitespace-nowrap text-base text-gray-700">
                          <p>{sc.name}</p>
                        </li>
                        {sc.subcategoryitems.map((sci, i) => (
                          <li key={`sci-${sci.link}-${i}`} className="mb-3">
                            <Link onClick={closeP} href={sci.link}>
                              <p className="text-sm text-gray-500 hover:text-gray-600">
                                {sci.name}
                              </p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ))}
                  <div className="h-[1px] absolute bottom-0 w-full bg-gray-200"></div>
                </div>
              </div>
            </Out>
          </div>
          <ul className="flex">
            <div className="flex items-center">
              <Link href={"/login"}>
                <p className="text-sm text-gray-800 font-medium">Sign in</p>
              </Link>
              <div className="h-4 w-[1px] bg-gray-500 mx-4"></div>
              <Link href={"/signup"}>
                <p className="text-sm text-gray-800 font-medium">
                  Create account
                </p>
              </Link>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Down;
