import path from "path";
import type { NextConfig } from "next";

const projectRoot = __dirname;

const nextConfig: NextConfig = {
  turbopack: { root: projectRoot },
  webpack: (config, { dir }) => {
    const root = dir ?? projectRoot;
    const ourNodeModules = path.join(root, "node_modules");
    config.resolve ??= {};
    config.resolve.modules = [ourNodeModules, ...(config.resolve.modules ?? [])];
    config.resolve.alias = {
      ...config.resolve.alias,
      tailwindcss: path.join(ourNodeModules, "tailwindcss"),
    };
    return config;
  },
};

export default nextConfig;
