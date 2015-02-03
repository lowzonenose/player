
jQuery(function($) {
    
    console.log(this);

    $("#demo").click(
            function () {
                var zip = new JSZip();
                var root = zip.folder("sample");
                
                var url_hostname  = window.location.hostname;
                var url_protocol  = window.location.protocol;
                var url_port      = window.location.port;
                var url_pathname  = window.location.pathname;

                var url = url_protocol.concat("//");
                (url_port) ? url = url + url_hostname.concat(":", url_port) : url = url + url_hostname;
                url = url + url_pathname.substring(0, url_pathname.lastIndexOf("/"));
                
                var files = [];
                files.push(addFile(url, "/../../jasmine/resources/sample/sample.css", root));
                files.push(addFile(url, "/../../jasmine/resources/sample/sample.js", root));
                files.push(addFile(url, "/../../jasmine/resources/sample/sample.html", root));
                
                var dir = root.folder("folder");
                files.push(addFile(url, "/../../jasmine/resources/sample/folder/README", dir));
                // FIXME 
                // mode binary ?
                // files.push(addFile(url, "/../../jasmine/resources/sample/folder/logo-api.png", dir));
                
                $.when.apply(this, files)
                    .done(
                        function() {
                            var content = zip.generate({type:"blob"});
                            console.log(content);
                            saveAs(content, "example.zip");
                        })
                    .fail(function() {});
            }
        );
        
    function addFile(url, file, zipin) {

        var deferred = $.Deferred();
        
         $.ajax({
            url : url.concat(file),
            type : 'GET' ,
            dataType : 'text',
            success : function(code_text, statut){ 
                console.log("success!");
                var filename = file.substring(file.lastIndexOf("/")+1);
                console.log(filename);
                zipin.file(filename, code_text,{binary:true});
                deferred.resolve(code_text);
            },
            error : function(resultat, statut, erreur){
                console.log("error!");
                deferred.reject(resultat);
            },
            complete : function(resultat, statut){
                console.log("complete!");
                
            }
        });
        
        return deferred;
    };
});

