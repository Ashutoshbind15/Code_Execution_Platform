"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { useState } from "react";

export function ResizableDemo() {
  const [lang, setLang] = useState("javascript");

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border bg-primary text-primary-foreground"
    >
      <ResizablePanel className="">
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="">
        <Editor
          height="90vh"
          defaultLanguage="javascript"
          defaultValue="// some comment"
          onChange={(val) => console.log(val)}
          language={lang}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
