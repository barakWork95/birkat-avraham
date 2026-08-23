import { Routes, Route } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Login from './Login'
import AdminLayout from './AdminLayout'
import Dashboard from './Dashboard'
import CollectionList from './CollectionList'
import CollectionEditor from './CollectionEditor'
import InfoEditor from './InfoEditor'
import SectionsEditor from './SectionsEditor'

/**
 * AdminApp — mounted at /admin/*. Gates on auth, then renders the admin routes.
 */
export default function AdminApp() {
  const { user, signIn, signOut, mode } = useAuth()

  if (!user) return <Login onSignIn={signIn} mode={mode} />

  return (
    <AdminLayout user={user} onSignOut={signOut}>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="info" element={<InfoEditor />} />
        <Route path="sections" element={<SectionsEditor />} />
        <Route path=":name" element={<CollectionList />} />
        <Route path=":name/:id" element={<CollectionEditor />} />
      </Routes>
    </AdminLayout>
  )
}
