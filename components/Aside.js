import Link from "next/link";
import { IoHome } from "react-icons/io5";
import { BsPostcard } from "react-icons/bs";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { MdOutlinePending } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Aside() {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);
  const [activeLink, setActiveLinked] = useState("/");

  const handleClick = () => {
    setClicked(!clicked);
  };

  const handleLinkClick = (link) => {
    setActiveLinked(link);
    setClicked(false);
  };

  useEffect(() => {
    setActiveLinked(router.pathname);
  }, [router.pathname]);

  return (
    <>
      <aside className="asideleft">
        <ul>
          <Link href="/">
            <li
              className={activeLink === "/" ? "navactive" : ""}
              onClick={() => handleLinkClick("/")}
            >
              <IoHome />
              <span>Dashboard</span>
            </li>
          </Link>
          <Link href="/blogs">
            <li
              className={activeLink === "/blogs" ? "navactive" : ""}
              onClick={() => handleLinkClick("/blogs")}
            >
              <BsPostcard />
              <span>Blogs</span>
            </li>
          </Link>
          <Link href="/blogs/addblog">
            <li
              className={activeLink === "/blogs/addblog" ? "navactive" : ""}
              onClick={() => handleLinkClick("/blogs/addblog")}
            >
              <MdOutlineAddPhotoAlternate />
              <span>AddBlogs</span>
            </li>
          </Link>
          <Link href="/draft">
            <li
              className={activeLink === "/draft" ? "navactive" : ""}
              onClick={() => handleLinkClick("/draft")}
            >
              <MdOutlinePending />
              <span>Pending</span>
            </li>
          </Link>
          <Link href="/setting">
            <li
              className={activeLink === "/setting" ? "navactive" : ""}
              onClick={() => handleLinkClick("/setting")}
            >
              <IoSettingsOutline />
              <span>Settings</span>
            </li>
          </Link>
        </ul>
      </aside>
    </>
  );
}
