/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: "standalone",

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Configurações para o cliente - resolver módulos Node.js
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        fs: false,
        path: false,
        os: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        querystring: false,
        assert: false,
        buffer: false,
        util: false,
        events: false,
        dns: false,
        perf_hooks: false,
        child_process: false,
        cluster: false,
        dgram: false,
        module: false,
        readline: false,
        repl: false,
        string_decoder: false,
        timers: false,
        tty: false,
        v8: false,
        vm: false,
        worker_threads: false,
      };
    }
    return config;
  },
};

export default nextConfig;
