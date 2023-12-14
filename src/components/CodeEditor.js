import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { findFirstNonWhitespaceIndex, findLastNonWhitespaceIndex } from "../utils/CompileOutputParser";

/**
 * Code editor where the user puts code into
 */
const CodeEditor = (props) => {

  const {
    onChange,
    code = '',
    errorLines = []
  } = props;

  const [value, setValue] = useState(code);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decoratorRef = useRef([]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const decorators = getErrorLineDecorators();

    decoratorRef.current = editor.deltaDecorations(decoratorRef.current, decorators);
  }, [errorLines]);

  /**
   * Returns the error line decorators used to highlight errors in the code editor.
   */
  const getErrorLineDecorators = useCallback(() => errorLines.map(line => {
    const editor = editorRef.current;
    const lineContent = editor.getModel().getLineContent(line);
    const startOfError = findFirstNonWhitespaceIndex(lineContent) + 1;
    const endOfError = findLastNonWhitespaceIndex(lineContent) + 2;
    const monaco = monacoRef.current;

    return {
      range: new monaco.Range(line, startOfError, line, endOfError),
      options: {
        className: "highlighted-error-underlined",
        linesDecorationsClassName: "error-lines-decoration",
      },
    };
  }), [errorLines]);

  /**
   * Handles code changes in the editor.
   */
  const handleEditorChange = useCallback((value) => {
    setValue(value);
    onChange("code", value);

    decoratorRef.current = editorRef.current.deltaDecorations(decoratorRef.current, []);
  }, [onChange]);

  /**
   * Sets the editor reference when editor is loaded.
   */
  const editorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }, []);

  /**
   * Sets options for the code editor.
   */
  const options = useMemo(() => ({
    selectOnLineNumbers: true,
    minimap: {
      enabled: false,
    },
    scrollBeyondLastLine: false,
  }), []);

  return (
    <div className="code-editor overlay rounded-md overflow-hidden w-full h-full shadow-4xl px-1 py-1">
      <Editor
        language="java"
        value={value}
        theme="vs-dark"
        defaultValue="// some comment"
        onChange={handleEditorChange}
        onMount={editorDidMount}
        options={options}
      />
    </div>
  );
};

export default React.memo(CodeEditor);