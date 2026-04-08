import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './assets/styles/PostContent.css';
import PostDetail from './pages/PostDetail';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import NotFound from './pages/NotFound';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import PostList from './features/admin/PostList';
import AddPostAdmin from './features/admin/AddPostAdmin';
import EditPost from './features/admin/EditPost';
import ViewPost from './features/admin/ViewPost';
import AddRegion from './features/admin/AddRegion';
import AddPostUser from './features/posts/AddPostUser';
import UserProfile from './features/profile/UserProfile';
import ForgotPassword from './features/auth/ForgotPassword';
import UpdateProfile from './features/profile/UpdateProfile';
import PendingPosts from './features/admin/PendingPosts';
import SearchPage from './pages/SearchResults';
import EditDraft from './features/profile/EditDraft';
import RequireAdmin from './features/auth/RequireAdmin';
import AccessDenied from './pages/AccessDenied';
import Contact from './pages/Contact';
import About from './pages/About';
import TagPage from './features/posts/TagPage';
import AdminLogin from './features/auth/AdminLogin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminUserList from './features/admin/AdminUserList';
import AdminStatsChart from './features/admin/AdminStatsChart';
import RegionPosts from './pages/RegionPosts';
import RegionPostsNam from './pages/RegionPostNam';
import RegionPostsTrung from './pages/RegionPostsTrung';
import ChatBotBox from './components/ui/ChatBotBox';

const MainLayout = ({ children }) => (
  <>
    <Header />
    <div className="flex-grow-1 container py-4">{children}</div>
    <Footer />
    <ChatBotBox />
  </>
);

function App() {
  return (
    <div className="app-wrapper d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/post/:id"
          element={
            <MainLayout>
              <PostDetail />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />
        <Route
          path="/register"
          element={
            <MainLayout>
              <Register />
            </MainLayout>
          }
        />
        <Route
          path="/dang-bai"
          element={
            <MainLayout>
              <AddPostUser />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <UserProfile />
            </MainLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <MainLayout>
              <ForgotPassword />
            </MainLayout>
          }
        />
        <Route
          path="/update-profile"
          element={
            <MainLayout>
              <UpdateProfile />
            </MainLayout>
          }
        />
        <Route
          path="/search"
          element={
            <MainLayout>
              <SearchPage />
            </MainLayout>
          }
        />
        <Route
          path="/edit-draft/:id"
          element={
            <MainLayout>
              <EditDraft />
            </MainLayout>
          }
        />
        <Route
          path="/lien-he"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />
        <Route
          path="/gioi-thieu"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />
        <Route
          path="/tag/:tag"
          element={
            <MainLayout>
              <TagPage />
            </MainLayout>
          }
        />
        <Route
          path="/mien-bac"
          element={
            <MainLayout>
              <RegionPosts />
            </MainLayout>
          }
        />
        <Route
          path="/mien-trung"
          element={
            <MainLayout>
              <RegionPostsTrung />
            </MainLayout>
          }
        />
        <Route
          path="/mien-nam"
          element={
            <MainLayout>
              <RegionPostsNam />
            </MainLayout>
          }
        />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminStatsChart />} />
          <Route path="posts" element={<PostList />} />
          <Route path="add-region" element={<AddRegion />} />
          <Route path="add-post" element={<AddPostAdmin />} />
          <Route path="edit-post/:id" element={<EditPost />} />
          <Route path="view-post/:id" element={<ViewPost />} />
          <Route path="pending-posts" element={<PendingPosts />} />
          <Route path="users" element={<AdminUserList />} />
        </Route>

        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;