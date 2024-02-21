"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "../ui/sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const Root = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <div>{children}</div>
        <Toaster />
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Root;
