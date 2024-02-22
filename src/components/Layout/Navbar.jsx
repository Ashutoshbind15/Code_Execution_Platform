"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { useUser } from "@/lib/hooks/queries";

const Navbar = () => {
  const { user, isUserLoading, isUserError, userError } = useUser();

  console.log(user);

  return (
    <div className="flex w-full justify-between px-8 sticky top-0 py-4 text-primary font-semibold">
      <div className="flex-1">
        <Link href={"/"} className="text-xl text-primary">
          CodeExec Platform
        </Link>
      </div>

      {isUserLoading && (
        <Skeleton className={"w-[100px] h-[20px] rounded-full bg-slate-600"} />
      )}

      <div className="flex gap-x-4 items-center">
        {user && (
          <Avatar>
            <AvatarImage src={user?.image} />
            <AvatarFallback>
              {user?.name?.length && user?.name[0]}
            </AvatarFallback>
          </Avatar>
        )}
        {user && <button onClick={() => signOut()}>Sign Out</button>}
      </div>
      {isUserError && <button onClick={() => signIn("github")}>Sign In</button>}
    </div>
  );
};

export default Navbar;
