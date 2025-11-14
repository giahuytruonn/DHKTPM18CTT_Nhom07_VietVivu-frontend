import api from "./api";

export const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });

    const response = await api.post('/tours/upload-images', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.result;
};

export const deleteImageFromCloudinary = async (imageUrl: string): Promise<void> => {
    await api.delete('/tours/delete-image', {
        params: { imageUrl },
    });
};