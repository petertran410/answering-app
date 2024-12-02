"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams
) => {
  try {
    await connectToDatabase();

    // const { userId, limit = 3 } = params;
    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return [
      { _id: "1", name: "Tag1" },
      { _id: "2", name: "Tag2" },
      { _id: "3", name: "Tag3" },
    ];
  } catch (error) {
    console.log("Cannot find tags", error);
    throw error;
  }
};

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    await connectToDatabase();

    const tags = await Tag.find({});

    return { tags };
  } catch (error) {
    console.log("Cannot get all tags", error);
    throw error;
  }
};
