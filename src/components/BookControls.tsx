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
import '../styles/BookControls.css';
import {
   fetchBook,
   getBook,
   postBook,
   verifyBook,
} from '../hooks/BookControlsHooks';

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

interface User {
   _id: string;
   books: Book[];
   email: string;
   username: string;
   password: string;
}

function BookControls() {
   const navigate = useNavigate();

   const user: User = JSON.parse(localStorage.getItem('user') || '{}');

   const { _id: userId } = user;
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

   const bookTemplate = {
      ...apiBook,
      id: book.id,
      title: book.volumeInfo.title,
      cover: `https://books.google.com/books/content/images/frontcover/${book.id}?fife=w480-h690`,
   };

   useEffect(() => {
      fetchBook(bookId as string).then((data) => {
         setBook(data.book);
         setIsLoading(data.loading);
      });

      getBook(userId, bookId as string).then((data) => {
         setApiBook(data);
         setRating(data.rating);
      });
   }, [userId, bookId]);

   useEffect(() => {
      verifyBook(userId, bookId as string, apiBook).then((data) =>
         setRating(data)
      );
   }, [bookId, userId, apiBook]);

   const clearRating = async () => {
      setRating(0);

      const data = await postBook(userId, { ...bookTemplate, rating: 0 });
      return setApiBook(data);
   };

   const handleRating = ({
      currentTarget: { value },
   }: {
      currentTarget: { value: string };
   }) => {
      if (!userId) {
         return navigate('/login');
      }

      setRating(Number(value));

      return postBook(userId, { ...bookTemplate, rating: Number(value) }).then(
         (data) => setApiBook(data)
      );
   };

   const handleClick = async ({
      currentTarget: { name },
   }: {
      currentTarget: { name: string };
   }) => {
      if (!userId) {
         return navigate('/login');
      }

      return postBook(userId, {
         ...bookTemplate,
         [name]: !bookTemplate[name as keyof Book],
      }).then((data) => setApiBook(data));
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
      !isLoading && (
         <div className="bookControls">
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
            <hr />
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
         </div>
      )
   );
}

export default BookControls;
