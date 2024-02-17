"use client";

import React, { useEffect, useState } from "react";

const AuthPage = () => {
  const [isDOMMounted, setIsDOMMounted] = useState(false);

  useEffect(() => {
    setIsDOMMounted(true);
  }, []);

  if (!isDOMMounted) {
    return null;
  }
  return <div></div>;
};

export default AuthPage;
