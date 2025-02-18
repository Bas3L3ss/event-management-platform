"use client";

import React, { Dispatch } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";
import Emoji from "quill-emoji";

Quill.register("modules/emoji", Emoji);

interface FormDescriptionRIchTextProps {
  content: string;
  setContent: Dispatch<string>;
}

const FormDescriptionRIchText = ({
  content,
  setContent,
}: FormDescriptionRIchTextProps) => {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"], // Styling
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      [{ color: [] }, { background: [] }], // Text and background coloring
      ["emoji"], // Emoji button
    ],
    "emoji-toolbar": true,
    "emoji-textarea": false,
    "emoji-shortname": true,
  };

  return (
    <div>
      <ReactQuill
        value={content}
        onChange={setContent}
        modules={modules}
        theme="snow" // Use the Snow theme
        placeholder="Write event description here..."
      />
    </div>
  );
};

export default FormDescriptionRIchText;
