"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CreateProblemPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
    input: "",
    output: "",
  });

  const [testcases, setTestcases] = useState([]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle testcase form
  const [tcInput, setTcInput] = useState("");
  const [tcOutput, setTcOutput] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log("Test Cases:", testcases);
    // Add logic to send data to API or another state

    const { data } = await axios.post("/api/problems", { formData, testcases });
  };

  // Add a new testcase
  const addTestcase = (e) => {
    e.preventDefault();
    setTestcases([...testcases, { input: tcInput, output: tcOutput }]);
    setTcInput("");
    setTcOutput("");
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
            <label>Difficulty</label>
            <Select
              name="difficulty"
              value={formData.difficulty}
              onValueChange={(e) =>
                handleChange({ target: { name: "difficulty", value: e } })
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

        <div className="w-1/2 px-10 flex flex-col gap-y-5">
          <div>
            <label>Input</label>
            <Textarea
              name="input"
              value={formData.input}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Output</label>
            <Textarea
              name="output"
              value={formData.output}
              onChange={handleChange}
            />
          </div>

          <div>
            {testcases.map((testcase, index) => (
              <div
                key={index}
                className="my-2 border-y-2 border-black border-dashed"
              >
                <p>Input: {testcase.input}</p>
                <p>Output: {testcase.output}</p>
              </div>
            ))}
          </div>

          <Dialog>
            <DialogTrigger className="bg-primary text-primary-foreground p-2 rounded-xl">
              Add TestCase
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-y-5">
              <div>
                <label>Testcase Input</label>
                <Textarea
                  type="text"
                  value={tcInput}
                  onChange={(e) => setTcInput(e.target.value)}
                />
              </div>

              <div>
                <label>Testcase Output</label>
                <Textarea
                  type="text"
                  value={tcOutput}
                  onChange={(e) => setTcOutput(e.target.value)}
                />
              </div>

              <Button type="button" onClick={addTestcase}>
                Add Testcase
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </div>
  );
};

export default CreateProblemPage;
