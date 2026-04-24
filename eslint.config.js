import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import globals from 'globals';

export default [
	{
		ignores: [
			'dist/**',
			'node_modules/**',
			'hb_emulator_data/**',
			'.firebase/**',
			'functions/node_modules/**',
			'public/**',
			'*.log',
		],
	},

	js.configs.recommended,
	...pluginVue.configs['flat/recommended'],

	{
		files: ['**/*.{js,mjs,cjs,vue}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
			},
		},
		rules: {
			'no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			'preserve-caught-error': 'warn',
			'vue/multi-word-component-names': 'off',
			// 'vue/no-v-html': 'off',
		},
	},

	{
		files: ['functions/**/*.js', 'scripts/**/*.js', 'vite.config.js'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},

	eslintConfigPrettier,
];
