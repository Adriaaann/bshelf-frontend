import Icon from '@mdi/react';
import { mdiAccountCircle, mdiMagnify } from '@mdi/js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
   const navigate = useNavigate();

   const user = JSON.parse(localStorage.getItem('user'));

   const [searchValue, setSearchValue] = useState('');

   const handleClick = () => {
      if (searchValue !== '') {
         const query = searchValue.trim().replace(/\s+/g, '+');

         navigate(`/search/${query}`);
      }
   };

   const handleChange = ({ target }: { target: any }) => {
      setSearchValue(target.value);
   };

   const handleSingOut = () => {
      localStorage.removeItem('user');
      navigate('/');
   };

   return (
      <div className="headerContainer">
         <div className="headerContent">
            <div className="logo">
               <a href="/">
                  <img src="\src\icons\logoName.svg" alt="logo" />
               </a>
            </div>
            <div className="headerItems">
               {user ? (
                  <div className="login">
                     <a href="/account" className="account">
                        <Icon path={mdiAccountCircle} size={1.5} />
                        {user.username}
                     </a>
                     <a href="/library">Library</a>
                     <button type="button" onClick={handleSingOut}>
                        Sign Out
                     </button>
                  </div>
               ) : (
                  <div className="login">
                     <a href="/login">Log in</a>
                     <a href="/createAccount">Create Account</a>
                  </div>
               )}
               <hr />
               <div className="searchBar">
                  <input
                     id="headerInput"
                     className="headerInput"
                     type="text"
                     name="search"
                     value={searchValue}
                     onChange={handleChange}
                     onKeyDown={(e) => e.key === 'Enter' && handleClick()}
                  />
                  <button
                     className="searchBtn"
                     type="button"
                     onClick={handleClick}
                  >
                     <Icon path={mdiMagnify} size={1} />
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Header;
