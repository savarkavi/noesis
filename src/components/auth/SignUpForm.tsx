"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { signUp } from "@/app/(auth)/actions";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

const SignUpForm = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPending, setTransition] = useTransition();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpValues) => {
    setError(undefined);
    setTransition(async () => {
      const { error } = await signUp(values);
      if (error) setError(error);
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-[300px] flex-col gap-6"
      >
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-600">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email"
                  {...field}
                  className="text-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-600">Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="username"
                  {...field}
                  className="text-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-600">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="password"
                  {...field}
                  className="text-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="size-5 animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
