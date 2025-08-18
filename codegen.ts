import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.VITE_API_URL || 'http://localhost:4000/graphql',
  documents: ['src/**/*.graphql'],
  generates: {
    'src/graphql/generated/index.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
        maybeValue: 'T | null',
        avoidOptionals: true,
        withHooks: true,
        withComponent: false,
        withHOC: false,
        reactApolloVersion: 3,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
};

export default config;
