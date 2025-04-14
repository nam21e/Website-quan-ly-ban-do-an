<<<<<<< HEAD
import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import PostDetail from './features/posts/PostDetail';
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
import CommentList from './features/admin/CommentList';
import SearchPage from './pages/SearchResults';
import EditDraft from "./features/profile/EditDraft";
import RequireAdmin from './features/auth/RequireAdmin';
import AccessDenied from './pages/AccessDenied';
import Contact from './pages/Contact';
import About from './pages/About';
import TagPage from './features/posts/TagPage';
import AdminLogin from './features/auth/AdminLogin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminUserList from "./features/admin/AdminUserList";


function App() {
    return (
        <div className="app-wrapper d-flex flex-column" style={{ minHeight: '100vh' }}>
            <Routes>
                <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                <Route path="/post/:id" element={<MainLayout><PostDetail /></MainLayout>} />
                <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
                <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
                <Route path="/dang-bai" element={<MainLayout><AddPostUser /></MainLayout>} />
                <Route path="/profile" element={<MainLayout><UserProfile /></MainLayout>} />
                <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
                <Route path="/update-profile" element={<MainLayout><UpdateProfile /></MainLayout>} />
                <Route path="/search" element={<MainLayout><SearchPage /></MainLayout>} />
                <Route path="/edit-draft/:id" element={<MainLayout><EditDraft /></MainLayout>} />
                <Route path="/lien-he" element={<MainLayout><Contact/></MainLayout>} />
                <Route path="/gioi-thieu" element={<MainLayout><About /></MainLayout>} />
                <Route path="/tag/:tag" element={<MainLayout><TagPage /></MainLayout>} />
                <Route path="/admin-login" element={<AdminLogin />} />

                {/* 🔒 Admin Routes Protected */}
                <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
                    <Route path="posts" element={<PostList />} />
                    <Route path="add-region" element={<AddRegion />} />
                    <Route path="add-post" element={<AddPostAdmin />} />
                    <Route path="edit-post/:id" element={<EditPost />} />
                    <Route path="view-post/:id" element={<ViewPost />} />
                    <Route path="pending-posts" element={<PendingPosts />} />
                    <Route path="comments" element={<CommentList />} />
                    <Route path="/admin/users" element={<AdminUserList />} />
                </Route>

                {/* 🚫 Access Denied */}
                <Route path="/access-denied" element={<AccessDenied />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

const MainLayout = ({ children }) => (
    <>
        <Header />
        <div className="flex-grow-1 container py-4">
            {children}
        </div>
        <Footer />
    </>
);

=======
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

>>>>>>> ad2b6d5 (Initialize project using Create React App)
export default App;
