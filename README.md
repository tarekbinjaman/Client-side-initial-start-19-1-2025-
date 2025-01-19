# Client side 

# Install pacakges

react router dom
```
npm create vite@latest name-of-your-project -- --template react
# follow prompts
cd <your new project directory>
npm install react-router-dom # always need this!
npm install localforage match-sorter sort-by # only for this tutorial.
npm run dev
```

tailwingcss
```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
daisyui
```
npm i -D daisyui@latest
```
After installation complete open client file with vs code

# finish tailwind setup
in tailwindconfig.js replace content code here it is:

```
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
```

also replace index.css code, here it is:

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Put this daisyui require code in plugin in tailwindconfig.js:

```
require('daisyui'),
```

# Now Folder and main files setup
-----------------------------
# create those folder into src
Components
Hooks
Layout
Pages
Provider
Router

# Create Loading componenet first

we are using daisyui loader
```
import React from 'react';

const Loading = () => {
    return (
        <div>
        <div className='max-h-screen justify-center items-center flex mt-[10%]'>
            <span className="loading loading-bars loading-lg"></span>
        </div>
    </div>
    );
};

export default Loading;
```

# First create Layouts like navbar, footer 
# then create a component name Main layout in same folder

```
const MainLayout = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar></Navbar>
            <div className='flex-grow'>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;
```
if you set className how this code written then you will see issue to adjust footer

# router setup
Create a router.jsx file into router folder

this is how you will setup
```
import { createBrowserRouter } from "react-router-dom";
import MainLayout from '../Layout/MainLayout'
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Services from "../pages/Services";
const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout></MainLayout>,
      errorElement: <h1>Route Not Found</h1>,
      children: [
        {
            path: '/',
            element: <Home></Home>
        },
        {
            path: 'login',
            element: <Login></Login>
        },
        {
            path: 'registration',
            element: <Register></Register>
        },
        {
            path: 'services',
            element: <Services></Services>
        }
        
      ]
    },
  ]);

export default router;
```

# Setup main layout
```
<!-- initally setup like this -->
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router-dom";
import router from './router/router.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

<!-- * Important * -->
<!-- Must import router from router.jsx -->

```

# Provider setup

first create a context file like this

AuthContext.jsx
```
import React, { createContext } from 'react';

const AuthContext = createContext();

export default AuthContext;
```

Then create  

Authprovider.jsx

```
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
```

After finishing this must setup AuthProvider in main.jsx

# Setup AuthProvider in main.jsx

```
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router-dom";
import router from './router/router.jsx';
import Authprovider from './Provider/Authprovider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Authprovider>
    <RouterProvider router={router} />
    </Authprovider>
  </StrictMode>,
)

```

# Create private route
```
import React, { useContext } from 'react';
import { Authcontext } from '../Provider/Authprovider';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Loading from '../Components/Loading';

const PrivateRoute = ({children}) => {
    const {user, loading} = useContext(Authcontext)
    const navigate = useNavigate();
    const location = useLocation();
    if(loading) {
        return <Loading></Loading>
    }
    if(user && user.email) {
        return children
    }
    return <Navigate state={location.pathname} to={"/login"}></Navigate>
};

export default PrivateRoute;
```

# Create Hook before using context api

This is how you can create

useAuth.jsx
```
import React, { useContext } from 'react';
import AuthContext from '../Provider/Authcontext';

const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
};

export default useAuth;
```

And this is how you will use
```
const { user, setUser, signIn } = useAuth();
```

# From here JWT Process Start

In Authprovider you have to put jwt path in useEffect like this
```
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
```

then check the token is successfully adding and removing process working or not.

# Verify token client side setup
In previous step token was stored in cookie then after logout cookie also removed.
Now the process we are going to do it is token verify and data load process here it is

```
        {
            path: 'services',
            element: <Services></Services>,
            loader: () => fetch('http://localhost:5000/services', {credentials: 'include'})
        }
```

in the server side we have put verifytoken in this route so We have to set {credentials: 'include'}
Be careful! sometime you might write {withcredentials: true} it will make verifytoken process in trouble.