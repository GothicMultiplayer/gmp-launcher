import {fixupConfigRules, includeIgnoreFile} from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import reactCompiler from 'eslint-plugin-react-compiler'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/electron",
    "plugin:import/typescript",
)), {
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },
        sourceType: "module",
        parser: tsParser,
    },
},
    {
        plugins: {
            'react-compiler': reactCompiler,
        },
        rules: {
            'react-compiler/react-compiler': 'error',
        },
    },
    includeIgnoreFile(gitignorePath),
    {
        files: ["**/*.ts", "**/*.tsx"]
    }
];