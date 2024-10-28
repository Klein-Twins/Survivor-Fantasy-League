import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/Home";
import RootLayout from "./pages/Root.jsx";
import RulesPage from "./pages/Rules.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/rules", element: <RulesPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
