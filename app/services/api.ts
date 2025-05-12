import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth services
export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    register: async (username: string, email: string, password: string) => {
        const response = await api.post('/auth/register', { username, email, password });
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

// Theme services
export const themeService = {
    getAll: async () => {
        const response = await api.get('/themes');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/themes/${id}`);
        return response.data;
    },
    create: async (themeData: any) => {
        const response = await api.post('/themes', themeData);
        return response.data;
    },
    update: async (id: string, themeData: any) => {
        const response = await api.put(`/themes/${id}`, themeData);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/themes/${id}`);
        return response.data;
    },
};

// Plugin services
export const pluginService = {
    getAll: async () => {
        const response = await api.get('/plugins');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/plugins/${id}`);
        return response.data;
    },
    create: async (pluginData: any) => {
        const response = await api.post('/plugins', pluginData);
        return response.data;
    },
    update: async (id: string, pluginData: any) => {
        const response = await api.put(`/plugins/${id}`, pluginData);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/plugins/${id}`);
        return response.data;
    },
}; 