susy-starter-pack
=================

Susy SCSS starter pack

Setup project

run bundle install
run npm install -g gulp
run npm install

run 'gulp watch' to start the express webserver with compass and livereload
run 'gulp' to build SCSS
add '--theme [theme-name]' to the 2 commands to set a custom theme, other than '_scaffold' (not used at the moment)

#run compass watch --sourcemap to generate CSS

## CTags

The project uses CTags to enable autocomplete in your favorite editor. A .ctags file was created in the root of the project to enable autocomplete over .scss files (it indexes mixins and variables).

Setup autocomplete (OS X):
  * install CTags using brew: `brew install ctags`
  * install a CTags plugin for your editor
  * get the path of the ctags binary (``echo `brew --prefix`"/bin/ctags"``) and set it in the editor's CTags plugin settings
  * some editors (e.g. Sublime Text) may require an additional setting to be activated to enable autocomplete using ctags (e.g. `"autocomplete": true`)
