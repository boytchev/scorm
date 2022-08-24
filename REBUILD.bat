@ECHO OFF

SET ZIP=..\..\misc\7z\7z

CD src
@rem inside: GitHub\scorm\src\
ECHO.
FOR /D %%F in ("matrix-carousel") DO (CALL :BuildOne "%%~F")
CD ..
EXIT /B



:BuildOne

REM Inside: GitHub\scorm\src\

ECHO - Rebuilding SCORM "%~1"

COPY ..\misc\js\suica.js "%~1\libs"
COPY scorm.utils.js "%~1\libs"
COPY styles.css "%~1"

CD "%~1"

REM Inside: GitHub\scorm\src\%~1\

SET XSD_PATH=..\..\misc\xsd
SET ZIP_PATH=..\..\bin
SET ZIP_FILE="%ZIP_PATH%\%~1.zip"
SET EXCLUDES= -x!*.bak -x!*.md -x!docs

DEL %ZIP_FILE%

%ZIP% a %EXCLUDES% %ZIP_FILE% * %XSD_PATH%\* >nul

CD ..\..\src
