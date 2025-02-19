"use client";
import React, { useEffect } from "react";
import Prism from "prismjs";
import parse from "html-react-parser";

import "prismjs/components/prism-java";
import "prismjs/components/prism-c";

interface Props {
  data: string;
}

const ParseHTML = ({ data }: Props) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const processContent = (content: string) => {
    if (!content.includes("<")) {
      return content.replace(/\n/g, "<br/>");
    }
    return content;
  };

  return (
    <div
      className="text-dark400_light800 prose max-w-full"
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
      {parse(processContent(data))}
    </div>
  );
};

export default ParseHTML;
