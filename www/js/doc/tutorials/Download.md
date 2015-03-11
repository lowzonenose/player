
## DESCRIPTION du MODULE Download

   Gestion des téléchargements des exemples au format 'zip'.

   Gestion de la construction  des archives au format 'zip'.
   
## INFORMATION

   types de fonctionnement selon les parametres d'entrée :
    - cas n° 1 : Une archive est fournie 
                  donc simple transfert
                  on peut choisir un mode de téléchargement.
    - cas n° 2 : Une liste de fichier est fournie 
                  donc compression et transfert (mode URI)
    
  Il existe +ieurs mode de téléchargements (param. interne !)

  Par defaut, on utilise le mode TAG : (cf. notes !)

```javascript
      {
        mode : (
          "TAG", // insertion d'une balise <a>
          "URL", // requete XHR
          "URI"  // requete XHR
          )
       } 
 ``` 

## USAGE

 ```javascript
   // cas n° 1 
   var options = { 
      scope    : this,        // cf. notes !
      mode     : "URI",       // cf. notes !
      archive  : "exemple",   // ex. exemple.zip
      base     : "./www/site/download/",
      onsuccess: callback,
      onfailure: callback,
   };
   var dl = new Download(options);
   dl.send();
```

```javascript
   // cas n° 2
   var options = {  
      scope    : this,                // cf. notes  
      archive  : "exemple",           // ex. exemple.zip
      base     : "./www/site/download/",
      files    : ["exemple/",
                  "exemple/file.js", 
                  "exemple/file.html",
                  "exemple/file.css"], 
      onsuccess: callback,
      onfailure: callback,
   };
   var dl = new Download(options);
   dl.send();
```
  
```javascript   
   // cas n° 2 avec gestion des contents
   var options = {  
      scope    : this,             // cf. notes  
      archive  : "exemple",        // ex. exemple.zip
      base     : "./www/site/download/",               
      files    : [
                   {path: "sample/"},
                   {path: "sample/file.1",content:"test contenu!"},
                   {path: "sample/file.2",content:"test contenu!"}"
                  ] 
      onsuccess: callback,
      onfailure: callback,
   };
   var dl = new Download(options);
   dl.send();
```
   
## NOTES
 
  - scope
   l'option 'scope' permet d'interagir avec la fonction 'callback':
   Si "scope : this", le this du callback renvoie l'objet 'player'.
   Par defaut, si le scope n'est pas renseignée, this est associé à l'objet 
   'Download'.
   
  - mode
   l'option 'mode' est utile dans le cas d'un téléchargement d'une archive. 
   par defaut, on est dans le mode 'TAG'.
   (fonctionnalité orientée maintenance !)
   
## RETURN
 
  une archive !
  
    