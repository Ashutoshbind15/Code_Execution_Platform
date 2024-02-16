"use client";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex w-full justify-between px-4 py-2 text-primary font-semibold">
      <div>CodeExec Platform</div>
      <LoginLink> Sign in </LoginLink>
    </div>
  );
};

export default Navbar;
