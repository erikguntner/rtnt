module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    'jest-styled-components',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
};
