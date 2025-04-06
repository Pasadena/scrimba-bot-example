import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import scrimbaInfo from "./scrimba-info.md";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_KEY!;

export async function register() {
  try {
    console.log("Initializing embeddings");
    const client = createClient(SUPABASE_URL, SUPABASE_KEY);

    const res = await client.from("documents").select("*");

    if (res.data) {
      console.log("Documents already initialized, skipping...");
      return;
    }

    const spliter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    const output = await spliter.createDocuments([scrimbaInfo]);

    await SupabaseVectorStore.fromDocuments(
      output,
      new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
      {
        client,
        tableName: "documents",
      }
    );
  } catch (err) {
    console.log(err);
  }
}
