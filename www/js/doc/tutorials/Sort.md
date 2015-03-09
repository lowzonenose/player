   
##  DESCRIPTION
   
   Tri du liste de chemins (path).
   
##  INFORMATION
 
  _Exemple de liste :_

```javascript
  - string
  [
     "sample/",
     "sample/folder/",
     "sample/folder/README",
     "sample/sample.css",
     "sample/sample.html",
     "sample/sample.js",
     "sample/folder-bis/",
     "sample/folder-bis/README"
   ]
```
   
```javascript
   - object 
   [
      {path:"sample/"},
      {path:"sample/folder/"},
      {path:"sample/folder/README", content:"contenu du fichier README!"},
      {path:"sample/sample.css"},
      {path:"sample/sample.html"},
      {path:"sample/sample.js"},
      {path:"sample/folder-bis/"},
      {path:"sample/folder-bis/README", content:"contenu du fichier README!"}
   ]
```
   
## USAGE
 
```javascript
      var s = new Sort([
          {path:"sample/"},
          {path:"sample/folder/"},
          {path:"sample/folder/README", content:"contenu du fichier README!"},
          {path:"sample/sample.css"},
          {path:"sample/sample.html"},
          {path:"sample/sample.js"},
          {path:"sample/folder-bis/"},
          {path:"sample/folder-bis/README", content:"contenu du fichier README!"}]);
      var array = s.pathsort();
```
      
##  RETURN
 
  Liste triée
  
##  REFERENCES
 
  ???
    