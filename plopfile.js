module.exports = function (plop) {
  // Feature generator
  plop.setGenerator('feature', {
    description: 'Generate a new feature module',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the feature name (e.g., posts, comments)?',
        validate: (input) => {
          if (!input) return 'Feature name is required';
          if (!/^[a-z]+$/.test(input)) return 'Feature name must be lowercase letters only';
          return true;
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/features/{{name}}/pages/{{properCase name}}Page.tsx',
        templateFile: 'plop-templates/page.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{name}}/components/{{properCase name}}List.tsx',
        templateFile: 'plop-templates/list-component.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{name}}/hooks/use{{properCase name}}.ts',
        templateFile: 'plop-templates/hook.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{name}}/graphql/{{name}}.graphql.ts',
        templateFile: 'plop-templates/graphql.hbs',
      },
    ],
  });
};
