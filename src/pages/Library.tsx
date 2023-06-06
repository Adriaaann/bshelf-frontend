import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axios from '../api/axios';
import '../styles/Library.css';

function Library() {
   const [books, setBooks] = useState([]);
   const [filteredBooks, setFilteredBooks] = useState([]);
   const [btnFilter, setBtnFilter] = useState('read');

   const navigate = useNavigate();

   const user = JSON.parse(localStorage.getItem('user') || '{}');

   const { _id: userId } = user;

   useEffect(() => {
      if (!userId) {
         return navigate('/login');
      }

      const getUser = async () => {
         try {
            const { data } = await axios.get(`/users/${userId}`);

            setBooks(data.books);
         } catch (err) {
            console.log(err);
         }
      };

      getUser();

      return setFilteredBooks(books.filter((book) => book[btnFilter] === true));
   }, [books, userId, btnFilter, navigate]);

   const filters = [
      {
         name: 'read',
      },
      {
         name: 'favorite',
      },
      {
         name: 'planning',
      },
   ];

   return (
      <div>
         <Header />
         <div className="libraryHeader">
            <div className="libraryButtons">
               {filters.map((btn) => (
                  <button
                     name={btn.name}
                     key={btn.name}
                     type="button"
                     className={btnFilter === btn.name ? 'selected' : ''}
                     onClick={() => setBtnFilter(btn.name)}
                  >
                     {btn.name}
                  </button>
               ))}
            </div>
         </div>
         <div className="libraryContainer">
            {filteredBooks.length > 0 ? (
               filteredBooks.map((book: Book) => (
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

interface Book {
   id: string;
   title: string;
   cover: string;
}

export default Library;
