import { RCategory } from "@/functions/requests";
import React from "react";
import Down from "./Down";

async function Header() {
  const cl = await RCategory.getHeader();
  return (
    <header className="h-[104px] fixed top-0 left-0 bg-white z-50 w-screen">
      <div className="bg-indigo-600 h-[42px] center">
        <p className="text-white font-medium">
          Get free delivery on orders over $100
        </p>
      </div>
      <Down cl={cl} profile={{ cartCount: 0 }} />
    </header>
  );
}

export default Header;
