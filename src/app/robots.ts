import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // Assuming API routes should not be indexed
    },
    sitemap: 'https://kingenious.xyz/sitemap.xml',
  }
}
