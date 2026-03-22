import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // allowedDevOrigins is intentionally left empty here.
  // If you access the dev server from a non-localhost IP (e.g. WSL, VM, or local network),
  // add your IP locally but do NOT commit it:
  allowedDevOrigins: [],
};

export default nextConfig;
