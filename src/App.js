import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/auth';
// import Dashboard from './pages/Dashboard'
// import Login from './pages/Login'
// import Register from './pages/Register'
import * as PATHS from './constants/routes';
import myImage from './assets/BG.png';
import LandingPage from './pages/LandingPage';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
// const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
// const Dashboard = lazy(() => import('./pages/Dashboard'));
// const Profile = lazy(() => import('./pages/Profile'))

const PrivateOutlet = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to={PATHS.LOGIN} />;
};
const ProfileOutlet = () => {
  const { user } = useAuth();
  !user.address && toast.error('please Finish Your profile');
  return user.address ? <Outlet /> : <Navigate to={PATHS.PROFILE} />;
};
const PublicOutlet = () => {
  /* A hook that is listening to the user state. */
  const { isLoggedIn } = useAuth();
  return !isLoggedIn ? <Outlet /> : <Navigate to={PATHS.DASHBOARD} />;
};
const App = () => {
  return (
    <AuthProvider>
      <div
        className='flex justify-center  bg-cover bg-no-repeat items-center h-screen '
        style={{ backgroundImage: `url(${myImage})` }}
      >
        <Suspense
          fallback={
            <div className='h-screen w-screen  flex justify-center items-center'>
              <FaSpinner />
            </div>
          }
        >
          <BrowserRouter>
            <Routes>
              <Route element={<PublicOutlet />}>
                <Route path={PATHS.LOGIN} element={<Login />} />
                <Route path={PATHS.SIGNUP} element={<Register />} />
              </Route>
              <Route element={<PrivateOutlet />}>
                <Route path={PATHS.PROFILE} element={<Profile />} />
                <Route element={<ProfileOutlet />}>
                  <Route path={PATHS.DASHBOARD} element={<LandingPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </Suspense>
      </div>
    </AuthProvider>
  );
};
export default App;
