"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import Editor from "@monaco-editor/react";

export function ResizableDemo({ setContent, languageValue, problem }) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border bg-primary text-primary-foreground"
    >
      <ResizablePanel className="" defaultSize={90}>
        <div className="flex flex-col justify-between p-6 ">
          <div>
            <h1></h1>
            <div className="text-2xl">{problem?.title}</div>
          </div>
          <div>
            <div
              className={`${
                problem?.difficulty === "easy"
                  ? "bg-green-500"
                  : problem?.difficulty === "medium"
                  ? "bg-orange-500"
                  : "bg-red-500"
              } p-2 rounded-lg text-primary-foreground w-max`}
            >
              {problem?.difficulty}
            </div>
          </div>
          <div className="my-4">
            <div className="text-2xl font-semibold">Description</div>
            <div>{problem?.description}</div>
          </div>
          <div className="my-4">
            <div className="text-2xl font-semibold">Input Format</div>
            <div>{problem?.inputDescription}</div>
          </div>
          <div className="my-4">
            <div className="text-2xl font-semibold">Output Format</div>
            <div>{problem?.outputDescription}</div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="flex" defaultSize={90}>
        <Editor
          height="90vh"
          defaultLanguage="cpp"
          defaultValue="// some comment"
          onChange={(val) => setContent(val)}
          language={languageValue}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
