import React from "react";
import { Link } from "react-router-dom";

const NavButton = ({ icon, children }) => {
  return (
    <div className="w-auto inline-block px-6 py-4 border-r-2 font-bold cursor-pointer transition-all duration-300 hover:bg-yellow-500">
      <div className="inline-block">{children}</div>
    </div>
  );
};

const Nav = () => {
  return (
    <div className="relative border-b-2 z-20">
      <Link to="/attendance">
        <NavButton>Attendance</NavButton>
      </Link>
      <Link to="/register">
        <NavButton>Register</NavButton>
      </Link>
      {/* <Link to="/update">
        <NavButton>Update</NavButton>
      </Link>
      <Link to="/delete">
        <NavButton>Delete</NavButton>
      </Link> */}
      <Link to="/detail">
        <NavButton>Detail</NavButton>
      </Link>
      <Link to="/emptydb">
        <NavButton>Empty DB</NavButton>
      </Link>
    </div>
  );
};

export default Nav;
