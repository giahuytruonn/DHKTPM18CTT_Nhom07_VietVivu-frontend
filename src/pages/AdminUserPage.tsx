import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  updateUserStatus,
  createUser,
  updateUser,
} from "../services/user.service";
import {
  Search,
  Plus,
  Edit,
  UserCheck,
  UserX,
  X,
  Save,
  Loader,
  Mail,
  Phone,
  MapPin,
  User as UserIcon,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import type { UserResponse, UserCreationRequest, UserUpdateRequest } from "../types/user";

const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  // Fetch users with proper default value
  const { data: usersData, isLoading, isError, error } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: getAllUsers,
    staleTime: 1000 * 60 * 5,
  });

  // Ensure users is always an array
  const users = useMemo(() => {
    if (!usersData) return [];
    if (Array.isArray(usersData)) return usersData;
    // Handle case where data might be wrapped in an object
    if (usersData.data && Array.isArray(usersData.data)) return usersData.data;
    return [];
  }, [usersData]);

  // Filter users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search filter
    if (searchKeyword) {
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          user.phoneNumber?.includes(searchKeyword)
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      result = result.filter((user) =>
        statusFilter === "ACTIVE" ? user.isActive : !user.isActive
      );
    }

    return result;
  }, [users, searchKeyword, statusFilter]);

  // Toggle user status
  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      updateUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success("Cập nhật trạng thái thành công!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleToggleStatus = (user: UserResponse) => {
    const newStatus = !user.isActive;
    const action = newStatus ? "kích hoạt" : "khóa";
    
    if (window.confirm(`Bạn có chắc muốn ${action} tài khoản "${user.username}"?`)) {
      toggleStatusMutation.mutate({ userId: user.id, isActive: newStatus });
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        Hoạt động
      </span>
    ) : (
      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        Đã khóa
      </span>
    );
  };

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : "Không thể tải danh sách người dùng"}
          </p>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ["adminUsers"] })}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="animate-spin w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải danh sách người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Tài Khoản</h1>
          <p className="text-gray-600 mt-1">
            Tổng cộng {filteredUsers.length} tài khoản
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Thêm Tài Khoản
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, SĐT..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="INACTIVE">Đã khóa</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Số điện thoại
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{user.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{user.phoneNumber}</span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(user.isActive)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isActive
                            ? "hover:bg-red-50 text-red-600"
                            : "hover:bg-green-50 text-green-600"
                        }`}
                        title={user.isActive ? "Khóa tài khoản" : "Kích hoạt"}
                      >
                        {user.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy người dùng nào</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedUser(null);
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
          }}
        />
      )}
    </div>
  );
};

// Create User Modal Component
const CreateUserModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<UserCreationRequest>({
    username: "",
    password: "",
    email: "",
    name: "",
    phoneNumber: "",
    address: "",
  });

  const createMutation = useMutation({
    mutationFn: (data: UserCreationRequest) => createUser(data),
    onSuccess: () => {
      toast.success("Tạo tài khoản thành công!");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Tạo Tài Khoản Mới</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <UserIcon className="w-4 h-4" />
              Tên đăng nhập *
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="username"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Lock className="w-4 h-4" />
              Mật khẩu *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <UserIcon className="w-4 h-4" />
              Họ và tên *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4" />
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4" />
              Số điện thoại *
            </label>
            <input
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="0912345678"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Địa chỉ
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Địa chỉ (không bắt buộc)"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Tạo tài khoản
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit User Modal Component
const EditUserModal: React.FC<{
  user: UserResponse;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<UserUpdateRequest>({
    name: user.name || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    address: user.address || "",
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserUpdateRequest) => updateUser(user.id, data),
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành công!");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Chỉnh Sửa Thông Tin</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <UserIcon className="w-4 h-4" />
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={user.username}
              disabled
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <UserIcon className="w-4 h-4" />
              Họ và tên
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4" />
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Địa chỉ
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUsersPage;