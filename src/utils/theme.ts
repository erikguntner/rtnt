import { createGlobalStyle } from 'styled-components';

export const theme = {
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  navHeight: '6.4rem',
  colors: {
    primary: '#0070f3',
    lightGrey: '#e4e7eb',
    darkBlue: '#2d3748',
    gray: {
      100: '#f7fafc',
      200: '#edf2f7',
      300: '#e2e8f0',
      400: '#cbd5e0',
      500: '#a0aec0',
      600: '#718096',
      700: '#4a5568',
      800: '#2d3748',
      900: '#1a202c',
    },
    red: {
      100: '#fff5f5',
      200: '#fed7d7',
      300: '#feb2b2',
      400: '#fc8181',
      500: '#f56565',
      600: '#e53e3e',
      700: '#c53030',
      800: '#9b2c2c',
      900: '#742a2a',
    },
    orange: {
      100: '#fffaf0',
      200: '#feebc8',
      300: '#fbd38d',
      400: '#f6ad55',
      500: '#ed8936',
      600: '#dd6b20',
      700: '#c05621',
      800: '#9c4221',
      900: '#7b341e',
    },
    yellow: {
      100: '#fffff0',
      200: '#fefcbf',
      300: '#faf089',
      400: '#f6e05e',
      500: '#ecc94b',
      600: '#d69e2e',
      700: '#b7791f',
      800: '#975a16',
      900: '#744210',
    },
    green: {
      100: '#f0fff4',
      200: '#c6f6d5',
      300: '#9ae6b4',
      400: '#68d391',
      500: '#48bb78',
      600: '#38a169',
      700: '#2f855a',
      800: '#276749',
      900: '#22543d',
    },
    teal: {
      100: '#e6fffa',
      200: '#b2f5ea',
      300: '#81e6d9',
      400: '#4fd1c5',
      500: '#38b2ac',
      600: '#319795',
      700: '#2c7a7b',
      800: '#285e61',
      900: '#234e52',
    },
    blue: {
      100: '#ebf8ff',
      200: '#bee3f8',
      300: '#90cdf4',
      400: '#63b3ed',
      500: '#4299e1',
      600: '#3182ce',
      700: '#2b6cb0',
      800: '#2c5282',
      900: '#2a4365',
    },
    newBlues: {
      100: '#ebf8ff',
      200: '#b6e1fd',
      300: '#85c7fe',
      400: '#54acfe',
      500: '#238ffb',
      600: '#0070f3',
    },
    indigo: {
      100: '#ebf4ff',
      200: '#c3dafe',
      300: '#a3bffa',
      400: '#7f9cf5',
      500: '#667eea',
      600: '#5a67d8',
      700: '#4c51bf',
      800: '#434190',
      900: '#3c366b',
    },
    purple: {
      100: '#faf5ff',
      200: '#e9d8fd',
      300: '#d6bcfa',
      400: '#b794f4',
      500: '#9f7aea',
      600: '#805ad5',
      700: '#6b46c1',
      800: '#553c9a',
      900: '#44337a',
    },
    pink: {
      100: '#fff5f7',
      200: '#fed7e2',
      300: '#fbb6ce',
      400: '#f687b3',
      500: '#ed64a6',
      600: '#d53f8c',
      700: '#b83280',
      800: '#97266d',
      900: '#702459',
    },
  },
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl:
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
    outlineError: '0 0 0 3px #fed7d7',
    bottom: '0 4px 6px -6px rgba(0, 0, 0, 0.1), 0 2px 4px -4px rgba(0, 0, 0, 0.06)',
    none: 'none',
  },
  fontFamily: {
    sans:
      'Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'Menlo,Monaco, Consolas,"Liberation Mono","Courier New", monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '4rem',
  },
  fontWeight: {
    hairline: '100',
    thin: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '1.2rem',
    lg: '1.6rem',
    xl: '2.4rem',
    '2xl': '3.2rem',
    '3xl': '4.8rem',
  },
};

type ThemeType = typeof theme;

export const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
  html {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    font-size: 10px;
  }

  * {
    margin: 0;
    padding: 0;
    line-height: 1.6;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    /* font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale; */
    font-family: ${props => props.theme.fontFamily.sans};
    color: #1a202c;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  #__next {
    width: 100%;
    height: 100%;
  }

  .mapboxgl-canvas {
    &:focus {
      outline: 1px solid blue;
    }
  }

  .mapboxgl-ctrl-top-right {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    right: auto;
    top: 10.3rem;
  }

  @media only screen and (max-width: 800px) {
    .mapboxgl-ctrl-top-right {
      top: 19.2rem;
    }
  }

  #nprogress {
    pointer-events: none;
  }

  #nprogress .bar {
    position: fixed;
    z-index: 2000;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
  }

  #nprogress .bar {
    background-color: ${props => props.theme.colors.teal[400]};
  }

  #nprogress .peg {
    box-shadow: 0 0 10px #fff, 0 0 5px #fff;
  }

  .date-picker {

    &-wrapper {
      padding: 1rem;
      font-size: 1.6rem;
      border-left: 1px solid ${props => props.theme.colors.gray[400]};
      border-top: 1px solid ${props => props.theme.colors.gray[400]};
      border-bottom: 1px solid ${props => props.theme.colors.gray[400]};
      border-right: none;
      border-radius: 2px 0 0 2px;
      z-index: 2000;

      @media screen and (max-width: ${(props) => props.theme.screens.md}) {
        margin-bottom: 1.6rem;
        border-right: 1px solid ${props => props.theme.colors.gray[400]};
      }

      &:focus {
        outline: none;
        box-shadow: ${props => props.theme.boxShadow.outline};
      }
    }

    &-calendar {
      width: 200px;
      font-size: 1.2rem;
    }
  }

  .react-datepicker{
    border: 1px solid ${props => props.theme.colors.gray[400]};
    color: ${props => props.theme.colors.gray[900]};

    &-wrapper {
      @media screen and (max-width: ${(props) => props.theme.screens.md}) {
        width: 100%;
      }
    }

    &__input-container {
      & > input {
        @media screen and (max-width: ${(props) => props.theme.screens.md}) {
          width: 100%;
        }
      }
    }
  

    &-popper {
      z-index: 2000;
    }

    &__triangle {
      border-bottom-color: ${props => props.theme.colors.gray[400]};

      &:before {
        border-bottom-color: ${props => props.theme.colors.gray[400]};
      }
    }

    &__header {
      background-color: ${props => props.theme.colors.gray[100]};
      color: ${props => props.theme.colors.gray[900]};
      border-bottom: 1px solid ${props => props.theme.colors.gray[400]};
    }

    &__month-container {
      width: 100%;
      color: ${props => props.theme.colors.gray[900]};
    }

    &__current-month {
      color: ${props => props.theme.colors.gray[900]};
      font-size: 1.4rem;
    }

    &__week {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__day {
      border-radius: 2px;
      width: 2.4rem;
      padding: 4px;
      color: ${props => props.theme.colors.gray[800]};

      &:hover {
        background-color: ${props => props.theme.colors.gray[100]};
      }

      &-names {
        display: flex;
        justify-content: space-around;
      }

      &--selected {
        background-color: ${props => props.theme.colors.primary};
        color: #fff;

        &:hover {
          background-color: ${props => props.theme.colors.newBlues[500]};
        }
      }

      &--disabled {
        color: ${props => props.theme.colors.gray[400]};
        &:hover {
          background-color: #fff;
        }
      }
    }
  }
`;
