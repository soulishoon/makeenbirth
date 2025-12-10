/**
 * Helper function برای ساخت URL API
 * در development از proxy استفاده می‌کند
 * در production مستقیماً به سرور اصلی می‌رود
 */
const API_BASE_URL = 'https://panel.makeenacademy.ir';

export const getApiUrl = (path) => {
  // اگر path با / شروع می‌شود، آن را حذف کن
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // در development، از proxy استفاده می‌کنیم
  // در production، مستقیماً به سرور اصلی می‌رویم
  if (import.meta.env.DEV) {
    // در development، proxy در vite.config.js تنظیم شده
    return `/api/${cleanPath}`;
  } else {
    // در production، مستقیماً به سرور اصلی
    return `${API_BASE_URL}/api/${cleanPath}`;
  }
};

/**
 * Helper function برای fetch با مدیریت خطا
 */
export const apiFetch = async (path, options = {}) => {
  const url = getApiUrl(path);
  
  // اگر FormData است، Content-Type را تنظیم نکن (بگذار browser خودش تنظیم کند)
  const isFormData = options.body instanceof FormData;
  
  const defaultOptions = {
    headers: {
      'Accept': 'application/json',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      const text = await response.text();
      console.error("Server returned HTML instead of JSON:", text.substring(0, 200));
      throw new Error("RESPONSE_NOT_JSON");
    }
    throw new Error(`Server error: ${response.status}`);
  }

  // بررسی Content-Type قبل از پارس کردن JSON
  const contentType = response.headers.get("content-type");
  
  // اگر Content-Type مشخص است و JSON نیست، خطا بده
  if (contentType && !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Expected JSON but got:", contentType, text.substring(0, 200));
    throw new Error("RESPONSE_NOT_JSON");
  }

  // سعی کن JSON پارس کنی
  try {
    const text = await response.text();
    // اگر متن خالی است یا با < شروع می‌شود (HTML)، خطا بده
    if (!text || text.trim().startsWith("<!") || text.trim().startsWith("<html")) {
      console.error("Response is HTML, not JSON:", text.substring(0, 200));
      throw new Error("RESPONSE_NOT_JSON");
    }
    return JSON.parse(text);
  } catch (e) {
    if (e.message === "RESPONSE_NOT_JSON") {
      throw e;
    }
    console.error("Failed to parse JSON:", e);
    throw new Error("RESPONSE_NOT_JSON");
  }
};

