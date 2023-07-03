#!/usr/bin/env node

import esbuildServe from "esbuild-serve"
esbuildServe(
    {
        logLevel: "info",
        entryPoints: ["src/main.ts"],
        bundle: true,
        outfile: "www/main.js",
    },
    { root: "www" }
);
