import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '@mdi/react';
import {
   mdiBookCheck,
   mdiBookCheckOutline,
   mdiHeart,
   mdiHeartOutline,
   mdiClockMinus,
   mdiClockPlusOutline,
   mdiLabelMultiple,
   mdiChevronDoubleDown,
   mdiChevronDoubleUp,
   mdiBookOpenPageVariant,
   mdiOfficeBuilding,
   mdiCalendarMonth,
   mdiStar,
   mdiClose,
} from '@mdi/js';
import axios from '../api/axios';
import Header from '../components/Header';
import NotFound from './NotFound';
import '../styles/BookPage.css';

function BookPage() {
   const navigate = useNavigate();
   const { id: bookId } = useParams();
   const { _id: id } = JSON.parse(localStorage.getItem('user'));
   const [isCollapsed, setIsCollaped] = useState(true);
   const [rating, setRating] = useState(0);
   const [book, setBook] = useState({});
   const [apiBook, setApiBook] = useState({
      id: '',
      title: '',
      cover: '',
      rating: 0,
      read: false,
      favorite: false,
      planning: false,
   });

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
         try {
            const response = await axios.get(`books/${id}/${bookId}`);

            if (!Object.keys(response.data).includes('error')) {
               setApiBook(response.data);
               setRating(response.data.rating);
            }
         } catch (err) {
            console.log(err);
         }
      };

      getBook();
   }, [id, bookId]);

   const handleDescription = () => {
      const descriptionBorder = document.querySelector(
         '.descriptionBorder'
      ) as HTMLElement;
      const bookDescription = document.querySelector(
         '.bookDescription'
      ) as HTMLElement;

      if (isCollapsed && bookDescription && descriptionBorder) {
         bookDescription.style.maxHeight = 'none';
         bookDescription.style.overflow = 'none';
         descriptionBorder.style.height = '1rem';
         descriptionBorder.style.position = 'initial';

         setIsCollaped(false);
      }

      if (!isCollapsed && bookDescription && descriptionBorder) {
         bookDescription.style.maxHeight = '27rem';
         bookDescription.style.overflow = 'hidden';
         descriptionBorder.style.height = '4rem';
         descriptionBorder.style.position = 'absolute';

         setIsCollaped(true);
      }
   };

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

   if (Object.keys(book).includes('error')) {
      return <NotFound />;
   }

   if (Object.keys(book).includes('volumeInfo')) {
      const {
         authors,
         categories,
         description,
         pageCount,
         publishedDate,
         publisher,
         title,
      } = book.volumeInfo;

      const fixedCategories =
         categories !== undefined
            ? [
                 ...new Set(
                    categories
                       .map((genre) => {
                          return genre.split(' / ');
                       })
                       .flat()
                 ),
              ]
            : undefined;

      const bookDescription = description.replace(/(?!<br>)(<([^>]+)>)/gi, '');

      return (
         <div>
            <Header />
            <div className="bookContainer">
               <div className="bookWrap">
                  <div className="bookSide">
                     <img
                        src={`https://books.google.com/books/content/images/frontcover/${bookId}?fife=w480-h690`}
                        alt={`${title}`}
                     />
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
                           <button
                              type="button"
                              name="favBtn"
                              onClick={(e) => handleClick(e)}
                           >
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
                                 <button
                                    type="button"
                                    onClick={() => setRating(0)}
                                 >
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
                                          <Icon
                                             className="selected"
                                             path={mdiStar}
                                             size={2}
                                          />
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
                     <div className="bookGenre">
                        <div className="bookGenreTitle">
                           <Icon path={mdiLabelMultiple} size={1} />
                           <span>Genres:</span>
                        </div>
                        {fixedCategories === undefined ? (
                           <p>Unknown</p>
                        ) : (
                           <p>{fixedCategories.join(', ')}</p>
                        )}
                     </div>
                  </div>
                  <div className="bookMain">
                     <div className="bookHeader">
                        <p className="bookTitle">{title}</p>
                        <a
                           href={`/search/${authors
                              .join('+')
                              .replace(' ', '+')}`}
                           className="bookAuthor"
                        >
                           {authors.join(', ')}
                        </a>
                     </div>
                     <div
                        dangerouslySetInnerHTML={{ __html: bookDescription }}
                        className="bookDescription"
                     />
                     {document.querySelector('.bookDescription')
                        ?.clientHeight >= 432 && (
                        <div className="descriptionBorder">
                           {isCollapsed ? (
                              <button type="button" onClick={handleDescription}>
                                 Show more{' '}
                                 <Icon path={mdiChevronDoubleDown} size={1} />
                              </button>
                           ) : (
                              <button type="button" onClick={handleDescription}>
                                 Show less{' '}
                                 <Icon path={mdiChevronDoubleUp} size={1} />
                              </button>
                           )}
                        </div>
                     )}
                     <div className="bookFooter">
                        <div className="bookFooterInfo">
                           <span>Page Count:</span>
                           <Icon path={mdiBookOpenPageVariant} size={1.5} />
                           {pageCount === undefined ? (
                              <p>Unknown</p>
                           ) : (
                              <p>{pageCount} pages</p>
                           )}
                        </div>
                        <div className="bookFooterInfo">
                           <span>Publisher:</span>
                           <Icon path={mdiOfficeBuilding} size={1.5} />
                           {publisher === undefined ? (
                              <p>Unknown</p>
                           ) : (
                              <p>{publisher}</p>
                           )}
                        </div>
                        <div className="bookFooterInfo">
                           <span>Published Date:</span>
                           <Icon path={mdiCalendarMonth} size={1.5} />
                           {publishedDate === undefined ? (
                              <p>Unknown</p>
                           ) : (
                              <p>{publishedDate}</p>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }
}

export default BookPage;
