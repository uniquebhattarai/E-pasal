declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    NODE_ENV?: string;
    PORT?: string;
    MONGODB_URL?: string;
    JWT_SECRET?: string;
    REFRESH_TOKEN_SECRET?: string;
    CLOUD_NAME?: string;
    API_KEY?: string;
    API_SECRET?: string;
    FOLDER_NAME?: string;
    MAIL_HOST?: string;
    MAIL_USER?: string;
    MAIL_PASS?: string;
    FRONTEND_URL?: string;
    ESEWA_PRODUCT_CODE?: string;
    ESEWA_SECRET?: string;
    ESEWA_FORM_URL?: string;
    RENDER?: string;
  }

  interface Process {
    env: ProcessEnv;
    exit(code?: number): never;
    on(event: string, listener: (...args: any[]) => void): any;
    cwd(): string;
    platform: string;
    version: string;
    [key: string]: any;
  }
}

declare var process: NodeJS.Process;
