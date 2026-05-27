import { mdxComponents } from './components/mdx/MDXComponents';

type MDXComponents = {
  [key: string]: React.ComponentType<any>;
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components, ...mdxComponents };
}
