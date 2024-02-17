"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data } = useSession();
  console.log(data);

  return (
    <div className="flex w-full justify-between px-4 py-2 text-primary font-semibold">
      <div>CodeExec Platform</div>
      <button onClick={() => signIn("github")}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

export default Navbar;
