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

   const fetchBooks = async (q: string, key: string) => {
      const response = await fetch(
         `https://www.googleapis.com/books/v1/volumes?q=${q}&printType=books&maxResults=40&key=${key}`
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

   useEffect(() => {
      fetchBooks(query as string, API_KEY);
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

                     const REMOVE_ALL_TAGS_BUT_BR = /(?!<br>)(<([^>]+)>)/gi;

                     const description = textSnippet.replace(
                        REMOVE_ALL_TAGS_BUT_BR,
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
