define(["jquery"], function($) {
    
    /**
     * DESCRIPTION
     *   
     * INFORMATION
     * 
     * USAGE
     *   
     * RETURN
     * 
     * SEE ASLO
     * 
     */
    
    "use strict";
    
    function UICrossBar(context) {
        
        if (!(this instanceof UICrossBar)) {
            throw new TypeError("UICrossBar constructor cannot be called as a function.");
        }
        
        // c'est le 'this' du player ! 
        this.context = context;
        
    }
    
    // id CSS
    UICrossBar.CLASSNAME        = "_PlayGroundJS_menu";
    UICrossBar.CLASSNAME_BUTTON = "_PlayGroundJS_menuButton";
    UICrossBar.CLASSNAME_PADDING= "_PlayGroundJS_menuPadding";
    
    UICrossBar.prototype = {
        
        constructor: UICrossBar,
        
        generate: function() {

            var $this = this.context;
            
            var menuButton_run   = $('<span id="button_run"   class="'+UICrossBar.CLASSNAME_BUTTON+'">Run</span>')
                    .click(function(e){$this.doRun();});
            
            var menuButton_reset = $('<span id="button_reset" class="'+UICrossBar.CLASSNAME_BUTTON+'">Reset</span>')
                    .click(function(e){$this.doReset();});
            
            var menuButton_save  = $('<span id="button_save"  class="'+UICrossBar.CLASSNAME_BUTTON+'">Save</span>')
                    .click(function(e){$this.doSave();});
            menuButton_save.attr('title', '[TODO] Fonction en cours de test...');
    
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