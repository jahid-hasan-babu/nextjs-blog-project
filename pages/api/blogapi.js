import { mongooseconnect } from "@/lib/mongoose";
import { Blog } from "@/models/blog";

export default async function handle(req, res) {
  await mongooseconnect();

  const { method } = req;

  try {
    if (method === "POST") {
      const { title, slug, description, blogCategory, tags, status } = req.body;

      if (
        !title ||
        !slug ||
        !description ||
        !blogCategory ||
        !tags ||
        !status
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const blogDoc = await Blog.create({
        title,
        slug,
        description,
        blogCategory,
        tags,
        status,
      });

      return res.status(201).json(blogDoc);
    }

    if (method === "GET") {
      if (req.query?.id) {
        const blog = await Blog.findById(req.query.id);
        if (!blog) {
          return res.status(404).json({ message: "Blog not found" });
        }
        return res.json(blog);
      } else {
        const blogs = await Blog.find();
        return res.json(blogs.reverse());
      }
    }

    if (method === "PUT") {
      const { _id, title, slug, description, blogCategory, tags, status } =
        req.body;

      if (!_id) {
        return res.status(400).json({ message: "Missing blog ID" });
      }

      const updatedBlog = await Blog.findByIdAndUpdate(
        _id,
        {
          title,
          slug,
          description,
          blogCategory,
          tags,
          status,
        },
        { new: true }
      );

      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      return res.json(updatedBlog);
    }

    if (method === "DELETE") {
      if (!req.query?.id) {
        return res.status(400).json({ message: "Missing blog ID" });
      }

      const deletedBlog = await Blog.findByIdAndDelete(req.query.id);

      if (!deletedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      return res.json({ message: "Blog deleted successfully" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
