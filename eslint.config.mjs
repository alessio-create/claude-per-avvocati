// ESLint flat config for Next.js app - disables react-refresh rules
// The root config uses reactRefresh rules which break Next.js metadata exports
export default [
  {
    ignores: ['.next/**', 'node_modules/**', '.turbo/**'],
  },
];

