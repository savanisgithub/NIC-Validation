import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import FileUpload from './components/File-Upload'
import MainLayout from './components/layouts/MainLayout'
import Summary from './components/Summary'
import ResetPassword from './components/ResetPassword'


const router = createBrowserRouter([
  {
    element: <MainLayout/>,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        
        {
          path: "/fileupload",
          element: <FileUpload />
        },

        {
          path: "/summary",
          element: <Summary />
        },
        
        ]
      },

      {
        path: "/",
        element: <Login />
      },
      {
        path: "/resetpassword",
        element: <ResetPassword />
      },


    ])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> {/*A thing that can catch and show all the mistekes and errors we do in react app When we use advanced react*/}
    <RouterProvider router={router} />
  </React.StrictMode>
)
 
