import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../context/RoleContext';
import { RoutesContext } from '../context/RoutesContext';

export const useLogin = () => {
    const { urls } = useContext(RoutesContext);
    const { setRole, setToken } = useContext(RoleContext);
    const [config, setConfig] = useState(null);
    const [method, setMethod] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const httpConfig = (method, user) => {
        if(method === 'POST'){
            setConfig({
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(user),
            })

            setMethod('POST');
        }
    }

    const logout = (e) => {
        if(e){
            localStorage.removeItem('token');
            localStorage.removeItem('cpf');
            localStorage.removeItem('user');
            localStorage.removeItem('name');
            setRole('VISITOR');
            setToken('');
            navigate('/');
        }
    }

    useEffect(() => {
        if(method === 'POST'){
            const login = async () => {
                setLoading(true);
                try{
                    let res = await fetch(`${urls.user}login`, config);
    
                    let json = await res.json();

                    const token = json.message.token;

                    setToken(token);

                    localStorage.setItem('token', JSON.stringify(token));

                    res = await fetch(`${urls.user}get-role`, { headers:{'Authorization':`Bearer ${token}`,}});

                    json = await res.json();

                    const role = json.message;
                    setRole(role);
        
                    setError(null);
                } catch (error){
                    console.log(error);
                    setError(true);
                }
                setLoading(false)
            }
    
            login();
        }
    }, [method, setToken, config, urls, setRole]);

    return { httpConfig, logout, loading, error }
}