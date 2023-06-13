import React from "react";
import { type NextPage } from "next";
import { api } from "~/utils/api";
import { useUser, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LoadingSpinner from "~/components/loading";
dayjs.extend(relativeTime);
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import PostView from "~/components/postview";

const CreatePostWizard = () => {
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Something went wrong!");
      }
    },
  });
  const [input, setInput] = React.useState<string>("");

  if (!user) return null;

  return (
    <div className="flex w-full gap-3 ">
      <Image
        src={user.profileImageUrl}
        alt="Profile Picture"
        className="rounded-full"
        width={50}
        height={50}
      />
      <input
        disabled={isPosting}
        type="text"
        placeholder="Type some emojis"
        className="grow bg-transparent"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            mutate({ content: input });
          }
        }}
      />
      {isPosting === false ? (
        <button
          className="btn btn-primary"
          onClick={() => mutate({ content: input })}
          disabled={isPosting}
        >
          Post
        </button>
      ) : null}
      {isPosting === true ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      ) : null}
    </div>
  );
};

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  const { user, isLoaded: userLoaded, isSignedIn } = useUser();

  return (
    <PageLayout>
      <div className="flex w-full border-b border-slate-200 p-4">
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
        {!!isSignedIn && <CreatePostWizard />}
      </div>
      <div className="flex flex-col">
        {postsLoading ? (
          <div className="mt-2 flex w-full items-center justify-center">
            <LoadingSpinner size={40} />
          </div>
        ) : (
          <>
            {data?.map(({ post, author }) => (
              <PostView key={post.id} post={post} author={author} />
            ))}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default Home;
