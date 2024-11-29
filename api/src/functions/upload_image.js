const { app } = require("@azure/functions");

app.http("upload_image", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    return { body: JSON.stringify({ message: "Hello, from the API!" }) };
  },
});
