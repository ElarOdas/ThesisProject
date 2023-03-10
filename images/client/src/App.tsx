import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Call from './pages/Call';
import { loader as authInfoLoader } from './pages/Auth';
import LoginPage from './pages/Login';
import RedirectPage, { loader as redirectLoader } from './pages/Redirect';
import RootLayout from './pages/Root';
import ErrorPage from './pages/Error';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <h1>This is the homepage</h1> },
            {
                path: 'auth',
                id: 'auth',
                loader: authInfoLoader,
                children: [
                    { path: 'login', element: <LoginPage /> },
                    {
                        path: 'redirect/:redirectId',
                        loader: redirectLoader,
                        element: <RedirectPage />,
                    },
                ],
            },
            {
                path: 'call',
                children: [
                    {
                        index: true,
                        element: <Call />,
                    },
                    {
                        path: 'p2p',
                        element: <h1>Here will be the video Element</h1>,
                    },
                ],
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
