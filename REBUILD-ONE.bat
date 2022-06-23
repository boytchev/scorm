@ECHO OFF

CD src
rem inside: GitHub\scorm\src\
CALL :BuildOne "color-hues"
CD ..
EXIT /B



:BuildOne

ECHO Rebuilding SCORM "%~1"

rem inside: GitHub\scorm\src\
rem copy ..\misc\js\suica.js "%~1"

del "..\bin\%~1.zip"

cd "%~1"
rem inside: GitHub\scorm\src\%~1\
..\..\misc\7z\7z a "..\..\bin\%~1.zip" *

cd ..\..\misc\xsd
rem inside: GitHub\scorm\misc\xsd
..\..\misc\7z\7z a "..\..\bin\%~1.zip" *

..\..\misc\7z\7z d "..\..\bin\%~1.zip" *.bak
..\..\misc\7z\7z d "..\..\bin\%~1.zip" *.mp4
..\..\misc\7z\7z d "..\..\bin\%~1.zip" *.md
..\..\misc\7z\7z d "..\..\bin\%~1.zip" images\snapshot*.jpg
..\..\misc\7z\7z d "..\..\bin\%~1.zip" images\doc-*.jpg
cd ..\..\src
rem inside: GitHub\scorm\misc\xsd
