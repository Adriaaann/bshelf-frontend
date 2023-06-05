import { Link } from 'react-router-dom';

function NotFound() {
   return (
      <>
         <h1 style={{ color: 'white' }}>Not Found</h1>
         <Link style={{ color: 'white' }} to="/">
            GO HOME
         </Link>
      </>
   );
}

export default NotFound;
