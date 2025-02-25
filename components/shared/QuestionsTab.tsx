import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "../cards/QuestionCard";

interface QuestionsTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionsTab = async ({
  searchParams,
  userId,
  clerkId,
}: QuestionsTabProps) => {
  const result = await getUserQuestions({
    userId,
    page: 1,
  });
  return (
    <>
      {result.questions.map((question) => {
        return (
          <QuestionCard
            key={question._id}
            _id={question._id}
            clerkId={question.author.clerkId}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
          />
        );
      })}
    </>
  );
};

export default QuestionsTab;
