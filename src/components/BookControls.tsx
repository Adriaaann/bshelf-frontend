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

function BookControls() {
   const [book, setBook] = useState({});
   const [rating, setRating] = useState(0);
   const [apiBook, setApiBook] = useState({
      id: '',
      title: '',
      cover: '',
      rating: 0,
      read: false,
      favorite: false,
      planning: false,
   });

   const user = JSON.parse(localStorage.getItem('user') || '{}');

   const { _id: id } = user;
   const { id: bookId } = useParams();

   const navigate = useNavigate();

   useEffect(() => {
      const fetchBook = async () => {
         const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${bookId}`
         );

         const data = await response.json();

         setBook(data);
      };
      fetchBook();

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

   const handleClick = async ({ currentTarget: { name, value } }) => {
      if (!id) {
         navigate('/login');
      }

      const addBook = {
         id: bookId,
         title: book.volumeInfo.title,
         cover: `https://books.google.com/books/content/images/frontcover/${bookId}?fife=w480-h690`,
         rating: apiBook.rating,
         read: apiBook.read,
         favorite: apiBook.favorite,
         planning: apiBook.planning,
      };

      if (name === 'readBtn') {
         addBook.read = !addBook.read;
         addBook.rating = 0;
         setRating(0);
      }

      if (name === 'favBtn') {
         addBook.favorite = !addBook.favorite;
      }

      if (name === 'planBtn') {
         addBook.planning = !addBook.planning;
      }

      if (name === 'ratingBtn') {
         addBook.rating = value;
         addBook.read = true;
         setRating(value);
      }

      try {
         await axios.post(`books/${id}`, addBook);
         setApiBook(addBook);
      } catch (err) {
         console.log(err);
      }

      if (!addBook.read && !addBook.favorite && !addBook.planning) {
         try {
            await axios.delete(`books/${id}/${bookId}`);
         } catch (err) {
            console.log(err);
         }
      }
   };

   return (
      <div className="bookControls">
         <div className="bookButtons">
            <button
               type="button"
               name="readBtn"
               onClick={(e) => handleClick(e)}
            >
               {apiBook.read ? (
                  <>
                     <Icon
                        path={mdiBookCheck}
                        size={2}
                        style={{ color: 'var(--sunglow)' }}
                     />
                     <span className="checked">Read</span>
                  </>
               ) : (
                  <>
                     <Icon path={mdiBookCheckOutline} size={2} />
                     <span>Read</span>
                  </>
               )}
            </button>
            <button type="button" name="favBtn" onClick={(e) => handleClick(e)}>
               {apiBook.favorite ? (
                  <>
                     <Icon
                        path={mdiHeart}
                        size={2}
                        style={{ color: 'var(--red)' }}
                     />
                     <span className="checked">Favorite</span>
                  </>
               ) : (
                  <>
                     <Icon path={mdiHeartOutline} size={2} />
                     <span>Favorite</span>
                  </>
               )}
            </button>
            <button
               type="button"
               name="planBtn"
               onClick={(e) => handleClick(e)}
            >
               {apiBook.planning ? (
                  <>
                     <Icon
                        path={mdiClockMinus}
                        size={2}
                        style={{ color: 'var(--blue)' }}
                     />
                     <span className="checked">Planning</span>
                  </>
               ) : (
                  <>
                     <Icon path={mdiClockPlusOutline} size={2} />
                     <span>Planning</span>
                  </>
               )}
            </button>
         </div>
         <hr />
         <div className="bookRating">
            <div className="bookRatingButton">
               {rating > 0 && (
                  <button type="button" onClick={() => setRating(0)}>
                     <Icon path={mdiClose} size={0.5} />
                  </button>
               )}
               {[...Array(5)].map((star, i) => {
                  const ratingValue = i + 1;

                  return (
                     <label key={star} htmlFor={`ratingBtn${i}`}>
                        <input
                           type="radio"
                           name="ratingBtn"
                           id={`ratingBtn${i}`}
                           value={ratingValue}
                           onClick={(e) => handleClick(e)}
                        />
                        {ratingValue <= rating ? (
                           <Icon className="selected" path={mdiStar} size={2} />
                        ) : (
                           <Icon path={mdiStar} size={2} />
                        )}
                     </label>
                  );
               })}
            </div>
            <span>Rate</span>
         </div>
      </div>
   );
}

export default BookControls;
