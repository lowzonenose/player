

##  DESCRIPTION

   surcharge de la lib. de colorisation synthaxique : CodeMirror 
   
##  INFORMATION
 
##  USAGE
 
```javascript
   var m_obj = new SyntaxHighlighter();
   
   m_obj.apply("js"); // ex: js, html ou css !
   m_obj.apply("js", {
      onfinish: function(msg) {
          // ...
      }
   });
   
   m_obj.remove();
   m_obj.update();
   m_obj.clear();
   m_obj.restore(); // Not yet implemented !
```
   
##  RETURN
 
##  REFERENCES

 CodeMirror is a code-editor component that can be embedded in Web pages
 [http://codemirror.net/](http://codemirror.net/)

   