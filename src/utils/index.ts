// This file contains utility functions that can be used throughout the application. 
// It exports functions or constants that assist with various tasks.

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const generateUniqueId = (): string => {
    return 'id-' + Math.random().toString(36).substr(2, 16);
};