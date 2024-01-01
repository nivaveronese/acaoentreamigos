import axios from 'axios';

const apicep = axios.create({
    baseURL: 'https://viacep.com.br/ws'
});

export default apicep;