"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "../ui/sonner";

const Root = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <div>{children}</div>
      <Toaster />
    </SessionProvider>
  );
};

export default Root;
