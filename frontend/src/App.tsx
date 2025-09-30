import { createBrowserRouter, RouterProvider, Outlet, Navigate} from 'react-router-dom'

// Pages
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import FileManagerPage from './pages/FileManagerPage'
import DirectoryPage from './pages/DirectoryPage'
import StationAnalyticsPage from './pages/StationAnalyticsPage'
import GraphViewPage from './pages/GraphViewPage'       // This will be the Knowledge Graph
import GeoSpatialMap from './pages/GeoSpatialMap'       // Import the Geospatial map
import AddReportPage from './pages/AddReportPage'
import UploadPage from './pages/UploadPage'
import SearchPage from './pages/SearchPage'
import AdminPage from './pages/AdminPage'
import NotFound from './pages/NotFound'
import FileManagerCategoryPage from './pages/FileManagerCategoryPage'
import DocumentMockViewPage from './pages/DocumentMockViewPage'
import Sidebar from './components/Sidebar'


function Layout() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh' }}>
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

// Layouts & Routes
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'file-manager', element: <FileManagerPage /> },
          { path: 'file-manager/:category', element: <FileManagerCategoryPage /> },
          { path: 'file-manager/:category/:docId', element: <DocumentMockViewPage /> },
          { path: 'directory', element: <DirectoryPage /> },
          { path: 'station-analytics', element: <StationAnalyticsPage /> },
          { path: 'graph-view', element: <GraphViewPage /> },
          { path: 'geospatial-view', element: <GeoSpatialMap /> },
          { path: 'add-report', element: <AddReportPage /> },
          { path: 'upload', element: <UploadPage /> },
          { path: 'search', element: <SearchPage /> },
          { path: 'admin', element: <AdminPage /> },
          { path: 'home', element: <Navigate to="/" replace /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
])


export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}