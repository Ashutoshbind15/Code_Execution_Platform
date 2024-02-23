"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { useUser } from "@/lib/hooks/queries";
import Link from "next/link";

const psetSize = 10;

const psetGenerator = (psetSize) => {
  const pset = [];
  for (let i = 0; i < psetSize; i++) {
    pset.push({
      title: `Problem ${i + 1}`,
      difficulty: "Easy",
      submissions: 100,
    });
  }
  return pset;
};

const contestGenerator = (contestSize) => {
  const cset = [];
  for (let i = 0; i < contestSize; i++) {
    cset.push({
      title: `Contest ${i + 1}`,
      rank: 300,
      solved: "3/4",
      delta: -30,
    });
  }
  return cset;
};

const problems = psetGenerator(psetSize);
const contests = contestGenerator(psetSize);

const ProfilePage = () => {
  const { user, isUserLoading, isUserError, userError } = useUser();

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (isUserError) {
    return <div>{userError.message}</div>;
  }

  const {
    numberOfProblemsSolved,
    numberOfContributions,
    problemsSolved,
    problemsCreated,
  } = user;

  console.log(
    numberOfContributions,
    problemsCreated,
    problemsSolved,
    numberOfProblemsSolved
  );

  return (
    <div className="flex flex-col items-center w-full">
      <Card className="w-1/3 my-12">
        <CardHeader className="mt-4">
          <div className="flex items-center justify-around">
            <Avatar>
              <AvatarImage src={user?.image} />
              <AvatarFallback>
                {user?.name?.length && user?.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user?.name}</CardTitle>
              <CardDescription>Veteran</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between py-6 px-8">
            <div className="flex flex-col items-center">
              <div className="font-bold text-xl">Problems Solved</div>
              <div className="my-3 text-2xl font-bold text-primary">
                {numberOfProblemsSolved}
              </div>
            </div>

            <Separator orientation="vertical" className="mx-2" />

            <div className="flex flex-col items-center">
              <div className="font-bold text-xl">Contributions</div>
              <div className="my-3 text-2xl font-bold text-primary">
                {numberOfContributions}
              </div>
            </div>

            <Separator orientation="vertical" className="mx-2" />

            {/* <div className="flex flex-col">
              <div className="font-bold text-xl">Problems Solved</div>
              <div>300+</div>
            </div>

            <Separator orientation="vertical" className="mx-2" /> */}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col ">
          {/* <Button className="my-2 w-3/4">Edit Profile</Button> */}
          <Link
            className="my-2 w-3/4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-center"
            href="/"
          >
            Return Home
          </Link>
        </CardFooter>
      </Card>

      <Tabs defaultValue="problems" className="w-full">
        <TabsList className="w-full flex items-center justify-around">
          <TabsTrigger value="problems">Problems</TabsTrigger>
          <TabsTrigger value="contests">Contests (Coming Soon)</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
        </TabsList>
        <TabsContent value="problems">
          <Table>
            <TableCaption>A list of our comprehensive pset.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">S. No</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-right"># Test Cases</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problemsSolved?.map((problem, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{problem?.title}</TableCell>
                  <TableCell>{problem?.difficulty}</TableCell>
                  <TableCell className="text-right">
                    {problem?.testcases?.length}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total Submissions</TableCell>
                <TableCell className="text-right">
                  {problems.reduce(
                    (acc, problem) => acc + problem.submissions,
                    0
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TabsContent>
        <TabsContent value="contests">
          <Table>
            <TableCaption>Contests (Coming Soon)</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">S. No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead className="">Solved</TableHead>
                <TableHead className="text-right">Delta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contests.map((contest, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{contest.title}</TableCell>
                  <TableCell>{contest.rank}</TableCell>
                  <TableCell className="">{contest.solved}</TableCell>
                  <TableCell className="text-right">{contest.delta}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Delta</TableCell>
                <TableCell className="text-right">
                  {contests.reduce((acc, contest) => acc + contest.delta, 0)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TabsContent>
        <TabsContent value="contributions">
          <Table>
            <TableCaption>A list of our comprehensive pset.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">S. No</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-right"># Test Cases</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problemsCreated?.map((problem, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{problem?.title}</TableCell>
                  <TableCell>{problem?.difficulty}</TableCell>
                  <TableCell className="text-right">
                    {problem?.testcases?.length}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total Submissions</TableCell>
                <TableCell className="text-right">
                  {problems.reduce(
                    (acc, problem) => acc + problem.submissions,
                    0
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
