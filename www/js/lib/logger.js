/**
 * Log
 * @tutorial Logger
 * @module Logger
 * @see module:log4js
 * @see module:config
 */
define(["log4js", "config"], function (Log4js, Config) {
    
    "use strict";
    
    /**
     * Description
     * @method Logger
     * @return 
     */
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
        
        /**
         * @alias Logger
         * @constructor Logger
         */
        constructor: Logger,
        /**
         * Description
         * @method log
         * @param {} message
         * @return 
         */
        log: function (message) {
            this.logger.log(this.logger.getLevel(), message);
        },
        /**
         * Description
         * @method info
         * @param {} message
         * @return 
         */
        info: function (message) {
            this.logger.info(message);
        },
        /**
         * Description
         * @method debug
         * @param {} message
         * @return 
         */
        debug: function (message) {
            this.logger.debug(message);
        },
        /**
         * Description
         * @method warn
         * @param {} message
         * @return 
         */
        warn: function (message) {
            this.logger.warn(message);
        },
        /**
         * Description
         * @method error
         * @param {} message
         * @return 
         */
        error: function (message) {
            this.logger.error(message);
        },
        /**
         * Description
         * @method level
         * @return CallExpression
         */
        level: function() {
            return this.logger.getLevel().toString();
        }
    };
    
    return Logger;
});