"use client";

import { LanguageSelector } from "@/components/UICustom/Editor/LanguageSelector";
import { ResizableDemo } from "@/components/UICustom/Editor/Windows";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [languageValue, setlanguageValue] = useState("javascript");

  return (
    <div>
      <LanguageSelector value={languageValue} setValue={setlanguageValue} />

      <ResizableDemo
        setContent={setContent}
        languageValue={languageValue}
        setlanguageValue={setlanguageValue}
      />
      <button
        onClick={async () => {
          await axios.post("/api/exec", {
            srcCode: content,
            langId: 63,
          });
        }}
      >
        Submit
      </button>
    </div>
  );
}
