HSP
=================

HTML starter pack

## Setup & run the project

First you have to install the npm dependencies. To do this, run `npm install`.
The project is using gulp as a task-runner. There are quite a few tasks already in the gulpfile to help your workflow, take a look at the file to see what you can use and extend the file at your needs. I won't go into a lot of detail, everything is pretty clear by looking into the file, I just want to mention two things:

  - the `scripts` task is using browserify for bundling dependencies
  - the `styles` task is using ruby-sass to compile the scss files

You may need to change these tasks based on the needs of your project.

From version 3.9 gulpfiles can contain ES6 syntax and gulp will use Babel to compile the file (that's why the gulpfile isn't called `gulpfile.js` but `gulpfile.babel.js`). So, to run the project you'll need at least version 3.9 of gulp. I'll explain below how to run the project using the global gulp or the local one.

### Using global gulp

If your global gulp is at least version 3.9 then you can use it to run the project directly. Just run `gulp start-dev` to start a simple webserver, livereloading (using livereload) and watch over the scss and js files.

### Using local gulp

If your global gulp version is lower than 3.9 and you cannot update it, than you can use the local gulp version. We recommend this version because this way you can use different version of gulp on different projects. There are two ways to use your local gulp binary:

  1. Use the scripts from package.json. There is already a script created called `start-dev` which just runs `gulp start-dev`. By running gulp using these scripts, npm will use the local version installed in node_modules
  2. The local binary for gulp can be found in `node_modules/.bin/gulp`. You can use this binary to run your local gulp: `./node_modules/.bin/gulp start-dev`. As a quick tip, you can create an alias for `./node_modules/.bin/gulp` so you don't have to write it everytime. In OS X, for example, just add this to `~/.bash_profile`: `alias gulpl=./node_modules/.bin/gulp`, and now you can run `gulpl start-dev` to run the local gulp.

## CTags

The project uses CTags to enable autocomplete in your favorite editor. A .ctags file was created in the root of the project to enable autocomplete over .scss files (it indexes mixins and variables).

Setup autocomplete (OS X):
  * install CTags using brew: `brew install ctags`
  * install a CTags plugin for your editor
  * get the path of the ctags binary (``echo `brew --prefix`"/bin/ctags"``) and set it in the editor's CTags plugin settings
  * some editors (e.g. Sublime Text) may require an additional setting to be activated to enable autocomplete using ctags (e.g. `"autocomplete": true`)
