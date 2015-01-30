define(["jquery", "cdn"], function($, CDN) {
    
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
    UISideBar.CLASSNAME        = "_PlayGroundJS_sidebar";
    UISideBar.CLASSNAME_LIST   = "_PlayGroundJS_sidebarDivList";
    UISideBar.CLASSNAME_INPUT  = "_PlayGroundJS_sidebarInput";
    UISideBar.CLASSNAME_BUTTON = "_PlayGroundJS_sidebarButton";
    UISideBar.CLASSNAME_SELECT = "_PlayGroundJS_sidebarSelect";
    
    // compteur id
    UISideBar.COUNT_JSEXT_LIST  = 0;
    UISideBar.COUNT_JSCDN_LIST  = 0;
    
    // id for jquery
    UISideBar.ID_JSAPI_INFO        = "_jsapi_info_div";
    UISideBar.ID_JSAPI_MODE        = "_jsapi_mode_div";
    UISideBar.ID_JSAPI_MODE_CHECK  = "_jsapi_mode_input";
    UISideBar.ID_JSAPI_DEP            = "_jsapi_dep_div";
    UISideBar.ID_JSAPI_DEP_SELECT     = "_jsapi_dep_select";
    UISideBar.ID_JSAPI_DEP_CSS        = "_jsapi_dep_css_div";
    UISideBar.ID_JSAPI_DEP_SELECT_CSS = "_jsapi_dep_select_css";
    
    UISideBar.ID_JSCDN            = "_jsdep_cdn_div";
    UISideBar.ID_JSCDN_INPUT      = "_jsdep_cdn_input";
    UISideBar.ID_JSCDN_SEL_FIND   = "_jsdep_cdn_select_find";
    UISideBar.ID_JSCDN_LIST       = "_jsdep_cdn_list";
    
    UISideBar.ID_JSEXT               = "_jsdep_external_div";
    UISideBar.ID_JSEXT_INPUT         = "_jsdep_external_input";
    UISideBar.ID_JSEXT_LIST          = "_jsdep_external_list";
    
    UISideBar.ID_BUTTON_ADD    = "button_add";
    UISideBar.ID_BUTTON_REMOVE = "button_remove";
    UISideBar.ID_BUTTON_SEARCH = "button_search";
    
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
        
        /**
         * Liste des ressources externes
         */
        m_jsdep_external : [],
        
        /**
         * Liste des dependances JS Framework
         */
        m_jsdep_cdn : [],
        
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
            this.clean_jsdep_cdn();
            this.clean_jsdep_external();
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
            
            var check = $('<input id="'+UISideBar.ID_JSAPI_MODE_CHECK+'" class="_PlayGroundJS_sidebarCheck" type="checkbox"/>');
            check.on("click", function() {
                check.is(":checked" ) ? $self.m_jsapi_selected = urldev : $self.m_jsapi_selected = urlcompact;
            });
            
            // check.attr('disabled', 'disabled'); // .removeAttr('disabled');
            check.attr('title', '[BETA] API JS non compactée');
            
            return $('<div id="'+UISideBar.ID_JSAPI_MODE+'" class="_PlayGroundJS_sidebarContainerInto"></div>')
                    .append(check)
                    .append($('<label for="'+UISideBar.ID_JSAPI_MODE_CHECK+'" class="_PlayGroundJS_sidebarLabel">mode dev.</div>'));
                    
        },
        
        _jsapi_dependencies: function () {

            var select = $('<div \n\
                id="'   +UISideBar.ID_JSAPI_DEP_SELECT+'" \n\
                class="'+UISideBar.CLASSNAME_LIST+'"></div>');
            select.attr('disabled', 'disabled');
            select.attr('title', 'Liste des dependances JS');
            
            return $('<div id="'+UISideBar.ID_JSAPI_DEP+'" class="_PlayGroundJS_sidebarContainerInto"></div>')
                    .append(select);

        },
        
        _jsapi_dependencies_css: function () {
            
            var select_css = $('<div \n\
                id="'   +UISideBar.ID_JSAPI_DEP_SELECT_CSS+'" \n\
                class="'+UISideBar.CLASSNAME_LIST+'"></div>');
            select_css.attr('disabled', 'disabled');
            select_css.attr('title', 'Liste des dependances CSS');
            
            return $('<div id="'+UISideBar.ID_JSAPI_DEP_CSS+'" class="_PlayGroundJS_sidebarContainerInto"></div>')
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
            
            var $self = this; // instance de la classe !
            
            // zone de recherche
            var input  = $('<input \n\
                id="'   +UISideBar.ID_JSCDN_INPUT+'" \n\
                class="'+UISideBar.CLASSNAME_INPUT+'" type="text">');
            
            // input.attr('disabled', 'disabled'); // .removeAttr('disabled');
            input.attr('title', 'Saisir un mot clef de recherche.');
            
            // bouton de recherche sur le CDN
            var button_search = $('<div \n\
                id="'   +UISideBar.ID_BUTTON_SEARCH+'" \n\
                class="'+UISideBar.CLASSNAME_BUTTON+'"></div>');
            button_search.on("click", function(event) {
                
                console.log(event);
                
                // existe t il deja des anciennes valeurs ? on nettoie ...
                $self.clean_jsdep_cdn();
                
                // on peut maintenant rechercher qqch ...
                var v = input.val();
                if (v) {

                    var cdn = new CDN(v);
                    cdn.request({ 
                        mode: "json",
                        callback: function (response) {
                            // a t on qqch de trouver ?
                            if (this.length()) {

                                console.log(this.json());
                                
                                // on ajoute les resultats dans la liste
                                for(var i=0; i<this.length(); i++) {
                                    select_find
                                        .append(
                                            new Option(
                                                this.name(i), 
                                                this.url(i))
                                        );
                                }
                                
                                // mise à jour de la taille d'affichage de la liste
                                // on limite a 5 affichages !
                                if (this.length() > 5) {
                                    select_find.attr("size", 5);
                                }
                                else {
                                    select_find.attr("size", this.length());
                                }
                                
                                // affichage de la liste
                                select_find.show();
                            }
                        }
                    });
                }
            });
            
            
            // liste des resultats recherchée dans le CDN
            var select_find = $('<select \n\
                id="'   +UISideBar.ID_JSCDN_SEL_FIND+'" \n\
                class="'+UISideBar.CLASSNAME_SELECT+'" size="0"></select>');
            select_find.on("click", function(event) {
                // TODO 
                // ajout à faire
                console.log(event);
                var k = event.target.textContent;
                var v = event.target.value;
                console.log("key:" + k);
                console.log("val:" + v);
                
                $self.add_jsdep_cdn(k, v);

            });
            select_find.hide();
            
            return $('<div id="'+UISideBar.ID_JSCDN+'" class="_PlayGroundJS_sidebarContainerInto"></div>')
                        .append(input)
                        .append(button_search)
                        .append(select_find);
        },
        
        _jsdep_external: function () {
            
            var $self = this; // instance de la classe !
            
            // zone de saisie
            var input  = $('<input \n\
                id="'   +UISideBar.ID_JSEXT_INPUT+'" \n\
                class="'+UISideBar.CLASSNAME_INPUT+'" type="text">');
            
            input.attr('title', "Saisir une URL d'une ressource JS"); // .removeAttr('disabled');
            
            // bouton d'ajout de la ressource
            var button_add = $('<div \n\
                id="'   +UISideBar.ID_BUTTON_ADD+'" \n\
                class="'+UISideBar.CLASSNAME_BUTTON+'"></div>');
            button_add.on("click", function(event) {
                var v = input.val();
                var regex = new RegExp("^http://.*\.js$");
                if (v && regex.test(v)) {
                    $self.add_jsdep_external(v);
                    input.val('');
                }
            });

            return $('<div id="'+UISideBar.ID_JSEXT+'" class="_PlayGroundJS_sidebarContainerInto"></div>')
                        .append(input)
                        .append(button_add);
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
                $('#'+UISideBar.ID_JSAPI_DEP_SELECT)
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
                $('#'+UISideBar.ID_JSAPI_DEP_SELECT_CSS)
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
    
        clean_jsapi_dependencies: function () {
            // INFO
            // clean des anciennes valeurs...
            $('#'+UISideBar.ID_JSAPI_DEP_SELECT).children().remove();
            $('#'+UISideBar.ID_JSAPI_DEP_SELECT_CSS).children().remove();
        },
        
        /**
         * fonctions sur JS FRAMEWORK
         */
        
        get_jsdep_cdn: function() {
            return this.m_jsdep_cdn;
        },
        
        clean_jsdep_cdn: function() {
            $('#'+UISideBar.ID_JSCDN_SEL_FIND).children().remove();
            $('#'+UISideBar.ID_JSCDN_SEL_FIND).attr("size", 0);
            $('#'+UISideBar.ID_JSCDN_SEL_FIND).hide();
        },
        
        add_jsdep_cdn: function (key, value) {
        
            var $self = this; // instance de la classe !

            // Identifiant de la balise, utile lors de la suppression...
            var id    = UISideBar.COUNT_JSCDN_LIST++;
            var idcss = UISideBar.ID_JSCDN_LIST + "_" + id;
            
            var container = $('<div id="'+ idcss +'">');
            
            // zone d'affichage
            var input  = $('<input class="'+UISideBar.CLASSNAME_INPUT+'" type="text">');
                input.attr('disabled', 'disabled');
                input.val(key);
                input.css({width:'80%'});
                
            // bouton de suppression
            var button_remove = $('<div \n\
                id="'   +UISideBar.ID_BUTTON_REMOVE+'" \n\
                class="'+UISideBar.CLASSNAME_BUTTON+'"></div>');
            button_remove.on("click", function(event) {
                $self.remove_jsdep_cdn(id);
            });
            
            // ajout de l'entrée à la suite...
            $('#'+UISideBar.ID_JSCDN)
                .append(
                    container
                        .append(input)
                        .append(button_remove));

            
            // ajout de cette ressource dans la liste
            if ($self.m_jsdep_cdn != null) {
                $self.m_jsdep_cdn.push(value);
            }
            
        },
        
        remove_jsdep_cdn: function (index) {
            
            var $self = this; // instance de la classe !
            console.log(index);
            
            if (index > ($self.m_jsdep_cdn.length - 1)) {
                throw new RangeError("Index Out Of Bounds");
                return;
            }
            
            // mise à vide de la ressource, mais on ne la supprime pas !
            if ($self.m_jsdep_cdn != null) {
                $self.m_jsdep_cdn[index] = null;
            }
            
            console.log($('#'+UISideBar.ID_JSCDN_LIST+'_'+index));
            
            $('#'+UISideBar.ID_JSCDN_LIST+'_'+index).remove();
        }, 
        
        /**
         * fonctions sur JS EXTERNAL
         */
        
        get_jsdep_external: function() {
            return this.m_jsdep_external;
        },
        
        clean_jsdep_external: function() {
            throw new Error("Not yet implemented !");
        },
        
        add_jsdep_external: function (value) {
        
            var $self = this; // instance de la classe !

            // Identifiant de la balise, utile lors de la suppression...
            var id    = UISideBar.COUNT_JSEXT_LIST++;
            var idcss = UISideBar.ID_JSEXT_LIST + "_" + id;
            
            var container = $('<div id="'+ idcss +'">');
            
            // zone d'affichage
            var input  = $('<input class="'+UISideBar.CLASSNAME_INPUT+'" type="text">');
                input.attr('disabled', 'disabled');
                input.val(value);
                input.css({width:'80%'});
                
            // bouton de suppression
            var button_remove = $('<div \n\
                id="'   +UISideBar.ID_BUTTON_REMOVE+'" \n\
                class="'+UISideBar.CLASSNAME_BUTTON+'"></div>');
            button_remove.on("click", function(event) {
                $self.remove_jsdep_external(id);
            });
            
            // ajout de l'entrée à la suite...
            $('#'+UISideBar.ID_JSEXT)
                .append(
                    container
                        .append(input)
                        .append(button_remove));

            
            // ajout de cette ressource dans la liste
            if ($self.m_jsdep_external != null) {
                $self.m_jsdep_external.push(value);
            }
            
        }, 
        
        remove_jsdep_external: function (index) {
            
            var $self = this; // instance de la classe !
            console.log(index);
            
            if (index > ($self.m_jsdep_external.length - 1)) {
                throw new RangeError("Index Out Of Bounds");
                return;
            }
            
            // mise à vide de la ressource, mais on ne la supprime pas !
            if ($self.m_jsdep_external != null) {
                $self.m_jsdep_external[index] = null;
            }
            
            console.log($('#'+UISideBar.ID_JSEXT_LIST+'_'+index));
            
            $('#'+UISideBar.ID_JSEXT_LIST+'_'+index).remove();
        }, 
        
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