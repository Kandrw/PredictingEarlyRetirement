import { tabs } from "../lib/constants";
import { Link } from "react-router-dom";

export const Header = () => (
  <header className=" bg-gray-900 h-[60px] w-full flex flex-row justify-center  px-6 py-3">
    <div className="flex flex-row gap-6">
      {" "}
      {tabs.map(({ title, href }) => (
        <Link
          className={`rounded-default bg-white rounded-lg px-6 py-1 text-xl  duration-300 hover:bg-gray-300`}
          key={title}
          to={href}
        >
          {title}
        </Link>
      ))}
    </div>
  </header>
);
