"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

const Navbar = () => {
  const { data, status } = useSession();

  return (
    <div className="flex w-full justify-between px-8 sticky top-0 py-4 text-primary font-semibold">
      <div className="flex-1">
        <Link href={"/"} className="text-xl text-primary">
          CodeExec Platform
        </Link>
      </div>

      {status === "loading" && (
        <Skeleton className={"w-[100px] h-[20px] rounded-full bg-slate-600"} />
      )}

      <div className="flex gap-x-4 items-center">
        {status === "authenticated" && (
          <Avatar>
            <AvatarImage src={data?.user?.image} />
            <AvatarFallback>
              {data?.user?.name?.length && data?.user?.name[0]}
            </AvatarFallback>
          </Avatar>
        )}
        {status === "authenticated" && (
          <button onClick={() => signOut()}>Sign Out</button>
        )}
      </div>
      {status === "unauthenticated" && (
        <button onClick={() => signIn("github")}>Sign In</button>
      )}
    </div>
  );
};

export default Navbar;
