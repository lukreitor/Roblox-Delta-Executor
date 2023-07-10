import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'

import { BoxArrowLeft, ChevronLeft, Files, GraphUpArrow, LayoutSplit, PersonBadge, Square } from 'react-bootstrap-icons';

import './SideMenu.css'
import { useLogin } from '../hooks/useLogin';

const SideMenu = ({ page = 'pedidos'}) => {
    const [ activeMenu, setActiveMenu ] = useState(false);
    const { logout } = useLogin();
    const navigate = useNavigate();

    const handleClick = () => {
        if(activeMenu){
            setActiveMenu(false);
        } else {
            setActiveMenu(true);
        }
    }

  return (
    <div className={ activeMenu ? 'menu-container-all change' : 'menu-container-all' }>
        <div className={ activeMenu ? 'side-menu-container change' : 'side-menu-container' }>
            <aside className='d-flex flex-column justify-content-between align-items-center side-menu'>
                <div className='d-flex justify-content-center align-items-center mt-3'>
                    <img onClick={() => navigate('/')} className='logo' src={logo} alt="Logo F.O.M.E." />
                </div>
                <div className='links-container d-flex flex-column align-items-center justify-content-evenly h-100'>
                    <NavLink to='/painel/admin/pedidos'>
                        <Files color={ page === 'pedidos' ? '#E52424' : '#fff'} size={36}/>
                        <span className='side-menu-content'>Pedidos</span>
                    </NavLink>

                    <NavLink to='/painel/admin/mesas'>
                        <Square color={ page === 'mesas' ? '#E52424' : '#fff'} size={36}/>
                        <span className='side-menu-content'>Mesas</span>
                    </NavLink>

                    <NavLink to='/painel/admin/cardapio'>
                        <LayoutSplit color={ page === 'cardapio' ? '#E52424' : '#fff'} size={36}/>
                        <span className='side-menu-content'>Cardápio</span>
                    </NavLink>

                    <NavLink to='/painel/admin/perfis'>
                        <PersonBadge color={ page === 'perfis' ? '#E52424' : '#fff'} size={36}/>
                        <span className='side-menu-content'>Perfis</span>
                    </NavLink>

                    <NavLink to='/painel/admin/receita'>
                        <GraphUpArrow color={ page === 'receita' ? '#E52424' : '#fff'} size={36}/>
                        <span className='side-menu-content'>Receita</span>
                    </NavLink>

                    <NavLink to='/logout' onClick={() => logout(true)}>
                        <BoxArrowLeft color='#fff' size={36}/>
                        <span className='side-menu-content'>Sair</span>
                    </NavLink>
                </div>
            </aside>
            <div className='app-bg'>
                <div className={ activeMenu ? 'circle opened d-flex justify-content-start align-items-center' : 'circle closed d-flex justify-content-start align-items-center'} onClick={handleClick}>
                    <div className='seta'>
                     <ChevronLeft color={activeMenu ? '#E52424' : '#FFF'} size={36}/>    
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SideMenu