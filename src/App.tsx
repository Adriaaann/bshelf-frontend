import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Account from './pages/Account';
import BookPage from './pages/BookPage';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Search from './pages/Search';
import Library from './pages/Library';

export function App() {
   return (
      <Routes>
         <Route path="/login" element={<Login />} />
         <Route path="/library" element={<Library />} />
         <Route path="/account" element={<Account />} />
         <Route path="/book/:id" element={<BookPage />} />
         <Route path="/createAccount" element={<Login />} />
         <Route path="/search/:query" element={<Search />} />
         <Route path="/" element={<Home />} />
         <Route path="*" element={<NotFound />} />
      </Routes>
   );
}

export function WrappedApp() {
   return (
      <BrowserRouter>
         <App />
      </BrowserRouter>
   );
}
