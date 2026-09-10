import path from 'node:path';

/**
 * Path to the live PM plugin. Site scripts (`npm run build`, `npm test`) run
 * with `site/` as cwd. Unit tests pass fixture roots into `loadInventory`
 * and must not use this constant.
 */
export const PM_PLUGIN_ROOT = path.resolve(
	process.cwd(),
	'../plugins/faktion-pm-skills',
);
