
## DESCRIPTION

  Gestion des parametres de l'URL.

  Permet de definir les informations sur :
  - l'API : version, type, url
  - l'exemple
  - la colorisation synthaxique
  
## USAGE

```javascript
  var obj = new Settings();
  obj.getSettings();
```

## RETURN

```javascript
  {
      applySyntaxHighlighter: ...,
      typeApiJs: ...,
      versionApiJs: ...,
      urlApiJs: ...,
      loadSample : {
          sample_path:  ...,
          sample_name:  ...,
          sample_file: {
              html: ...,
              css:  ...,
              js:   ...,
          }
      }
  }
```
