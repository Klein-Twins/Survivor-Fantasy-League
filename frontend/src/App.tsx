import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './pages/RootLayout.tsx';
import LeagueDetailView from './pages/LeaguePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import HomePage from './pages/home/HomePage.tsx';
import AdminPage from './pages/AdminPage.tsx';
import AdminSeasonDetailsPage from './pages/AdminSeasonDetailsPage.tsx';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store/store.ts';
import { getSeasons } from './store/slices/seasonSlice.ts';
import SeasonDetailsPage from './pages/SeasonDetailsPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    //errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/season-details', element: <SeasonDetailsPage /> },
      { path: '/league/:leagueId', element: <LeagueDetailView /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/admin', element: <AdminPage /> },
      { path: '/admin/season/:seasonId', element: <AdminSeasonDetailsPage /> },
    ],
  },
]);

function App() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // dispatch(checkAuthentication());
    dispatch(getSeasons());
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
