export function formatHistory(messages: string[]) {
  const formattedMessages = messages
    .map((message, index) =>
      index % 2 === 0 ? `Human: ${message}` : `AI: ${message}`
    )
    .join("\n");

  return formattedMessages;
}
