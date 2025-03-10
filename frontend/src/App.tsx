import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.tsx';
import RootLayout from './pages/RootLayout.tsx';
import SurvivorCastPage from './pages/SurvivorCastPage.tsx';
import LeagueDetailView from './pages/LeaguePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import HomePage from './pages/HomePage.tsx';
import AdminPage from './pages/AdminPage.tsx';
import SeasonDetailsPage from './pages/SeasonDetailsPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    //errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/survivor-cast', element: <SurvivorCastPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/league/:leagueId', element: <LeagueDetailView /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/admin', element: <AdminPage /> },
      { path: '/admin/season/:seasonId', element: <SeasonDetailsPage /> },
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
