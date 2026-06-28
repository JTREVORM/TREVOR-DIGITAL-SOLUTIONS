import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://trevordigitalsolutions.com'
  
  // Static routes
  const routes = [
    '',
    '/about',
    '/founder',
    '/leadership',
    '/services',
    '/projects',
    '/technologies',
    '/testimonials',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // You can fetch projects dynamically from Supabase here
  // const supabase = await createClient()
  // const { data: projects } = await supabase.from('projects').select('id, updated_at')
  // const projectUrls = projects?.map(project => ({
  //   url: `${baseUrl}/projects/${project.id}`,
  //   lastModified: new Date(project.updated_at),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.6
  // })) || []

  return [...routes]
}
