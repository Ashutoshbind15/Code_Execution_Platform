"use client";

import { LanguageSelector } from "@/components/UICustom/Editor/LanguageSelector";
import TestCaseView from "@/components/UICustom/Editor/TestCaseView";
import { ResizableDemo } from "@/components/UICustom/Editor/Windows";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { RightCircleOutlined } from "@ant-design/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { compareOutputs } from "@/lib/helperFunctions/exec/outputComp";
import { useProblem } from "@/lib/hooks/queries";

const ProblemPage = ({ params }) => {
  const pid = params.pid;

  const { problem, isProblemLoading, isProblemError, problemError } =
    useProblem(pid);

  const [content, setContent] = useState("");
  const [languageValue, setlanguageValue] = useState("javascript");
  const [mounted, setMounted] = useState(false);
  const [tcs, setTcs] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (problem) {
      console.log("inside erff");
      console.log(problem?.testcases);
      for (let i = 0; i < problem?.testcases.length; i++) {
        const tc = problem.testcases[i];
        tc.res = "";
        tc.passed = 0;
        tc.isRunning = false;
        console.log(tc);
        setTcs((prev) => [...prev, tc]);
      }
    }
  }, [problem]);

  const setTestCase = (i, params) => {
    setTcs((p) => {
      const updatedTcs = [...p];

      updatedTcs[i] = {
        ...updatedTcs[i],
        ...params,
      };

      return updatedTcs;
    });
  };

  const tcForm = useForm({
    defaultValues: {
      input: "",
      output: "",
    },
  });

  const runner = async (testcase) => {
    const { data } = await axios.post("/api/exec", {
      srcCode: content,
      langId: 54,
      inputTestCase: testcase.input,
    });

    const token = data.token;

    if (token) {
      return token;
    }
  };

  return (
    <div>
      <LanguageSelector value={languageValue} setValue={setlanguageValue} />

      <div className="flex">
        <ResizableDemo
          setContent={setContent}
          languageValue={languageValue}
          setlanguageValue={setlanguageValue}
          problem={problem}
        />
        <div className="flex flex-col justify-between py-6">
          <div className="flex flex-col gap-y-4 px-3">
            {tcs.map((_, i) => (
              <TestCaseView
                i={i}
                content={content}
                key={i}
                testcase={_}
                setTestCase={setTestCase}
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-y-3">
            {mounted && (
              <Dialog>
                <DialogTrigger className="rounded-full w-10 h-10 bg-primary text-primary-foreground">
                  +
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Want new testcases?</DialogTitle>
                    <DialogDescription>
                      Fill the following to add testcases
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...tcForm}>
                    <form
                      onSubmit={tcForm.handleSubmit((vs) => {
                        setTcs((p) => [
                          ...p,
                          { ...vs, res: "", passed: 0, isRunning: false },
                        ]);
                      })}
                      className="flex flex-col gap-y-4 items-stretch"
                    >
                      <FormField
                        control={tcForm.control}
                        name="input"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel>Inputs</FormLabel>
                              <FormControl>
                                <Textarea placeholder="input" {...field} />
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={tcForm.control}
                        name="output"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel>outputs</FormLabel>
                              <FormControl>
                                <Textarea placeholder="output" {...field} />
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />

                      <Button type="submit">Add</Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
            <Button
              className="w-10 h-10 rounded-full flex items-center justify-center"
              onClick={async () => {
                console.log("batch runner");

                const tokens = [];

                for (let i = 0; i < tcs.length; i++) {
                  setTestCase(i, { isRunning: true });
                  const token = await runner(tcs[i]);
                  tokens.push(token);
                }

                console.log(tokens);

                for (let i = 0; i < tcs.length; i++) {
                  const token = tokens[i];
                  const testcase = tcs[i];

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
                }
              }}
            >
              <RightCircleOutlined className="text-2xl" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
