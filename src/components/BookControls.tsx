import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
   mdiBookCheck,
   mdiBookCheckOutline,
   mdiHeart,
   mdiHeartOutline,
   mdiClockMinus,
   mdiClockPlusOutline,
   mdiStar,
   mdiClose,
} from '@mdi/js';
import Icon from '@mdi/react';
import axios from '../api/axios';
import '../styles/BookControls.css';

interface BookFetch {
   id: string;
   volumeInfo: { title: string };
}

interface Book {
   id: string;
   title: string;
   cover: string;
   rating: number;
   read: boolean;
   favorite: boolean;
   planning: boolean;
}

function BookControls() {
   // tem mt fução aqui dentro desse componente, separa elas em um hook
   const navigate = useNavigate();

   const user = JSON.parse(localStorage.getItem('user') || '{}');

   const { _id: id } = user;
   const { id: bookId } = useParams();

   const [book, setBook] = useState<BookFetch>({
      id: '',
      volumeInfo: { title: '' },
   });
   const [apiBook, setApiBook] = useState<Book>({
      id: '',
      title: '',
      cover: '',
      rating: 0,
      read: false,
      favorite: false,
      planning: false,
   });
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [rating, setRating] = useState<number>(0);

   useEffect(() => {
      // essa funçao nao precisa ficar aqui dentro, se  ela ficar aqui ela é recriada toda vez q muda id ou bookId, e ela nao depende deles
      const fetchBook = async () => {
         const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${bookId}`
         );

         const data = await response.json();

         setBook(data);
         setIsLoading(false);
      };
      fetchBook();

      // ao inves de reescrever essa função sempre, cria ela fora e paassa o id por parametro para ela
      const getBook = async () => {
         if (id !== undefined) {
            try {
               const response = await axios.get(`books/${id}/${bookId}`);

               if (!Object.keys(response.data).includes('error')) {
                  setApiBook(response.data);
                  setRating(response.data.rating);
               }
            } catch (err) {
               console.log(err);
            }
         }
      };
      getBook();
   }, [id, bookId]);

   useEffect(() => {
      const verifyBook = async () => {
         if (
            apiBook.title !== '' &&
            !apiBook.favorite &&
            !apiBook.planning &&
            !apiBook.read
         ) {
            try {
               await axios.delete(`books/${id}/${bookId}`);
            } catch (err) {
               console.log(err);
            }
         }
      };
      verifyBook();
   }, [bookId, id, apiBook]);

   const postBook = async (addBook: Book) => {
      try {
         await axios.post(`books/${id}`, addBook);
      } catch (err) {
         console.log(err);
      }
      setApiBook(addBook);
   };

   const clearRating = () => {
      setRating(0);

      return postBook({
         ...apiBook,
         id: book.id,
         title: book.volumeInfo.title,
         cover: `https://books.google.com/books/content/images/frontcover/${book.id}?fife=w480-h690`,
         rating: 0,
      });
   };

   const handleRating = ({
      currentTarget: { value },
   }: {
      currentTarget: { value: string };
   }) => {
      if (!id) {
         return navigate('/login');
      }

      setRating(Number(value));

      return postBook({
         ...apiBook,
         id: book.id,
         title: book.volumeInfo.title,
         cover: `https://books.google.com/books/content/images/frontcover/${book.id}?fife=w480-h690`,
         rating: Number(value),
         read: true,
      });
   };

   const handleClick = async ({
      currentTarget: { name },
   }: {
      currentTarget: { name: string };
   }) => {
      if (!id) {
         return navigate('/login');
      }

      return postBook({
         ...apiBook,
         id: book.id,
         title: book.volumeInfo.title,
         cover: `https://books.google.com/books/content/images/frontcover/${book.id}?fife=w480-h690`,
         [name]: !apiBook[name as keyof Book],
      });
   };

   const buttons = [
      {
         name: 'read',
         iconChecked: mdiBookCheck,
         icon: mdiBookCheckOutline,
         color: 'var(--sunglow)',
      },
      {
         name: 'favorite',
         iconChecked: mdiHeart,
         icon: mdiHeartOutline,
         color: 'var(--red)',
      },
      {
         name: 'planning',
         iconChecked: mdiClockMinus,
         icon: mdiClockPlusOutline,
         color: 'var(--blue)',
      },
   ];

   return (
      <div className="bookControls">
         {!isLoading && (
            <div className="bookButtons">
               {buttons.map((btn) => (
                  <button
                     name={btn.name}
                     key={btn.name}
                     type="button"
                     onClick={(e) => handleClick(e)}
                  >
                     {apiBook[btn.name as keyof Book] ? (
                        <>
                           <Icon
                              color={btn.color}
                              path={btn.iconChecked}
                              size={2}
                           />
                           <span>{btn.name}</span>
                        </>
                     ) : (
                        <>
                           <Icon path={btn.icon} size={2} />
                           <span>{btn.name}</span>
                        </>
                     )}
                  </button>
               ))}
            </div>
         )}
         <hr />
         {!isLoading && (
            <div className="bookRating">
               <div className="bookRatingButton">
                  {rating > 0 && (
                     <button type="button" onClick={clearRating}>
                        <Icon path={mdiClose} size={0.5} />
                     </button>
                  )}
                  {[...Array(5)].map((star, i) => {
                     const ratingValue = i + 1;

                     return (
                        <label
                           key={`${star}${ratingValue}`}
                           htmlFor={`ratingBtn${ratingValue}`}
                        >
                           <input
                              type="radio"
                              name="ratingBtn"
                              id={`ratingBtn${ratingValue}`}
                              value={ratingValue}
                              onClick={(e) => handleRating(e)}
                           />
                           {ratingValue <= rating ? (
                              <Icon
                                 color="var(--sunglow)"
                                 path={mdiStar}
                                 size={1.8}
                              />
                           ) : (
                              <Icon path={mdiStar} size={1.8} />
                           )}
                        </label>
                     );
                  })}
               </div>
               <span>Rate</span>
            </div>
         )}
         {/* junta os dois já que são !loading */}
      </div>
   );
}

export default BookControls;
