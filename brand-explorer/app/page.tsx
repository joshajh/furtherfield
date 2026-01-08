import colors from "../../design-tokens/colors.json";
import typography from "../../design-tokens/typography.json";
import spacing from "../../design-tokens/spacing.json";
import components from "../../design-tokens/components.json";

type ColorToken = {
  value: string;
  type: string;
  description?: string;
};

type GradientToken = {
  value: string;
  type: string;
  description?: string;
};

function ColorSwatch({ name, color }: { name: string; color: ColorToken }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
      <div
        className="w-12 h-12 rounded border border-white/20 shrink-0"
        style={{ backgroundColor: color.value }}
      />
      <div className="min-w-0">
        <div className="font-mono text-sm text-treatment-acid">{name}</div>
        <div className="font-mono text-xs text-text-light/60 truncate">{color.value}</div>
        {color.description && (
          <div className="text-xs text-text-light/40 mt-0.5">{color.description}</div>
        )}
      </div>
    </div>
  );
}

function GradientSwatch({ name, gradient }: { name: string; gradient: GradientToken }) {
  return (
    <div className="rounded-lg overflow-hidden">
      <div
        className="h-20 w-full"
        style={{ background: gradient.value }}
      />
      <div className="p-3 bg-white/5">
        <div className="font-mono text-sm text-treatment-acid">{name}</div>
        {gradient.description && (
          <div className="text-xs text-text-light/40 mt-0.5">{gradient.description}</div>
        )}
      </div>
    </div>
  );
}

export default function BrandExplorer() {
  const colorTokens = colors.colors as Record<string, ColorToken>;
  const gradientTokens = colors.gradients as Record<string, GradientToken>;

  return (
    <main className="min-h-screen p-6 md:p-8">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Brand Explorer</h1>
        <p className="text-text-light/60">Furtherfield design tokens v{colors.meta.version}</p>
      </header>

      {/* Colors Section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-white/20">Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(colorTokens).map(([name, color]) => (
            <ColorSwatch key={name} name={name} color={color} />
          ))}
        </div>
      </section>

      {/* Gradients Section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-white/20">Gradients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(gradientTokens).map(([name, gradient]) => (
            <GradientSwatch key={name} name={name} gradient={gradient} />
          ))}
        </div>
      </section>

      {/* Typography Section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-white/20">Typography</h2>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-text-light/80">Font Families</h3>
          <div className="grid gap-3">
            {Object.entries(typography.typography.fontFamily).map(([name, font]) => (
              <div key={name} className="bg-white/5 rounded-lg p-4">
                <div className="font-mono text-sm text-treatment-acid mb-1">{name}</div>
                <div className="text-text-light/80 text-lg" style={{ fontFamily: font.value }}>
                  The quick brown fox jumps over the lazy dog
                </div>
                <div className="text-xs text-text-light/40 mt-2">{font.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-text-light/80">Font Sizes</h3>
          <div className="space-y-2">
            {Object.entries(typography.typography.fontSize).map(([name, size]) => (
              <div key={name} className="flex items-baseline gap-4 p-2 rounded bg-white/5">
                <span className="font-mono text-sm text-treatment-acid w-12">{name}</span>
                <span style={{ fontSize: size.value }}>Sample Text</span>
                <span className="text-xs text-text-light/40 ml-auto">{size.value} - {size.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacing Section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-white/20">Spacing & Layout</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-text-light/80">Container</h3>
            <div className="font-mono text-sm text-treatment-acid">{spacing.spacing.container.value}</div>
            <div className="text-xs text-text-light/40 mt-1">{spacing.spacing.container.description}</div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-text-light/80">Border Radius</h3>
            <div className="space-y-2">
              {Object.entries(spacing.borderRadius).map(([name, radius]) => (
                <div key={name} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 bg-treatment-acid"
                    style={{ borderRadius: radius.value }}
                  />
                  <span className="font-mono text-sm text-treatment-acid">{name}</span>
                  <span className="text-xs text-text-light/40">{radius.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-text-light/80">Border Width</h3>
            <div className="space-y-2">
              {Object.entries(spacing.borderWidth).map(([name, width]) => (
                <div key={name} className="flex items-center gap-3">
                  <div
                    className="w-8 bg-treatment-acid"
                    style={{ height: width.value }}
                  />
                  <span className="font-mono text-sm text-treatment-acid">{name}</span>
                  <span className="text-xs text-text-light/40">{width.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Components Section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-white/20">Components</h2>

        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-text-light/80">Tag</h3>
          <p className="text-text-light/50 text-sm mb-4">{components.components.tag.description}</p>
          <div className="bg-gradient-brand rounded-lg p-6">
            <div className="flex flex-wrap gap-3 items-center">
              <span className="tag tag-sm">Small</span>
              <span className="tag">Default</span>
              <span className="tag tag-lg">Large</span>
            </div>
          </div>
        </div>

        {/* Callout */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-text-light/80">Callout</h3>
          <p className="text-text-light/50 text-sm mb-4">{components.components.callout.description}</p>
          <div className="bg-gradient-brand rounded-lg p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="callout-sm">Small</span>
              <span className="callout">Default</span>
            </div>
          </div>
        </div>

        {/* Callout Underline */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-text-light/80">Callout Underline</h3>
          <p className="text-text-light/50 text-sm mb-4">{components.components.calloutUnderline.description}</p>
          <div className="bg-gradient-brand rounded-lg p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="callout-underline-sm">Small</span>
              <span className="callout-underline-sm">Multiple</span>
              <span className="callout-underline-sm">Items</span>
              <span className="callout-underline">Default</span>
            </div>
          </div>
        </div>

        {/* Color Treatments */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-text-light/80">Color Treatments</h3>
          <p className="text-text-light/50 text-sm mb-4">Background overlays for images and sections</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="aspect-square rounded-lg bg-treatment-dark flex items-center justify-center">
              <span className="font-mono text-sm text-white">dark</span>
            </div>
            <div className="aspect-square rounded-lg bg-treatment-light flex items-center justify-center">
              <span className="font-mono text-sm text-text-dark">light</span>
            </div>
            <div className="aspect-square rounded-lg bg-treatment-lemon flex items-center justify-center">
              <span className="font-mono text-sm text-text-dark">lemon</span>
            </div>
            <div className="aspect-square rounded-lg bg-treatment-acid flex items-center justify-center">
              <span className="font-mono text-sm text-text-dark">acid</span>
            </div>
          </div>
        </div>

        {/* Brand Gradient */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-text-light/80">Brand Gradient</h3>
          <p className="text-text-light/50 text-sm mb-4">Primary gradient with noise texture</p>
          <div className="bg-gradient-brand rounded-lg p-8 h-32 flex items-center justify-center">
            <span className="font-mono text-text-dark">.bg-gradient-brand</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 pt-6 mt-12">
        <p className="text-text-light/40 text-sm">
          Generated from @furtherfield/marketing canonical styles
        </p>
      </footer>
    </main>
  );
}
