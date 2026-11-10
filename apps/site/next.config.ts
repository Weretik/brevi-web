import path from 'node:path';

import type { NextConfig } from 'next';

// Nx libraries live outside the app folder, so the workspace root is the build and tracing root.
const workspaceRoot = path.join(__dirname, '../..');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  outputFileTracingRoot: workspaceRoot,
  turbopack: {
    root: workspaceRoot,
  },
  experimental: {
    // The root layout sits under [locale], so unmatched URLs get a global 404 document rendered on the server.
    globalNotFound: true,
    // The «Заявка» form takes a brief or a layout up to 10 MB; the default limit of a Server Action body is 1 MB.
    serverActions: { bodySizeLimit: '11mb' },
  },
  async redirects() {
    return [{ source: '/', destination: '/uk', permanent: true }];
  },
};

export default nextConfig;
