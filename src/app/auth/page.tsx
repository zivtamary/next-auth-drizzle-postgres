"use client";

import { signIn } from "next-auth/react";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const connect = async () => {
    await signIn("google");
  };
  return (
    <div>
      <button onClick={connect}>login</button>
    </div>
  );
};

export default page;
