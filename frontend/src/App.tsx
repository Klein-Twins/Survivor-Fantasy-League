import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import RootLayout from './pages/RootLayout.tsx';
import SurvivorCastPage from './pages/SurvivorCastPage.tsx';
import Modal from './components/ui/Modal.tsx';
import { useSelector } from 'react-redux';
import { RootState } from './store/store.ts';

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
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  return (
    <>
      <RouterProvider router={router} />
      <Modal isOpen ={isOpen} />
    </>
  )
}

export default App
