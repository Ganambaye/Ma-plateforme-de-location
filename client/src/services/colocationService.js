import api from './api';
export const colocationService = { getAll: () => api.get('/colocations'), create: (data) => api.post('/colocations', data) };
export default colocationService;
