import React, { useRef, useEffect } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { DOMParser, Schema } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";
import "prosemirror-view/style/prosemirror.css";

const ProseMirrorEditor = () => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      // 创建 ProseMirror 编辑器实例
      const state = EditorState.create({
        schema: basicSchema,
        doc: DOMParser.fromSchema(basicSchema).parse(
          document.createElement("div")
        ),
      });

      viewRef.current = new EditorView(editorRef.current, {
        state,
      });

      // 在组件卸载时销毁编辑器
      return () => {
        if (viewRef.current) {
          viewRef.current.destroy();
        }
      };
    }
  }, []);

  return (
    <div ref={editorRef} style={{ border: "1px solid #ccc", padding: "5px" }} />
  );
};

export default ProseMirrorEditor;
