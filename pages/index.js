import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoHome } from "react-icons/io5";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  LineController,
  Legend,
  LinearScale,
} from "chart.js";
import Loading from "@/components/Loading";
import { Bar } from "react-chartjs-2";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  ChartJS.register(
    CategoryScale,
    LineController,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const [blogsData, setBlogsData] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(0); // State for total blogs

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/blogapi");
        const data = await response.json();
        setBlogsData(data);
        setTotalBlogs(data.length); // Set the total number of blogs
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Blogs Created Monthly By Year",
      },
    },
  };

  const monthlydata = blogsData
    .filter((dat) => dat.status === "publish")
    .reduce((acc, blog) => {
      const year = new Date(blog.createdAt).getFullYear();
      const month = new Date(blog.createdAt).getMonth();
      acc[year] = acc[year] || Array(12).fill(0);
      acc[year][month]++;
      return acc;
    }, {});

  const currentYear = new Date().getFullYear();
  const years = Object.keys(monthlydata);
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const datasets = years.map((year) => ({
    label: `${year}`,
    data: monthlydata[year] || Array(12).fill(0),
    backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.5)`,
  }));

  const data = {
    labels,
    datasets,
  };

  if (status === "loading") {
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h1>Loading...</h1>
      </div>
    );
  }

  if (session) {
    return (
      <>
        <Head>
          <title>Admin Dashboard</title>
          <meta name="description" content="admin dashboard next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="dashboard">
          <div className="titledashboard flex flex-sb">
            <div data-aos="fade-right">
              <h2>
                Blogs <span>Dashboard</span>
              </h2>
              <h3>ADMIN PANEL</h3>
            </div>
            <div className="breadcrumb" data-aos="fade-left">
              <IoHome /> <span>/</span> <span>Dashboard</span>
            </div>
          </div>
          <div className="topfourcards flex flex-sb">
            <div className="four_card" data-aos="fade-right">
              <h2>Total Blogs</h2>
              <span>{totalBlogs}</span> {/* Display total number of blogs */}
            </div>
            <div className="four_card" data-aos="fade-right">
              <h2>Total Topics</h2>
              <span>4</span>
            </div>
            <div className="four_card" data-aos="fade-left">
              <h2>Total Tags</h2>
              <span>2</span>
            </div>
            <div className="four_card" data-aos="fade-left">
              <h2>Draft Blogs</h2>
              <span>
                {blogsData.filter((ab) => ab.status === "draft").length}
              </span>
            </div>
          </div>
          <div className="year_overview flex flex-sb">
            <div className="leftyearoverview" data-aos="fade-up">
              <div className="flex flex-sb">
                <h3>Year Overview</h3>
                <ul className="creative-dots">
                  <li className="big-dot"></li>
                  <li className="semi-big-dot"></li>
                  <li className="medium-dot"></li>
                  <li className="semi-medium-dot"></li>
                  <li className="semi-small-dot"></li>
                  <li className="small-dot"></li>
                </ul>
                <h3 className="text-right">
                  {blogsData.filter((ab) => ab.status === "publish").length} /
                  365
                  <br /> <span>Total Published</span>
                </h3>
              </div>
              <Bar data={data} options={options} />
            </div>
            <div className="right_salescont" data-aos="fade-up">
              <div>
                <h3>Blogs By Category</h3>
                <ul className="creative-dots">
                  <li className="big-dot"></li>
                  <li className="semi-big-dot"></li>
                  <li className="medium-dot"></li>
                  <li className="semi-medium-dot"></li>
                  <li className="semi-small-dot"></li>
                  <li className="small-dot"></li>
                </ul>
              </div>

              <div className="blogscategory flex flex-center">
                <table>
                  <thead>
                    <tr>
                      <td>Topics</td>
                      <td>Data</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Html, Css & JavaScript</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>Next Js, React Js</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>Database</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>Deployment</td>
                      <td>10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
