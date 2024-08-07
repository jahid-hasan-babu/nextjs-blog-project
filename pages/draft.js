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

export default function Draft() {
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(4);

  //fetchblogs
  const [alldata, loading] = useFetchData("/api/blogapi");

  // Debug log for fetched data
  useEffect(() => {
    console.log("All data fetched: ", alldata);
  }, [alldata]);

  //function to handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastBlog = currentPage * perPage;
  const indexOfFirstBlog = indexOfLastBlog - perPage;
  const currentBlogs = alldata
    ? alldata.slice(indexOfFirstBlog, indexOfLastBlog)
    : [];

  //filtering draft blogs
  const draftBlogs = currentBlogs.filter((ab) => ab.status === "draft");

  // Debug log for filtered draft blogs
  useEffect(() => {
    console.log("Draft blogs: ", draftBlogs);
  }, [currentBlogs]);

  const allblog = alldata ? alldata.length : 0;

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
            <div>
              <h2>
                All Draft <span>Blogs</span>
              </h2>
              <h3>ADMIN PANEL</h3>
            </div>
            <div className="breadcrumb">
              <BsPostcard /> <span>/</span> <span>Draft Blogs</span>
            </div>
          </div>
          <div className="blogstable">
            <table className="table table-styling">
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
                    {draftBlogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center">
                          No Draft Blogs
                        </td>
                      </tr>
                    ) : (
                      draftBlogs.map((blog, index) => (
                        <tr key={blog._id}>
                          <td>{index + 1}</td>
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
            {draftBlogs.length === 0 ? (
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
