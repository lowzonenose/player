define(["log4js", "config"], function (Log4js, Config) {
    
    /**
     * DESCRIPTION
     *  Gestion du logger.
     *  (surcharge de la librairie 'log4javascript')
     *   
     * INFO
     *   Par defaut, le logger est actif en mode ALL.
     *   La configuration est gérée via la class 'config.js'.
     *   
     * USAGE
     *  var m_Logger = new Logger();
     *  m_Logger.debug("Activation du logger en mode " + m_Logger.level());
     *
     * RETURN
     *  Affichage d'un message dans la console.
     * 
     * SEE ASLO
     *   config.js
     *   
     */
    
    "use strict";
    
    function Logger() {
        
        if (!(this instanceof Logger)) {
            throw new TypeError("Logger constructor cannot be called as a function.");
        }
        
        var mylogger   = log4javascript.getLogger("logger");
        mylogger.addAppender(new log4javascript.BrowserConsoleAppender());
        
        // test sur niveau du logger
        var level = Config.application.logger.level;
        if (level == null) {
            mylogger.setLevel(Logger.PARAMS_LEVEL);
        }
        else {
            switch (level) {
                case "ALL":
                    mylogger.setLevel(log4javascript.Level.ALL);
                    break;
                case "DEBUG":
                    mylogger.setLevel(log4javascript.Level.DEBUG);
                    break;
                case "INFO":
                    mylogger.setLevel(log4javascript.Level.INFO);
                    break;
                case "WARN":
                    mylogger.setLevel(log4javascript.Level.WARN);
                    break;
                case "ERROR":
                    mylogger.setLevel(log4javascript.Level.ERROR);
                    break;  
                default:
                    mylogger.setLevel(Logger.PARAMS_LEVEL);
            }
        }
        
        // test sur activation du logger
        var active = Config.application.logger.active;
        if (active == null) {
            log4javascript.setEnabled(Logger.PARAMS_ACTIVE);
        }
        else {
            log4javascript.setEnabled(active);
        }
        
        this.logger   = mylogger;
    }
    
    Logger.PARAMS_LEVEL  = log4javascript.Level.ALL;
    Logger.PARAMS_ACTIVE = true;
    
    Logger.prototype = {
        
        constructor: Logger,
        log: function (message) {
            this.logger.log(this.logger.getLevel(), message);
        },
        info: function (message) {
            this.logger.info(message);
        },
        debug: function (message) {
            this.logger.debug(message);
        },
        warn: function (message) {
            this.logger.warn(message);
        },
        error: function (message) {
            this.logger.error(message);
        },
        level: function() {
            return this.logger.getLevel().toString();
        }
    };
    
    return Logger;
});