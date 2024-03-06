import i18n, { LanguageDetectorAsyncModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

import * as en from '../../assets/translations/en';

// Add additional language
const LANGUAGES = {
  en,
};

const LANG_CODES = Object.keys(LANGUAGES);

const LANGUAGE_DETECTOR: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: async callback => {
    try {
      const language = await AsyncStorage.getItem('user-language');
      if (!language) {
        const findBestAvailableLanguage =
          RNLocalize.findBestLanguageTag(LANG_CODES);

        callback(findBestAvailableLanguage?.languageTag || 'en');
        return undefined;
      } else {
        callback(language);
        return undefined;
      }
    } catch (error) {
      console.log('Error fetching Languages from asyncstorage ', error);
      callback('en');
      return undefined;
    }
  },
  cacheUserLanguage: (language: string) => {
    AsyncStorage.setItem('user-language', language);
  },
};

i18n
  // detect language
  .use(LANGUAGE_DETECTOR)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // set options
  .init({
    compatibilityJSON: 'v3',
    resources: LANGUAGES,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
  });

export default i18n;
