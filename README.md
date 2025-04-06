# scrimba-bot-example

Example project done as part of the Langchain.js -course: https://scrimba.com/learn-langchainjs-c02t

The project contains:

1. Instrumentation that populates vector databse (in https://supabase.com/) with OpenAI Embeddings that are generated from example data about Scrimba (https://scrimba.com/home)
2. Chat-screen that enables user to query bot about all things related to Scrimba. The bot:
   - creates a standalone question from user's question using possible conversation history
   - uses the standalone question and embeddings retrieved from vector database to get the answer from OpenAi
   - Stores the original question and the answer to conversation history

The code is based on the material done in this course: https://www.youtube.com/watch?v=HSZ_uaif57o

The difference is that the course uses Vite and this project uses Next.js
