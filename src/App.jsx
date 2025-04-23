import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Layout from './pages/Layout'
import Body from './components/Body'
import Error from './components/Error'
import './index.css'
import DarkMode from './components/DarkMode/DarkMode'

function App() {

  const routerapp = createBrowserRouter([
    {
      path:"/",
      element:<Layout/>,
      children:[
        {
          path:"/",
          element:<Body/>
        },
      ],
      errorElement:<Error/>
    }
  ])
  return (
    <>
    <RouterProvider router={routerapp}></RouterProvider>
    </>
  )
}

export default App
