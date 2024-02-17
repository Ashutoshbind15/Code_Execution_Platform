"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { useState } from "react";

export function ResizableDemo({ setContent, languageValue }) {
  console.log(languageValue);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border bg-primary text-primary-foreground"
    >
      <ResizablePanel className="" defaultSize={90}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="" defaultSize={90}>
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
