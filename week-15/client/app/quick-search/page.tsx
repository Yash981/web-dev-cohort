"use client"
import React, { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getVectorEmbedResults } from '@/actions/vector-search-action';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

interface MessageFormInputs {
    message: string;
}

const QuickSearch: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading,setIsLoading] = useState(false)
    const form = useForm<MessageFormInputs>({
        defaultValues: {
            message: '',
        }
    });

    const handleSendMessage: SubmitHandler<MessageFormInputs> = async (data) => {
        const trimmedQuery = data.message.trim();
        if (!trimmedQuery) return;

        const userMessage: Message = {
            id: Date.now(),
            text: trimmedQuery,
            sender: 'user'
        };

        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
            setIsLoading(true)
            const res = await getVectorEmbedResults(trimmedQuery)
            const botMessage:Message = {
                id:Date.now()+1,
                text: res.summarizedContent as string,
                sender: 'bot'
            }
            setMessages((prevMesages)=> [...prevMesages,botMessage])
        } catch (error) {
            console.log('Error generating queried results',error)
        }finally{

            setIsLoading(false)
        }
                form.reset();


        
    };

    return (
        <div className="flex flex-col h-full max-w-full bg-[hsl(207.27deg 21.57% 10%)]">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.sender === 'user' 
                            ? 'justify-end' 
                            : 'justify-start'
                        }`}
                    >
                        <div
                            className={`
                                max-w-[75%] 
                                p-3 
                                rounded-lg 
                                ${
                                    message.sender === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-black'
                                }
                            `}
                        >
                            {message.text}
                        </div>
                    </div>
                ))}
            </div>
            {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-black p-3 rounded-lg flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating response...
                        </div>
                    </div>
            )}

            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(handleSendMessage)} 
                    className="flex items-center p-4 bg-[hsl(207.27deg 21.57% 10%)] border-t border-slate-600"
                >
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input
                                        placeholder="Type your message..."
                                        {...field}
                                        className="flex-grow p-2 mr-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="p-2 ml-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    >
                        <Send size={20} />
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default QuickSearch;