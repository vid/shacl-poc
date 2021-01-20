"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    roots: [
        '<rootDir>/src'
    ],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
};
exports.default = config;
