import api from './api';

export const filtersService = {
  getQuartiers: () => api.get('/quartiers'),
  getPrix: () => api.get('/prix'),
  getAllOptions: async () => {
    const [q, p] = await Promise.all([api.get('/quartiers'), api.get('/prix')]);
    return { quartiers: q.data, prix: p.data };
  },
};

export default filtersService;
