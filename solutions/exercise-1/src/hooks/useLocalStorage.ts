import {useState} from "react";

export const useLocalStorage = (key: string) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(key, JSON.stringify(null));
        return null;
      }
    } catch (err) {
      return null;
    }
  });

  const setValue = (newValue: any) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (err) {
      console.log(err);
    }
    setStoredValue(newValue);
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.log(err);
    }
    setStoredValue(null);
  };

  return [storedValue, setValue, removeValue];
}