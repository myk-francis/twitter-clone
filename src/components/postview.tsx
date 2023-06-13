import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profilePicture}
        alt="Profile Picture"
        className="rounded-full"
        width={50}
        height={50}
      />
      <div className="flex flex-col">
        <div className="flex gap-3">
          <Link href={`/${author.id === null ? "user" : author.id}`}>
            <span className="font-bold text-slate-300">
              @{author.firstName}
            </span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin text-slate-300">
              .{`${dayjs(post.createdAt).fromNow()}`}
            </span>
          </Link>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

export default PostView;
