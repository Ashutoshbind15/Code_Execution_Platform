"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const DateTimePicker = dynamic(
  () => import("react-datetime-picker").then((mod) => mod.default),
  { ssr: false }
);
const Checkbox = dynamic(
  () => import("@/components/ui/checkbox").then((mod) => mod.Checkbox),
  { ssr: false }
);
const Select = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.Select),
  { ssr: false }
);
const SelectTrigger = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectTrigger),
  { ssr: false }
);
const SelectContent = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectContent),
  { ssr: false }
);
const SelectGroup = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectGroup),
  { ssr: false }
);
const SelectItem = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectItem),
  { ssr: false }
);
const SelectLabel = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectLabel),
  { ssr: false }
);
const SelectValue = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectValue),
  { ssr: false }
);

const ContestCreatePage = () => {
  const [startDatetime, setStartDatetime] = useState(new Date());
  const [endDatetime, setEndDatetime] = useState(
    new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
  );
  const [userCreatedProblems, setUserCreatedProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);

  const divToDifficulty = {
    easy: 3,
    medium: 2,
    hard: 1,
  };

  useEffect(() => {
    axios.get("/api/problems?query=private").then((res) => {
      setUserCreatedProblems(res.data.problems);
    });
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    div: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log("Start Time:", startDatetime);
    console.log("End Time:", endDatetime);
    console.log("Selected Problems:", selectedProblems);
    const { title, description, div } = formData;
    const startTime = startDatetime;
    const endTime = endDatetime;

    const { data } = await axios.post("/api/contests", {
      title,
      description,
      div: divToDifficulty[div],
      problems: selectedProblems,
      startTime,
      endTime,
    });

    console.log(data);
    toast("Contest Created Successfully");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="py-16">
      <form onSubmit={handleSubmit} className="flex w-full items-center">
        <div className="w-1/2 px-10 flex flex-col gap-y-5">
          <div>
            <label>Title</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Div</label>
            <Select
              name="div"
              value={formData.div}
              onValueChange={(e) =>
                handleChange({ target: { name: "div", value: e } })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Difficulty Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Difficulty</SelectLabel>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <button type="submit">Submit</button>
        </div>
        <div className="flex-1 flex flex-col justify-around self-stretch items-center">
          <Tabs
            defaultValue="start time"
            className="flex flex-col items-center gap-y-3"
          >
            <TabsList>
              <TabsTrigger value="start time">Start Time</TabsTrigger>
              <TabsTrigger value="end time">End Time</TabsTrigger>
            </TabsList>
            <TabsContent value="start time">
              <DateTimePicker
                onChange={setStartDatetime}
                value={startDatetime}
              />
            </TabsContent>
            <TabsContent value="end time">
              <DateTimePicker onChange={setEndDatetime} value={endDatetime} />
            </TabsContent>
          </Tabs>

          <div className="rounded-md shadow-lg border-2 border-gray-400 w-1/2">
            <div className="bg-black text-white font-bold text-center">
              Problems
            </div>
            <div>
              {userCreatedProblems.map((problem) => (
                <div
                  key={problem._id}
                  className="flex items-center justify-around py-2 bg-slate-100"
                >
                  <label>{problem.title}</label>
                  <Checkbox
                    onCheckedChange={(e) => {
                      if (e) {
                        setSelectedProblems((prev) => [...prev, problem._id]);
                      } else {
                        setSelectedProblems((prev) =>
                          prev.filter((id) => id !== problem._id)
                        );
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContestCreatePage;
