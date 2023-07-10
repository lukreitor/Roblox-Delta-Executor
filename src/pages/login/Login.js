import React, { useState, useEffect, useContext } from 'react';
import NavBarHome from '../../components/NavBarHome';
import bgLogin  from '../../assets/bg-login.png';
import InputText from '../../components/InputText';
import { Eye, EyeSlash} from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

import './Login.css'
import { useLogin } from '../../hooks/useLogin';
import { RoleContext } from '../../context/RoleContext';



const Login = () => {
  const [ passType, setPassType ] = useState('password');
  const [ user, setUser] = useState('');
  const [ password, setPassword ] = useState('');
  const [ showModal, setShowModal ] = useState(false);
  const [ name, setName ] = useState('');
  const [ cpf, setCpf] = useState('');

  const { setUsername } = useContext(RoleContext);

  const { httpConfig, loading, error } = useLogin();
  const navigate = useNavigate();
 
  const handleClickPass = () => {
    if(passType === 'password'){
      setPassType('text');
    } else {
      setPassType('password');
    }
  }

  const userCondition = (user) => { return user.length !== 0};
  const passCondition = (password) => { return password.length >= 3};

  const cpfCondition = (cpf) => {
    let pDigVerificador = ((cpf.charAt(0) * 10 + cpf.charAt(1) * 9 + cpf.charAt(2) * 8 + cpf.charAt(3) * 7 + cpf.charAt(4) * 6 + cpf.charAt(5) * 5 + cpf.charAt(6) * 4 + cpf.charAt(7) * 3 + cpf.charAt(8) * 2)* 10) % 11;

    let sDigVerificador = ((cpf.charAt(0) * 11 + cpf.charAt(1) * 10 + cpf.charAt(2) * 9 + cpf.charAt(3) * 8 + cpf.charAt(4) * 7 + cpf.charAt(5) * 6 + cpf.charAt(6) * 5 + cpf.charAt(7) * 4 + cpf.charAt(8) * 3 + cpf.charAt(9) * 2)* 10) % 11;

    if(pDigVerificador === 10){
      pDigVerificador = 0;
    }

    if (sDigVerificador === 10){
      sDigVerificador = 0;
    }

    return !!(pDigVerificador === parseInt(cpf.charAt(9)) && sDigVerificador === parseInt(cpf.charAt(10)));
  }

  const handleOpen = (e) => {
    e.preventDefault();

    if(!isNaN(user) && userCondition(user) && passCondition(password)){
      setShowModal(true);
    } else if(isNaN(user) && userCondition(user) && passCondition(password)){
      const loginObj = {
        username: user,
        password
      }

      httpConfig('POST', loginObj);

      localStorage.removeItem('cpf');
      localStorage.removeItem('name');
      localStorage.setItem('user', JSON.stringify(user));

      setUsername(user);

      if(!error){
        setUser('');
        setPassword('');
      }
    }
  }

  useEffect(() => {
    if(loading === false && !error){
      if(showModal){
        setShowModal(false);
      }
      navigate('/');
    }
  }, [showModal, navigate, loading, error])


  const handleSubmit = (e) => {
    e.preventDefault();

    if(cpfCondition(cpf) && userCondition(name)){
      const loginObj = {
        username: user,
        password
      }

      httpConfig('POST', loginObj);

      localStorage.setItem('cpf', JSON.stringify(cpf));
      localStorage.setItem('name', JSON.stringify(name));
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('token');

      setUsername(user);
      setShowModal(false)
    
      if(!error){
        setUser('');
        setPassword('');
        setName('');
        setCpf('');
      }
    }
  }

  return (
    <div className='login-container'>
          <div className='d-flex'>
            <div className='col-12 col-lg-6 login-left'>
              <NavBarHome />
              <div className='login-content d-flex justify-content-center align-items-center'>
              {!loading && (<>
                <form className='d-flex flex-column justify-content-center' onSubmit={(e) => handleOpen(e)}>
                  <InputText name='user' value={user} setAttr={setUser} condition={userCondition}>Mesa/Usuário</InputText>

                  <label htmlFor="password">Senha</label>
                  <div className='pass-form d-flex align-items-center w-100'>
                    <input type={passType} 
                          name='password' 
                          className={passCondition(password) ? 'pass-camp col-10 valid' : 'pass-camp col-10 invalid'}
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)}/>

                    <div className='pass-reveal col-2 d-flex justify-content-center align-items-center' 
                        onClick={handleClickPass}>

                      {passType === 'password' ? (
                        <div>
                          <span className='visually-hidden'>Ver senha:</span>
                          <Eye color='#E32929' size={24} alt='Ver senha'/>
                        </div>
                      ):(
                        <div>
                          <span className='visually-hidden'>Deixar de ver senha:</span>
                          <EyeSlash color='#E32929' size={24}/>
                        </div>
                      )}

                    </div>

                  </div>
                  <input type="submit" value="Entrar"/>

                  {error && 
                  (<div className='error-container'>
                    <p>Houve um erro, tente novamente!</p>
                  </div>)}

                </form>


                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                  <div className='modal-container'>
                    <form className='d-flex justify-content-center align-items-center flex-column'
                          onSubmit={handleSubmit}>
                        <InputText name='name' value={name} setAttr={setName} condition={userCondition}>Nome</InputText>
                        <InputText name='cpf' value={cpf} setAttr={setCpf} condition={cpfCondition}>CPF</InputText>
                        <input type="submit" className='col-5' value="Entrar"/>
                    </form>
                  </div>
                </Modal>
                </>)}

                {loading && (<div className='d-flex w-100 justify-content-center align-items-center'>
                <div className='loading'></div>
              </div>)}
                
              </div>
            </div>
            <div className='col-0 col-lg-6 login-right'>
              <img src={bgLogin} alt='Fundo - Hamburgueres' className='bg-login'></img>
            </div>
          </div>
      </div>
  )
}

export default Login