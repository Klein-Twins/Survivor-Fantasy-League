import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import RootLayout from './pages/RootLayout.tsx';
import SurvivorCastPage from './pages/SurvivorCastPage.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    //errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/survivor-cast", element: <SurvivorCastPage />}
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
