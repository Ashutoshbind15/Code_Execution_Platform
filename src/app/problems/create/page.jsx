"use client";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import TestCaseView from "@/components/UICustom/Editor/TestCaseView";

const CreateProblemPage = () => {
  const form = useForm({
    defaultValues: {
      title: "",
    },
  });

  const tcForm = useForm({
    defaultValues: {
      input: "1 2 3 4",
      output: "10",
    },
  });

  const [testcases, setTestcases] = useState([]);

  const onSubmit = (values) => {
    console.log(values);
    toast("Problem created successfully");
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 ml-6">
          <div className="flex items-center">
            <div className="w-1/2 space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>title</FormLabel>
                    <FormControl>
                      <Input placeholder="placeholder" {...field} />
                    </FormControl>
                    <FormDescription>
                      Description for your problem display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Textarea for problem description */}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="placeholder" {...field} />
                    </FormControl>
                    <FormDescription>
                      Description for your problem description.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Choose the problem difficulty from easy, medium and hard */}

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Description for your problem difficulty.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-8 w-1/2 px-4">
              <FormField
                control={form.control}
                name="input"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>input</FormLabel>
                    <FormControl>
                      <Textarea placeholder="placeholder" {...field} />
                    </FormControl>
                    <FormDescription>
                      Description for your problem input.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="output"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>output</FormLabel>
                    <FormControl>
                      <Textarea placeholder="placeholder" {...field} />
                    </FormControl>
                    <FormDescription>
                      Description for your problem output.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-6 mt-6 items-center">
            <div className="flex items-center gap-x-4">
              {testcases.map((_, i) => (
                <TestCaseView key={i} i={i} testcase={_} />
              ))}
            </div>

            <Dialog>
              <DialogTrigger>
                <Button type="button">Add Testcases</Button>
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
                    onSubmit={form.handleSubmit((vals) => {
                      console.log(vals);
                    })}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="shadcn" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your public display name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button type="submit" className="w-max">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateProblemPage;
