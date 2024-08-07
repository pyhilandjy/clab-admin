import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        fontStyle: 'italic',
      },
    },
  },
});

export default theme;
