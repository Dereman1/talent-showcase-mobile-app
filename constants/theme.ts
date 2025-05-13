// constants/theme.ts
import { MD3DarkTheme as PaperDarkTheme } from 'react-native-paper';

export const DarkTheme = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    primary: '#1976d2', // blue primary
    background: '#121212', // app background
    surface: '#fff', // card background
    secondary: '#000',
    onSurface: '#ffffff',
    outline: '#888',
  },
};
