
## DESCRIPTION du MODULE CDN

  Gestion des librairies externes à ajouter dans l'exemple,  
  via une API de consultation d'un 'Content Delivery Networks for JS'.
  
## INFORMATION 

  Par defaut, on télécharge les libraries sur 
    [http://api.cdnjs.com/libraries](http://api.cdnjs.com/libraries)

  La recherche se fait via la construction de l'url suivante :
    [http://api.cdnjs.com/libraries?search=jquery&fields=version](http://api.cdnjs.com/libraries?search=jquery&fields=version)

  On obtient un objet JSON (liste de resultats).

  Cette liste est affichée pour selection dans le menu de la page principale.
 
## USAGE

```javascript
  var cdn = new CDN("codemirror");
  // en mode JSON (par defaut)
  cdn.request(); 
  
  // en mode JSONP
  var options = { 
       mode: "jsonp",                         // par defaut, "json"
       url: "http://api.cdnjs.com/libraries", // par defaut
       callback: function () {}               // par defaut, cf. fonction 'insert'
  }
  cdn.request(options); 
```

## RETURN 

  Reponse en JSONP ou JSON
  
  _Ex. JSONP par defaut_

```javascript
  typeof insert === 'function' && insert(
  {
    results: [
     {
       name: "codemirror",
       latest: "http://cdnjs.cloudflare.com/ajax/libs/codemirror/4.8.0/codemirror.min.js",
       version: "4.8.0"
     }
    ],
  });
```

## REFERENCES (CORS)

  [Howto CORS](http://www.eriwen.com/javascript/how-to-cors/)

  [Access Control 1](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Browser_compatibility)

  [Access Control 1](http://arunranga.com/examples/access-control/)

  [XHR](https://xhr.spec.whatwg.org/)
  