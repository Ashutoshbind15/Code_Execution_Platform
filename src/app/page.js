"use client";

import { LanguageSelector } from "@/components/UICustom/Editor/LanguageSelector";
import TestCaseView from "@/components/UICustom/Editor/TestCaseView";
import { ResizableDemo } from "@/components/UICustom/Editor/Windows";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [languageValue, setlanguageValue] = useState("javascript");
  const [token, setToken] = useState(null);
  const [output, setOutput] = useState("");

  const tcs = [1, 2, 3, 4];

  useEffect(() => {
    if (token) {
      const fetchToken = async () => {
        const { data } = await axios.get(`/api/exec?token=${token}`);
        console.log(data);
        setOutput(data.res);
      };
      fetchToken();
    }
  }, [token]);

  return (
    <div>
      <LanguageSelector value={languageValue} setValue={setlanguageValue} />

      {output && <div>{output}</div>}

      <div className="flex">
        <ResizableDemo
          setContent={setContent}
          languageValue={languageValue}
          setlanguageValue={setlanguageValue}
        />
        <div className="px-3 flex flex-col gap-y-4">
          {tcs.map((i) => (
            <TestCaseView i={i} content={content} key={i} />
          ))}
        </div>
      </div>
      <button
        onClick={async () => {
          const { data } = await axios.post("/api/exec", {
            srcCode: content,
            langId: 54,
          });

          const token = data.token;

          if (token) {
            setToken(token.toString());
          }
        }}
      >
        Submit
      </button>
    </div>
  );
}
