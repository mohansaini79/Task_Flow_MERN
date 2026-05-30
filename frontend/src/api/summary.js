import api from './axios';

export const summaryAPI = {
  getToday: () => api.get('/summary/today'),
};
