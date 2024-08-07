const { Schema, models, model } = require("mongoose");

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    blogCategory: [{ type: String }], // This should be an array of strings
    tags: [{ type: String }],
    status: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

export const Blog = models.Blog || model("blog", BlogSchema, "blogtest");
