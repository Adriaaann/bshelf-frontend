import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
   mdiLabelMultiple,
   mdiChevronDoubleDown,
   mdiChevronDoubleUp,
   mdiBookOpenPageVariant,
   mdiOfficeBuilding,
   mdiCalendarMonth,
} from '@mdi/js';
import Icon from '@mdi/react';
import Header from '../components/Header';
import NotFound from './NotFound';
import BookControls from '../components/BookControls';
import '../styles/BookPage.css';

function BookPage() {
   const [isLoading, setIsLoading] = useState(true);
   const [isCollapsed, setIsCollapsed] = useState(true);
   const [shouldCollapse, setShouldCollapse] = useState(false);
   const [book, setBook] = useState({
      volumeInfo: {
         authors: [],
         categories: [],
         description: '',
         pageCount: '',
         publishedDate: '',
         publisher: '',
         title: '',
      },
   });

   const user = JSON.parse(localStorage.getItem('user') || '{}');

   const { _id: id } = user;
   const { id: bookId } = useParams();

   useEffect(() => {
      const fetchBook = async () => {
         const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${bookId}`
         );

         const data = await response.json();

         setBook(data);

         const bookDescription = document.querySelector(
            '.bookDescription'
         ) as HTMLElement;

         if (bookDescription) {
            if (bookDescription.clientHeight >= 425) {
               setShouldCollapse(true);
            }
         }

         setIsLoading(false);
      };
      fetchBook();
   }, [id, bookId]);

   if (Object.keys(book).includes('error')) {
      return <NotFound />;
   }

   const {
      authors,
      categories,
      description,
      pageCount,
      publishedDate,
      publisher,
      title,
   } = book.volumeInfo;

   const fixedCategories = () => {
      const newArr: string[] = [
         ...new Set(
            categories
               .map((genre: string) => {
                  return genre.split(' / ');
               })
               .flat()
         ),
      ];
      return newArr.length > 1 ? newArr.join(', ') : newArr;
   };

   const bookDescription = description.replace(/(?!<br>)(<([^>]+)>)/gi, '');

   return (
      <div>
         <Header />
         {!isLoading && (
            <div className="container">
               <div className="bookWrap">
                  <div className="bookSide">
                     <img
                        src={`https://books.google.com/books/content/images/frontcover/${bookId}?fife=w480-h690`}
                        alt={`${title}`}
                     />
                     <BookControls />
                     <div className="bookGenre">
                        <div className="bookGenreTitle">
                           <Icon path={mdiLabelMultiple} size={1} />
                           <span>Genres:</span>
                        </div>
                        {fixedCategories === undefined ? (
                           <p>Unknown</p>
                        ) : (
                           <p>{fixedCategories()}</p>
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
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: bookDescription }}
                        className={
                           isCollapsed
                              ? 'bookDescription'
                              : 'bookDescription show'
                        }
                     />
                     {shouldCollapse && (
                        <div
                           className={
                              isCollapsed
                                 ? 'descriptionBorder'
                                 : 'descriptionBorder show'
                           }
                        >
                           {isCollapsed ? (
                              <button
                                 type="button"
                                 onClick={() => setIsCollapsed(false)}
                              >
                                 Show more{' '}
                                 <Icon path={mdiChevronDoubleDown} size={1} />
                              </button>
                           ) : (
                              <button
                                 type="button"
                                 onClick={() => setIsCollapsed(true)}
                              >
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
         )}
      </div>
   );
}

export default BookPage;
