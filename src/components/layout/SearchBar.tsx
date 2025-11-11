import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchTours } from "../../services/tour.service";
import type { TourResponse } from "../../types/tour";

interface Props {
  className?: string;
}

export default function SearchBar({ className }: Props) {
  const [keyword, setKeyword] = useState("");
  const { data: results = [], isFetching } = useQuery({
    queryKey: ["search", keyword],
    queryFn: () => searchTours({ keyword }),
    enabled: keyword.length > 2,
    staleTime: 60_000,
  });

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white rounded-full shadow-lg p-2 flex items-center">
        <div className="flex-1 flex items-center px-4">
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            type="text"
            placeholder="Tìm tour, địa điểm, hoạt động..."
            className="w-full outline-none text-gray-700"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 font-medium">
          Tìm kiếm
        </button>
      </div>

      {keyword && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
          {isFetching ? (
            <p className="p-4 text-gray-500">Đang tìm...</p>
          ) : results.length > 0 ? (
            results.map((t: TourResponse) => (
              <Link
                key={t.tourId}
                to={`/tours/${t.tourId}`}
                className="block p-3 hover:bg-gray-50 border-b last:border-0"
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{t.title}</h4>
                    <p className="text-sm text-gray-600">{t.destination}</p>
                  </div>
                  <span className="text-indigo-600 font-medium">
                    {t.priceAdult.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="p-4 text-gray-500 text-center">Không tìm thấy</p>
          )}
        </div>
      )}
    </div>
  );
}
