import { RiBarChartHorizontalLine } from "react-icons/ri";
import { GoScreenFull } from "react-icons/go";
import { IoNotifications } from "react-icons/io5";
import { BiExitFullscreen } from "react-icons/bi";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const [isFullScreen, setisFullScreen] = useState(false);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setisFullScreen(true);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setisFullScreen(false);
        });
      }
    }
  };
  return (
    <>
      <header className="header flex flex-sb">
        <div className="logo flex gap-2">
          <h1>ADMIN</h1>
          <div className="headerham flex flex-center">
            <RiBarChartHorizontalLine />
          </div>
        </div>
        <div className="rightnav flex gap-2">
          <div onClick={toggleFullscreen}>
            {isFullScreen ? <BiExitFullscreen /> : <GoScreenFull />}
          </div>
          <div className="notifications">
            <IoNotifications style={{ color: "#ffbe33" }} />
          </div>
          <div className="profilenav">
            {session ? (
              <img src={session.user.image} alt="user" />
            ) : (
              <img src="/img/user.png" width={10} height={50} alt="user" />
            )}
          </div>
        </div>
      </header>
    </>
  );
}
