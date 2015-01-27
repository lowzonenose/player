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
    
    function UISideBar(context, options) {
        
        if (!(this instanceof UISideBar)) {
            throw new TypeError("UISideBar constructor cannot be called as a function.");
        }
        
        // INFO 
        // 'this' === player !!!
        // permet d'interagir entre les classes...
        this.context = context;
        
        // INFO 
        // settings = {
        //   jsapi : {
        //      type: "",
        //      version: "",
        //      url: "",
        //      mode:  (true|false), // TODO, inititialisé en mode dev. !
        //      dep:  []             // TODO, inititialisé avec des dependances !
        //   },
        //   jsframework : {}
        // }
        this.settings = options || {};
        
    }
	
		
	/**
	 * Fonction ouvrant/fermant les menus déroulants
	 */
	function openSidebarTitle(elt) {
		if ($(elt).hasClass('sidebarTitleClosed')) {
			$(elt).removeClass('sidebarTitleClosed');
			$(elt).addClass('sidebarTitleOpened');
		} else {
			$(elt).removeClass('sidebarTitleOpened');
			$(elt).addClass('sidebarTitleClosed');
		}
	}
	
	/**
	 * Fonction ouvrant/fermant les sous-menus déroulants
	 */
	function openSidebarLabelClick(elt) {
		if ($(elt).hasClass('sidebarLabelClickClosed')) {
			$(elt).removeClass('sidebarLabelClickClosed');
			$(elt).addClass('sidebarLabelClickOpened');
		} else {
			$(elt).removeClass('sidebarLabelClickOpened');
			$(elt).addClass('sidebarLabelClickClosed');
		}
	}
    
    // class CSS
    UISideBar.CLASSNAME = "_PlayGroundJS_sidebar";
    UISideBar.CLASSNAME_LIST   = "_PlayGroundJS_sidebarDivList";
    UISideBar.CLASSNAME_INPUT  = "_PlayGroundJS_sidebarInput";
    UISideBar.CLASSNAME_BUTTON = "_PlayGroundJS_sidebarButton";
    
    // id for jquery
    UISideBar.ID_JSAPI_INFO       = "_jsapi_info_div";
    UISideBar.ID_JSAPI_MODE       = "_jsapi_mode_input";
    UISideBar.ID_JSAPI_SELECT     = "_jsapi_dependencies_select";
    UISideBar.ID_JSAPI_SELECT_CSS = "_jsapi_dependencies_css_select";
     
    UISideBar.ID_JSCDN_INPUT      = "_jsdep_cdn_input";
    UISideBar.ID_JSCDN_BUTTON     = "_jsdep_cdn_button_search";
    UISideBar.ID_JSCDN_SEL_FIND   = "_jsdep_cdn_select_find";
    UISideBar.ID_JSCDN_SEL_LIST   = "_jsdep_cdn_select_list";
    
    UISideBar.ID_JSEXT_INPUT         = "_jsdep_external_input";
    UISideBar.ID_JSEXT_BUTTON_ADD    = "_jsdep_external_button_add";
    UISideBar.ID_JSEXT_BUTTON_REMOVE = "_jsdep_external_button_remove";
    UISideBar.ID_JSEXT_SEL_LIST      = "_jsdep_external_select_list";
    
    UISideBar.prototype = {
        
        /**
         * API JS selectionnée :
         * - compactée (mode production)
         * - éclatée (mode dev.)
         * Par defaut, l'API JS est la version compactée
         */
        m_jsapi_selected : null,
        
        /**
         * Liste des dependances CSS de l'exemple
         */
        m_jsapi_dependencies_css : [],
        
        /**
         * Liste des dependances JS de l'exemple
         */
        m_jsapi_dependencies : [],
        
        constructor: UISideBar,
        
        /**
         * fonction de generation du code html principale
         */
        generate: function() {
			
			// Création JS des sous-menus
            var menu_geoportail   = this.generate_jsapi();
            var menu_dependencies = this.generate_jsdep();

            var openSideBar = function () {
                if ($('.'+UISideBar.CLASSNAME).hasClass('sideBarClosed')) {
                    $('.pictoOpen').addClass('pictoClose');
                    $('.pictoClose').removeClass('pictoOpen');
                    $('._PlayGroundJS_sidebarPadding').show();
                    $('.'+UISideBar.CLASSNAME).removeClass('sideBarClosed');
                    $('.'+UISideBar.CLASSNAME).addClass('sideBarOpened');
                } else {
                    $('.pictoClose').addClass('pictoOpen');
                    $('.pictoOpen').removeClass('pictoClose');
                    $('._PlayGroundJS_sidebarPadding').hide();
                    $('.'+UISideBar.CLASSNAME).removeClass('sideBarOpened');
                    $('.'+UISideBar.CLASSNAME).addClass('sideBarClosed');
                }
            };

           // Ajout des flèches d'ouverture du menu
            var openSideBarBas  = $('<div id="openSideBarBas" class="pictoOpen" title="ouvrir le volet de paramètres"></div>')
                    .click(function(e){openSideBar();});
            var openSideBarHaut = $('<div id="openSideBarHaut" class="pictoOpen" title="ouvrir le volet de paramètres"></div>')
                    .click(function(e){openSideBar();});
			
			// Création HTML du menu
            var sidebar = $('<div class="'+UISideBar.CLASSNAME+' sideBarClosed"></div>')
                .append(menu_geoportail)
                .append(menu_dependencies)
                .append(openSideBarHaut)
                .append(openSideBarBas);
    
            return sidebar;
        }, 
        
        clean: function() {
            this.clean_jsapi_dependencies();
            this.clean_jsapi_info();
        },
        
        /** 
         * menu sur la rubrique 'geoportail'
         */
        generate_jsapi: function () {
            
            var $this = this.context;
            var $self = this; // instance de la classe !
			
            var dependJS = $('<div class="_PlayGroundJS_sidebarLabelClick sidebarLabelClickClosed">Dépendances JS de l\'exemple</div>');
            dependJS.on('click', function(e){openSidebarLabelClick(this);});

            var dependCSS = $('<div class="_PlayGroundJS_sidebarLabelClick sidebarLabelClickClosed">Dépendances CSS de l\'exemple</div>');
            dependCSS.on('click', function(e){openSidebarLabelClick(this);});
            
            return $('<div class="_PlayGroundJS_sidebarPadding"></div>')
                    .append('<div class="_PlayGroundJS_sidebarBigTitle">API JS Géoportail</div>')
                    .append(
                        $('<div class="_PlayGroundJS_sidebarContainer"></div>')
                            .append(this._jsapi_info())
                            .append(this._jsapi_mode())
                            .append(dependJS)
                            .append(this._jsapi_dependencies())
                            .append(dependCSS)
                            .append(this._jsapi_dependencies_css())
                    );
        },
        
        _jsapi_info: function () {
            return $('<div id="'+UISideBar.ID_JSAPI_INFO+'" class="_PlayGroundJS_sidebarContainerInto"></div>')
                        .append('<div class="_PlayGroundJS_sidebarLabel"><span class="boldLabel">Type    :</span> <span class="italicLabel">' + this.settings.jsapi.type    + '</span></div>')
                        .append('<div class="_PlayGroundJS_sidebarLabel"><span class="boldLabel">Version :</span> <span class="italicLabel">' + this.settings.jsapi.version + '</span></div>')
                        .append('<div class="_PlayGroundJS_sidebarLabel"><span class="boldLabel">URL     :</span> <span class="italicLabel">' + this.settings.jsapi.url     + '</span></div>');
        },
        
        _jsapi_mode: function () {
            
            var $self = this; // instance de la classe ! 
            
            // INFO
            // lib. compactée dite "Extended" (GeoportalExtended.js) ===> lib. dev. Geoportal.js
            // lib. compactée dite "Standard" (Geoportal.js)         ===> lib. dev. GeoportalStandard.js

            var JSApiTypeCompact;
            var JSApiTypeDev;
            
            if (this.settings.jsapi.type === "Extended") {
                JSApiTypeCompact = "Extended";
                JSApiTypeDev     = "";
            }
            else if (this.settings.jsapi.type === "Standard") {
                JSApiTypeCompact = "";
                JSApiTypeDev     = "Standard";
            }
            else {
                JSApiTypeCompact = this.settings.jsapi.type;
                JSApiTypeDev     = this.settings.jsapi.type;
            }
            
            // url API JS en mode compacté et eclaté
            var urldev     = this.settings.jsapi.url + this.settings.jsapi.version + "/lib/geoportal/lib/Geoportal" + JSApiTypeDev     + ".js";
            var urlcompact = this.settings.jsapi.url + this.settings.jsapi.version + "/Geoportal"                   + JSApiTypeCompact + ".js";
            
            // par defaut, API JS en mode compacté
            $self.m_jsapi_selected = urlcompact;
            
            var check = $('<input id="'+UISideBar.ID_JSAPI_MODE+'" class="_PlayGroundJS_sidebarCheck" type="checkbox"/>');
            check.on("click", function() {
                check.is(":checked" ) ? $self.m_jsapi_selected = urldev : $self.m_jsapi_selected = urlcompact;
            });
            
            // check.attr('disabled', 'disabled'); // .removeAttr('disabled');
            check.attr('title', '[BETA] API JS non compactée');
            
            return $('<div class="_PlayGroundJS_sidebarContainerInto"></div>')
                    .append(check)
                    .append($('<label for="'+UISideBar.ID_JSAPI_MODE+'" class="_PlayGroundJS_sidebarLabel">mode dev.</div>'));
                    
        },
        
        _jsapi_dependencies: function () {

            var select = $('<div \n\
                id="'   +UISideBar.ID_JSAPI_SELECT+'" \n\
                class="'+UISideBar.CLASSNAME_LIST+'"></div>');
            select.attr('disabled', 'disabled');
            select.attr('title', 'Liste des dependances JS');
            
            return $('<div class="_PlayGroundJS_sidebarContainerInto"></div>')
                    .append(select);

        },
        
        _jsapi_dependencies_css: function () {
            
            var select_css = $('<div \n\
                id="'   +UISideBar.ID_JSAPI_SELECT_CSS+'" \n\
                class="'+UISideBar.CLASSNAME_LIST+'"></div>');
            select_css.attr('disabled', 'disabled');
            select_css.attr('title', 'Liste des dependances CSS');
            
            return $('<div class="_PlayGroundJS_sidebarContainerInto"></div>')
                    .append(select_css);
            },
        
        /** 
         *  menu sur la rubrique 'dependances'
         */  
        generate_jsdep: function () {
            
            var $this = this.context;
            var $self = this; // instance de la classe !
			
            var addDependJS = $('<div class="_PlayGroundJS_sidebarTitle sidebarTitleClosed">Ajouter des dépendances JS</div>');
            addDependJS.on('click', function(e){openSidebarTitle(this);});

            var rechercheCDN = $('<div class="_PlayGroundJS_sidebarLabelClick sidebarLabelClickClosed">Rechercher dans le CDN JS</div>');
            rechercheCDN.on('click', function(e){openSidebarLabelClick(this);});

            var saisirAdresse = $('<div class="_PlayGroundJS_sidebarLabelClick sidebarLabelClickClosed">Saisir une adresse</div>');
            saisirAdresse.on('click', function(e){openSidebarLabelClick(this);});
            
            return $('<div class="_PlayGroundJS_sidebarPadding"></div>')
                    .append(addDependJS)
                    .append(
                        $('<div class="_PlayGroundJS_sidebarContainer"></div>')
                        .append(rechercheCDN)
                        .append(this._jsdep_cdn())
                        .append(saisirAdresse)
                        .append(this._jsdep_external())
                    );
        }, 
        
        _jsdep_cdn: function () {
            
            // zone de recherche
            var input  = $('<input \n\
                id="'   +UISideBar.ID_JSCDN_INPUT+'" \n\
                class="'+UISideBar.CLASSNAME_INPUT+'" type="text">');
            
            input.attr('disabled', 'disabled'); // .removeAttr('disabled');
            input.attr('title', '[TODO]...');
            
            // bouton de recherche sur le CDN
            var button_search = $('<button \n\
                id="'   +UISideBar.ID_JSCDN_BUTTON+'" \n\
                class="'+UISideBar.CLASSNAME_BUTTON+'" type="button">...</button>');
            button_search.on("click", function(event) {
                console.log(event);
                // select_find.show();
            });
            
            button_search.attr('disabled', 'disabled'); // .removeAttr('disabled');
            button_search.attr('title', '[TODO]...');
            
            // liste des resultats recherchée
            var select_find = $('<select \n\
                id="'   +UISideBar.ID_JSCDN_SEL_FIND+'" \n\
                class="'+UISideBar.CLASSNAME_SELECT+'" size="0"></select>');
            select_find.on("click", function(event) {
                console.log(event);
                // select_list.show();
            });
            select_find.hide();
            
            // ajout d'une lib. externe dans la liste des selections
            var select_list = $('<select \n\
                id="'   +UISideBar.ID_JSCDN_SEL_LIST+'" \n\
                class="'+UISideBar.CLASSNAME_SELECT+'" size="0"></select>');
            select_list.on("click", function(event) {console.log(event);});
            select_list.hide();
            
            return $('<div class="_PlayGroundJS_sidebarContainerInto"></div>')
                        .append(input)
                        .append(button_search)
                        .append(select_find)
                        .append(select_list);
        },
        
        _jsdep_external: function () {
            
            // zone de saisie
            var input  = $('<input \n\
                id="'   +UISideBar.ID_JSEXT_INPUT+'" \n\
                class="'+UISideBar.CLASSNAME_INPUT+'" type="text">');
            
            input.attr('disabled', 'disabled'); // .removeAttr('disabled');
            input.attr('title', '[TODO]...');
            
            // bouton de recherche sur le CDN
            var button_add = $('<button \n\
                id="'   +UISideBar.ID_JSEXT_BUTTON_ADD+'" \n\
                class="'+UISideBar.CLASSNAME_BUTTON+'" type="button">+</button>');
            button_add.on("click", function(event) {
                console.log(event);
                // select_list.show();
            });
            
            button_add.attr('disabled', 'disabled'); // .removeAttr('disabled');
            button_add.attr('title', '[TODO]...');
    
            // liste des ajouts
            var select_list = $('<select \n\
                id="'   +UISideBar.ID_JSEXT_SEL_LIST+'" \n\
                class="'+UISideBar.CLASSNAME_SELECT+'" size="0"></select>');
            select_list.on("click", function(event) {
                console.log(event);
            });
            select_list.hide();
            
            
            return $('<div class="_PlayGroundJS_sidebarContainerInto"></div>')
                        .append(input)
                        .append(button_add)
                        .append(select_list);
        },
        
        /**
         * fonction getter/setter sur JS API
         */
        get_jsapi_selected: function () {
            return this.m_jsapi_selected;
        },
        
        set_jsapi_selected: function (bselected) {
            throw new Error("Not yet implemented !");
        },
        
        clean_jsapi_info: function () {
            // INFO
            // clean des anciennes valeurs...
            $('#'+UISideBar.ID_JSAPI_INFO).children().remove();
        },
        
        clean_jsapi_dependencies: function () {
            // INFO
            // clean des anciennes valeurs...
            $('#'+UISideBar.ID_JSAPI_SELECT).children().remove();
            $('#'+UISideBar.ID_JSAPI_SELECT_CSS).children().remove();
        },
        
        get_jsapi_dependencies: function () {
            return this.m_jsapi_dependencies;
        },
        
        get_jsapi_dependencies_css: function () {
            return this.m_jsapi_dependencies_css;
        },
        
        set_jsapi_dependencies: function (lstdep) {
            
            var $self = this; // instance de la classe ! 
            //
            // au cas où..., un seul fichier possible...
            var mydeps;
            if (typeof mydeps === "string") {
                mydeps = [lstdep];
            } 
            else {
                mydeps = lstdep;
            }
            
            // information si auncunes dependances ?
            if (typeof mydeps === 'undefined' || mydeps.length == 0) {
                return [];
            }
            
            // INFO
            // ajouter des items dans la liste 
            for(var i=0; i<mydeps.length; i++) {
                $('#'+UISideBar.ID_JSAPI_SELECT)
                    .append(
                        new Option(
                            mydeps[i], 
                            mydeps[i]) // FIXME valeur === affichage !? nom de la lib. ?
                    );
            }
            
            // save
            if ($self.m_jsapi_dependencies != null) {
                $self.m_jsapi_dependencies = $self.m_jsapi_dependencies.concat(mydeps);
            }
            else {
                $self.m_jsapi_dependencies = mydeps;
            }

        },
        
        set_jsapi_dependencies_css: function (lstdep) {
            
            var $self = this; // instance de la classe ! 
            //
            // au cas où..., un seul fichier possible...
            var mydeps;
            if (typeof mydeps === "string") {
                mydeps = [lstdep];
            } 
            else {
                mydeps = lstdep;
            }
            
            // information si auncunes dependances ?
            if (typeof mydeps === 'undefined' || mydeps.length == 0) {
                return [];
            }
            
            // INFO
            // ajouter des items dans la liste 
            for(var i=0; i<mydeps.length; i++) {
                $('#'+UISideBar.ID_JSAPI_SELECT_CSS)
                    .append(
                        new Option(
                            mydeps[i], 
                            mydeps[i]) // FIXME valeur === affichage !? nom de la lib. ?
                    );
            }
            
            // save
            if ($self.m_jsapi_dependencies_css != null) {
                $self.m_jsapi_dependencies_css = $self.m_jsapi_dependencies_css.concat(mydeps);
            }
            else {
                $self.m_jsapi_dependencies_css = mydeps;
            }

        },
    
        /**
         * fonction getter/setter sur JS FRAMEWORK
         */
        
        // TODO
        
         /**
         * fonction d'insertion dans le menu
         * - rubrique
         * - sous-rubrique
         * - element 
         */
        topic: function () {
            throw new Error("Not yet implemented !");
        },
        
        category: function () {
            throw new Error("Not yet implemented !");
        },
        
        item: function (code) {
            throw new Error("Not yet implemented !");
        },
    };
    
    return UISideBar;
    
});