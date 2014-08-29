'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var GulpNgGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('This generator will generate a web app project using gulp, bower and angularjs.'));

    var prompts = [];

    var prompts = [
    {
      type    : 'input',
      name: 'name',
      message: 'What would you like the angular app to be called?',
      default: "myapp"
    },
    {
      type    : 'input',
      name: 'output_directory',
      message: 'Where would you like the generated html content to go?',
      default: "./build"
    }];

    this.prompt(prompts, function (props) {
      this.appname = props.name;
      this.output_directory = props.output_directory;
      done();
    }.bind(this));
  },

  app: function () {


//var pkg = this.dest.readJSON('package.json');


    this.mkdir('app');
    this.copy('app/_app.css', 'app/app.css');
    this.copy('app/_app.js','app/app.js');
    this.copy('app/_routes.js','app/routes.js');
    this.copy('app/_app_controller.js','app/app_controller.js');
    this.copy('app/_app_controller_test.js','app/app_controller_test.js');
    this.copy('app/_index.html','app/index.html');

    this.mkdir('app/components');
    this.copy('app/components/_app_service.js', 'app/components/app_service.js');
    this.copy('app/components/_app_service_test.js', 'app/components/app_service_test.js');

    this.mkdir('app/main');
    this.copy('app/main/_main.html', 'app/main/main.html');
    this.copy('app/main/_main_controller.js', 'app/main/main_controller.js');
    this.copy('app/main/_main_controller_test.js', 'app/main/main_controller_test.js');
  },
  projectfiles: function () {    
    this.copy('_bowerrc', '.bowerrc');    
    this.copy('_bower.json', 'bower.json');    
    this.copy('_gulpfile.js', 'gulpfile.js');
    this.copy('_package.json', 'package.json');
    this.copy('_karma-unit.js', 'karma-unit.js');
  }
});

module.exports = GulpNgGenerator;