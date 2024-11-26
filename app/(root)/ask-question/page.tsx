import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

const page = () => {
  // const isUserLoggedIn = false;

  // if (!isUserLoggedIn) {
  // }

  return <ClerkProvider>Ask Question</ClerkProvider>;
};

export default page;
