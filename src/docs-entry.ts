// Docs-only barrel so TypeDoc can include deprecated LegacyConfig
// without exporting it from the package root.
// Consumers import from package root, which intentionally hides LegacyConfig.

export type { Config } from './core/config/Config';
export * from './index';
export type { LegacyConfig } from './legacy/LegacyConfig';

