// client-side helper for language retrieval

export function getCurrentLanguage() {
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('language');
      console.log('Selected Language from localStorage:', storedLanguage);
      return storedLanguage === 'fil' ? 'fil' : 'en';
    }
    return 'en'; // Fallback for SSR
  }
  