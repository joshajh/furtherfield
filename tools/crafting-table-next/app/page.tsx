import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  const apps = [
    {
      name: 'Social Graphics',
      description: 'Streamlined workflow for social media posts. Generate grids, apply colors, add text, and include data-driven footers in one unified interface.',
      href: '/social-generator',
      icon: '📱',
      status: 'Ready',
      featured: true,
    },
    {
      name: 'Grid Generator',
      description: 'Creates flexible grids with wave-like distortions based on real-time tidal data or ship movements at the Port of Felixstowe.',
      href: '/grid-generator',
      icon: '◫',
      status: 'Ready',
    },
    {
      name: 'Colorist',
      description: 'Applies color palettes, gradients, and generative noise to existing assets. Choose from maritime-inspired palettes or create custom schemes.',
      href: '/colorist',
      icon: '◨',
      status: 'Ready',
    },
    {
      name: 'Sprite Generator',
      description: 'Generates 8-bit pixel art representations of people, flora, and fauna. Creates trading-card-like symbols with procedural variations.',
      href: '/sprite-generator',
      icon: '◧',
      status: 'Ready',
    },
    {
      name: 'Mark Generator',
      description: 'Creates geometric marks that encode content-type and tags. Perfect for archival systems and visual knowledge management.',
      href: '/mark-generator',
      icon: '◪',
      status: 'Ready',
    },
    {
      name: 'Compositor',
      description: 'Combines outputs from multiple micro-apps into final compositions. Layer grids, sprites, colors, and marks with full control.',
      href: '/compositor',
      icon: '◰',
      status: 'Ready',
    },
    {
      name: 'Tide Table',
      description: 'Upload an asset and visualize the maritime conditions from when it was originally created. Extracts timestamps from EXIF/metadata and fetches historical tide data.',
      href: '/tide-table',
      icon: '🌊',
      status: 'New',
      featured: false,
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Crafting Table</h1>
          <p className="text-xl text-muted-foreground">
            Modular micro-apps for generative visual identity
          </p>
        </header>

        <div className="max-w-3xl mx-auto mb-16">
          <p className="text-center text-muted-foreground leading-relaxed">
            A suite of specialized tools for creating dynamic visual assets.
            Each app performs a specific task and can be used standalone or combined
            to create complex, data-driven designs rooted in Felixstowe&apos;s maritime environment.
          </p>
        </div>

        <div className="bg-secondary/30 rounded-lg p-8 mb-16">
          <h3 className="text-2xl font-semibold mb-6 text-center">Typical Workflow</h3>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {[
              { num: 1, title: 'Generate', subtitle: 'Grid or Sprite' },
              { num: 2, title: 'Colorize', subtitle: 'Apply palette' },
              { num: 3, title: 'Mark', subtitle: 'Add metadata' },
              { num: 4, title: 'Composite', subtitle: 'Combine layers' },
            ].map((step, i, arr) => (
              <div key={step.num} className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mb-2 mx-auto">
                    {step.num}
                  </div>
                  <div className="font-semibold">{step.title}</div>
                  <div className="text-sm text-muted-foreground">{step.subtitle}</div>
                </div>
                {i < arr.length - 1 && (
                  <div className="text-2xl text-muted-foreground hidden sm:block">→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <Link key={app.name} href={app.href}>
              <Card className={`h-full transition-all hover:shadow-lg hover:-translate-y-1 ${
                app.featured ? 'border-2 border-primary' : ''
              }`}>
                <CardHeader>
                  <div className="text-5xl mb-4">{app.icon}</div>
                  <CardTitle className="mb-2">{app.name}</CardTitle>
                  <CardDescription>{app.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant={app.featured ? 'default' : 'secondary'}>
                    {app.status}
                    {app.featured && ' · Most Popular'}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="mt-16">
          <CardHeader>
            <CardTitle>About This System</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              This tool suite embodies a tech-first, modular approach to visual identity design.
              Each app is self-contained and focused on a single task, but they share common
              data formats and can be composed together to create complex, dynamic assets.
            </p>
            <p>
              The tools are designed for a digital arts organisation based in Felixstowe, UK,
              incorporating real-world data from the local maritime environment to create
              unique, place-based generative artwork.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
