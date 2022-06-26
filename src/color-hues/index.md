# Color Hues

[Hue](https://en.wikipedia.org/wiki/Hue) is the main property of a color. It defines the color tone, like red, green or blue. This application shows colors with different hues and the user must fit a hue among other hues. Colors can be organized by their hue in a [color wheel](color-wheel.html).

Click on the image to start the application.

[<img src="docs/snapshot.jpg">](color-hues.html)

Alternatively, here are versions in [English](color-hues.html?lang=en), [Bulgarian](color-hues.html?lang=bg) and [Japanese](color-hues.html?lang=jp).

### How to play

When the application is started it shows the back sides of seven hexagonal plates. Click on any of them to flip all of them and see randomly generated colors &ndash; the six outer plates show colors with successive hues; while the central plate shows another hue. The challenge is to fit the central hue between two of the outer hues. This must be done on a sequence of challenges with increasing difficulty. The ultimate goal is to reach score 100.

Selection of hues is done by clicking on outer plates. If needed, a second click unselects a plate. When the two plates are selected, clicking on the central plate finalizes the attempt.

The next image shows two cases with arrows pointing to the plates with closest hues to the central plate. If the hues are lined up, the central hue fits just between the two selected hues. As the score progresses, the challenge becomes harder &ndash; generated hues get closer to each other.

<img src="docs/example.jpg">

### Integration with LMS

This application is provided as [SCORM](https://scorm.com/scorm-explained/one-minute-scorm-overview/) (Sharable Content Object Reference Model) module. It can be used with any [LMS](https://en.wikipedia.org/wiki/Learning_management_system) (Learning Management System) that supports version SCORM 1.2. SCORM modules are delivered as ZIP archive.

[ [Download ZIP](../../bin/color-hues.zip) ]

Follow the instruction of your LMS on how to install a SCORM module. Usually the ZIP is uploaded and a few additional settings are set.

When run from a LMS, the application reads these data:
- `cmi.core.student_name` &ndash; a string with the student's name

When run from a LMS, the application sends back these data:

- `cmi.core.score.raw` &ndash; a number from 0 to 100 for the overall score
- `cmi.core.score.min` &ndash; 0
- `cmi.core.score.max` &ndash; 100
- `cmi.core.lesson_status` &ndash; `'completed'` or `'incomplete'`

### Data policy

The application itself does not create or use [HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), [web beacons](https://en.wikipedia.org/wiki/Web_beacon), [spy pixels](https://en.wikipedia.org/wiki/Spy_pixel) or any other tracking technology. Besides SCORM-related data, described in section [Integration with LMS](#integration-with-lms), the application creates a local storage entry called `'sound'` with values `'on'`, or `'off'`. This entry is used to record user's sound preference and it is not send to the server.

When the application is run from a LMS, the LMS may utilize its own data policy, which is beyond the scope and the control of this application.

### Disclaimer

Although the application may suggest clues of color deficiencies, it is not a diagnostic tool and should not be used for medical examination. A low sensitivity to some hues is not a definitive indicator of color deficiency.

The perception of hue varies among people, but also, it varies within the same person. There are many factors that influence the precision of hue perception.

- **Biological**: people with [color vision deficiency](https://en.wikipedia.org/wiki/Color_blindness) may have issues distinguishing hues. 
- **Environmental**: lighting conditions like [color temperature](https://en.wikipedia.org/wiki/Color_temperature) and intensity may affect hue perception.
- **Technological**: capabilities of devices, their [color gamut](https://en.wikipedia.org/wiki/Gamut) and callibration change how color are represented.
- **Psychological**: emotional state is known to affect human perceptions, including color perception.

### Credits

This application uses a background music from [SoundCloud](https://soundcloud.com):

- "[Meditatio](https://soundcloud.com/b4kfampug9gi/meditatio)" by Maks Letvinov licensed under [CC BY 3.0 License](https://creativecommons.org/licenses/by/3.0/),

and sound effects from [Mixkit](https://mixkit.co/):

- "[Game quick warning notification](https://mixkit.co/free-sound-effects/click/)" licensed under [Mixkit Sound Effects Free License](https://mixkit.co/license/#sfxFree),
- "[Quick win video game notification](https://mixkit.co/free-sound-effects/click/)" licensed under [Mixkit Sound Effects Free License](https://mixkit.co/license/#sfxFree).


	
<small>{{site.time | date: "%B, %Y"}}</small>