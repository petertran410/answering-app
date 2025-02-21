import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "../cards/AnswerCard";

interface AnswersTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab = async ({
  // searchParam,
  userId,
  clerkId,
}: AnswersTabProps) => {
  const result = await getUserAnswers({
    userId,
    page: 1,
  });
  return (
    <div>
      {result.answers.map((answer) => {
        return (
          <AnswerCard
            key={answer._id}
            _id={answer._id}
            clerkId={answer.author.clerkId}
            question={answer.question}
            author={answer.author}
            upvotes={answer.upvotes}
            createdAt={answer.createdAt}
          />
        );
      })}
    </div>
  );
};

export default AnswersTab;
