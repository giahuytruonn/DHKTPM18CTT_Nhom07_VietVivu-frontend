import React, { useMemo } from "react";

interface Props {
  password: string;
}

const PasswordStrengthBar: React.FC<Props> = ({ password }) => {
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const getLabel = () => {
    switch (strength) {
      case 1:
        return "Yếu";
      case 2:
        return "Trung bình";
      case 3:
        return "Mạnh";
      case 4:
        return "Rất mạnh";
      default:
        return "Quá ngắn";
    }
  };

  const getColor = (index: number) => {
    const colors = [
      "bg-red-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];
    return strength >= index + 1 ? colors[index] : "bg-gray-200";
  };

  return (
    <div className="mt-2">
      <div className="flex gap-2 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded transition-all ${getColor(i)}`}
          />
        ))}
      </div>

      <p
        className={`text-sm font-medium ${
          strength <= 1
            ? "text-red-600"
            : strength === 2
            ? "text-yellow-600"
            : strength === 3
            ? "text-blue-600"
            : "text-green-600"
        }`}
      >
        {getLabel()}
      </p>
    </div>
  );
};

export default PasswordStrengthBar;
