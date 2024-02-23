"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { compareOutputs } from "@/lib/helperFunctions/exec/outputComp";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";

const TestCaseView = ({
  i,
  testcase = {
    input: "1 2 3 4",
    output: "10",
    res: "",
    passed: 0,
    isRunning: true,
  },
  content,
  setTestCase,
  languageId,
}) => {
  const [token, setToken] = useState(null);
  const [inputWindow, setInputWindow] = useState(true);

  if (testcase?.res)
    console.log(compareOutputs(testcase?.res, testcase.output));

  const runner = async () => {
    setTestCase(i, {
      isRunning: true,
    });

    console.log(languageId);

    const { data } = await axios.post("/api/exec", {
      srcCode: content,
      langId: languageId,
      inputTestCase: testcase.input,
    });

    const token = data.token;

    if (token) {
      return token;
    }
  };

  useEffect(() => {
    if (token) {
      const fetchToken = async () => {
        const { data } = await axios.get(`/api/exec?token=${token}`);

        const isTestCasePassed = compareOutputs(
          data.res,
          testcase.output
        ).isMatch;

        console.log(isTestCasePassed);

        setTestCase(i, {
          res: data.res,
          passed: isTestCasePassed === true ? 1 : -1,
          isRunning: false,
        });
      };
      fetchToken();
    }
  }, [token]);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <div>
            {!testcase?.isRunning && (
              <button
                className={`px-4 py-2 rounded-md ${
                  testcase?.passed === 0
                    ? "bg-primary text-primary-foreground"
                    : null
                } ${
                  testcase?.passed === 1
                    ? "bg-green-500 text-primary-foreground"
                    : null
                } ${
                  testcase?.passed === -1
                    ? "bg-red-500 text-primary-foreground"
                    : null
                }`}
              >
                {i}
              </button>
            )}

            {testcase?.isRunning && (
              <button className="bg-primary text-primary-foreground p-2 rounded-xl">
                <LoadingOutlined />
              </button>
            )}
          </div>
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
                value={testcase?.input}
                onChange={(e) => setTestCase(i, { input: e.target.value })}
                className="mb-2"
              />
              <Separator orientation="vertical" />
              <Textarea
                value={testcase?.output}
                onChange={(e) => setTestCase(i, { output: e.target.value })}
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
              <Textarea value={testcase?.res} readOnly={true} />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

TestCaseView.displayName = "TestCaseView";

export default TestCaseView;
