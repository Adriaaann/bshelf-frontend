import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import '../styles/Search.css';

interface Book {
   id: string;
   selfLink: string;
   volumeInfo: {
      title: string;
      authors: string[];
      categories: string[];
      pageCount: number;
   };
   searchInfo: {
      textSnippet: string;
   };
}

function Search() {
   const { query } = useParams();
   const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

   const [books, setBooks] = useState<Book[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchBooks = async () => {
         const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&printType=books&maxResults=40&key=${API_KEY}`
         );

         const { items } = await response.json();

         const filteredBooks = items.filter((item: Book) => {
            const {
               volumeInfo: { authors, categories, pageCount },
               searchInfo,
            } = item;

            return (authors && categories && searchInfo) !== undefined &&
               pageCount > 10
               ? item
               : undefined;
         });
         setBooks(filteredBooks);
         setIsLoading(false);
      };
      fetchBooks();
   }, [query, API_KEY]);

   return (
      <>
         <Header />
         {!isLoading && (
            <div className="container">
               <div className="resultsName">
                  <p>
                     Showing results for{' '}
                     <span>{`"${query?.replaceAll('+', ' ')}"`}</span>
                  </p>
               </div>
               <div className="resultsWrapper">
                  {books.map((book: Book) => {
                     const {
                        id,
                        volumeInfo: { title, authors },
                        searchInfo: { textSnippet },
                     } = book;

                     const description = textSnippet.replace(
                        /(?!<br>)(<([^>]+)>)/gi,
                        ''
                     );

                     return (
                        <div className="resultsBook" key={id}>
                           <a href={`/book/${id}`}>
                              <img
                                 src={`https://books.google.com/books/content/images/frontcover/${id}?fife=w480-h690`}
                                 alt={title}
                              />
                           </a>
                           <div className="resultsInfo">
                              <a href={`/book/${id}`}>
                                 <p className="resultsTitle">{title}</p>
                              </a>
                              <p className="resultsAuthors">
                                 {authors.join(', ')}
                              </p>
                              <p
                                 // eslint-disable-next-line react/no-danger
                                 dangerouslySetInnerHTML={{
                                    __html: description,
                                 }}
                                 className="resultsDescription"
                              />
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         )}
      </>
   );
}

export default Search;
