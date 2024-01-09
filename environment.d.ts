/* eslint-disable unused-imports/no-unused-vars */
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
    }
  }
}
