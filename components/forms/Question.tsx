"use client";
import React, { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { QuestionsSchema } from "@/lib/validations";
import { Editor } from "@tinymce/tinymce-react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";

interface Props {
  mongoUserId: string;
  type?: string;
  questionDetails?: string;
}

export const Question = ({ mongoUserId, type, questionDetails }: Props) => {
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmititing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { mode } = useTheme();

  const parseQuestionDetails = questionDetails && JSON.parse(questionDetails);

  const groupTags = parseQuestionDetails?.tags.map((tag: any) => tag.name);

  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: parseQuestionDetails?.title || "",
      explanation: parseQuestionDetails?.content || "",
      tags: groupTags || [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setIsSubmititing(true);

    try {
      if (type === "Edit") {
        await editQuestion({
          questionId: parseQuestionDetails._id,
          title: values.title,
          content: values.explanation,
          path: pathname,
        });
        router.push(`/question/${parseQuestionDetails._id}`);
      } else {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(mongoUserId),
          path: pathname,
        });
        router.push("/");
      }
    } catch (error) {
      console.log("Cannot submit the question form", error);
    } finally {
      setIsSubmititing(false);
    }
  }

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 characters",
          });
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newTags);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10">
        {/* TITLE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* EXPLANATION */}
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <div className="w-full overflow-hidden">
                  <Editor
                    key={mode}
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;

                      // Thêm CSS rules vào editor instance sau khi khởi tạo
                      editor.on("init", function () {
                        // Thêm CSS để xử lý code blocks
                        editor.dom.addStyle(`
            pre.language-javascript, pre.language-typescript, pre.language-html, pre.language-css, pre[class*="language-"] {
              white-space: pre-wrap !important;
              word-break: break-word !important;
              word-wrap: break-word !important;
              overflow-wrap: break-word !important;
              max-width: 100% !important;
            }
            
            code[class*="language-"] {
              white-space: pre-wrap !important;
              word-break: break-word !important; 
              word-wrap: break-word !important;
            }
            
            .mce-content-body .token {
              white-space: pre-wrap !important;
            }
          `);
                      });
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    initialValue={parseQuestionDetails?.content}
                    init={{
                      height: 400,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo | " +
                        "codesample | bold italic forecolor | alignleft aligncenter |" +
                        "alignright alignjustify | bullist numlist",
                      content_style: `
                        body { 
                          font-family: Inter; 
                          font-size: 16px; 
                        }
                        pre { 
                          max-width: 100%;
                          overflow-x: auto;
                          white-space: pre-wrap !important;
                          word-wrap: break-word !important;
                        }
                        code {
                          white-space: pre-wrap !important;
                          word-wrap: break-word !important;
                        }
                      `,
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                      width: "100%",
                      codesample_languages: [
                        { text: "HTML/XML", value: "markup" },
                        { text: "JavaScript", value: "javascript" },
                        { text: "TypeScript", value: "typescript" },
                        { text: "CSS", value: "css" },
                        { text: "PHP", value: "php" },
                        { text: "Ruby", value: "ruby" },
                        { text: "Python", value: "python" },
                        { text: "Java", value: "java" },
                        { text: "C", value: "c" },
                        { text: "C#", value: "csharp" },
                        { text: "C++", value: "cpp" },
                      ],
                      codesample_content_css: true,
                      codesample_global_prismjs: true,
                      branding: false,
                      resize: false,
                      paste_data_images: true,
                      browser_spellcheck: true,
                      min_height: 400,
                      max_height: 800,
                      autoresize_bottom_margin: 50,
                      placeholder: "Write your explanation here...",
                      mobile: {
                        plugins: "codesample",
                        toolbar: "undo redo | bold italic | codesample",
                      },
                    }}
                  />
                </div>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 50 characters
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* TAGS */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                {/* No props passed to Fragment */}
                <>
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                    disabled={type === "Edit"}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          onClick={() =>
                            type !== "Edit"
                              ? handleTagRemove(tag, field)
                              : () => {}
                          }>
                          {tag}
                          {type !== "Edit" && (
                            <Image
                              src="/assets/icons/close.svg"
                              alt="Close icon"
                              width={12}
                              height={12}
                              className="cursor-pointer object-contain invert-0 dark:invert"
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="primary-gradient w-fit !text-light-900"
          disabled={isSubmitting}>
          {isSubmitting ? (
            <>{type === "Edit" ? "Editing ..." : "Posting ..."}</>
          ) : (
            <>{type === "Edit" ? "Edit Question" : "Ask a question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};
