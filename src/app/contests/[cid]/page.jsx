"use client";

import { useUser } from "@/lib/hooks/queries";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Countdown from "react-countdown";
import { LanguageSelector } from "@/components/UICustom/Editor/LanguageSelector";
import { ResizableDemo } from "@/components/UICustom/Editor/Windows";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CalendarFilled, RightCircleOutlined } from "@ant-design/icons";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ContestPage = () => {
  // client -> [problems => {pid, solved}], leaderboard -> [{uid, points, time, rank}]
  // server -> leaderboard -> [{uid, points, time, rank}], the ranks and leaderboard is computed on the server and sends it to the client
  // wsserver -> emits back to the client the updated leaderboard and the points
  // client -> onSubmit(pid) -> sendPointsToServer(pid, points) -> updateRankings() -> emitRankings() -> wsserver -> emitRankings() -> client -> updateRankings()

  const [users, setUsers] = useState([]);
  const { user, isUserError, isUserLoading, userError } = useUser();
  const [socket, setSocket] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]); // [{uid, points, time, rank}
  const [contest, setContest] = useState(null);
  const [problem, setProblem] = useState(null); // [{pid, title, description, inputDescription, outputDescription, difficulty}

  const [probems, setProblems] = useState([]);

  const params = useParams();
  const cid = params.cid;

  // PROBLEM COMPONENTS AND STATE START
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

  // PROBLEM COMPONENTS AND STATE END

  const wsApi = "http://localhost:3001";

  const initialLeaderboardFetcher = async (cid) => {
    const { data } = await axios.get(`/api/contests/${cid}`);
    setLeaderboard(data.contest.leaderboard);
    setContest(data.contest);
    setProblem(data.contest.problems[0]);
    setProblems(data.contest.problems);
  };

  const sendPointsToServer = async (pid, cid) => {
    const { data } = await axios.post(`/api/contests/${cid}`, {
      uid: user.id,
      pid,
    });

    console.log(data);
    socket.emit("leaderboard", data.contestUpdated.leaderboard);
  };

  useEffect(() => {
    const socket = io(wsApi);

    if (cid) {
      initialLeaderboardFetcher(cid);
    }
  }, [cid]);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between px-6 py-2 bg-black text-white font-semibold">
        <div className="flex flex-col gap-y-2">
          <div>{contest?.title}</div>
          <div>{contest?.div}</div>
        </div>
        {contest?.endTime && <Countdown date={contest?.endTime} />}
      </div>
      <div className="flex-1 bg-slate-200 flex">
        <div className="w-12 bg-white"></div>
        <div className="flex-1 flex">
          <div className="flex-1">
            <LanguageSelector
              value={languageValue}
              setValue={setlanguageValue}
            />
            <ResizableDemo
              setContent={setContent}
              languageValue={languageValue}
              setlanguageValue={setlanguageValue}
              problem={problem}
            />
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

export default ContestPage;
