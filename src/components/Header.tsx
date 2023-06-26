import Icon from '@mdi/react';
import { mdiAccountCircle, mdiMagnify } from '@mdi/js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
   const navigate = useNavigate();

   const user = JSON.parse(localStorage.getItem('user') || '{}');

   const [searchValue, setSearchValue] = useState<string>('');

   const handleClick = () => {
      if (searchValue !== '') {
         const SELECT_SPACE = /\s+/g;
         const query = searchValue.trim().replace(SELECT_SPACE, '+');

         navigate(`/search/${query}`);
      }
   };

   // se essa função estiver em um hook ela nao precisa ser criada dnv aqui, era so chamar o hook
   const handleChange = ({
      target: { value },
   }: {
      target: { value: string };
   }) => {
      setSearchValue(value);
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
               {Object.keys(user).length !== 0 ? (
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
