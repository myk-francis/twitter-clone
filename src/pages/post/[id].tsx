import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { SignOutButton, useUser, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LoadingSpinner from "~/components/loading";
import toast from "react-hot-toast";

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="flex h-screen justify-center">Post page</main>
    </>
  );
};

export default SinglePostPage;
