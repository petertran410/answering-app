import { z } from "zod";

export const QuestionsSchema = z.object({
  title: z.string().min(1).max(150),
  explanation: z.string().min(50),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const AnswersSchema = z.object({
  answer: z.string().min(1),
});

export const ProfileSchema = z.object({
  name: z.string().min(5).max(100),
  username: z.string().min(5).max(100),
  bio: z.string().min(5),
  porfolioWebsite: z.string().url(),
  location: z.string().min(5).max(100),
});
