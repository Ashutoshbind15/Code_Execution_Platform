"use client";

import TestCaseView from "@/components/UICustom/Editor/TestCaseView";
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
    <div>
      <form onSubmit={handleSubmit}>
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

          <div>
            <label>Testcase Input</label>
            <Input
              type="text"
              value={tcInput}
              onChange={(e) => setTcInput(e.target.value)}
            />

            <label>Testcase Output</label>
            <Input
              type="text"
              value={tcOutput}
              onChange={(e) => setTcOutput(e.target.value)}
            />

            <Button type="button" onClick={addTestcase}>
              Add Testcase
            </Button>
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateProblemPage;
