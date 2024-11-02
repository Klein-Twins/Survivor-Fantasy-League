import { NavLink } from "react-router-dom";

export default function MainNavigation() {
  return (
    <header>
      <nav>
        <ul className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
          <li className="">
            <NavLink to="/"><span className="menu-bar-button">Home</span></NavLink>
          </li>
          <li>
            <NavLink to="/rules"><span className="menu-bar-button">Rules</span></NavLink>
          </li>
          <li>
            <NavLink to="/roster"><span className="menu-bar-button">Roster</span></NavLink>
          </li>
          <li>
            <NavLink to="/login"><span className="menu-bar-button">Login</span></NavLink>
          </li>
          <li>
            <NavLink to="/signup"><span className="menu-bar-button">Signup</span></NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
