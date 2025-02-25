import { getTopInteractedTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import RenderTag from "../shared/RenderTag";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ user }: Props) => {
  const interactedTags = await getTopInteractedTags({ userId: user._id });

  return (
    <div>
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Link href={`/profile/${user.clerkId}`}>
          <div className="flex flex-col items-center">
            <Image
              src={user.picture}
              alt="User profile piciture"
              width={100}
              height={100}
              className="rounded-full"
            />

            <div className="mt-4 text-center">
              <h3 className="h3-bold text-dark200_light900 line-clamp-1">
                {user.name}
              </h3>
              <p className="body-regular text-dark500_light500 mt-2">
                @{user.username}
              </p>
            </div>
          </div>
        </Link>

        <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedTags.map((tag) => {
                return (
                  <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
                );
              })}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </div>
  );
};

export default UserCard;
