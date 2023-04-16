import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { auth, getUserDocument, updateUserProfile } from '../services/firebase';

const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  user: {},
  updateUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const isLoggedIn = !!user;
  const logoutHandler = useCallback(() => {
    auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const loginHandler = useCallback(
    async (userCredentials) => {
      try {
        if (!userCredentials.emailVerified) {
          toast.success('Please Verify your Email Address ');
          logoutHandler();
          return;
        }

        const userData = await getUserDocument(userCredentials.uid);
        const mergedUser = { ...userCredentials, ...userData };
        setUser(mergedUser);
        localStorage.setItem('user', JSON.stringify(mergedUser));
      } catch (error) {
        console.error(error);
        toast.error('Error fetching user data from Firestore');
      }
    },
    [logoutHandler]
  );

  useEffect(() => {
    if (!user) {
      logoutHandler();
    }
  }, [user, logoutHandler]);

  const updateUserHandler = useCallback(
    async (updatesObject) => {
      try {
        const updatedUserData = await updateUserProfile(
          user.uid,
          updatesObject
        );
        const updatedUser = { ...user, ...updatedUserData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error(error);
        toast.error('Error updating user data in Firestore');
      }
    },
    [user]
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        loginHandler(firebaseUser);
      } else {
        logoutHandler();
      }
    });

    return () => unsubscribe();
  }, [loginHandler, logoutHandler]);

  const authContextValue = useMemo(() => {
    return {
      isLoggedIn,
      login: loginHandler,
      logout: logoutHandler,
      user,
      updateUser: updateUserHandler,
    };
  }, [isLoggedIn, loginHandler, logoutHandler, user, updateUserHandler]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
