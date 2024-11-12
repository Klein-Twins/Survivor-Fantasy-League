import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import RootLayout from './pages/RootLayout.tsx';
import SurvivorCastPage from './pages/SurvivorCastPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    //errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/survivor-cast", element: <SurvivorCastPage />},
      { path: "/dashboard", element: <DashboardPage />}
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
