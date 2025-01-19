import React, { useContext } from 'react';
import { Authcontext } from '../Provider/Authprovider';
import useAuth from '../Hooks/UseAuth';

const Login = () => {
    const {setUser, googleSignin} = useAuth();
    const googleClick = () => {
        googleSignin()
        .then(result => {
            const user = result.user;
            setUser(user)
            console.log(user)
        })
    }
    return (
        <div>
            <h1>This is a login page</h1>
            <div className='flex justify-center mb-4'>
            <button onClick={googleClick} className='bg-blue-400 text-white font-bold px-3 rounded-md'>Login with google</button>
            </div>
            <div className='divider'>
            </div>
            {/* From here service card will start */}
        </div>
    );
};

export default Login;