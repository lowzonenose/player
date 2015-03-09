- - -
# Information

<pre><code>
{
  "name": "playergroundjs",
  "version": "1.0.0",
  "description": "",
  "license": "Copyright (c) IGN, released under the BSD license",
  "author": "lowzonenose <jpbazonnais@gmail.com>",
}
</pre></code>

- - -
# Repository

<pre><code>
{
    "type": "git",
    "url": "https://github.com/lowzonenose/player.git"
}
</pre></code>

- - -
# Dependencies

<pre><code>
{
    "gulp": "^3.8.11 ",
    "gulp-clean": "^0.3.1",
    "gulp-concat": "^2.2.0",
    "gulp-rename": "^1.2.0",
    "gulp-util": "~3.0.4",
    "gulp-uglify": "~1.1.0",
    "gulp-minify-css": "~0.4.6",
    "gulp-jshint": "~1.9.2",
    "gulp-requirejs-optimize": "^0.1.2",
    "gulp-bower-normalize": "~1.0.4",
    "gulp-jasmine": "~2.0.0",
    "minimist": "~1.1.0",
    "imagemin": "~3.1.0",
    "main-bower-files": "~2.5.0",
    "bower": "~1.3.12",
    "gulp-bower": "0.0.10",
    "karma": "~0.12.31",
    "karma-chrome-launcher": "~0.1.7",
    "jasmine-core": "~2.2.0",
    "karma-jasmine": "~0.3.5",
    "requirejs": "~2.1.16",
    "karma-requirejs": "~0.2.2",
    "karma-firefox-launcher": "~0.1.4",
    "gulp-jsdoc": "~0.1.4"
}
</pre></code>

- - -
# Build

## Directory Source

<pre><code>
.
├── .bowerrc
├── .npmrc
├── bower_components/
├── bower_dependencies/
├── bower.json
├── gulpfile.js
├── karam.conf.js
├── karma-main.js
├── node_modules/
├── package.json
├── README
├── target/
└── ...
</pre></code>

## Command

> npm install
> bower install
> gulp

avec gestion du proxy

> npm install   --proxy http://host:port
> bower install --proxy http://host:port
> gulp

ou 

> npm install   --https-proxy http://host:port
> bower install --https-proxy http://host:port
> gulp

## Options

> gulp --dev --check --test --doc --sample --download

* dev      : cette option desactive les taches d'optimisation
* check    : controle synthaxique des JS
* test     : execution des tests
* doc      : documentation JSdoc
* sample   : deployer des exemples
* download : tétélchargement des dependances externes via bower (ex. jquery)

## Directory Target

<pre><code>
├── doc
│   └── *.html
├── js
│   ├── cfg
│   │   └── *.js
│   ├── external
│   │   └── *.js
│   ├── main.css
│   ├── main.js
│   ├── modules
│   │   ├── img
│   │   └── style
│   └── thirdparty
│       └── codemirror
│             └── *.*
├── samples
│   ├── 3d
│   ├── archives
│   │   └── *.zip
│   ├── README
│   ├── sample_1
│   ├── sample_2
│   ├── sample_3
│   ├── sample_4
│   └── sample_5
└── template.html
</pre></code>

- - -
# Link

* [cdn] [1]
* [config] [2]
* [dependency] [3]
* [download] [4]
* [helper] [5]
* [logger] [6]
* [playgroundjs] [7]
* [settings] [8]
* [sort] [9]
* [syntaxhighlighter] [10]
* [codearea] [11]
* [sidebar] [12]
* [crossbar] [13]

[1]: cdn.js.html
[2]: config.js.html
[3]: dependency.js.html
[4]: download.js.html
[5]: helper.js.html
[6]: logger.js.html
[7]: playgroundjs.js.html
[8]: settings.js.html
[9]: sort.js.html
[10]: syntaxhighlighter.js.html
[11]: ui-codearea.js.html
[12]: ui-sidebar.js.html
[13]: ui-crossbar.js.html
