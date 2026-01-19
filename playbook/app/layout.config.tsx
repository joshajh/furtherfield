import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <span className="font-mono text-sm uppercase tracking-wider">
        This Coastal Town / Planet Reimagined
      </span>
    ),
  },
  links: [
    {
      text: 'Playbook',
      url: '/docs',
      active: 'nested-url',
    },
    {
      text: 'Back to Main Site',
      url: 'https://thiscoastaltown.org',
      external: true,
    },
  ],
};
