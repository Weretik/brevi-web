interface ApiEnvironment {
  production: boolean;
  api: {
    baseUrl: string;
  };
}

let apiEnvironment: ApiEnvironment = {
  production: false,
  api: {
    baseUrl: '',
  },
};

export function configureApiEnvironment(environment: ApiEnvironment): void {
  apiEnvironment = environment;
}

export function apiUrl(path: string): string {
  if (!apiEnvironment.production) return path;
  return `${apiEnvironment.api.baseUrl.replace(/\/$/, '')}${path}`;
}
