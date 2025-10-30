import { withAuth } from "./_middleware";

export default withAuth(function handler(req, res) {
  res.status(200).json({ name: "John Doe" });
});
