import { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import * as PATHS from './constants/routes';
import { AuthProvider, useAuth } from './context/auth';
import myImage from './assets/1.png';
import LandingPage from './pages/LandingPage';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));

const PrivateRoute = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to={PATHS.LOGIN} />;
};

const ProfileRoute = () => {
  const { user } = useAuth();
  if (!user.address) {
    toast.info('Please finish your profile.');
    return <Navigate to={PATHS.PROFILE} />;
  }
  return <Outlet />;
};

const PublicRoute = () => {
  const { isLoggedIn } = useAuth();
  return !isLoggedIn ? <Outlet /> : <Navigate to={PATHS.DASHBOARD} />;
};

const App = () => {
  return (
    <AuthProvider>
      <div
        className='flex justify-center bg-cover bg-no-repeat items-center h-screen'
        style={{
          backgroundImage: `url(${myImage})`,
        }}
      >
        <Suspense
          fallback={
            <div className='h-screen w-screen bg-[#aeaeae3d] flex justify-center items-center'>
              <FaSpinner size={56} />
            </div>
          }
        >
          <BrowserRouter>
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path={PATHS.LOGIN} element={<Login />} />
                <Route path={PATHS.SIGNUP} element={<Register />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route element={<ProfileRoute />}>
                  <Route path={PATHS.DASHBOARD} element={<LandingPage />} />
                </Route>
                <Route path={PATHS.PROFILE} element={<Profile />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Suspense>
      </div>
    </AuthProvider>
  );
};

export default App;
