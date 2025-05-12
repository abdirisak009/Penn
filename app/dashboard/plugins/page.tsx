'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { pluginService } from '../../services/api';
import ResourceForm from '../../components/forms/ResourceForm';

interface Plugin {
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

export default function PluginsPage() {
    const [plugins, setPlugins] = useState<Plugin[]>([]);
    const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchPlugins();
    }, []);

    const fetchPlugins = async () => {
        try {
            setLoading(true);
            const data = await pluginService.getAll();
            setPlugins(data);
        } catch (err) {
            setError('Failed to fetch plugins');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data: Omit<Plugin, '_id'>) => {
        try {
            await pluginService.create(data);
            setIsCreating(false);
            fetchPlugins();
        } catch (err) {
            throw new Error('Failed to create plugin');
        }
    };

    const handleUpdate = async (data: Omit<Plugin, '_id'>) => {
        if (!selectedPlugin) return;

        try {
            await pluginService.update(selectedPlugin._id, data);
            setSelectedPlugin(null);
            fetchPlugins();
        } catch (err) {
            throw new Error('Failed to update plugin');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this plugin?')) return;

        try {
            await pluginService.delete(id);
            fetchPlugins();
        } catch (err) {
            setError('Failed to delete plugin');
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
                <h1 className="text-2xl font-semibold text-gray-900">Plugins</h1>
                <button
                    onClick={() => setIsCreating(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    Add Plugin
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {isCreating && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium mb-4">Create New Plugin</h2>
                    <ResourceForm onSubmit={handleCreate} type="plugin" />
                </div>
            )}

            {selectedPlugin && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium mb-4">Edit Plugin</h2>
                    <ResourceForm
                        initialData={selectedPlugin}
                        onSubmit={handleUpdate}
                        type="plugin"
                    />
                </div>
            )}

            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">All Plugins</h3>
                </div>
                <div className="border-t border-gray-200">
                    {plugins.length === 0 ? (
                        <div className="px-4 py-5 text-center text-gray-500">
                            No plugins found. Click "Add Plugin" to create one.
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {plugins.map((plugin) => (
                                <li key={plugin._id} className="px-4 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{plugin.title}</p>
                                            <p className="text-sm text-gray-500 truncate">{plugin.category}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setSelectedPlugin(plugin)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(plugin._id)}
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