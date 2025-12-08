import React, { useRef } from "react";

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

const OtpInput: React.FC<Props> = ({ value, onChange }) => {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return; // Chỉ cho nhập số

    // Nếu người dùng dán (paste) nhiều ký tự 1 lúc vào ô này
    if (val.length > 1) {
      const chars = val.slice(0, 6).split("");
      const newOtp = [...value];

      for (let i = 0; i < chars.length && index + i < 6; i++) {
        newOtp[index + i] = chars[i] || "";
      }

      onChange(newOtp);

      // focus vào ô cuối cùng được điền
      const lastFilled = Math.min(index + chars.length - 1, 5);
      inputs.current[lastFilled]?.focus();
      return;
    }

    // Nhập từng ký tự
    const newOtp = [...value];
    newOtp[index] = val;
    onChange(newOtp);

    if (val && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-5 justify-center items-center">
      {value.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          inputMode="numeric"
          pattern="[0-9]*"
          ref={(el) => {
            inputs.current[index] = el;
          }}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => (e.target as HTMLInputElement).select()}
          className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      ))}
    </div>
  );
};

export default OtpInput;
