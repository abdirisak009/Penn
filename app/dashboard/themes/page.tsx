'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { themeService } from '../../services/api';
import ResourceForm from '../../components/forms/ResourceForm';

interface Theme {
    _id: string;
    title: string;
    description: string;
    category: string;
    version: string;
    imageUrl: string;
    downloadUrl: string;
    previewUrl: string;
    lastUpdated: string;
}

export default function ThemesPage() {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchThemes();
    }, []);

    const fetchThemes = async () => {
        try {
            setLoading(true);
            const data = await themeService.getAll();
            setThemes(data);
        } catch (err) {
            setError('Failed to fetch themes');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data: Omit<Theme, '_id'>) => {
        try {
            await themeService.create(data);
            setIsCreating(false);
            fetchThemes();
        } catch (err) {
            throw new Error('Failed to create theme');
        }
    };

    const handleUpdate = async (data: Omit<Theme, '_id'>) => {
        if (!selectedTheme) return;

        try {
            await themeService.update(selectedTheme._id, data);
            setSelectedTheme(null);
            fetchThemes();
        } catch (err) {
            throw new Error('Failed to update theme');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this theme?')) return;

        try {
            await themeService.delete(id);
            fetchThemes();
        } catch (err) {
            setError('Failed to delete theme');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Themes</h1>
                <button
                    onClick={() => setIsCreating(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    Add Theme
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {isCreating && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium mb-4">Create New Theme</h2>
                    <ResourceForm onSubmit={handleCreate} type="theme" />
                </div>
            )}

            {selectedTheme && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium mb-4">Edit Theme</h2>
                    <ResourceForm
                        initialData={selectedTheme}
                        onSubmit={handleUpdate}
                        type="theme"
                    />
                </div>
            )}

            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">All Themes</h3>
                </div>
                <div className="border-t border-gray-200">
                    {themes.length === 0 ? (
                        <div className="px-4 py-5 text-center text-gray-500">
                            No themes found. Click "Add Theme" to create one.
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {themes.map((theme) => (
                                <li key={theme._id} className="px-4 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{theme.title}</p>
                                            <p className="text-sm text-gray-500 truncate">{theme.category}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setSelectedTheme(theme)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(theme._id)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
} 