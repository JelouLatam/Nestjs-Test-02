import { FlatCompat } from '@eslint/eslintrc';
const compat = new FlatCompat({
  baseDirectory: __dirname,
});
export default [
  ...compat.extends('plugin:@nestjs/recommended'),
  ...compat.extends('plugin:@typescript-eslint/recommended'),
];
