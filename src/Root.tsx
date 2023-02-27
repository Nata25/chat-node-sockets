import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Chat from './Chat';
import JoinForm from './JoinForm';
import './styles.css';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <JoinForm />
  },
  {
    path: 'chat',
    element: <Chat />
  },
])

const RootApp = () => {
  return (
    <RouterProvider router={routes} />
  )
}

export default RootApp;
