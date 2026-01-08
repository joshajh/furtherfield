import Link from 'next/link'

export default function Home() {
  const tools = [
    {
      name: 'Social Generator',
      description: 'Create carousel posts with dynamic marine data grids',
      href: '/social-generator',
    },
    {
      name: 'Grid Generator',
      description: 'Generate wave-distorted grids from live tidal and ship data',
      href: '/grid-generator',
    },
    {
      name: 'CMS',
      description: 'Admin interface for the Marketing app',
      href: 'https://example.com',
      external: true,
    },
  ]

  return (
    <main className="min-h-screen bg-[#F6F8FB]">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <header className="mb-16">
          <h1 className="text-4xl font-bold font-mono uppercase tracking-wide text-[#0F0E0E]">
            Crafting Table
          </h1>
          <p className="font-mono text-sm text-[#555659] mt-2">
            Tools for Reimagine This Coastal Town
          </p>
        </header>

        <div className="space-y-4">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              target={tool.external ? '_blank' : undefined}
              rel={tool.external ? 'noopener noreferrer' : undefined}
              className="block card-gradient rounded-md border border-[#0F0E0E] p-6 transition-all hover:bg-[rgba(200,255,0,0.15)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-mono text-lg font-semibold uppercase tracking-wider text-[#0F0E0E]">
                    {tool.name}
                  </h2>
                  <p className="font-mono text-sm text-[#555659] mt-1">
                    {tool.description}
                  </p>
                </div>
                <span className="font-mono text-xl text-[#555659]">
                  {tool.external ? '↗' : '→'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
