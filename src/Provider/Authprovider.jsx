import React, { createContext, useState } from 'react';
import { auth } from '../../firebase.init';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import AuthContext from './Authcontext';

export const Authcontext = createContext();

const Authprovider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const userRegister = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const userLogin = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logOut = () => {
        setLoading(false)
        return signOut(auth)
    }

    const googleSignin = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup( auth, provider)
    }

    const authInfo = {
        user,
        setUser,
        userRegister,
        userLogin,
        logOut,
        googleSignin
    }
    // return <Authcontext.Provider value={authInfo}>
    //     {children}
    // </Authcontext.Provider>
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default Authprovider;