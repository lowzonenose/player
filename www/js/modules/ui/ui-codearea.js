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
    
    function UICodeArea(context, options) {
        
        if (!(this instanceof UICodeArea)) {
            throw new TypeError("UICodeArea constructor cannot be called as a function.");
        }
        
        // INFO 
        // 'this' === player !!!
        this.context = context;
        
        // INFO 
        // settings = {
        //   
        // }
        this.settings = options || {};
        
    }
    
    // class CSS
    UICodeArea.CLASSNAME = "";
    
    //id 
    UICodeArea.IDBOXHTML   = "html";
    UICodeArea.IDBOXJS     = "js";
    UICodeArea.IDBOXCSS    = "css";
    UICodeArea.IDBOXRESULT = "iframe";
    
    
    UICodeArea.prototype = {

         /**
         * objets
         */
        
        boxHTML: null,
        boxJS: null,
        boxCSS: null,
        boxResult:null,
        
        constructor: UICodeArea,
        
        /**
         * fonction de generation du code html
         */
        generate: function() {
            
            var $this = this.context;
            var $self = this; // instance de la classe ! 
            
            $.each([$self._boxHTML(), $self._boxCSS(), $self._boxJS(), $self._boxResult()], function(index, item)
            {
                    item
                    .focus(function(){ $($this).parent().children('._PlayGroundJS_boxLabel').fadeOut(); })
                    .blur(function() { $($this).parent().children('._PlayGroundJS_boxLabel').fadeIn(); });
            });
            
            
            var codearea = 
                $('<div class="_PlayGroundJS_codeArea"></div>')
                .append(
                    $('<table class="_PlayGroundJS_codeAreaTable" cellpadding="0" cellspacing="1"></table>')
                    .append(
                            $('<tr></tr>')
                            .append(
                                    $('<td class="_PlayGroundJS_box _PlayGroundJS_boxTop _PlayGroundJS_boxLeft"></td>')
                                    .append(
                                            $('<div class="_PlayGroundJS_boxContainer"></div>')
                                            .append($self._boxHTML())
                                            .append('<div class="_PlayGroundJS_boxLabel" title="code HTML"></div>')	
                                    )
                            )
                            .append(
                                    $('<td class="_PlayGroundJS_box _PlayGroundJS_boxTop _PlayGroundJS_boxRight"></td>')
                                    .append(
                                            $('<div class="_PlayGroundJS_boxContainer"></div>')
                                                .append($self._boxCSS())
						.append('<div class="_PlayGroundJS_boxLabel" title="code CSS"></div>')     
                                    )
                            )
                    )
                    .append(
                            $('<tr></tr>')
                            .append(
                                    $('<td class="_PlayGroundJS_box _PlayGroundJS_boxBottom _PlayGroundJS_boxLeft"></td>')
                                    .append(
                                            $('<div class="_PlayGroundJS_boxContainer"></div>')
                                            .append($self._boxJS())
                                            .append('<div class="_PlayGroundJS_boxLabel" title="code JavaScript / API Gépoportail"></div>')
                                            .append('<div class="_logo_API" title="code JavaScript / API Gépoportail"></div>')
                                    )
                            )
                            .append(
                                    $('<td class="_PlayGroundJS_box _PlayGroundJS_boxBottom _PlayGroundJS_boxRight"></td>')
                                    .append(
                                            $('<div class="_PlayGroundJS_boxContainer"></div>')
                                            .append($self._boxResult())
                                    )
                            )
                    )
            );
    
            return codearea;
        }, 
        
        clean: function() {
            
            var $this = this.context;
            var $self = this; // instance de la classe ! 
            
            $('#'+UICodeArea.IDBOXHTML).val('');
            $('#'+UICodeArea.IDBOXJS).val('');
            $('#'+UICodeArea.IDBOXCSS).val('');
            $('#'+UICodeArea.IDBOXRESULT).val('');
            
            
        },
        
        remove: function() {
            var $this = this.context;
            var $self = this; // instance de la classe ! 
            
            $('#'+UICodeArea.IDBOXHTML).remove();
            $('#'+UICodeArea.IDBOXJS).remove();
            $('#'+UICodeArea.IDBOXCSS).remove();
            $('#'+UICodeArea.IDBOXRESULT).remove();
        },
        
        restore: function() {
            var $this = this.context;
            var $self = this; // instance de la classe ! 
            
            throw new Error("Not yet implemented !");
        },
        
        _boxHTML: function () {
            this.boxHTML = $('<textarea class="_PlayGroundJS_boxEdit" id="html"></textarea>');
            return this.boxHTML;
        },
        
        _boxJS: function () {
            this.boxJS = $('<textarea class="_PlayGroundJS_boxEdit" id="js"></textarea>');
            return this.boxJS;
        },
        
        _boxCSS: function () {
            this.boxCSS = $('<textarea class="_PlayGroundJS_boxEdit" id="css"></textarea>');
            return this.boxCSS;
        },
        
        _boxResult: function () {
            this.boxResult = $('<iframe id="iframe" class="_PlayGroundJS_boxEdit" frameBorder="0"></iframe>');
            return this.boxResult;
        }

    };
    
    return UICodeArea;
    
});