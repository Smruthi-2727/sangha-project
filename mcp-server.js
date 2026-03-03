const mongoose = require("mongoose");
const dotenv = require("dotenv");

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");

//  MCP SCHEMAS
const {
  ListToolsRequestSchema,
  CallToolRequestSchema
} = require("@modelcontextprotocol/sdk/types.js");

dotenv.config();

// load models
const models = require("./models/sangha.js");
const { Entity, ParentEntity } = models;


//  CONNECT MONGODB
async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI missing in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" MongoDB connected");
  } catch (err) {
    console.error(" DB Connection Error:", err.message);
    process.exit(1);
  }
}


// create server
const server = new Server(
  {
    name: "sangha-hierarchy-server",
    version: "1.0.0"
  },
  {
    capabilities: { tools: {} }
  }
);


// LIST TOOLS
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_entity_hierarchy",
      description: "Get full hierarchy path of an entity",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string" }
        },
        required: ["name"]
      }
    }
  ]
}));


//  CALL TOOL
server.setRequestHandler(CallToolRequestSchema, async (request) => {

  if (request.params.name === "get_entity_hierarchy") {

    const entityName = request.params.arguments.name;

    //  CASE-INSENSITIVE SEARCH (VERY IMPORTANT)
    let entity = await Entity.findOne({
      name: new RegExp(`^${entityName}$`, "i")
    });

    if (!entity) {
      return {
        content: [{ type: "text", text: "❌ Entity not found in database" }]
      };
    }

    let path = [];

    // traverse parent chain
    while (entity) {
      path.push(entity.name);

      const relation = await ParentEntity.findOne({
        currentEntity: entity._id
      });

      if (!relation) break;

      entity = await Entity.findById(relation.parentEntity);
    }

    return {
      content: [
        {
          type: "text",
          text: path.reverse().join(" → ")
        }
      ]
    };
  }
});


//  START SERVER
async function start() {
  await connectDB();

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.log(" MCP Server running...");
}

start();
