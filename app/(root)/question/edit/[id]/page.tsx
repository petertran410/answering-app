import { Question } from "@/components/forms/Question";
import { GetQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const page = async ({ params }: ParamsProps) => {
  const { userId } = await auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  const result = await GetQuestionById({ questionId: params.id });

  return (
    <div className="flex-start w-full flex-col">
      <div className="w-full max-w-5xl px-4 sm:px-6 md:px-10 lg:px-16">
        <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

        <div className="mt-9 w-full">
          <Question
            type="Edit"
            mongoUserId={JSON.stringify(mongoUser._id)}
            questionDetails={JSON.stringify(result)}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
