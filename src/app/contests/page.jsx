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
import { useContests } from "@/lib/hooks/queries";
import { useRouter } from "next/navigation";

const ContestsPage = () => {
  const { contests } = useContests();

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
        {contests?.map((contest, i) => (
          <TableRow
            key={i}
            className="cursor-pointer"
            onClick={() => {
              rtr.push(`/contests/${contest._id}`);
            }}
          >
            <TableCell>{i + 1}</TableCell>
            <TableCell>{contest?.title}</TableCell>
            <TableCell>{contest?.div}</TableCell>
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

export default ContestsPage;
