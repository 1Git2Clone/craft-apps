// Static files only: caddy serves the build straight out of the pages volume.
export const prerender = true;

// /photocraft/ rather than /photocraft.html, which caddy's file_server would
// not find from /photocraft without a rewrite.
export const trailingSlash = 'always';
