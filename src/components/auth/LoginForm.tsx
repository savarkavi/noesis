"use client";

import { loginSchema, LoginValues } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const LoginForm = () => {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {};

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-[300px] flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="usernameOrEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-600">Username or Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="username or email"
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
                  placeholder="password"
                  {...field}
                  className="text-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default LoginForm;
