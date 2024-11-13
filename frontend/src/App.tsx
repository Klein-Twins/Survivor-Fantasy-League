import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import League from './components/dashboard/league/League.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import HomePage from './pages/HomePage.tsx';
import RootLayout from './pages/RootLayout.tsx';
import SurvivorCastPage from './pages/SurvivorCastPage.tsx';
import Home from './components/dashboard/home/Home.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    //errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/survivor-cast", element: <SurvivorCastPage />},
      { path: "/dashboard", element: <DashboardPage />, children: [
          { path: "", element: <Home/>}, 
          { path: "league/:id", element: <League /> },
        ],
      }
    ],
  },
]);


function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
