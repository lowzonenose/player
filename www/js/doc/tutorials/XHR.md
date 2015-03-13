   
## DESCRIPTION


## INFORMATION
  
Requête avec parser XML ou JSON.
(Utilisation des Promises)
 
## USAGE

```javascript
  xhr  = new RequestXHR();

  xhr.get("http://localhost/test-player/www/js/test/jasmine/resources/test.json").then(function(response) {
        console.log("Succès : ", response);
    }).catch(function(error) {
        console.log("Échec : ", error);
    });
```
 
 ou pour avoir un objet JSON

```javascript  
  xhr  = new RequestXHR();

  xhr.getJSON("http://localhost/test-player/www/js/test/jasmine/resources/test.json").then(function(response) {
        console.log("Succès : ", response);
    }).catch(function(error) {
        console.log("Échec : ", error);
    });
```
 
## RETURN


## REFERENCE