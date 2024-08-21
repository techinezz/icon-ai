'use client';
import * as z from 'zod';
import Navbar from "@/components/navbar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; 

import { formSchema } from './constant';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const MessagePage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <div>
      <Navbar/>
      <div className="px-4 lg:px-8">
        <div className="px-4 lg:px-8 pt-[200px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
            className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'>
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem
                  className='col-span-12 lg:col-span-10'>
                    <FormControl className='m-0 p-0'>
                      <Input className="border-0 outline-none
                      focus-visible:ring-0
                      focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder='Ask Icon AI a question...'/>
                    </FormControl>
                 </FormItem>
                )}
              />
              <Button
              className='col-span-12 lg:col-span-2 w-full'
              disabled={isLoading}
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;





