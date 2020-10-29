import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

const extensions = ['.js'];

export default [{
    input: './src/index.js',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
        },
        {
            file: pkg.module,
            format: 'esm',
        }
    ],
    plugins: [
        resolve({extensions}),
        babel({
            babelrc: false,
            exclude: '**/node_modules/**',
            presets: [
                ['@babel/preset-env', {loose: true, modules: false}],
                '@babel/preset-react'
            ]
        }),
        commonjs({
            exclude: 'src/**'
        }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
}];


