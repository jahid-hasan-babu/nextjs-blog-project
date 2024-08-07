import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import MarkDownEditor from "react-markdown-editor-lite";
import ReactMarkDown from "react-markdown";

export default function Blog({
  _id,
  title: existingTitle,
  slug: existingSlug,
  blogCategory: existingBlogCategory,
  status: existingStatus,
  description: existingDescription,
  tags: existingTags,
}) {
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();
  const [title, setTitle] = useState(existingTitle || "");
  const [slug, setSlug] = useState(existingSlug || "");
  const [blogCategory, setBlogCategory] = useState(existingBlogCategory || []);
  const [status, setStatus] = useState(existingStatus || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [tags, setTags] = useState(existingTags || []);

  async function createProduct(ev) {
    ev.preventDefault();
    const data = { title, slug, description, blogCategory, tags, status };

    try {
      if (_id) {
        await axios.put("/api/blogapi", { ...data, _id });
      } else {
        await axios.post("/api/blogapi", data);
      }
      setRedirect(true);
    } catch (error) {
      console.error(
        "Error creating/updating the blog:",
        error.response ? error.response.data : error.message
      );
      alert("An error occurred. Please try again.");
    }
  }

  if (redirect) {
    router.push("/");
    return null;
  }

  const handleSlugChange = (ev) => {
    const inputValue = ev.target.value;
    const newSlug = inputValue.replace(/\s+/g, "-");
    setSlug(newSlug);
  };

  const handleCategoryChange = (e) => {
    setBlogCategory(
      Array.from(e.target.selectedOptions, (option) => option.value)
    );
  };

  return (
    <>
      <form className="addWebsiteform" onSubmit={createProduct}>
        {/* blog title */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter small title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {/* blog slug  */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="slug">Slug</label>
          <input
            type="text"
            id="slug"
            placeholder="Enter slug url"
            value={slug}
            onChange={handleSlugChange}
            required
          />
        </div>

        {/* blog category  */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="blogCategory">Category</label>
          <select
            name="blogCategory"
            id="blogCategory"
            value={blogCategory}
            onChange={handleCategoryChange}
            multiple
          >
            <option value="htmlcssjs">Html, Css & Javascript</option>
            <option value="nextjs">Next Js, React js</option>
            <option value="database">Database</option>
            <option value="deployment">Deployment</option>
          </select>
          <p className="existingcategory flex gap-1 mt-1 mb-1">
            <span>
              selected: <span>category</span>
            </span>
          </p>
        </div>

        {/* markdown description content */}
        <div className="description w-100 flex flex-col flex-left mb-2">
          <label htmlFor="description">Blog content</label>
          <MarkDownEditor
            value={description}
            onChange={(ev) => setDescription(ev.text)}
            style={{ width: "100%", height: "400px" }}
            renderHTML={(text) => (
              <ReactMarkDown
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    if (inline) {
                      return <code>{children}</code>;
                    } else if (match) {
                      return (
                        <div style={{ position: "relative" }}>
                          <pre
                            style={{
                              padding: "0",
                              borderRadius: "5px",
                              overflowX: "auto",
                              whiteSpace: "pre-wrap",
                            }}
                            {...props}
                          >
                            <code>{children}</code>
                          </pre>
                          <button
                            style={{
                              position: "absolute",
                              top: "0",
                              right: "0",
                              zIndex: "1",
                            }}
                            onClick={() =>
                              navigator.clipboard.writeText(children)
                            }
                          >
                            copy code
                          </button>
                        </div>
                      );
                    } else {
                      return <code {...props}> {children}</code>;
                    }
                  },
                }}
              >
                {text}
              </ReactMarkDown>
            )}
          />
        </div>

        {/* blog tags  */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="tags">Tags</label>
          <select
            name="tags"
            id="tags"
            value={tags}
            onChange={(e) =>
              setTags(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            multiple
          >
            <option value="html">Html</option>
            <option value="css">Css</option>
            <option value="javascript">Javascript</option>
            <option value="nextjs">Next Js</option>
            <option value="reactjs">React Js</option>
            <option value="database">Database</option>
          </select>
          <p className="existingcategory flex gap-1 mt-1 mb-1">
            <span>
              selected: <span>Tags</span>
            </span>
          </p>
        </div>

        {/* blog status  */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="status">Status</label>
          <select
            name="status"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="publish">Publish</option>
          </select>
          <p className="existingcategory flex gap-1 mt-1 mb-1">
            <span>
              selected: <span>Status</span>
            </span>
          </p>
        </div>

        {/* save button  */}
        <div className="w-100 mb-2">
          <button type="submit" className="w-100 addwebbtn flex-center">
            SAVE BLOG
          </button>
        </div>
      </form>
    </>
  );
}
