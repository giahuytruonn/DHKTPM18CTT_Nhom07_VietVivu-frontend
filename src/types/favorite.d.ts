/**
 * Request để thêm tour vào danh sách yêu thích
 */
export interface FavoriteTourRequest {
  tourId: string;
}

/**
 * Response chứa danh sách tour yêu thích
 */
export interface FavoriteTourResponse {
  favoriteTourIds: string[];
}

/**
 * Response khi kiểm tra tour có trong danh sách yêu thích
 */
export interface FavoriteTourCheckResponse {
  isFavorite: boolean;
}

