import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import axios from '../api/axios';

interface User {
   username: string;
   email: string;
   password: string;
}

function Login() {
   const navigate = useNavigate();
   // pega a url pelo react router dom
   const url = window.location.pathname;

   const [user, setUser] = useState<User>({
      username: '',
      email: '',
      password: '',
   });
   const [isLogin, setLogin] = useState<boolean>(true);
   const [error, setError] = useState<boolean>(false);
   const [errorMsg, setErrorMsg] = useState<string>('');

   useEffect(() => {
      localStorage.removeItem('user');
      if (url === '/createAccount') {
         setLogin(false);
      }
   }, [url, setLogin]);

   const handleClick = () => {
      setError(false);
      setLogin(!isLogin);
   };

   const handleChange = ({
      target: { name, value },
   }: {
      target: { name: string; value: string };
   }) => {
      setUser((prevUser) => ({
         ...prevUser,
         [name]: value,
      }));
   };

   const handleSubmit = async (e: BaseSyntheticEvent) => {
      e.preventDefault();

      if (e.target.name === 'createAccount') {
         try {
            const response = await axios.post('/users', user);

            if (!Object.keys(response.data).includes('error')) {
               localStorage.setItem('user', JSON.stringify(response.data));
               navigate('/');
            }

            setError(true);
            setErrorMsg(response.data.error);
         } catch (err) {
            console.log(err);
         }
      }

      if (e.target.name === 'login') {
         const { username, ...rest } = user;

         try {
            const response = await axios.post('/login', rest);

            if (!Object.keys(response.data).includes('error')) {
               localStorage.setItem('user', JSON.stringify(response.data));
               navigate('/');
            }

            setError(true);
            setErrorMsg(response.data.error);
         } catch (err) {
            console.log(err);
         }
      }
   };

   return (
      <div className="loginContainer">
         <div className="loginForm">
            {!isLogin ? (
               <>
                  <h1>Create Account</h1>
                  <form name="createAccount" onSubmit={handleSubmit}>
                     <input
                        placeholder="Username"
                        type="text"
                        name="username"
                        onChange={handleChange}
                        value={user.username}
                        required
                     />
                     <input
                        placeholder="Email"
                        type="email"
                        name="email"
                        onChange={handleChange}
                        value={user.email}
                        required
                     />
                     <input
                        placeholder="Password"
                        type="password"
                        name="password"
                        onChange={handleChange}
                        value={user.password}
                        minLength={6}
                        required
                     />
                     <button className="loginBtn" type="submit">
                        Create
                     </button>
                  </form>
                  {error && (
                     <div className="loginError">
                        <p>{errorMsg}</p>
                     </div>
                  )}
                  <div className="loginFooter">
                     <p>Already have an account?</p>
                     <button onClick={handleClick} type="button">
                        Log in
                     </button>
                  </div>
               </>
            ) : (
               <>
                  <h1>Log in</h1>
                  <form name="login" onSubmit={handleSubmit}>
                     <input
                        placeholder="Email"
                        type="email"
                        name="email"
                        onChange={handleChange}
                        value={user.email}
                     />
                     <input
                        placeholder="Password"
                        type="password"
                        name="password"
                        onChange={handleChange}
                        value={user.password}
                        required
                     />
                     <button className="loginBtn" type="submit">
                        Log in
                     </button>
                  </form>
                  {error && (
                     <div className="loginError">
                        <p>{errorMsg}</p>
                     </div>
                  )}
                  <div className="loginFooter">
                     <p>No account?</p>
                     <button onClick={handleClick} type="submit">
                        Create one
                     </button>
                  </div>
               </>
            )}
         </div>
      </div>
   );
}

export default Login;
