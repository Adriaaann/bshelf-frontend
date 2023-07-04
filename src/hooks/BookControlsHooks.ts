import axios from '../api/axios';

interface Book {
   id: string;
   title: string;
   cover: string;
   rating: number;
   read: boolean;
   favorite: boolean;
   planning: boolean;
}

const fetchBook = async (bookId: string) => {
   const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${bookId}`
   );

   const book = await response.json();

   return { book, loading: false };
};

const getBook = async (userId: string, bookId: string) => {
   try {
      const response = await axios.get(`books/${userId}/${bookId}`);

      if (!Object.keys(response.data).includes('error')) {
         return response.data;
      }
   } catch (err) {
      console.log(err);
   }

   return {
      id: '',
      title: '',
      cover: '',
      rating: 0,
      read: false,
      favorite: false,
      planning: false,
   };
};

const verifyBook = async (userId: string, bookId: string, book: Book) => {
   if (book.title !== '' && !book.favorite && !book.planning && !book.read) {
      try {
         await axios.delete(`books/${userId}/${bookId}`);
      } catch (err) {
         console.log(err);
      }
      return 0;
   }
   return book.rating;
};

const postBook = async (userId: string, book: Book) => {
   try {
      await axios.post(`books/${userId}`, book);
   } catch (err) {
      console.log(err);
   }
   return book;
};

export { fetchBook, getBook, verifyBook, postBook };
