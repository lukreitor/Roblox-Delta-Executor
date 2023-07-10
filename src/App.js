import './App.css';

import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { RoleContext } from './context/RoleContext';

import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Admin from './pages/admin/Admin';
import Kitchen from './pages/kitchen/Kitchen';
import Waiter from './pages/waiter/Waiter';
import AdminTable from './pages/admin-mesas/AdminTable';
import AdminMenu from './pages/admin-cardapio/AdminMenu';
import AdminProfiles from './pages/admin-perfis/AdminProfiles';
import AdminRevenue from './pages/admin-receita/AdminRevenue';
import Attendant from './pages/attendant/Attendant';

function App() {
  const { role } = useContext(RoleContext);

  const admin = 'ADMIN';
  const waiter = 'WAITER';
  const attendant = 'ATTENDANT';
  const kitchen = 'KITCHEN';
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Rotas */}
          <Route path='/' element={<Home />}/>
          <Route path='/login' element={role === 'VISITOR' ? <Login /> : <Navigate to='/' /> }/>

          {/* PAINEIS */}
          <Route 
            path='/painel/admin/pedidos'
            element={ role === admin ? <Admin /> : <Navigate to='/' /> } />
          <Route 
            path='/painel/admin/mesas' 
            element={ role === admin ? <AdminTable /> : <Navigate to='/' /> } />
          <Route 
            path='/painel/admin/cardapio' 
            element={ role === admin ? <AdminMenu /> : <Navigate to='/' /> } />
          <Route 
            path='/painel/admin/perfis' 
            element={ role === admin ? <AdminProfiles /> : <Navigate to='/' /> } />
          <Route 
            path='/painel/admin/receita' 
            element={ role === admin ? <AdminRevenue /> : <Navigate to='/' /> } />

          <Route 
            path='/painel/kitchen' 
            element={(role === kitchen || role === admin) ? <Kitchen /> : <Navigate to='/' />} />
          <Route 
            path='/painel/attendant' 
            element={(role === attendant || role === admin) ? <Attendant /> : <Navigate to='/' />} />
          <Route 
            path='/painel/waiter' 
            element={(role === waiter || role === admin) ? <Waiter /> : <Navigate to='/' />} />

          {/* 404 */}
          <Route path='*' element={<Navigate to='/' />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
