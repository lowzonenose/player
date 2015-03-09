
## DESCRIPTION

  Gestion du logger. (surcharge de la librairie 'log4javascript')
   
## INFO

   Par defaut, le logger est actif en mode ALL.

   La configuration est gérée via la class 'config.js'.
   
## USAGE

```javascript
  var m_Logger = new Logger();
  m_Logger.debug("Activation du logger en mode " + m_Logger.level());
```

## RETURN

  Affichage d'un message dans la console.
 
## SEE ASLO

   config.js
    