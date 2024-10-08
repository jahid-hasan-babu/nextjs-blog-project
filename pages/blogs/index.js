import Dataloading from "@/components/Dataloading";
import Loading from "@/components/Loading";
import useFetchData from "@/hooks/useFetchData";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsPostcard } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";

import { RiDeleteBin6Fill } from "react-icons/ri";

export default function blogs() {
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage] = useState(5);

  //fetchblogs
  const [alldata, loading] = useFetchData("/api/blogapi");

  //function to handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const allblog = alldata.length;

  //search function
  const filterBlog =
    searchQuery.trim() === ""
      ? alldata
      : alldata.filter((blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const indexOfFirstBlog = (currentPage - 1) * perPage;
  const indexOfLastBlog = currentPage * perPage;

  const currentBlogs = filterBlog.slice(indexOfFirstBlog, indexOfLastBlog);
  //filtering published blogs

  const publishedBlogs = currentBlogs.filter((ab) => ab.status === "publish");

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(allblog / perPage); i++) {
    pageNumbers.push(i);
  }

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="loadingdata flex flex-col flex-center wh_100 ">
        <Loading />
        <h1>Loading...</h1>
      </div>
    );
  }

  if (session) {
    return (
      <>
        <div className="blogpage">
          <div className="titledashboard flex flex-sb">
            <div data-aos="fade-right">
              <h2>
                All Published <span>Blogs</span>
              </h2>
              <h3>ADMIN PANEL</h3>
            </div>
            <div className="breadcrumb" data-aos="fade-left">
              <BsPostcard /> <span>/</span> <span>Blogs</span>
            </div>
          </div>
          <div className="blogstable" data-aos="fade-up">
            <div className="flex gap-2 mb-1">
              <h2>Search Blogs: </h2>
              <input
                type="text"
                placeholder="search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <table className="table table-styling" data-aos="fade-up">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Edit / Delete</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    <tr>
                      <td>
                        <Dataloading />
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    {publishedBlogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center">
                          No Published Blogs
                        </td>
                      </tr>
                    ) : (
                      publishedBlogs.map((blog, index) => (
                        <tr key={blog._id}>
                          <td>{indexOfFirstBlog + index + 1}</td>
                          <td>{blog.title}</td>
                          <td>{blog.slug}</td>
                          <td>
                            <div className="flex gap-2 flex-center">
                              <Link href={`/blogs/edit/${blog._id}`}>
                                <button title="edit">
                                  <FaEdit />
                                </button>
                              </Link>
                              <Link href={`/blogs/delete/${blog._id}`}>
                                <button title="delete">
                                  <RiDeleteBin6Fill />
                                </button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </>
                )}
              </tbody>
            </table>
            {publishedBlogs.length === 0 ? (
              ""
            ) : (
              <div className="blogpagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {pageNumbers
                  .slice(
                    Math.max(currentPage - 3, 0),
                    Math.min(currentPage + 2, pageNumbers.length)
                  )
                  .map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`${currentPage === number ? "active" : ""}`}
                    >
                      {number}
                    </button>
                  ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentBlogs.length < perPage}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}
