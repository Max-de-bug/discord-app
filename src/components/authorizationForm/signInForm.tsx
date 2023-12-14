"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import GoogleSignInButton from "../ui/GoogleSignInButton";
import { cn } from "@/lib/utils";
import { SignInformSchema } from "@/app/lib/types";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/app/context/AuthContext";

const SignInForm = () => {
  const context = useContext(AuthContext);
  const router = useRouter();
  const form = useForm<z.infer<typeof SignInformSchema>>({
    resolver: zodResolver(SignInformSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInformSchema>) => {
    // const signInData = await signIn("credentials", {
    //   email: values.email,
    //   password: values.password,
    // });
    // if (signInData?.error) {
    //   console.log(signInData.error);
    // } else {
    //   router.push("/");
    // }
    let response = await fetch("/api/user-sign-in/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    let result = await response.json();
    context.login(result);
    redirect("/");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <h2 className="text-center text-lg font-medium mb-3 text-white ">
          Welcome back!
        </h2>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input placeholder="mail@example.com" {...field} />
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
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className={cn("w-full mt-6", {
            "bg-blue-500": true,
            "hover:bg-blue-700": true,
          })}
          type="submit"
        >
          Sign in
        </Button>
      </form>
      <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
        or
      </div>
      <GoogleSignInButton>Sign in with Google</GoogleSignInButton>
      <p className="text-center text-sm text-gray-600 mt-2">
        If you don&apos;t have an account, please&nbsp;
        <Link className="text-blue-500 hover:underline" href="/sign-up">
          Sign up
        </Link>
      </p>
    </Form>
  );
};
export default SignInForm;
