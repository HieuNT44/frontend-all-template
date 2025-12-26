"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useLoginController } from "../../hooks/useLoginController";
import { LoginFormSchema, type LoginFormData } from "../../types/login.types";

export function LoginForm() {
  const { handleSubmit } = useLoginController();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await handleSubmit(data);
    toast("You submitted the following values", {
      description: (
        <pre className='mt-2 w-[320px] rounded-md bg-neutral-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input id='email' type='email' placeholder='you@example.com' autoComplete='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  autoComplete='current-password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='remember'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center'>
              <FormControl>
                <Checkbox
                  id='login-remember'
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className='size-4'
                />
              </FormControl>
              <FormLabel htmlFor='login-remember' className='text-muted-foreground ml-1 text-sm font-medium'>
                Remember me for 30 days
              </FormLabel>
            </FormItem>
          )}
        />
        <Button className='w-full' type='submit'>
          Login
        </Button>
      </form>
    </Form>
  );
}
