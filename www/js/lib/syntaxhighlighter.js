/**
 * CodeMirror is a code-editor component that can be embedded in Web pages
 * cf. http://codemirror.net/
 */
        
define([
        "helper",
        // ie "cm-lib", 
        "../external/codemirror/lib/codemirror",
        // ie  "cm-htmlmixed",
        "../external/codemirror/mode/htmlmixed/htmlmixed",   
        // ie  "cm-javascript",
        "../external/codemirror/mode/javascript/javascript",
        // ie  "cm-css",
        "../external/codemirror/mode/css/css",              
        // ie  "cm-xml"
        "../external/codemirror/mode/xml/xml",
        // ie  "cm-fold
        "../external/codemirror/addon/fold/foldcode",
        "../external/codemirror/addon/fold/foldgutter",
        "../external/codemirror/addon/fold/brace-fold",
        "../external/codemirror/addon/fold/xml-fold",
        "../external/codemirror/addon/fold/comment-fold",
    ], 

    function (Helper, CodeMirror) {
        
    /**
     * DESCRIPTION
     *   surcharge de la lib. de colorisation synthaxique : CodeMirror 
     *   
     * INFORMATION
     * 
     * USAGE
     * 
     *   var m_obj = new SyntaxHighlighter();
     *   
     *   m_obj.apply("js"); // ex: js, html ou css !
     *   m_obj.apply("js", {
     *      onfinish: function(msg) {
     *          // ...
     *      }
     *   });
     *   
     *   m_obj.remove();
     *   m_obj.update();
     *   m_obj.clear();
     *   m_obj.restore(); // Not yet implemented !
     *   
     * RETURN
     * 
     * SEE ASLO
     * 
     */
   
        "use strict";
    
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
         *  Le code est identifié par le ID de la balise "textarea" du document
         *  ex. avec id:'html' ('js' ou 'css')
         *  <textarea class="_PlayGroundJS_boxEdit" id="html"></textarea>
         *  
         *  
         * @param {type} code
         * @param {object} callback ex: {onfinish: function(msg){}}
         * @returns {undefined}
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