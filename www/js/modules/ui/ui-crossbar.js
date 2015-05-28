/**
 * Gestion du menu des boutons d'action
 * 
 * @module UICrossBar
 * @todo !!! version avec ou sans JQuery !!!
 */
define(["jquery"], function($) {

    "use strict";
    
    function UICrossBar(context) {
        
        if (!(this instanceof UICrossBar)) {
            throw new TypeError("UICrossBar constructor cannot be called as a function.");
        }
        
        // c'est le 'this' du player ! 
        this.context = context;
        
    }
    
    // class CSS
    UICrossBar.CLASSNAME        = "_PlayGroundJS_menu";
    UICrossBar.CLASSNAME_BUTTON = "_PlayGroundJS_menuButton";
    UICrossBar.CLASSNAME_PADDING= "_PlayGroundJS_menuPadding";
    
    // id
    UICrossBar.IDBUTTON_RUN   = "button_run";
    UICrossBar.IDBUTTON_RESET = "button_reset";
    UICrossBar.IDBUTTON_SAVE  = "button_save";
    
    UICrossBar.prototype = {
        
        constructor: UICrossBar,
        
        /**
         * Creation du menu avec les boutons d'action 
         * (compatible IE9+)
         * @method generate
         * @returns {Object} DOM.Element
         */
        generate: function() {
            
            var $this = this.context;
            
            // FIXME 
            // For browsers that don't support the addEventListener() method, you can use the attachEvent() method.
            // This example demonstrates a cross-browser solution:
            //      var x = document.getElementById("myBtn");
            //      if (x.addEventListener) {                    // For all major browsers, except IE 8 and earlier
            //          x.addEventListener("click", myFunction);
            //      } else if (x.attachEvent) {                  // For IE 8 and earlier versions
            //          x.attachEvent("onclick", myFunction);
            //      }
            
            var eltButton_run = document.createElement('span');
            eltButton_run.setAttribute('id', UICrossBar.IDBUTTON_RUN);
            eltButton_run.setAttribute('class', UICrossBar.CLASSNAME_BUTTON);
            eltButton_run.addEventListener("click", function(e){$this.doRun();});
            eltButton_run.appendChild(document.createTextNode("Run"));
            
            var eltButton_reset = document.createElement('span');
            eltButton_reset.setAttribute('id', UICrossBar.IDBUTTON_RESET);
            eltButton_reset.setAttribute('class', UICrossBar.CLASSNAME_BUTTON);
            eltButton_reset.addEventListener("click", function(e){$this.doReset();});
            eltButton_reset.appendChild(document.createTextNode("Reset"));
            
            var eltButton_save = document.createElement('span');
            eltButton_save.setAttribute('id', UICrossBar.IDBUTTON_SAVE);
            eltButton_save.setAttribute('class', UICrossBar.CLASSNAME_BUTTON);
            eltButton_save.addEventListener("click", function(e){$this.doSave();});
            eltButton_save.appendChild(document.createTextNode("Save"));
            
            var crossbar = document.createElement('div');
            crossbar.setAttribute('class', UICrossBar.CLASSNAME);
            
            var padding = document.createElement('div');
            padding.setAttribute('class', UICrossBar.CLASSNAME_PADDING);
            
            padding.appendChild(eltButton_run);
            padding.appendChild(eltButton_reset);
            padding.appendChild(eltButton_save);
            
            crossbar.appendChild(padding);
            
            return crossbar;
        },
        
        /**
         * Creation du menu avec les boutons d'action
         * (compatible IE8+)
         * @method generate
         * @deprecated Use JQUery !
         * @returns {Object} JQuery
         */
        __generate: function() {

            var $this = this.context;
            
            var menuButton_run   = $('<span id="button_run"   class="'+UICrossBar.CLASSNAME_BUTTON+'">Run</span>')
                    .click(function(e){$this.doRun();});
            
            var menuButton_reset = $('<span id="button_reset" class="'+UICrossBar.CLASSNAME_BUTTON+'">Reset</span>')
                    .click(function(e){$this.doReset();});
            
            var menuButton_save  = $('<span id="button_save"  class="'+UICrossBar.CLASSNAME_BUTTON+'">Save</span>')
                    .click(function(e){$this.doSave();});
            // menuButton_save.attr('title', '[TODO] Fonction en cours de test...');
    
            // var menuButton_test  = $('<span id="button_test"  class="'+UICrossBar.CLASSNAME_BUTTON+'">Test</span>')
            //         .click(function(event){$this.doTest(event);});
            // menuButton_test.attr('title', '[TODO] Fonction en cours de test...');
    
            var crossbar = 
                $('<div class="'+UICrossBar.CLASSNAME+'"></div>')
                .append(
                    $('<div class="'+UICrossBar.CLASSNAME_PADDING+'"></div>')
                    .append(menuButton_run)
                    .append(menuButton_reset)
                    .append(menuButton_save)
                    // .append(menuButton_test)
            );
    
            return crossbar;
        }
        
    };
    
    return UICrossBar;
    
});