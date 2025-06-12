import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Divider, Input } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/configStore/store';
import { logInRequest } from '../../store/features/auth/authSlice';
import DynamicFaIcon from '../../components/DynamicFaIcon';

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);


    const { user, loading, error } = useSelector(
        (state: RootState) => ({
        user: state.auth.user,
        loading: state.auth.loading,
        error: state.auth.error
        }),
    );

    // Redirección al dashboard si el login fue exitoso
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(logInRequest({ email, password }));
    };

    return (
        <form onSubmit={handleSubmit} className='h-dscreen w-screen flex flex-col justify-between items-center px-6 lg:px-0 pt-16 pb-8'>
            <div className="w-full lg:w-1/4 flex flex-col items-start justify-start gap-y-8">
                <span className='text-3xl font-semibold'>Inicio de sesión</span>
                <div className='w-full flex flex-col gap-y-6'>
                    <Input
                        required
                        size='lg'
                        variant='bordered'
                        label="Correo electrónico"
                        placeholder="usuario@ejemplo.com"
                        type="email"
                        labelPlacement='outside'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className='w-full flex flex-col items-end space-y-2'>
                        <Input
                            required
                            size='lg'
                            variant='bordered'
                            label='Contraseña'
                            placeholder='••••••••'
                            type={passwordVisible ? 'text' : 'password'}
                            labelPlacement='outside'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            endContent={
                                <button
                                    type='button'
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    className='font-semibold text-xs'
                                >
                                    {passwordVisible ? 'OCULTAR' : 'MOSTRAR'}
                                </button>
                            }
                        />
                        <button>
                            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-sm font-semibold hover:text-black">
                                ¿Olvidaste tu contraseña?
                            </span>
                        </button>
                    </div>
                </div>
                
                
                
                <Button
                    size='lg'
                    type="submit"
                    variant="shadow"
                    color='primary'
                    radius='lg'
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mt-3"
                    isLoading={loading}
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </Button>

                {error && <div className='w-full text-center text-rose-600 text-sm'>{error}</div>}

                <div className='w-full flex flex-row justify-center items-center space-x-2'>
                    <div className='w-full'>
                        <Divider/>
                    </div>
                    <span className='w-full text-sm text-center'>O ingresar con</span>
                    <div className='w-full'>
                        <Divider/>
                    </div>
                </div>

                <div className='w-full flex flex-row gap-x-5'>
                    <Button
                        size='lg'
                        radius='lg'
                        variant='flat'
                        className='w-full'
                    >
                        <DynamicFaIcon name={'FaFacebook'} className='text-gray-800'/>
                        <span className='text-sm'>Facebook</span>
                    </Button>
                    <Button
                        size='lg'
                        radius='lg'
                        variant='flat'
                        className='w-full'
                    >
                        <DynamicFaIcon name={'FaGoogle'} className='text-gray-800'/>
                        <span className='text-sm'>Google</span>
                    </Button>
                </div>
            </div>
            <div className='w-full text-center'>
                    <span className='text-sm'>¿No tienes cuenta? </span>
                    <button>
                        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-sm font-semibold hover:text-">
                            Registrate aquí
                        </span>
                    </button>
                </div>
        </form>
        
    );
};

export default Login;
