import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['C:/Users/VeRo656/Desktop/Cafeteria-Recommendation-Engine/src'], 

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        
        diagnostics: true, 
      },
    ],
  },

  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],

  clearMocks: true,


  coverageReporters: ['text', 'lcov'],

};

export default config;
