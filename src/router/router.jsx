import { createBrowserRouter } from "react-router-dom";
import MainLayout from '../Layout/MainLayout'
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Services from "../pages/Services";
const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout></MainLayout>,
      errorElement: <h1>Route Not Found</h1>,
      children: [
        {
            path: '/',
            element: <Home></Home>
        },
        {
            path: 'login',
            element: <Login></Login>
        },
        {
            path: 'registration',
            element: <Register></Register>
        },
        {
            path: 'services',
            element: <Services></Services>
        }
        
      ]
    },
  ]);

export default router;