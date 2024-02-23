"use client";

import { LanguageSelector } from "@/components/UICustom/Editor/LanguageSelector";
import TestCaseView from "@/components/UICustom/Editor/TestCaseView";
import { ResizableDemo } from "@/components/UICustom/Editor/Windows";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CalendarFilled, RightCircleOutlined } from "@ant-design/icons";
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

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { compareOutputs } from "@/lib/helperFunctions/exec/outputComp";
import { useProblem, useUserSubmissions } from "@/lib/hooks/queries";

const ProblemPage = ({ params }) => {
  const pid = params.pid;

  const { problem, isProblemLoading, isProblemError, problemError } =
    useProblem(pid);

  const {
    isSubmissionsError,
    isSubmissionsLoading,
    submissions,
    submissionsError,
    refetchSubmissions,
  } = useUserSubmissions(pid);

  const [content, setContent] = useState("");
  const [languageValue, setlanguageValue] = useState("javascript");
  const [mounted, setMounted] = useState(false);
  const [tcs, setTcs] = useState([]);
  const [tcErr, setTcErr] = useState(null);
  const [failedTestCase, setFailedTestCase] = useState(null);

  const languageIdMap = new Map([
    ["javascript", 63],
    ["python", 71],
    ["java", 62],
    ["c", 50],
    ["cpp", 54],
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (problem) {
      for (let i = 0; i < problem?.testcases.length; i++) {
        const tc = problem.testcases[i];
        tc.res = "";
        tc.passed = 0;
        tc.isRunning = false;

        if (tcs.find((tcase) => tcase._id === tc._id)) continue;

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
    console.log(languageIdMap.get(languageValue));

    const { data } = await axios.post("/api/exec", {
      srcCode: content,
      langId: languageIdMap.get(languageValue),
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
                languageId={
                  languageIdMap.get(languageValue) || languageIdMap.get("cpp")
                }
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

                let fg = 0;

                for (let i = 0; i < tcs.length; i++) {
                  const token = tokens[i];
                  const testcase = tcs[i];

                  const { data } = await axios.get(`/api/exec?token=${token}`);

                  const comparison = compareOutputs(data.res, testcase.output);

                  const isTestCasePassed = comparison.isMatch;

                  console.log(isTestCasePassed);

                  if (!isTestCasePassed) {
                    setTcErr(comparison);
                    setFailedTestCase(i);
                    setTestCase(i, {
                      res: data.res,
                      passed: isTestCasePassed === true ? 1 : -1,
                      isRunning: false,
                    });

                    const { submission } = await axios.post(
                      "/api/submissions",
                      {
                        problemId: problem._id,
                        passed: false,
                        tcNum: i + 1,
                        testcase: tcs[i],
                        result: data.res,
                        comparison,
                      }
                    );

                    fg = 1;

                    // set Remaining testcases to not running

                    for (let j = i + 1; j < tcs.length; j++) {
                      setTestCase(j, {
                        isRunning: false,
                      });
                    }

                    break;
                  }

                  setTestCase(i, {
                    res: data.res,
                    passed: isTestCasePassed === true ? 1 : -1,
                    isRunning: false,
                  });
                }

                if (fg == 0) {
                  setTcErr(null);
                  setFailedTestCase(null);

                  const { submission } = await axios.post("/api/submissions", {
                    problemId: problem._id,
                    passed: true,
                    tcNum: tcs.length,
                  });
                }

                // refetch submissions

                refetchSubmissions();
              }}
            >
              <RightCircleOutlined className="text-2xl" />
            </Button>

            <Drawer className="">
              <DrawerTrigger className="w-10 h-10 text-primary-foreground flex items-center justify-center rounded-full bg-primary">
                <CalendarFilled className="" />
              </DrawerTrigger>
              <DrawerContent className="">
                <DrawerHeader className={"mb-3"}>
                  <DrawerTitle className="">Submissions tab</DrawerTitle>
                  <DrawerDescription className="">
                    View Your Past Submissions here
                  </DrawerDescription>
                </DrawerHeader>

                <Tabs defaultValue="submissions" className="">
                  <TabsList>
                    <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    <TabsTrigger value="error">Error</TabsTrigger>
                  </TabsList>
                  <TabsContent value="submissions">
                    <Table>
                      <TableCaption>
                        A list of your recent Submissions.
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Sid</TableHead>
                          <TableHead>Status</TableHead>

                          <TableHead className="text-right">Last TC</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions?.map((submission, i) => (
                          <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>
                              {submission.success ? "Passed" : "Failed"}
                            </TableCell>
                            <TableCell className="text-right">
                              {submission.tcNum}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* {submissions?.map((submission, i) => (
                      <div key={i}>
                        <p>{submission.tcNum}</p>
                        <p>{submission.success ? "Passed" : "Failed"}</p>
                      </div>
                    ))} */}
                  </TabsContent>
                  <TabsContent value="error">
                    <div className="flex flex-col gap-y-4 pl-4">
                      <div>
                        {tcErr?.differences?.map((diff, i) => (
                          <div key={i}>
                            <p>{diff}</p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p>Expected Output</p>
                        <p>{tcs[failedTestCase]?.output}</p>
                      </div>
                      <div>
                        <p>Received Output</p>
                        <p>{tcs[failedTestCase]?.res}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <DrawerFooter>
                  <DrawerClose>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
