import Blog from "@/components/Blog";
import axios from "axios";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsPostcard } from "react-icons/bs";
import Loading from "@/components/Loading"; // Import Loading component

export default function DeleteBlog() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    if (!session && status !== "loading") {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (id) {
      axios.get("/api/blogapi?id=" + id).then((response) => {
        setProductInfo(response.data);
      });
    }
  }, [id]);

  async function goback() {
    router.push("/");
  }

  async function deleteOneBlog() {
    await axios.delete("/api/blogapi?id=" + id);
    goback();
  }

  if (status === "loading" || !session) {
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Delete Blog</title>
      </Head>
      <div className="blogpage">
        <div className="titledashboard flex flex-sb">
          <div>
            <h2>
              Delete{" "}
              <span>{productInfo ? productInfo.title : "Loading..."}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <BsPostcard /> <span>/</span> <span>Edit Blogs</span>
          </div>
        </div>
        {productInfo ? (
          <div className="deletesec flex flex-center wh_100">
            <div className="deletecard">
              <svg viewBox="0 0 24 24" fill="red" height="6em" width="6em">
                <path d="M4 19V7h12v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2M6 9v10h8V9H6m7.5-5H17v2H3V4h3.5l1 1M19 17v-2h2v2h-2m0-4V7h2v6h-2z" />
              </svg>
              <p className="cookieHeading">Are you sure?</p>
              <p className="cookieDescription">
                If you delete this blog content, it will be permanently deleted.
              </p>
              <div className="buttonContainer">
                <button onClick={deleteOneBlog} className="acceptButton">
                  Delete
                </button>
                <button onClick={goback} className="declineButton">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="loadingdata flex flex-col flex-center wh_100">
            <Loading />
            <h1>Loading Blog Data...</h1>
          </div>
        )}
      </div>
    </>
  );
}
