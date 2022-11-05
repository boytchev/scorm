---
title: 'Thimble bits'
description: A Suica SCORM module
tag: scorm
---

&nbsp;
### About

Line clipping in computer graphics is a process for removing parts of lines that are outside the graphical window. One of the basic algorithms for this is the [Cohen–Sutherland line clipping algorithm](https://en.wikipedia.org/wiki/Cohen–Sutherland_algorithm). It divides the window into zones and assigns a bitmask for each zone. The thimble bits application represents a topological variation with the following modifications:

1. Dividing line are arcs and the zones are not rectangular.
2. Dividing lines are not 4, and the zones are not 9.
3. Bits "0" and "1" are replaced by a circle "◯" and a cross "✕".

The challenge in Thimble bits is to find the bitmask for one of the zones when the bitmasks of some other zones are known. Solving the challenges uses the fundamental properties of the Cohen-Sutherland bitmasks:

1. Each arc represents a specific bit position in all masks.
2. All zones from one side of an arc have the same value for this bit; all zone from the other side have the other value of the bit.

Click on the image to start the application.

[<img src="docs/snapshot.jpg">](thimble-bits.html)

Alternatively, here are versions in [English](thimble-bits.html?lang=en), [Bulgarian](thimble-bits.html?lang=bg) and [Japanese](thimble-bits.html?lang=jp).

### How to play

When the application is started it shows a thimble. Click on the thimble to generate arcs &ndash; they are inside the thimble. There are dents on the outer surface of the thimble indicating arcs end points. The level of difficulty defines the number of bits and how many hints are provided. The goal is to reach score 100. 

- **Starting**: Click anywhere on the thimble.
- **Playing**:  Click on the orange-yellowish symbols to toggle bits.
- **Ending**: Click on the button inside the thimble  to end the challenge.

Here are a few hints: The depth of bits corresponds to the depth of arcs. The depth of arc can be found by other checking their end points or by observing how arcs' bodies overlap. The dents can be used to identify arc end points. Beware of fake dents &dash; these are dents that do not correspond to arcs. And important rule for all configurations is that two neighbouring zones differ exactly by one bit. The bitmask of one zone is sufficient to get the bitmasks for all other zones.

The following examples show how arcs and bits are related. The left image shows how an arc splits the thimble into two zones. One is marked by a circle "◯", and the other is marked by a cross "✕". If there are more arcs, there will be more zones. The second image demonstrates how all zones from one side of the red arc are marked by circles "◯", while all the others are marked by crosses "✕". Thimble bits are placed vertically and their order is the same as the order of the arc. Thus, the red arc is in the middle, so it corresponds to the middle bit. The right image shows the bitmasks of all zones. The bits for the red arc are red.

<img src="docs/example.png">



### Integration with LMS

This application is provided as [SCORM](https://scorm.com/scorm-explained/one-minute-scorm-overview/) (Sharable Content Object Reference Model) module. It can be used with any [LMS](https://en.wikipedia.org/wiki/Learning_management_system) (Learning Management System) that supports version SCORM 1.2. SCORM modules are delivered as ZIP archive.

[ [Download ZIP](../../bin/euler-grill.zip) ]

Follow the instruction of your LMS on how to install a SCORM module. Usually the ZIP is uploaded and a few additional settings are set.

When run from a LMS, the application reads these data:
- `cmi.core.student_name` &ndash; a string with the student's name

When run from a LMS, the application sends back these data:

- `cmi.core.score.raw` &ndash; a number from 0 to 100 for the overall score
- `cmi.core.score.min` &ndash; 0
- `cmi.core.score.max` &ndash; 100
- `cmi.core.lesson_status` &ndash; `'completed'` or `'incomplete'`

### Data policy

The application itself does not create or use [HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), [web beacons](https://en.wikipedia.org/wiki/Web_beacon), [spy pixels](https://en.wikipedia.org/wiki/Spy_pixel) or any other tracking technology. Besides SCORM-related data, described in section [Integration with LMS](#integration-with-lms), the application creates a local storage entry called `'sound'` with values `'on'`, `'off'` or `'fx'`. This entry is used to record user's sound preference and it is not sent to the server.

When the application is run from a LMS, the LMS may utilize its own data policy, which is beyond the scope and the control of this application.

### Disclaimer

The application requires a good perception of depth.

### Credits

This application uses a background music from [ccMixter](http://ccmixter.org/):

- "[Spacedust](http://dig.ccmixter.org/files/airtone/64741)" by [Airtone](http://dig.ccmixter.org/people/airtone) (c) copyright 2022 licensed under [CC BY 3.0 License](https://creativecommons.org/licenses/by/3.0/).

and sound effects from [Mixkit](https://mixkit.co/):

- "[Game quick warning notification](https://mixkit.co/free-sound-effects/click/)" licensed under [Mixkit Sound Effects Free License](https://mixkit.co/license/#sfxFree),
- "[Quick win video game notification](https://mixkit.co/free-sound-effects/click/)" licensed under [Mixkit Sound Effects Free License](https://mixkit.co/license/#sfxFree).


	
<small>{{site.time | date: "%B, %Y"}}</small>