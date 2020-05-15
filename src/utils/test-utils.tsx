import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';

const WithAllProviders = ({ children }: { children: React.ReactElement }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) => render(ui, { wrapper: WithAllProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
