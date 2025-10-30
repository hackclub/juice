import formidable from "formidable";
import fs from "fs";
import { withAuth } from "./_middleware";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default withAuth(async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    if (!files.file || !files.file[0]) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = files.file[0];
    const fileData = fs.readFileSync(file.filepath);
    const base64Data = fileData.toString("base64");

    // Return the base64 data that can be used in Airtable
    return res.status(200).json({
      url: `data:${file.mimetype};base64,${base64Data}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Error uploading file" });
  }
});
