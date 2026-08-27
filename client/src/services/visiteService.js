import api from './api';
export const visiteService = { create: (data) => api.post('/visites', data), getMyVisites: () => api.get('/visites/mes-visites'), updateStatut: (id, statut) => api.put('/visites/' + id + '/statut', { statut }), cancel: (id) => api.put('/visites/' + id + '/cancel') };
export default visiteService;
