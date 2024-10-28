import { NavLink } from "react-router-dom";

export default function MainNavigation() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/rules">Rules</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
