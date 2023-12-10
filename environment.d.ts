export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BASE_URL: string;
      NEXT_PUBLIC_BASE_URL_PATH: string;
      NEXT_PUBLIC_WEBSITE_URL: string;
      NEXT_PUBLIC_WEBSITE_URL_PATH: string;
    }
  }
}
