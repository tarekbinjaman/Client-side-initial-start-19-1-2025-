import React, { createContext, useEffect, useState } from 'react';
import { auth } from '../../firebase.init';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import AuthContext from './Authcontext';
import axios from 'axios';

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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            console.log('state captured', currentUser?.email)
            // one
            if(currentUser?.email) {
                const user = { email: currentUser.email };
                axios.post('http://localhost:5000/jwt', user, { withCredentials: true })
                .then(res => {
                    console.log('Login token', res.data)
                    setLoading(false)
                })
                .catch(err => console.error('Error generating token', err));
            }

            // two
            else {
                axios.post('http://localhost:5000/logout', {}, {withCredentials: true})
                .then( res => {
                    console.log('Logout token cleared', res.data)
                    setLoading(false)
                })
                .catch( err => console.error('Error clearing token:', err));
            }
        });
        // three
        return () => { unsubscribe()};
    }, [])

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default Authprovider;