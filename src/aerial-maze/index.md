&nbsp;
# Aerial maze

When airplane fly they can change their orientation by rotation around [three principal axes](https://en.wikipedia.org/wiki/Aircraft_principal_axes) &ndash; <em>vertical</em>, <em>transverse</em> and <em>longitudinal</em>. The rotation around the vertical axis is called [yaw](https://howthingsfly.si.edu/flight-dynamics/roll-pitch-and-yaw) (i.e. the front of the aircraft turns left or right). The rotation around the transverse axis is called [pitch](https://howthingsfly.si.edu/flight-dynamics/roll-pitch-and-yaw) (i.e. the front of the aircraft goes up or down). The rotation around the longitudinal axis is called [roll](https://howthingsfly.si.edu/flight-dynamics/roll-pitch-and-yaw) (i.s. the aircraft rolls clockwise or counterclockwise). 

The challenge in Aerial Maze is to navigate a spaceship from one platform to another, following a predefined route and using only yaw, pitch and roll commands.

Click on the image to start the application.

[<img src="docs/snapshot.jpg">](aerial-maze.html)

Alternatively, here are versions in [English](aerial-maze.html?lang=en), [Bulgarian](aerial-maze.html?lang=bg) and [Japanese](aerial-maze.html?lang=jp).

### How to play

When the application is started it shows a hangar with a spaceship. Click on them to start a challenge &ndash; this will show two platforms, will move the spaceship to one of them and will set possible routes. You have to set navigation commands and execute them so that the spaceship flies to the other platform. The number of execution attemps is limited. The level of difficulty defines the complexity of the routes and the set of available navigation commands. The goal is to reach score 100. 

- **Starting**: Click anywhere on the hangar.
- **Playing**: Playing is a sequence of two alternating phases (navigating and executing):
	1. **Navigating**: Click on a navigation button to send a command to the spaceship (it will not be executed at this moment);
	2. **Executing**: Click on an execution button to run all commands (or to clear them without running).
- **Ending**: The challenges ends by itself when the spaceship is parked at the target platform or when all commands have been used.

See section [Control buttons](#control-buttons) for details about the buttons and their functions.

Here are a few hints: Keep in mind the orientation of the spaceship, because all commands are relative to its orientation. Changing the view point helps to see the structure of the available routes. Even if some of the navigation buttons are missing, they can be emulated by the other navigation buttons. For example:

| NAVIGATION | EQUIVALENT SEQUENCE |
| --- | --- |
| <img src="docs/up.png"> | <img src="docs/down.png"><img src="docs/down.png"><img src="docs/down.png"> |
| <img src="docs/up.png"> | <img src="docs/rollccw.png"><img src="docs/right.png"><img src="docs/rollcw.png"> |

Each challenge allows two execution attempts of the spaceship commands. However, unused executions are converted into bonus attempts and can be used in next challenges (5 unused &rarr; 2 bonuses).

### Control buttons

| BUTTONS | FUNCTION |
| :---: | :-- |
| | **NAVIGATION** |
| <img src="docs/forward.png"> | Adds a command to move the airplane one step forward. A number inside the button shows the number of sroted commands. |
| <img src="docs/left.png"> <img src="docs/right.png"> | Adds a command to turn the airplane to the left or to the right. |
| <img src="docs/up.png"> <img src="docs/down.png"> | Adds a command to turn the airplane up or down. |
| <img src="docs/rollccw.png"> <img src="docs/rollcw.png"> | Adds a command to tilt the airplane left or right (i.e. counterclockwise or clockwise). |
| | **EXECUTION** |
| <img src="docs/start.png"> | Executes all stored navigation commands. Numbers inside the button show the number of left attempts. For example *2<sup>+1</sup>* means there are 2 official attempts and 1 bonus attempt left. This button has a green outline. It can be placed in various positions depending on missing navigation buttons. |
| <img src="docs/reset.png"> | Clears all stored navigation commands. This button has a red outline. It can be placed in various positions depending on missing navigation buttons. |
| | **DOCKING** |
| <img src="docs/pan_left.png"> <img src="docs/pan_right.png"> | Docks the control panel to the left or right side of the window. |
| <img src="docs/pan_top.png"> <img src="docs/pan_bottom.png"> | Docks the control panel to the top or bottom of the window. |



### Integration with LMS

This application is provided as [SCORM](https://scorm.com/scorm-explained/one-minute-scorm-overview/) (Sharable Content Object Reference Model) module. It can be used with any [LMS](https://en.wikipedia.org/wiki/Learning_management_system) (Learning Management System) that supports version SCORM 1.2. SCORM modules are delivered as ZIP archive.

[ [Download ZIP](../../bin/aerial-maze.zip) ]

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

The application requires a good perception of depth, a strong 3D memory and a solid sense of orientation in space.

### Credits

This application uses 3D models from [Kenney](www.kenney.nl):

- "[Space Kit](https://www.kenney.nl/assets/space-kit) by Kenney licensed under [CC0 License](http://creativecommons.org/publicdomain/zero/1.0/),


a background music from [SoundCloud](https://soundcloud.com):

- "[Mermaid Princess](https://soundcloud.com/dfiechter2/mermaid-princess) by Derek Fiechter / [Theme Cloud](https://soundcloud.com/dfiechter2)  licensed under [CC BY-NC 3.0 License](https://creativecommons.org/licenses/by-nc/3.0/),

and sound effects from [Mixkit](https://mixkit.co/):

- "[Game quick warning notification](https://mixkit.co/free-sound-effects/click/)" licensed under [Mixkit Sound Effects Free License](https://mixkit.co/license/#sfxFree),
- "[Quick win video game notification](https://mixkit.co/free-sound-effects/click/)" licensed under [Mixkit Sound Effects Free License](https://mixkit.co/license/#sfxFree),
- "[Pen click and release](https://mixkit.co/free-sound-effects/click/)" licensed under [Mixkit Sound Effects Free License](https://mixkit.co/license/#sfxFree).


	
<small>{{site.time | date: "%B, %Y"}}</small>