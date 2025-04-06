"use server";

import { retriever } from "./retriever";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatHistory } from "./formatHistory";

export type ConversationMessage = {
  message: string;
  type: "user" | "ai";
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const llm = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0 });

function combineDocuments(documents: { pageContent: string }[]) {
  return documents.map((doc) => doc.pageContent).join("\n\n");
}

const conversationHistory: string[] = [];

const USER_RESPONSE_REMPLATE = PromptTemplate.fromTemplate(`
    Answer the question friendly based on the context provided and conversation history. Try to find the answer from the context.
    If the answer is not available from the context, try to find answer in the conversation history.
    If you don't the answer apologize and advise user to email help@scrimba.com. Never make up an answer.
    Always speak like you are chatting with a friend.
    Context: {context}
    Previous conversation history: {conversation_history}
    ---
    Question: {question} 
    Answer: ""
    `);

const STANDALONE_QUESTION_TEMPLATE = PromptTemplate.fromTemplate(`
        Given some cnversastion history (if any) and a question, create a standalone question.
        Conversation history: {conversation_history}
        ---
        Question: {question}
        Standalone question: 
        `);

export async function ask(value: string): Promise<ConversationMessage> {
  const standaloneQuestionSequence = RunnableSequence.from([
    STANDALONE_QUESTION_TEMPLATE,
    llm,
    new StringOutputParser(),
    retriever,
    combineDocuments,
  ]);

  const userResponseSequence = RunnableSequence.from([
    USER_RESPONSE_REMPLATE,
    llm,
    new StringOutputParser(),
  ]);

  const chain = RunnableSequence.from([
    {
      context: standaloneQuestionSequence,
      question: ({ question }) => question,
      conversation_history: ({ conversation_history }) => conversation_history,
    },
    userResponseSequence,
  ]);

  const response = await chain.invoke({
    question: value,
    conversation_history: formatHistory(conversationHistory),
  });

  conversationHistory.push(value);
  conversationHistory.push(response);

  console.log("RESPONSE", response);

  return { message: response, type: "ai" };
}
