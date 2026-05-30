import api from './axios';

export const timeLogsAPI = {
  getAll: (params) => api.get('/timelogs', { params }),
  getRunning: () => api.get('/timelogs/running'),
  start: (taskId) => api.post('/timelogs/start', { taskId }),
  stop: (data) => api.post('/timelogs/stop', data),
};
