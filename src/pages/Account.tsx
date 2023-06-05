import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axios from '../api/axios';
import '../styles/Account.css';

function Account() {
   const navigate = useNavigate();
   const [error, setError] = useState(false);
   const [errorMsg, setErrorMsg] = useState('');
   const [user, setUser] = useState({
      username: '',
      email: '',
      password: '',
   });

   const { _id: userId } = JSON.parse(localStorage.getItem('user'));

   const handleChange = ({ target }: { target: any }) => {
      const { name, value } = target;
      setUser((prevUser) => ({
         ...prevUser,
         [name]: value,
      }));
   };

   const handleSubmit = async (e: any) => {
      e.preventDefault();

      try {
         const response = await axios.post(`/users/${userId}`, user);

         if (!Object.keys(response.data).includes('error')) {
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/');
         }

         setError(true);
         setErrorMsg(response.data.error);
      } catch (err) {
         console.log(err);
      }
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
                        autoComplete="off"
                        onChange={handleChange}
                     />
                  </label>
                  <label htmlFor="email">
                     <span>Change Email:</span>
                     <input
                        type="email"
                        name="email"
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
                        onChange={handleChange}
                     />
                  </label>
                  {error && (
                     <div className="loginError">
                        <p>{errorMsg}</p>
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
