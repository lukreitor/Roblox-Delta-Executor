import { createContext, useContext, useEffect, useState } from "react";
import { RoutesContext } from "./RoutesContext";

export const RoleContext = createContext();

export const RoleContextProvider = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : '');
    const [role, setRole] = useState('VISITOR');
    const [username, setUsername] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '');

    const { urls } = useContext(RoutesContext);

    useEffect(() => {
        const getRole = async () => {
            setLoading(true);

            try{
                if(token){
                    const res = await fetch(`${urls.user}get-role`, {headers:{'Authorization':`Bearer ${token}`,}});
        
                    const json = await res.json();

                    setRole(json.message);
                }

                if(!token){
                    setRole('VISITOR');
                }
            }
            catch(error){
                console.log('Houve um problema, tente novamente mais tarde!');
            }
    
            setLoading(false);
        }

        getRole();
    }, [token, urls.user]);


    return(
        <RoleContext.Provider value={{role, setRole, token, setToken, loading, username, setUsername}}>
            {children}
        </RoleContext.Provider>
    )
}