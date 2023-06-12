import React from "react";
// import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LoadingSpinner from "~/components/loading";
dayjs.extend(relativeTime);
// import toast from "react-hot-toast";

import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";

// const ProfileFeed = (props: { userId: string }) => {
//   const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
//     userId: props.userId,
//   });

//   if (isLoading) return <LoadingPage />;

//   if (!data || data.length === 0) return <div>User has not posted</div>;

//   return (
//     <div className="flex flex-col">
//       {data.map((fullPost) => (
//         <PostView {...fullPost} key={fullPost.post.id} />
//       ))}
//     </div>
//   );
// };

export default function ProfilePage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { userid } = props;
  const postQuery = api.profile.getUserById.useQuery({
    userid: userid,
  });

  const { data } = postQuery;

  if (postQuery.isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (!data)
    return <div className="flex h-screen items-center justify-center">404</div>;

  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={data.profilePicture}
            alt="Profile Picture"
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${
          data.firstName ?? "User"
        }`}</div>
        <div className="w-full border-b border-slate-400" />
      </PageLayout>
    </>
  );
}

export async function getStaticProps(
  context: GetStaticPropsContext<{ userid: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const userid = context.params?.userid as string;
  // prefetch `post.byId`
  await helpers.profile.getUserById.prefetch({ userid: userid });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      userid,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
    fallback: "blocking",
  };
};
