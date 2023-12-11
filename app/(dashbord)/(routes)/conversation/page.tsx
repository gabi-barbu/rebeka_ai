"use client";

import axios from "axios";
import * as z from "zod";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { OpenAI } from 'openai'
import { useEffect, useRef, useState } from "react";

import { Heading } from "@/components/heading";



import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";

import { formSchema } from "./constants";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { ScrollArea } from "@/components/ui/scroll-area";



const ConversationPage = () => {
    const router = useRouter();

    const [messages, setMessages] = useState<OpenAI.Chat.ChatCompletionMessageParam[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            propt: ""
        }
    });
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
    }

    const isLoading = form.formState.isSubmitting;
    useEffect(() => {
        scrollToBottom()
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: OpenAI.Chat.ChatCompletionMessageParam = {
                role: "user",
                content: values.propt,
            };
            const newMessages = [...messages, userMessage];

            const response = await axios.post("/api/conversation", { messages: newMessages });
            setMessages((current) => [...current, userMessage, response.data]);

            form.reset();

        } catch (error: any) {
            // TODO: Open Pro Modal
            console.log(error)
        } finally {
            router.refresh();
        }
    }

    return (
        <div>
            <Heading
                title="Conversation"
                description="What do you wanna talk about today"
                icon={MessageSquare}
                iconColor="text-violet-500"
                bgColor="bg-violet-500/10"
            />
            <div className="px-4 lg:px-8 lg:pr-4">
                <div className="relative  pb-36 lg:pb-24">
                    <div className="absolute bottom-0 w-full border-box lg:pr-4"> 
                        <div >
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"                            >
                                    <FormField
                                        name="propt"
                                        render={({ field }) => (
                                            <FormItem className="col-span-12 lg:col-span-10">
                                                <FormControl className="m-0 p-0">
                                                    <Input
                                                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                        disabled={isLoading}
                                                        placeholder="What's the deal with the AI?"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>Poke!</Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                   
                    <ScrollArea id="chatBox" className=" space-y-4 mt-4 h-[65vh] lg:h-[70vh] w-full lg:pr-4">

                        {messages.length === 0 && !isLoading && (
                            <Empty label="I'm eager to answer your many questions just keep it polite" />
                        )}
                        <div className="flex flex-col gap-y-4">
                            {messages.map((message) => (
                                <div key={message.content} className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg", message.role === "user" ? "bg-white border border-black/10 flex-row-reverse" : "bg-muted ")}>
                                    {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                    <p className="text-sm"> {message.content}</p>

                                </div>
                            ))}
                        </div>
                        {
                            isLoading && (

                                <div className="mt-4 p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                                    <Loader />

                                </div>


                            )
                        }
                        <div ref={messagesEndRef} />
                    </ScrollArea>
                </div>

            </div>
        </div>
    );
}

export default ConversationPage;