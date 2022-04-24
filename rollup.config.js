// @ts-check
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import replace from "@rollup/plugin-replace";

const production = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    served = true;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true
            });

            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        }
    };
}

let served = false;

/**
 * 
 * @param {string} input 
 * @param {string} output 
 * @returns 
 */
function createConfig(input, output) {
    return {
        input: `src/${input}.ts`,
        output: {
            sourcemap: !production,
            format: 'iife',
            name: 'app',
            file: `public/${output}/build.js`
        },
        inlineDynamicImports: true,
        plugins: [
            replace({
                sourceMap: !production,
                preventAssignment: true,

                isProduction: production
            }),

            svelte({
                preprocess: sveltePreprocess({
                    sourceMap: !production,
                }),
                compilerOptions: {
                    dev: !production,
                    filename: `public/${output}/build.js`
                }
            }),
            css({ output: `build.css` }),

            resolve({
                browser: true,
                dedupe: ['svelte']
            }),
            commonjs(),
            typescript({
                sourceMap: !production,
                inlineSources: !production,
                rootDir: "src",
                tsconfig: "./tsconfig.json"
            }),

            (!production && !served) && serve(),

            !production && livereload('public'),

            production && terser()
        ],
        watch: {
            clearScreen: false,
        }
    };
}

const config = [
    createConfig("tipping-point", "tipping-point/build"),
    createConfig("spin-up", "spin-up/build")
];

export default config;