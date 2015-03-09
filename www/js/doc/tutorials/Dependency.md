
## DESCRIPTION du MODULE Dependency

  Gestion des dependances des exemples.

  Permet d'extraire une liste de librairies interne et/ou externe utilisées 
  dans l'exemple chargé.

  Pour information, cette liste est affichée dans le menu de la page principale.
  
##  USAGE

```javascript
  var dep = new Dependency();
  
  var lstUrl = null;
  lstUrl = dep.getScriptsIntoBody();
  lstUrl = dep.getScriptsIntoHead();
  lstUrl = dep.getScriptsInternal();
  lstUrl = dep.getScriptsExternal();
```  
  ou
  
  (cf. Helper.getDoc)

```javascript
  var parser = new DOMParser();
  var doc    = parser.parseFromString(code_html, "text/html");
  var dep = new Dependency(doc);
  
  var lstUrl = null;
  lstUrl = dep.getScriptsIntoBody();
  lstUrl = dep.getScriptsIntoHead();
  lstUrl = dep.getScriptsInternal();
  lstUrl = dep.getScriptsExternal();
 ```
 
##  RETURN

  _Ex. de liste de dependances_

  - External  http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js
  - External  http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
  - Internal  js/apiconfig.js
  - Internal  ./sample.js
  - Internal  ./api/js/2.1.1-SNAPSHOT/Geoportal.js
  - Internal  ./thirdParty/Cesium/Cesium.js
  - External  http://api.ign.fr/geoportail/api/js/2.1.0/Geoportal.js
