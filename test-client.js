// test-client.js
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");
const readline = require("readline");

// Helper to get input from terminal
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => rl.question(query, answer => {
    rl.close();
    resolve(answer);
  }));
}

async function run() {

  const transport = new StdioClientTransport({
    command: "node",
    args: ["mcp-server.js"]  // make sure this points to your server file
  });

  const client = new Client({
    name: "interactive-client",
    version: "1.0.0"
  });

  await client.connect(transport);
  console.log(" Connected to MCP server. Type 'exit' to quit.\n");

  while (true) {
    const entityName = await askQuestion("Enter entity name: ");
    const trimmedName = entityName.trim();

    if (trimmedName.toLowerCase() === "exit") {
      console.log("Exiting client...");
      break;
    }

    try {
      const result = await client.callTool({
        name: "get_entity_hierarchy",
        arguments: { name: trimmedName }
      });

      console.log("Result:", result.content.map(c => c.text).join("\n"));
      console.log("\n---------------------------\n");

    } catch (err) {
      console.error("Error calling tool:", err.message);
    }
  }

  process.exit(0);
}

run();