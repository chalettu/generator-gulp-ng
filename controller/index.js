'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var ControllerGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    console.log('You called the controller subgenerator with the argument ' + this.name + '.');

   this.js_controller_function=this.name+'Ctrl';
//take the controller name and lowercase it for the filename
	var filename=this.name.toLowerCase()+'.js';
var bower = this.dest.readJSON('bower.json');

	var controller_template = this.read("_controller.js");
  this.appname=bower.name;

	    var context = {
            name: this.name,
            appname:bower.name
        };
   
        var controller = this.engine(controller_template , context);


this.write("app/"+this.name+"/"+filename, controller);

//this.generateControllerIncludes();

  },
implode:function(glue, pieces) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Waldo Malqui Silva
  // +   improved by: Itsacon (http://www.itsacon.net/)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: implode(' ', ['Kevin', 'van', 'Zonneveld']);
  // *     returns 1: 'Kevin van Zonneveld'
  // *     example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'});
  // *     returns 2: 'Kevin van Zonneveld'
  var i = '',
    retVal = '',
    tGlue = '';
  if (arguments.length === 1) {
    pieces = glue;
    glue = '';
  }
  if (typeof pieces === 'object') {
    if (Object.prototype.toString.call(pieces) === '[object Array]') {
      return pieces.join(glue);
    }
    for (i in pieces) {
      retVal += tGlue + pieces[i];
      tGlue = glue;
    }
    return retVal;
  }
  return pieces;
},
askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
  //  this.log(chalk.magenta('You\'re using the fantastic AngularMobileGenerator generator.'));

    var prompts = [{
      type: 'confirm',
      name: 'createPartial',
      message: 'Do you want me to create a default partial template for you?',
      default: true
    },
    {
      name: 'route_path',
      message: 'What path do you want me to set for controller? ',
      default: "/"+this.name
    }
    ];

    this.prompt(prompts, function (props) {
      //this.someOption = props.someOption;

      if (props.route_path=="")
      {
      		this.route_path="/"+this.name;
      }
      else
      {
      	this.route_path= props.route_path;
      }

      if (props.createPartial===true)
      {
        var partial_name="app/"+this.name+"/"+this.name+".html";
        this.write(partial_name, "/* PARTIAL FOR "+this.name+" CONTROLLER */");
      }

      done();
    }.bind(this));
  },
generateRoutingRule:function()
{
//first check to see what was set for the route
//var routes = this.read("/www/js/app.js");
var slugged_name=this._.slugify(this.name);
var hook   = ';//END OF ROUTES',
    path= 'app/routes.js',
    file  = this.readFileAsString(path),
    insert=' .state("'+this.name+'", {url: "'+this.route_path+'", templateUrl:\''+ slugged_name+'/'+slugged_name +'.html\',controller: "'+this.js_controller_function+'"})';



//    console.log(this.route_path);
//searchText.match(/angular.module\('.*', (\[.*\])/i)
//file = this.readFileAsString(path);
//routes+="testing";
//JSON.stringify(yourArray);
 
this.write(path, file.replace(hook, '\n'+insert+hook));


//open app.js
  var app_file="app/app.js";
  var module_name=this.appname+'-'+this.name;

  file  = this.readFileAsString(app_file);

  var matches=file.match(/angular.module\('.*', (\[.*\])/i);
  var ang_modules_str=matches[1];
 
  if (ang_modules_str.indexOf(module_name) ==-1) {

      var ang_modules_arr=JSON.parse(ang_modules_str); 
      ang_modules_arr.push(module_name);
      var modified_modules=JSON.stringify(ang_modules_arr);
    this.write(app_file, file.replace(ang_modules_str, modified_modules));
  }

  


//this.write("www/js/app.js", routes);
//END OF ROUTES

}

});

module.exports = ControllerGenerator;


function str_replace(search, replace, subject, count) {
  //  discuss at: http://phpjs.org/functions/str_replace/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Gabriel Paderni
  // improved by: Philip Peterson
  // improved by: Simon Willison (http://simonwillison.net)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Onno Marsman
  // improved by: Brett Zamir (http://brett-zamir.me)
  //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // bugfixed by: Anton Ongson
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Oleg Eremeev
  //    input by: Onno Marsman
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: Oleg Eremeev
  //        note: The count parameter must be passed as a string in order
  //        note: to find a global variable in which the result will be given
  //   example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
  //   returns 1: 'Kevin.van.Zonneveld'
  //   example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
  //   returns 2: 'hemmo, mars'
  // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
  //   example 3: str_replace(Array('S','F'),'x','ASDFASDF');
  //   returns 3: 'AxDxAxDx'

  var i = 0,
    j = 0,
    temp = '',
    repl = '',
    sl = 0,
    fl = 0,
    f = [].concat(search),
    r = [].concat(replace),
    s = subject,
    ra = Object.prototype.toString.call(r) === '[object Array]',
    sa = Object.prototype.toString.call(s) === '[object Array]';
  s = [].concat(s);
  
  if(typeof(search) === 'object' && typeof(replace) === 'string' ) {
    temp = replace; 
    replace = new Array();
    for (i=0; i < search.length; i+=1) { 
      replace[i] = temp; 
    }
    temp = ''; 
    r = [].concat(replace); 
    ra = Object.prototype.toString.call(r) === '[object Array]';
  }
  
  if (count) {
    this.window[count] = 0;
  }

  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue;
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + '';
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
      s[i] = (temp)
        .split(f[j])
        .join(repl);
      if (count && s[i] !== temp) {
        this.window[count] += (temp.length - s[i].length) / f[j].length;
      }
    }
  }
  return sa ? s : s[0];
}