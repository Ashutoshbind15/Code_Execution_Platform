"use client";

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
import { useProblems } from "@/lib/hooks/queries";
import { useRouter } from "next/navigation";

const ProblemsPage = () => {
  const { problems } = useProblems();

  const rtr = useRouter();

  return (
    <Table>
      <TableCaption>A list of our comprehensive pset.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">S. No</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Difficulty</TableHead>
          {/* <TableHead className="text-right">Submissions</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {problems?.map((problem, i) => (
          <TableRow
            key={i}
            className="cursor-pointer"
            onClick={() => {
              rtr.push(`/problems/${problem._id}`);
            }}
          >
            <TableCell>{i + 1}</TableCell>
            <TableCell>{problem?.title}</TableCell>
            <TableCell>{problem?.difficulty}</TableCell>
            {/* <TableCell className="text-right">{problem?.submissions}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Submissions</TableCell>
          <TableCell className="text-right">
            {problems.reduce((acc, problem) => acc + problem.submissions, 0)}
          </TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  );
};

export default ProblemsPage;
