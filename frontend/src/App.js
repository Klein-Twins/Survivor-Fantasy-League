import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./styles/App.css";

import HomePage from "./pages/Home.jsx";
import RootLayout from './pages/Root.jsx';
import RulesPage from "./pages/Rules.jsx";
import RosterPage from "./pages/Roster.jsx";
import LoginPage from "./pages/Login.jsx";
import SignupPage from "./pages/Signup.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/rules", element: <RulesPage /> },
      { path: "/roster", element: <RosterPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
