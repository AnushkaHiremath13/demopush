import { 
  createContext, 
  useContext, 
  useState, 
  useEffect 
} from "react";
import { loginUser } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserType = localStorage.getItem("userType");

    if (savedToken && savedUserType) {
      setToken(savedToken);
      setUserType(savedUserType);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async ({ uemail, upassword }) => {
    const response = await loginUser({ uemail, upassword });

    const { token, userType } = response;

    localStorage.setItem("token", token);
    localStorage.setItem("userType", userType);

    setToken(token);
    setUserType(userType);

    return userType;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setToken(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userType,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
