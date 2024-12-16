import React, { useEffect, useRef } from "react";
import { Schema } from "prosemirror-model";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";

// Define the schema
const trivialSchema = new Schema({
  nodes: {
    text: {
      group: "inline",
    },
    star: {
      inline: true,
      group: "inline",
      toDOM() {
        return ["star", "🟊"];
      },
      parseDOM: [{ tag: "star" }],
    },
    paragraph: {
      group: "block",
      content: "inline*",
      toDOM() {
        return ["span", 0];
      },
      parseDOM: [{ tag: "span" }],
    },
    boring_paragraph: {
      group: "block",
      content: "text*",
      marks: "",
      toDOM() {
        return ["span", { class: "boring" }, 0];
      },
      parseDOM: [{ tag: "span.boring", priority: 60 }],
    },
    doc: {
      content: "block+",
    },
  },
});

// Selection 监听插件
const selectionPlugin = new Plugin({
  view(editorView) {
    return {
      update(view) {
        const { from, to } = view.state.selection;
        console.log(`Selection changed: from ${from} to ${to}`);
      },
    };
  },
});

const defaultContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "请获取",
        },
      ],
    },
    {
      type: "boring_paragraph",
      content: [
        {
          type: "text",
          text: "2024年12月10日",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "的日程主题，联系人，描述",
        },
      ],
    },
  ],
};

// React Component
const ProseMirrorEditor = () => {
  const editorRef = useRef(null);
  const editorViewRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Initialize the editor state
    const state = EditorState.create({
      doc: trivialSchema.nodeFromJSON(defaultContent),
      schema: trivialSchema,
      plugins: [keymap(baseKeymap), selectionPlugin],
    });

    // Create the editor view
    const view = new EditorView(editorRef.current, {
      state,
    });

    editorViewRef.current = view;

    // Cleanup function
    return () => {
      view.destroy();
      editorViewRef.current = null;
    };
  }, []);

  return (
    <div
      ref={editorRef}
      className="p-2 border-2 rounded-md border-purple-500"
    ></div>
  );
};

export default ProseMirrorEditor;
