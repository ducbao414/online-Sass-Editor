var btn_close = document.getElementById("btn_close");
var btn_close_about = document.getElementById("btn_close_about");
var select_indentSyntax = document.getElementById("select_indentSyntax");
var select_style = document.getElementById("select_style");
var select_comments = document.getElementById("select_comments");
var select_theme = document.getElementById("select_theme");
var input_fontSize = document.getElementById("input_fontSize");
var btn_save_setting = document.getElementById("btn_save_setting");
function loadSettings() {
    select_indentSyntax.value = Number(userDefaults["indentedSyntax"]);
    select_style.value = userDefaults["style"];
    select_comments.value = Number(userDefaults["comments"]);
    select_theme.value = userDefaults["theme"];
    input_fontSize.value = userDefaults["fontSize"];
    //Sass
    sass.options({
    // Format output: nested, expanded, compact, compressed
    style: userDefaults['style'],
    // Precision for outputting fractional numbers
    // (-1 will use the libsass default, which currently is 5)
    precision: -1,
    // If you want inline source comments
    comments: userDefaults['comments'],
    // Treat source_string as SASS (as opposed to SCSS)
    indentedSyntax: userDefaults['indentedSyntax'],
    // String to be used for indentation
    indent: '  ',
    // String to be used to for line feeds
    linefeed: '\n',
  
    // Path to source map file
    // Enables the source map generating
    // Used to create sourceMappingUrl
    sourceMapFile: 'file',
    // Pass-through as sourceRoot property
    sourceMapRoot: 'root',
    
    // The output path is used for source map generation.
    // Libsass will not write to this file, it is just
    // used to create information in source-maps etc.
    outputPath: 'stdout',
    // Embed included contents in maps
    sourceMapContents: true,
    // Embed sourceMappingUrl as data uri
    sourceMapEmbed: false,
    // Disable sourceMappingUrl in css output
    sourceMapOmitUrl: true,
  }, function callback(){});
    sass_editor.setTheme("ace/theme/"+userDefaults["theme"]);
    if(userDefaults["indentedSyntax"]==false)
    {
        sass_editor.getSession().setMode("ace/mode/scss");
    }
    else
    {
        sass_editor.getSession().setMode("ace/mode/sass");
    }
    css_editor.setTheme("ace/theme/"+userDefaults["theme"]);
    sass_editor.setFontSize(userDefaults["fontSize"]);
    css_editor.setFontSize(userDefaults["fontSize"]);
}
loadSettings();
btn_close_about.onclick = function(){
	var about_panel = document.getElementById("about-overlay-view");
    about_panel.style.visibility = "hidden";
}
btn_close.onclick = function()
{
    el = document.getElementById("overlay");
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    select_indentSyntax.value = Number(userDefaults["indentedSyntax"]);
    select_style.value = userDefaults["style"];
    select_comments.value = Number(userDefaults["comments"]);
    select_theme.value = userDefaults["theme"];
    input_fontSize.value = userDefaults["fontSize"];
}
btn_save_setting.onclick = function()
{
    userDefaults["indentedSyntax"] = Boolean(Number(select_indentSyntax.value));
    userDefaults["style"] = Number(select_style.value);
    userDefaults["comments"] = Boolean(Number(select_comments.value));
    userDefaults["theme"] = select_theme.value;
    userDefaults["fontSize"] = Number(input_fontSize.value);
    //save settings to local storage
	if(typeof(Storage) !== 'undefined')
	{
		localStorage.setItem("indentedSyntax", userDefaults["indentedSyntax"]);
		localStorage.setItem("style", userDefaults["style"]);
		localStorage.setItem("comments", userDefaults["comments"]);
		localStorage.setItem("theme", userDefaults["theme"]);
		localStorage.setItem("fontSize", userDefaults["fontSize"]);
	}
    el = document.getElementById("overlay");
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    loadSettings();
    if(userDefaults["indentedSyntax"]==false)
    {
        sass_editor.getSession().setMode("ace/mode/scss");
    }
    else
    {
        sass_editor.getSession().setMode("ace/mode/sass");
    }
}
