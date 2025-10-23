const isProd = !!import.meta.env.PROD

function debug(...args: unknown[]) {
  if (!isProd) console.debug(...args)
}

function info(...args: unknown[]) {
  if (!isProd) console.info(...args)
}

function warn(...args: unknown[]) {
  // always show warnings to help catch issues in production
  console.warn(...args)
}

function error(...args: unknown[]) {
  // always show errors so failures are visible in production
  console.error(...args)
}

export default {
  debug,
  info,
  warn,
  error,
}
