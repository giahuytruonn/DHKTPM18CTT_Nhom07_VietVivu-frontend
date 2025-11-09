import React, { useState } from "react";
import { Heart, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    addFavoriteTour,
    removeFavoriteTour,
    checkFavoriteTour,
} from "../../services/favorite.services";
import { QUERY_KEYS } from "../../utiils/queryKeys";
import { useAuthStore } from "../../stores/useAuthStore";
import type { FavoriteTourRequest } from "../../types/favorite";

interface FavoriteButtonProps {
    tourId: string;
    className?: string;
    isRemovalMode?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    tourId,
    className = "",
    isRemovalMode = false,
}) => {
    const { token } = useAuthStore();
    const queryClient = useQueryClient();
    const [showConfirm, setShowConfirm] = useState(false);

    const { data: checkData, isLoading: isChecking } = useQuery({
        queryKey: QUERY_KEYS.FAVORITE_TOUR_CHECK(tourId),
        queryFn: () => checkFavoriteTour(tourId),
        enabled: !!token && !!tourId,
    });

    const isFavorite = checkData?.isFavorite ?? false;

    const removeMutation = useMutation({
        mutationFn: () => removeFavoriteTour(tourId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FAVORITE_TOUR_CHECK(tourId),
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FAVORITE_TOURS,
            });
            // Chỉ xóa query tour detail nếu không phải là isRemovalMode (để không load lại tour trên trang favorite)
            if (!isRemovalMode) {
                queryClient.removeQueries({ queryKey: QUERY_KEYS.TOUR(tourId) });
            }

            toast.success("Đã xóa khỏi danh sách yêu thích");
            setShowConfirm(false);
        },
        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.message || "Có lỗi xảy ra khi xóa";
            toast.error(errorMessage);
        },
    });

    const addMutation = useMutation({
        mutationFn: () => addFavoriteTour({ tourId } as FavoriteTourRequest),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FAVORITE_TOUR_CHECK(tourId),
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FAVORITE_TOURS,
            });
            toast.success("Đã thêm vào danh sách yêu thích");
        },
        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.message || "Có lỗi xảy ra khi thêm";
            toast.error(errorMessage);
        },
    });

    const isPending = isChecking || addMutation.isPending || removeMutation.isPending;

    if (!token) {
        return null;
    }

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        // Logic cho trường hợp: Đỏ (đã yêu thích) -> Hiển thị xác nhận Hủy
        if (isFavorite || isRemovalMode) {
            setShowConfirm(true);
        } 
        // Logic cho trường hợp: Xám (chưa yêu thích) -> Thêm ngay lập tức
        else {
            addMutation.mutate();
        }
    };
    
    const handleConfirmRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isPending) {
            removeMutation.mutate();
        }
    };

    // --- RENDER LOGIC ---
    
    // Logic hiển thị Pop-up xác nhận khi tour ĐÃ YÊU THÍCH (đỏ)
    const renderConfirmPopup = (isAbsolute: boolean = true) => (
        <div 
            onClick={(e) => e.stopPropagation()} // Ngăn chặn click lên item cha (tour card)
            className={`${isAbsolute ? 'absolute right-0 top-full mt-2' : ''} w-72 bg-white rounded-lg shadow-2xl p-4 border border-red-100 animate-in fade-in slide-in-from-top-1 z-50`}
        >
            <p className="text-sm font-semibold text-gray-700 mb-3">
                {isRemovalMode ? 
                    "Bạn có chắc muốn xóa tour này khỏi danh sách yêu thích?" :
                    "Tour này đã được thêm vào yêu thích. Bạn có muốn hủy?"
                }
            </p>
            <div className="flex justify-end gap-2">
                <button
                    onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
                    disabled={isPending}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                    Hủy
                </button>
                <button
                    onClick={handleConfirmRemove}
                    disabled={isPending}
                    className={`px-3 py-1 text-sm bg-red-500 text-white rounded ${removeMutation.isPending ? 'opacity-50' : 'hover:bg-red-600'} transition`}
                >
                    {removeMutation.isPending ? 'Đang xóa...' : 'Đồng ý xóa'}
                </button>
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
                className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-700"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
    
    // Chế độ dành cho FavoriteToursPage (Nút Đỏ lớn, luôn hỏi xác nhận)
    if (isRemovalMode) {
        return (
            <div className="relative z-10">
                <button
                    onClick={handleClick}
                    disabled={isPending && !showConfirm}
                    className={`p-2 rounded-full bg-red-500 text-white shadow-lg 
                                 hover:bg-red-600 transition-colors duration-200 
                                 disabled:opacity-50 ${className}`}
                    title="Xóa khỏi yêu thích"
                >
                    <Heart className="w-5 h-5 fill-current" />
                </button>

                {showConfirm && renderConfirmPopup()}
            </div>
        );
    }
    
    // Chế độ Bình thường (Xám -> Đỏ [add], Đỏ -> Xác nhận [remove])
    return (
        <div className="relative z-10">
            <button
                onClick={handleClick}
                disabled={isPending && !showConfirm}
                className={`${className} ${
                    isFavorite
                        ? "text-red-500 hover:text-red-600"
                        : "text-gray-400 hover:text-red-500"
                } transition-colors duration-200 disabled:opacity-50`}
                title={isFavorite ? "Hủy yêu thích" : "Thêm vào yêu thích"}
            >
                <Heart
                    className={`w-5 h-5 ${
                        isFavorite ? "fill-current" : ""
                    } transition-all duration-200`}
                />
            </button>

            {/* Hiển thị xác nhận khi isFavorite là true */}
            {showConfirm && isFavorite && renderConfirmPopup()}
        </div>
    );
};

export default FavoriteButton;