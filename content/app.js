
/////////////////////////////////////////
//global UI elements
/////////////////////////////////////////
var left_panel = document.getElementById("left-panel");
var right_panel = document.getElementById("right-panel");
var dragger = document.getElementById("dragger");
var working_area = document.getElementById("working-area");
var console_area = document.getElementById("console-area");
var title_bar = document.getElementById("title-bar");
//buttons
var btn_open = document.getElementById("btn_open");
var btn_save = document.getElementById("btn_save");
var btn_setting = document.getElementById("btn_setting");
var btn_compile = document.getElementById("btn_compile");
var btn_find = document.getElementById("btn_find");
var btn_replace = document.getElementById("btn_replace");
var btn_undo = document.getElementById("btn_undo");
var btn_redo = document.getElementById("btn_redo");
var btn_about = document.getElementById("btn_about");
var btn_find_right = document.getElementById("btn_find_right");
var btn_save_right = document.getElementById("btn_save_right");
//output
var console_output = document.getElementById("console-output");
//setup slider
var isResizing = false;
var offSet = 0;
dragger.onmousedown = function(e)
{
    offSet = e.clientX - left_panel.offsetWidth;
    isResizing = true;
}
document.onmouseup = function(e)
{
    isResizing = false;
}
document.onmousemove = function(e) {
    if (isResizing) {
        var t = 100*(e.clientX - offSet)/(document.getElementById("container").offsetWidth);
        if (document.getElementById("container").offsetWidth*(100-t)/100>350) {
            left_panel.style.width = t+'%';
        }
        
    } 
}
/////////////////////////////////////////
//setup sass/less editor
/////////////////////////////////////////
var beingTrack = false
var css_editor = ace.edit("css-editor");
var sass_editor = ace.edit("sass-editor");
    sass_editor.setTheme("ace/theme/github");
    sass_editor.getSession().setMode("ace/mode/scss");
    sass_editor.focus();
sass_editor.getSession().on('change', function() {
    if(beingTrack)
    {
        var um = sass_editor.getSession().getUndoManager();
        btn_undo.disabled =  um.hasUndo() ? false : true;
        btn_redo.disabled =  um.hasRedo() ? false : true;
        
        if(!um.hasUndo())
        {
            //interOp.callSwift('status:clean');
        }
    }
});

function startTracking()
{
    //sass_editor.setValue(fileContent,0)
    btn_undo.disabled = true;
    btn_redo.disabled = true;
    beingTrack = true;
    sass_editor.getSession().setUndoManager(new ace.UndoManager);
}
startTracking();
sass_editor.setValue(savedSCSS, 1);
input_open.onchange = function(e)
{
	var file = e.target.files[0];
	if (!file) {
		return;
	}
	var reader = new FileReader();
	reader.onload = function(e) {
		var contents = e.target.result;
		sass_editor.setValue(contents, 1);
	};
  reader.readAsText(file);
}
btn_save.onclick = function()
{
	var blob = new Blob([sass_editor.getValue()], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "document." + select_indentSyntax.options[select_indentSyntax.selectedIndex].text.toLowerCase());
}
btn_setting.onclick = function()
{
    try
    {
        //open setting modal
        el = document.getElementById("overlay");
        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    }
    catch(error)
    {
        //show error message
    }
}
btn_compile.onclick = function()
{
    try
    {
        compile();
    }
    catch(error)
    {
        //show error message
    }
}
btn_find.onclick = function()
{
    try
    {
        sass_editor.execCommand("find");
    }
    catch(error)
    {
        //show error message
    }
}
btn_replace.onclick = function()
{
    try
    {
        sass_editor.execCommand("replace");
    }
    catch(error)
    {
        //show error message
    }
}
btn_undo.onclick = function()
{
    try
    {
        sass_editor.execCommand("undo");
    }
    catch(error)
    {
        //show error message
    }
}
btn_redo.onclick = function()
{
    try
    {
        sass_editor.execCommand("redo");
    }
    catch(error)
    {
        //show error message
    }
}
btn_about.onclick = function(){
	var about_panel = document.getElementById("about-overlay-view");
    about_panel.style.visibility = "visible";
}
/////////////////////////////////////////
//setup css editor
/////////////////////////////////////////
    css_editor.setTheme("ace/theme/github");
    css_editor.getSession().setMode("ace/mode/css");
    css_editor.setValue('',1);
btn_find_right.onclick = function()
{
    try
    {
        css_editor.execCommand("find");
    }
    catch(error)
    {
        //show error message
    }
}
btn_save_right.onclick = function()
{
    try
    {
        
        var blob = new Blob([css_editor.getValue()], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "document.css");
    }
    catch(error)
    {
        //show error message
    }
}
///
// register a custom importer callback
sass.importer(function(request, done) {
              
              if (request.path) {
              // Sass.js already found a file,
              // we probably want to just load that
              done();
              } else if (request.current === 'content') {
              // provide a specific content
              // (e.g. downloaded on demand)
              done({
                   content: 'sample'
                   })
              } else if (request.current === 'redirect') {
              // provide a specific content
              done({
                   path: 'file:///'+request.previous+request.current
                   });
              
              } else if (request.current === 'error') {
              // provide content directly
              // note that there is no cache
              done({
                   error: 'import failed because bacon.'
                   });
              
              } else {
              // let libsass handle the import
              
              done({
                   content: readTextFile('file://'+request.previous+request.current)
                   });
              
              }
              });
/////////////////////////////////////////
//output to console log + sass
/////////////////////////////////////////
function compile() {
    sass_editor.getSession().clearAnnotations();
    console_output.value = "---> Compiling source code as "+select_indentSyntax.options[select_indentSyntax.selectedIndex].text+"...";
     //compile sass
    var result = sass.compile(sass_editor.getValue(), function(result) {
        if (result.status == 0) {
           css_editor.setValue(result.text,1);
           console_output.value = console_output.value + "\n---> Compile success."
        }
        else
        {
            var message = result.message;
            if (result.message.indexOf('file to import not found') != -1) {
                message = result.message + '\nDid you forget to add the file extension? Or forget to set properly local path?\nSee Sass Editor Help for more details.';
            }
           var line = result.line;
           if(line>0)
           {
           sass_editor.scrollToLine(line-1);
           }
           console_output.value  = console_output.value + "\n---> "+  message + ".\nOn line: "+Number(result.line)+".";
           
           sass_editor.getSession().setAnnotations([{
                                    row: result.line -1,
                                    text: message,
                                    type: "error" // also warning and information
                                }]);
           
           console_output.value = console_output.value + "\n---> Compile failed.";
           console_output.scrollTop = console_output.scrollHeight;
        }
    });
}


//run test
sass.compile(testContent, function(result) {
	console.log("compile done");
	var loading_view = document.getElementById("loading-view");
    loading_view.style.visibility = "hidden";
});