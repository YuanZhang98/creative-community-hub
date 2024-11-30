const { app } = require("@azure/functions");
const { BlobServiceClient } = require("@azure/storage-blob");
const multiparty = require("multiparty");

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = "images";

app.http("upload_image", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const form = new multiparty.Form();
    console.log(AZURE_STORAGE_CONNECTION_STRING);
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    return new Promise((resolve, reject) => {
      form.parse(request, async (err, fields, files) => {
        if (err) {
          context.log.error("Error parsing form: ", err);
          resolve({
            status: 500,
            body: JSON.stringify({ error: "Error parsing form" }),
          });
          return;
        }

        const file = files.file[0];
        const blobName = file.originalFilename;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        try {
          const uploadBlobResponse = await blockBlobClient.uploadFile(
            file.path
          );
          context.log(
            `Upload block blob ${blobName} successfully`,
            uploadBlobResponse.requestId
          );
          resolve({
            status: 200,
            body: JSON.stringify({
              message: "Image uploaded successfully",
              blobName,
            }),
          });
        } catch (uploadError) {
          context.log.error("Error uploading blob: ", uploadError);
          resolve({
            status: 500,
            body: JSON.stringify({ error: "Error uploading blob" }),
          });
        }
      });
    });
  },
});
