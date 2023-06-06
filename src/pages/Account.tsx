import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axios from '../api/axios';
import '../styles/Account.css';

function Account() {
   const [errorMsg, setErrorMsg] = useState('');
   const [successMsg, setSuccessMsg] = useState('');
   const [user, setUser] = useState({
      username: '',
      email: '',
      password: '',
   });

   const navigate = useNavigate();

   const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

   const { _id: userId } = currentUser;

   useEffect(() => {
      if (!userId) {
         navigate('/login');
      }
   }, [userId, navigate]);

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

      try {
         const response = await axios.post(`/users/${userId}`, user);

         if (!Object.keys(response.data).includes('error')) {
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(response.data));

            setErrorMsg('');
            setSuccessMsg('Successfully changed');
            return setUser({
               username: '',
               email: '',
               password: '',
            });
         }
         setSuccessMsg('');
         setErrorMsg(response.data.error);
      } catch (err) {
         console.log(err);
      }
      return null;
   };

   return (
      <div>
         <Header />
         <div className="accountContainer">
            <form className="accountForm" onSubmit={handleSubmit}>
               <div className="accountInfo">
                  <label htmlFor="username">
                     <span>Change Username:</span>
                     <input
                        type="text"
                        name="username"
                        value={user.username}
                        autoComplete="off"
                        onChange={handleChange}
                     />
                  </label>
                  <label htmlFor="email">
                     <span>Change Email:</span>
                     <input
                        type="email"
                        name="email"
                        value={user.email}
                        autoComplete="off"
                        onChange={handleChange}
                     />
                  </label>
                  <label htmlFor="password">
                     <span>Change Password:</span>
                     <input
                        type="password"
                        name="password"
                        minLength={6}
                        value={user.password}
                        onChange={handleChange}
                     />
                  </label>
                  {errorMsg !== '' && (
                     <div className="errorMsg">
                        <p>{errorMsg}</p>
                     </div>
                  )}
                  {successMsg !== '' && (
                     <div className="successMsg">
                        <p>{successMsg}</p>
                     </div>
                  )}
                  <button type="submit">Save</button>
               </div>
            </form>
         </div>
      </div>
   );
}

export default Account;
