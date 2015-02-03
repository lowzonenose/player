/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

jQuery(function($) {
    
    function getFile(url, file) {
        
        var deferred = $.Deferred();
        
        $.ajax({
            url : url.concat(file),
            type : 'GET' ,
            dataType : 'text',
            success : function(code_text, statut){ 
                console.log("success!");

                var div = document.createElement("div");
                div.setAttribute('id', "text");
                var text = document.createTextNode(code_text);
                div.appendChild(text);  
                document.body.appendChild(div);
                
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
    
    (function () {
        
        var files     = [];
        var deferreds = [];
        
        var url_hostname  = window.location.hostname;
        var url_protocol  = window.location.protocol;
        var url_port      = window.location.port;
        var url_pathname  = window.location.pathname;

        var url = url_protocol.concat("//");
        (url_port) ? url = url + url_hostname.concat(":", url_port) : url = url + url_hostname;
        url = url + url_pathname.substring(0, url_pathname.lastIndexOf("/"));
        
        files.push("/promises.html");
        files.push("/promises-ajax.js");
        files.push("/lib/jquery.js");
        
        $.each(files, function (index, value) {
            deferreds.push(getFile(url, value));
        });
        
        $.when.apply(this, deferreds)
            .done(
                function() {})
            .fail(
                function() {});
    })();
});
