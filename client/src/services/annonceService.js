import api from './api';
export const annonceService = { getAll: (filters = {}) => { const params = new URLSearchParams(filters).toString(); return api.get('/annonces?' + params); }, getOne: (id) => api.get('/annonces/' + id), create: (data) => api.post('/annonces', data) };
export default annonceService;
