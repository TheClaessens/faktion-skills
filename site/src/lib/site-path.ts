/**
 * Prefix a site-absolute path with Astro `base`.
 * Markdown generated at build time uses `SITE_BASE` in `source-docs.ts`
 * instead: that code runs before Vite defines `import.meta.env.BASE_URL`.
 */
export function withSiteBase(pathname: string): string {
	const raw = (import.meta.env.BASE_URL as string | undefined) ?? '/';
	const root = raw.replace(/\/$/, '');
	const suffix = pathname.startsWith('/') ? pathname : `/${pathname}`;
	return `${root}${suffix}`;
}
