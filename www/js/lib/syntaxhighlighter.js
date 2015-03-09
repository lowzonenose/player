/**
 * Surcharge de la lib. de colorisation synthaxique CodeMirror
 * @tutorial SyntaxHighlighter
 * @module SyntaxHighlighter
 * @see module:helper
 * @requires cm/lib/codemirror
 */
define([
        "helper",
        "cm/lib/codemirror", // cf. FIXME ../external/codemirror/
        "cm/mode/htmlmixed/htmlmixed", 
        "cm/mode/javascript/javascript",
        "cm/mode/css/css",
        "cm/mode/xml/xml",
        "cm/addon/fold/foldcode",
        "cm/addon/fold/foldgutter",
        "cm/addon/fold/brace-fold",
        "cm/addon/fold/xml-fold",
        "cm/addon/fold/comment-fold",
    ], 

    function (Helper, CodeMirror) {
   
        "use strict";

        /**
         * Description
         * @method SyntaxHighlighter
         * @return 
         */
        function SyntaxHighlighter() {

            if (!(this instanceof SyntaxHighlighter)) {
                throw new TypeError("SyntaxHighlighter constructor cannot be called as a function.");
            }

            this.lstEditor = null;
        }

        SyntaxHighlighter.prototype = {

            constructor: SyntaxHighlighter,

            /**
             * Application la colorisation sur le code.
             * Le code est identifié par le ID de la balise "textarea" du document
             * ex. avec id:'html' ('js' ou 'css')
             * <textarea class="_PlayGroundJS_boxEdit" id="html"></textarea>
             * @method apply
             * @param {type} code
             * @param {} options
             * @return 
             */
            apply: function (code, options) {

                // mime type
                var mime = null;
                switch(code) {
                    case "js":
                        mime = "application/javascript";
                        break;
                    case "html":
                        mime = "application/xml"; // ???
                        break;
                    case "css":
                        mime = "text/css";
                        break;
                    default:
                        return;
                }

                var callbacks = options || {};

                if (this.lstEditor === null) {
                    this.lstEditor = new Array();
                }

                var element = document.getElementById(code);
                console.log(element);

                var editor = CodeMirror.fromTextArea(element, {
                    lineNumbers: true,
                    lineWrapping: true,
                    scrollbarStyle: "native", // hide : null !
                    mode: mime,
                    foldGutter: true,
                    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
                 });

                editor.setOption("theme", "default");
                this.lstEditor.push(editor);

                // callback
                if (callbacks.onfinish != null && typeof callbacks.onfinish === 'function') {
                    callbacks.onfinish();
                }

            },

            // Sauvegarde du contenu. 
            // (DOM Element <textarea> est réécrit !)
            /**
             * Description
             * @method update
             * @return 
             */
            update: function () {
                if (this.lstEditor !== null) {
                    var len = this.lstEditor.length;
                    for(var i = 0; i < len; i++){
                        this.lstEditor[i].save();
                    }
                }
            },

            // Effacement du contenu... 
            // mais pas la liste des objets !
            /**
             * Description
             * @method clear
             * @return 
             */
            clear: function() {
                 if (this.lstEditor !== null) {
                    var len = this.lstEditor.length;
                    for(var i = 0; i < len; i++){
                        this.lstEditor[i].setValue("");
                        this.lstEditor[i].clearHistory("");
                    }
                }
            }, 

            // Suppression de DOM Element 
            // ainsi que de la liste des objets !
            /**
             * Description
             * @method remove
             * @return 
             */
            remove: function() {
                if (this.lstEditor !== null) {
                    var len = this.lstEditor.length;
                    for(var i = 0; i < len; i++){
                        var element = this.lstEditor[i].getWrapperElement();
                        element.parentNode.removeChild(element);
                    }
                    this.lstEditor.slice(0, len);
                    this.lstEditor = null;
                }
            },

            // FIXME : ça restaure quoi en fait ???
            // " Remove the editor, and restore the original textarea 
            // (with the editor's current content). "
            /**
             * Description
             * @method restore
             * @return 
             */
            restore: function() {
                if (this.lstEditor !== null) {
                    var len = this.lstEditor.length;
                    for(var i = 0; i < len; i++){
                        this.lstEditor[i].toTextArea();
                    } 
                }
            },

        };

        return SyntaxHighlighter;
});