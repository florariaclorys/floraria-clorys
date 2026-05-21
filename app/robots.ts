import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/cos', '/comanda', '/confirmare'],
      },
    ],
    sitemap: 'https://myclorys.com/sitemap.xml',
  }
}
