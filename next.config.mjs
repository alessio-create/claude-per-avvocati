import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Next.js requires plugins as [name, options] tuples (strings) so the loader
    // can serialize them across the worker boundary. Direct imports break Turbopack.
    remarkPlugins: [
      ['remark-frontmatter', 'yaml'],
      'remark-gfm',
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
};

export default withMDX(nextConfig);
