/* eslint-disable no-unused-vars */
"use server";

import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";
import User from "@/database/user.model";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";

export const getUserById = async (params: any) => {
  try {
    await connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log("Error no userId found", error);
    throw error;
  }
};

export const createUser = async (userData: CreateUserParams) => {
  try {
    await connectToDatabase();

    const newUser = await User.create(userData);

    console.log("User created", newUser);

    return newUser;
  } catch (error) {
    console.log("Error no userId found", error);
    throw error;
  }
};

export const updateUser = async (params: UpdateUserParams) => {
  try {
    await connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw new Error("Cannot update User");
  }
};

export const deleteUser = async (params: DeleteUserParams) => {
  try {
    await connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete everything from user: questions, answers, comments, etc

    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      "_id"
    );

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw new Error("Cannot delete User");
  }
};

export const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    connectToDatabase();

    // const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const users = await User.find({}).sort({ createdAt: -1 });

    return { users };
  } catch (error) {
    console.log("Cannot get all users", error);
    throw error;
  }
};

export const toggleSaveQuestion = async (
  params: ToggleSaveQuestionParams
): Promise<{ success: boolean }> => {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      // Remove question from saved
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      // Add question to saved
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);

    // Indicate success
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

export const getSavedQuestions = async (params: GetSavedQuestionsParams) => {
  try {
    connectToDatabase();

    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: { craetedAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions };
  } catch (error) {
    console.log("Error fetching saved question", error);
    throw error;
  }
};
