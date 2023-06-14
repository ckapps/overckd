module.exports = {
  extends: '../../.eslintrc.js',
  ignorePatterns: [
    '!src/**/*"',
    // Don't lint output directories`
    'dist',
    'coverage',
  ],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@angular-eslint/ng-cli-compat',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/recommended--extra',
        'prettier',
      ],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        // These problems happen currently quite often in our code base
        // TODO: Resolve these problems, then enable
        '@typescript-eslint/no-unsafe-argument': ['error'],
        '@typescript-eslint/no-unsafe-assignment': ['error'],
        '@typescript-eslint/no-unsafe-call': ['error'],
        '@typescript-eslint/no-unsafe-member-access': ['error'],
        '@typescript-eslint/no-unsafe-return': ['error'],
        '@typescript-eslint/restrict-plus-operands': ['error'],
        // ------------------------------------------------
        '@angular-eslint/no-output-native': ['error'],
        '@typescript-eslint/ban-ts-comment': ['error'],
        '@typescript-eslint/consistent-type-definitions': [
          'error',
          'interface',
        ],
        '@typescript-eslint/dot-notation': 'off', // was disabled for tslint
        '@typescript-eslint/explicit-member-accessibility': [
          'off',
          {
            accessibility: 'explicit',
          },
        ],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            format: ['PascalCase'],
            selector: 'typeLike',
          },
          {
            format: ['StrictPascalCase'],
            selector: 'enumMember',
          },
          {
            format: ['camelCase', 'snake_case'],
            selector: 'objectLiteralProperty',
          },
          {
            // This is ignores properties on e.g. `HttpHeaders`
            selector: 'objectLiteralProperty',
            format: null,
            modifiers: ['requiresQuotes'],
          },
        ],
        '@typescript-eslint/no-floating-promises': ['error'],
        '@typescript-eslint/no-inferrable-types': [
          'error',
          {
            ignoreParameters: true,
          },
        ],
        '@typescript-eslint/no-shadow': [
          'error',
          {
            ignoreTypeValueShadow: true,
            ignoreFunctionTypeParameterNameValueShadow: true,
          },
        ],
        '@typescript-eslint/no-throw-literal': ['error'],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            args: 'none',
            caughtErrors: 'none',
            varsIgnorePattern: '^_', // usefull for array destructuring
          },
        ],
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/prefer-literal-enum-member': [
          'error',
          { allowBitwiseExpressions: true },
        ],
        '@typescript-eslint/prefer-regexp-exec': 'off',
        '@typescript-eslint/quotes': [
          'error',
          'single',
          {
            allowTemplateLiterals: true,
            avoidEscape: true,
          },
        ],
        '@typescript-eslint/restrict-template-expressions': [
          'warn',
          {
            allowAny: true,
            allowBoolean: true,
          },
        ],
        '@typescript-eslint/semi': ['error'],
        '@typescript-eslint/type-annotation-spacing': ['error'],
        '@typescript-eslint/unbound-method': [
          'error',
          {
            ignoreStatic: true, // For Angulars Validators
          },
        ],
        '@typescript-eslint/unified-signatures': 'error',
        'arrow-body-style': ['error', 'as-needed'],
        'constructor-super': 'error',
        curly: 'error',
        'deprecation/deprecation': 'warn',
        'dot-notation': 'off', // was disabled
        eqeqeq: 'error',
        'guard-for-in': 'error',
        'id-blacklist': 'off',
        'id-match': 'off',
        'jsdoc/newline-after-description': 'off',
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-console': ['error', { allow: ['log', 'warn', 'error'] }],
        'no-new-wrappers': 'error',
        'no-eval': 'error',
        'no-fallthrough': 'off',
        'no-labels': 'error',
        'no-shadow': 'off', // see @typescript-eslint/no-shadow
        'no-undef-init': 'error',
        'no-underscore-dangle': 'off',
        'no-unused-expressions': 'error',
        'no-throw-literal': 'off', // see @typescript-eslint/no-throw-literal
        'no-var': 'error',
        // Prefer arrow as a callback, but not for every function
        'prefer-arrow/prefer-arrow-functions': 'off',
        'prefer-arrow-callback': 'error',
        'prefer-const': 'error',
        quotes: 'off',
        radix: 'error',
        semi: 'error', // see @typescript-eslint/semi
        'spaced-comment': ['error', 'always', { exceptions: ['*'] }],
      },
    },
    {
      // Linting rules that target code that is meant to be deployed
      files: ['*.ts'],
      excludedFiles: [
        'index.ts',
        '*.spec.ts',
        '*.stories.ts',
        'test/**/*.ts',
        '__mocks__/**/*.ts',
      ],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['*.public-api'],
                message:
                  'Any *.public-api.ts file is an entry point. Use the actual source within the same library. Use the @fmnts/<lib> path when outside the library.',
              },
              {
                group: [
                  '*.spec',
                  '*.stories',
                  '**/test/**/*',
                  '**/testing/**/*',
                ],
                message: "Don't import tests/stories in production code.",
              },
            ],
          },
        ],
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {
        '@angular-eslint/template/eqeqeq': [
          'error',
          {
            allowNullOrUndefined: true,
          },
        ],
      },
    },
    {
      // Rules for test files
      files: [
        '*.spec.ts',
        '*.jest-mocks.ts',
        'setup-jest.ts',
        // Testing modules
        '**/testing/**',
      ],
      rules: {
        '@angular-eslint/component-class-suffix': 'off',
        '@angular-eslint/directive-class-suffix': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/naming-convention': 'off',
        // many errors right now with Angulars `waitForAsync`
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/unbound-method': 'off',
      },
    },
    {
      // Rules for configuration files
      files: ['**/jest.config.js', '**/jest.config.*.js'],
      parserOptions: {
        ecmaVersion: 2020,
      },
      env: {
        es6: true,
      },
    },
    {
      // Rules for proxy configuration files
      files: ['server/*.mjs'],
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
      },
      env: {
        es6: true,
      },
    },
  ],
};
