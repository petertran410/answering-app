"use server";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import User from "@/database/user.model";

export const getQuestion = async (param: GetQuestionsParams) => {
  try {
    connectToDatabase();

    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

    return { questions };
  } catch (error) {
    console.log("Cannot get question", error);
    throw error;
  }
};

export const createQuestion = async (param: CreateQuestionParams) => {
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = param;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });
    const tagDocuments = [];

    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);
    }
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });
    // Create an interaction record for the user's ask_question action
    revalidatePath(path);
    // Imcrement author's reputation by +5 for creating a question
  } catch (error) {
    console.log("Cannot create question", error);
    throw error;
  }
};
