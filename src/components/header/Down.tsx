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
          <div className="h-full flex items-center">
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
                        isactive && "!border-b-indigo-600",
                        "ml-8 center relative cursor-pointer h-full pt-1 border-b-transparent border-b-2"
                      )}
                    >
                      <p
                        className={classNames(
                          isactive && "text-indigo-600",
                          "text-gray-900 font-medium"
                        )}
                      >
                        {cl.name}
                      </p>
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
                        <li className="mb-4 font-medium whitespace-nowrap text-base text-gray-900">
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
        </div>
      </div>
    </div>
  );
}

export default Down;
