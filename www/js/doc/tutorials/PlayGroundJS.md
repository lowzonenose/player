## DESCRIPTION

## INFORMATION

## USAGE

```javascript

    var player  = null;
    var options = {
        div: 'PlayGroundJS',
        onsuccess : function (e) {
            console.log(e);
        },
        onerror : function (e) {
            console.log(e);
        }
    };

    $( document ).ready(function() {        
        player = new PlayGroundJS(options);
        player.load();
    });

    $( window ).resize(function() {
        player.resize();
    });
```

## RETURN

##  REFERENCES