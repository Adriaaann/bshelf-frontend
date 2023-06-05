import { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from '../api/axios';
import '../styles/Library.css';

function Library() {
   const [books, setBooks] = useState([]);
   const [filteredBooks, setFilteredBooks] = useState([]);
   const [btnFilter, setBtnFilter] = useState('read');

   useEffect(() => {
      const { _id: userId } = JSON.parse(localStorage.getItem('user'));

      const getUser = async () => {
         try {
            const { data } = await axios.get(`/users/${userId}`);

            setBooks(data.books);
         } catch (err) {
            console.log(err);
         }
      };

      getUser();

      if (btnFilter === 'read') {
         setFilteredBooks(books.filter((book) => book.read === true));
      }
      if (btnFilter === 'favorite') {
         setFilteredBooks(books.filter((book) => book.favorite === true));
      }
      if (btnFilter === 'planning') {
         setFilteredBooks(books.filter((book) => book.planning === true));
      }
   }, [books, btnFilter]);

   const handleClick = (e) => {
      [...e.target.parentNode.childNodes].map((node) => {
         document.getElementById(`${node.name}`).classList.remove('selected');
      });
      document.getElementById(`${e.target.name}`).classList.add('selected');
      setBtnFilter(e.target.name);
   };

   return (
      <div>
         <Header />
         <div className="libraryHeader">
            <div className="libraryButtons">
               <button
                  name="read"
                  id="read"
                  type="button"
                  className="selected"
                  onClick={(e) => handleClick(e)}
               >
                  Read
               </button>
               <button
                  name="favorite"
                  id="favorite"
                  type="button"
                  onClick={(e) => handleClick(e)}
               >
                  Favorite
               </button>
               <button
                  name="planning"
                  id="planning"
                  type="button"
                  onClick={(e) => handleClick(e)}
               >
                  Planning
               </button>
            </div>
         </div>
         <div className="libraryContainer">
            {filteredBooks.length > 0 ? (
               filteredBooks.map((book) => (
                  <a
                     href={`/book/${book.id}`}
                     key={book.id}
                     className="libraryBookWrapper"
                  >
                     <img src={book.cover} alt={book.title} />
                     <span>{book.title}</span>
                  </a>
               ))
            ) : (
               <p>No books yet.</p>
            )}
         </div>
      </div>
   );
}

export default Library;
