import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { Auth, getUserDocument, updateUserProfile } from '../services/firebase';

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
  const userIsLoggedIn = !!user;
  const loginHandler = useCallback(async (userCredentials) => {
    try {
      const userData = await getUserDocument(userCredentials.uid); // call the function to get user document

      setUser({ ...userCredentials, ...userData }); // merge the user object with the data from Firestore
      localStorage.setItem(
        'user',
        JSON.stringify({ ...userCredentials, ...userData })
      );
    } catch (error) {
      console.error(error);
      toast.error('Error fetching user data from Firestore');
    }
  }, []);
  const logoutHandler = useCallback(() => {
    Auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  useEffect(() => {
    if (!user) logoutHandler();
  }, [user, logoutHandler]);

  const updateHandler = useCallback(
    async (updatesObject) => {
      try {
        const userData = await updateUserProfile(user.uid, updatesObject); // call the function to get user document
        setUser((prev) => {
          const newUser = { ...prev, ...userData };
          localStorage.removeItem('user');
          localStorage.setItem('user', JSON.stringify(newUser));
          return newUser;
        }); // merge the user object with the data from Firestore
      } catch (error) {
        console.error(error);
        toast.error('Error fetching user data from Firestore');
      }

      localStorage.removeItem('user');
      localStorage.setItem('user', JSON.stringify(user));
    },
    [user]
  );
  useEffect(() => {
    let unsubscribe;
    unsubscribe = Auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // User is signed in;
        loginHandler(firebaseUser);
      } else {
        // User is signed out
        logoutHandler();
      }
    });
    return () => unsubscribe();
  }, [logoutHandler, loginHandler]);

  const foo = useMemo(() => {
    return {
      isLoggedIn: userIsLoggedIn,
      login: loginHandler,
      logout: logoutHandler,
      user,
      updateUser: updateHandler,
    };
  }, [userIsLoggedIn, loginHandler, logoutHandler, user, updateHandler]);
  return <AuthContext.Provider value={foo}>{children}</AuthContext.Provider>;
};
