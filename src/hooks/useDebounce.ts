import { useState, useEffect } from 'react';

/**
 * Hook để trì hoãn việc cập nhật giá trị (debounce).
 * @param value Giá trị cần debounce (ví dụ: e.target.value)
 * @param delay Thời gian trì hoãn (mili giây)
 * @returns Giá trị đã được debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
  
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); 

  return debouncedValue;
}