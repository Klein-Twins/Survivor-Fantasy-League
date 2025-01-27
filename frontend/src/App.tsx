import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.tsx';
import HomePage from './pages/HomePage.tsx';
import RootLayout from './pages/RootLayout.tsx';
import SurvivorCastPage from './pages/SurvivorCastPage.tsx';
import LeagueDetailView from './pages/LeagueDetailView.tsx';
import AboutPage from './pages/AboutPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    //errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/survivor-cast', element: <SurvivorCastPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/league', element: <LeagueDetailView /> },
      { path: '/about', element: <AboutPage /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
