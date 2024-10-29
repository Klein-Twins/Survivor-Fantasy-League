import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/Home.jsx";
import RootLayout from './pages/Root.jsx';
import RulesPage from "./pages/Rules.jsx";
import RosterPage from "./pages/Roster.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/rules", element: <RulesPage /> },
      { path: "/roster", element: <RosterPage /> },
      { path: "/login", element: <HomePage /> },
      { path: "/signup", element: <HomePage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
