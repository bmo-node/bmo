import inject from '@b-mo/injector'

export default async ({ bundle: resolvedBundle }) => inject(resolvedBundle.config, resolvedBundle.dependencies)
