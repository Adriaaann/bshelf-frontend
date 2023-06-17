import axios from 'axios';

export default axios.create({
   baseURL: 'http://localhost:3333',
   // coloca a baseURL na env e chama aqui
});
