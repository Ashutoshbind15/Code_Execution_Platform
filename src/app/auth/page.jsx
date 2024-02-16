"use client";

import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import React, { useEffect, useState } from "react";

const AuthPage = () => {
  const [isDOMMounted, setIsDOMMounted] = useState(false);

  useEffect(() => {
    setIsDOMMounted(true);
  }, []);

  if (!isDOMMounted) {
    return null;
  }
  return (
    <div>
      <LoginLink>Sign in</LoginLink>
      <RegisterLink>Sign up</RegisterLink>
    </div>
  );
};

export default AuthPage;
