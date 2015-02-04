jQuery(function ($) {
    "use strict";

    
    /**
     * show a successful message.
     * @param {String} text the text to show.
     */
    function showMessage(text) {
        console.log(text);
    }
    /**
     * show an error message.
     * @param {String} text the text to show.
     */
    function showError(text) {
        console.log(text);
    }

    /**
     * Fetch the content, add it to the JSZip object
     * and use a jQuery deferred to hold the result.
     * @param {String} url the url of the content to fetch.
     * @param {String} filename the filename to use in the JSZip object.
     * @param {JSZip} zip the JSZip instance.
     * @return {jQuery.Deferred} the deferred containing the data.
     */
    function deferredAddZip(url, filename, zip) {
        var deferred = $.Deferred();
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if(err) {
                deferred.reject(err);
            } else {
                zip.file(filename, data, {binary:true});
                deferred.resolve(data);
            }
        });
        return deferred;
    }

    if(!JSZip.support.blob) {
        showError("This demo works only with a recent browser !");
        return;
    }

    $("#demo").click(
        function () {
            
            var zip  = new JSZip();
            var root = zip.folder("sample-lvl0").folder("sample-lvl1");
            
            var deferreds = [];

            var url_hostname  = window.location.hostname;
            var url_protocol  = window.location.protocol;
            var url_port      = window.location.port;
            var url_pathname  = window.location.pathname;

            var url = url_protocol.concat("//");
            (url_port) ? url = url + url_hostname.concat(":", url_port) : url = url + url_hostname;
            url = url + url_pathname.substring(0, url_pathname.lastIndexOf("/"));

            // find every checked item
            var files = [
                "/../../jasmine/resources/sample/sample.css", 
                "/../../jasmine/resources/sample/sample.js",
                "/../../jasmine/resources/sample/sample.html"
            ];

            $.each(files, function (index, value) {
                var file     = url + value;
                var filename = file.substring(file.lastIndexOf("/")+1);
                deferreds.push(deferredAddZip(file, filename, root));
            });
            
            var dir  = root.folder("folder");
            var file = "/../../jasmine/resources/sample/folder/README";
            deferreds.push(deferredAddZip(url + file, file.substring(file.lastIndexOf("/")+1),  dir));
            
            var image = "/../../jasmine/resources/sample/folder/logo-api.png";
            deferreds.push(deferredAddZip(url + image, image.substring(image.lastIndexOf("/")+1),  dir));
            
            // when everything has been downloaded, we can trigger the dl
            $.when.apply($, deferreds).done(function () {
                var blob = zip.generate({type:"blob"});

                // see FileSaver.js
                saveAs(blob, "example.zip");

                showMessage("done !");
            }).fail(function (err) {
                showError(err);
            });
            return false;
        }
    );
});

// vim: set shiftwidth=4 softtabstop=4:
