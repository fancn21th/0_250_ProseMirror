import React, { useEffect, useRef } from "react";
import { Schema } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { DOMParser } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";

// Define the schema
const trivialSchema = new Schema({
  nodes: {
    doc: { content: "paragraph+" },
    paragraph: {
      content: "text*",
      group: "block",
      toDOM: () => ["p", 0],
      parseDOM: [{ tag: "p" }],
    },
    text: { inline: true, group: "inline" },
  },
  marks: {},
});

// React Component
const ProseMirrorEditor = () => {
  const editorRef = useRef(null);
  const editorViewRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Initialize the editor state
    const state = EditorState.create({
      schema: trivialSchema,
      plugins: [keymap(baseKeymap)],
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

  return <div ref={editorRef} className="w-screen h-screen bg-gray-100"></div>;
};

export default ProseMirrorEditor;
