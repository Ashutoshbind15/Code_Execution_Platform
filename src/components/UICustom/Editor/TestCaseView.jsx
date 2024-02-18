"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useEffect, useState } from "react";
import { forwardRef, useImperativeHandle } from "react";

const TestCaseView = forwardRef(
  ({ i, testcase = { input: "1 2 3 4", output: "10" }, content }, ref) => {
    const [input, setInput] = useState(testcase.input);
    const [output, setOutput] = useState(testcase.output);
    const [token, setToken] = useState(null);
    const [result, setResult] = useState(null);
    const [inputWindow, setInputWindow] = useState(true);

    const runner = async () => {
      const { data } = await axios.post("/api/exec", {
        srcCode: content,
        langId: 54,
        inputTestCase: input,
      });

      const token = data.token;

      if (token) {
        return token;
      }
    };

    useImperativeHandle(ref, () => ({
      runner,
    }));

    useEffect(() => {
      if (token) {
        const fetchToken = async () => {
          const { data } = await axios.get(`/api/exec?token=${token}`);
          console.log(data);
          setResult(data.res);
        };
        fetchToken();
      }
    }, [token]);

    return (
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button>{i}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 mr-3" side="left" align="start">
            <div className="flex h-5 items-center space-x-4 text-sm">
              <Button onClick={() => setInputWindow(true)}>Input</Button>
              <Separator orientation="vertical" />
              <Button onClick={() => setInputWindow(false)}>Output</Button>
              <Separator orientation="vertical" />
            </div>

            <Separator className="my-2" />

            {inputWindow && (
              <div>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="mb-2"
                />
                <Separator orientation="vertical" />
                <Textarea
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  className="mb-2"
                />

                <Button
                  onClick={async () => {
                    const token = await runner();
                    setToken(token);
                  }}
                  className="mb-2"
                >
                  Run TC
                </Button>
              </div>
            )}

            {!inputWindow && (
              <div>
                <Textarea
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                />
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

TestCaseView.displayName = "TestCaseView";

export default TestCaseView;
