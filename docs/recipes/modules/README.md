#BMO Modules

BMO modules are meant to provide a better alternative to `import` statements.

The problem with import statements is they tightly couple your code to a package. So if a package is
deprecated or needs to be swapped out for some reason you need to hunt down every reference to it
and update then possibly requiring more code changes if the new interface does not match the old interface.

Using BMO modules and the [dependency injector](/packages/injector/)
