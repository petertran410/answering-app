"use client";
import React, { useEffect } from "react";
import Prism from "prismjs";
import parse from "html-react-parser";

import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-aspnet";
import "prismjs/components/prism-sass";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-solidity";
import "prismjs/components/prism-json";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-r";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-go";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-mongodb";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

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
      className="text-dark400_light800 prose max-w-full overflow-hidden"
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
      <style jsx global>{`
        pre,
        pre[class*="language-"] {
          white-space: pre-wrap !important;
          word-break: break-word !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          max-width: 100% !important;
          overflow-x: auto;
          border-radius: 0.375rem;
        }

        code,
        code[class*="language-"] {
          white-space: pre-wrap !important;
          word-break: break-word !important;
          word-wrap: break-word !important;
        }

        .token {
          white-space: pre-wrap !important;
        }

        .prose pre {
          margin: 0;
          padding: 1rem;
          color: var(--prism-color, #f8f8f2);
          font-family: monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          tab-size: 2;
        }

        .dark .prose pre {
          --prism-bg: #1e1e1e;
          --prism-color: #f8f8f2;
        }

        .light .prose pre {
          --prism-bg: #f5f5f5;
          --prism-color: #2d2d2d;
        }

        .prose img {
          max-width: 100%;
          height: auto;
        }

        .prose table {
          display: block;
          width: 100%;
          overflow-x: auto;
          white-space: nowrap;
        }
      `}</style>
      {parse(processContent(data))}
    </div>
  );
};

export default ParseHTML;
