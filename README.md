playgroundjs
============

C'est tout simplement un JsFiddle Like !
Il est adapté pour l'utilisation de l'API JS Geoportail...

Exemples
--------

avec {host} = http://localhost:8383/test-player/www/

0. {host}/template.html
    Par défaut, on recherche dans le répertoire ./samples/sample_1/, 
    les fichiers sample_1.(html,css,js)

1. {host}/template.html?sample_name=sample_1
    Par défaut, on recherche dans le répertoire ./samples/{sample_name}/, 
    les fichiers {sample_name}.(html,css,js)

2. {host}/template.html?sample_name=sample_1&type=extended
    Idem, et on charge la librarie API JS Geoportail en mode Extended
    (value : extended|ext, standard|std, mobile|mob, 3d, flash|f, gouv|g, minimal|min).

3. {host}/template.html?sample_path=samples&sample_name=sample_1
    On recherche les fichiers {sample_name}.(html,css,js) dans le répertoire
    ./{sample_path}/{sample_name}/.

4. {host}/template.html?sample_path=samples&sample_name=sample_1&sample_file_html=&sample_file_js=&sample_file_css=
    On recherche les differents fichiers dans le répertoire ./{sample_path}/{sample_name}/

5. {host}/template.html?sample_file_html=./samples/sample_2/sample_2.html&sample_file_js=./samples/sample_2/sample_2.js&sample_file_css=./samples/sample_2/sample_2.css
    On met directement le chemin complet des fichiers.

6. {host}/template.html?sample_path=./samples/sample_2/&sample_file_html=sample_2.html&sample_file_js=sample_2.js&sample_file_css=sample_2.css
    On recherche les differents fichiers dans le répertoire ./{sample_path}/

7. {host}/template.html?sample_name=./sample_3/&sample_file_html=sample_3.html&sample_file_js=sample_3.js&sample_file_css=sample_3.css
    On recherche les differents fichiers dans le répertoire ./samples/{sample_name}/.

8. {host}/template.html?applysyntaxhighlighter=false
    exemple sans colorisation synthaxique

9. {host}/template.html?sample_name=sample_1&type=extended&version=2.1.1&url=http%3A%2F%2Fapi.ign.fr%2Fgeoportail%2Fapi%2Fjs%2F"
    On charge la librarie API JS Geoportail en mode Extended, et on la recherche sur une version sur une url 

Exemple 3D
----------

{host}/template.html?type=min&sample_file_html=./samples/3d/geoportalCesium_Relief.html&sample_file_js=./samples/3d/geoportalCesium_Relief.js&sample_file_css=./samples/3d/css/geoportalCesium.css
ou 
{host}/template.html?type=min&sample_path=samples&sample_name=3d&sample_file_html=geoportalCesium_Relief.html&sample_file_js=js/geoportalCesium_Relief.js&sample_file_css=css/geoportalCesium.css

