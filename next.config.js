/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  compiler: {
    removeConsole: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  env: {
    NEXT_PUBLIC_ENV: "PRODUCTION",
    NEXT_PUBLIC_BASE_URL: "https://ivi-isb-backend.esmagico.net", //your next configs goes here
  },
  nextConfig,
  typescript: {
    ignoreBuildErrors: true,
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
});
