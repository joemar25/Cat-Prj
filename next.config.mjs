import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        turbo: {
            resolveAlias: {
                "@": path.resolve(__dirname, "src"),
                "@lottie": path.resolve(__dirname, "public/lottie"),
            }
        }
    }
};

export default nextConfig;