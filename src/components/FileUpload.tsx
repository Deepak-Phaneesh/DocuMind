'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
    onUploadSuccess: (fileId: string, fileName: string) => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError('Please upload a PDF file');
            return;
        }

        setIsUploading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.details || data.error || 'Upload failed';
                throw new Error(errorMsg);
            }

            setSuccess(true);
            onUploadSuccess(data.fileId, data.fileName);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload file. Please try again.';
            setError(errorMessage);
            console.error('Upload error:', err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <div className="relative group border-2 border-dashed border-zinc-700 hover:border-blue-500 rounded-xl transition-colors duration-300 bg-zinc-900/50 backdrop-blur-sm p-12 text-center cursor-pointer overflow-hidden">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <div className="space-y-4">
                    <div className="relative w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                        <AnimatePresence mode='wait'>
                            {isUploading ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                >
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                </motion.div>
                            ) : success ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                >
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                >
                                    <Upload className="w-8 h-8 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-zinc-100">
                            {isUploading ? 'Processing PDF...' : success ? 'PDF Ready!' : 'Drop your PDF here'}
                        </h3>
                        <p className="text-sm text-zinc-400">
                            {isUploading ? 'Parsing text and creating embeddings' : 'or click to browse'}
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm"
                >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </motion.div>
            )}
        </div>
    );
}
