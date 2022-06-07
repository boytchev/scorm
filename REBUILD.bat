@ECHO OFF

CD src
rem inside: GitHub\scorm\src\
FOR /D %%G in ("*") DO (CALL :BuildOne "%%~G")
CD ..
EXIT /B



:BuildOne

ECHO Rebuilding SCORM "%~1"

rem inside: GitHub\scorm\src\
copy ..\misc\js\three.min.js "%~1"
copy ..\misc\js\suica.min.js "%~1"

del "..\bin\%~1.zip"

cd "%~1"
rem inside: GitHub\scorm\src\%~1\
..\..\misc\7z\7z a "..\..\bin\%~1.zip" *

cd ..\..\misc\xsd
rem inside: GitHub\scorm\misc\xsd
..\..\misc\7z\7z a "..\..\bin\%~1.zip" *

..\..\misc\7z\7z d "..\..\bin\%~1.zip" *.bak

cd ..\..\src
rem inside: GitHub\scorm\misc\xsd
