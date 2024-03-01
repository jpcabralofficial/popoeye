/* eslint-disable @typescript-eslint/no-namespace */
import { configureFonts, DefaultTheme } from 'react-native-paper';
import { COLORS } from '../utils/colors';
import { FONTS } from '../utils/fonts';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      [key: string]: any;
    }

    interface Theme {
      [key: string]: any;
    }
  }
}

export const theme = {
  ...DefaultTheme,

  fonts: configureFonts({
    default: {
      thin: {
        fontFamily: FONTS.thin,
        fontWeight: 'normal',
      },
      light: {
        fontFamily: FONTS.light,
        fontWeight: 'normal',
      },
      regular: {
        fontFamily: FONTS.regular,
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: FONTS.medium,
        fontWeight: 'normal',
      },
    },
  }),
  colors: {
    ...DefaultTheme.colors,
    ...COLORS,
  },
};
