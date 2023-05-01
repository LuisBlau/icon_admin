import React, {useEffect, useState} from "react";
import { useAccount } from 'wagmi'
import { getAuth } from "src/utils/helper";

const AuthContext = React.createContext();
const AuthProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { address } = useAccount()

  useEffect(() => {
    if (address) {
      const checkOwner = async () => {
        const status = await getAuth(address)
        if (status)
          setIsAuthenticated(true)
        else
          setIsAuthenticated(false)
      }
      checkOwner()
    } else {
      setIsAuthenticated(false)
    }
  }, [address])

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };