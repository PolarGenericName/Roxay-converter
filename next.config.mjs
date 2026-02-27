/** @type {import('next').NextConfig} */

/**
 * CONFIGURAÇÃO DO FRONTEND PARA DISCLOUD
 *
 * IMPORTANTE: Substitua 'BACKEND_SUBDOMAIN' pelo subdomínio real
 * que você registrou para o backend na Discloud.
 *
 * Exemplo: se o subdomínio do backend for 'roxay-backend',
 * a URL será 'https://roxay-backend.discloud.app'
 *
 * Você também pode definir a variável de ambiente NEXT_PUBLIC_API_URL
 * no painel do Discloud para evitar alterar este arquivo.
 */

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://meuappback.discloud.app';

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Rewrites: o Next.js faz proxy das chamadas /api/* para o backend Python
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_API_URL}/api/:path*`,
      },
    ]
  },
  // Headers de segurança adicionais
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
