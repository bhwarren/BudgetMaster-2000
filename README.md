A simple weekly budget manager, with a responsive design. 

Please note that this is a quick and dirty project I wrote in a short amout of time as a fun proof-of-concept project.

Boons:
  - Single page w/ responsive design
  - simple, straightforward usage
  - Site uses https
  - Facebook Authentication keeps login security requirements minimal
  - login happens once as long as facebook user isn't logged out

Critical Analysis:
  - uses css in the HTML file.  Future edits should move this out to a .css file
  - includes jquery for just a minor function.  replace it w/ proper angular equivalent (ng-class)
  - uses plain unencrypted json to store the user data on the filesystem.  Should switch to a proper noSQL DB like Couch/Mongo
  - needs a logout button
  - static files should have a better file structure (one directory for every major function). This app is tiny though, so it's less of an issue



Libraries Used (Node.js):
  - passport-facebook
  - express
  - body-parser

Libraries Used (Client):
  - angular 1
  - bootstrap
  - jquery


<img src="https://raw.githubusercontent.com/bhwarren/BudgetMaster-2000/master/Screenshot_20170908-160949.png" alt="Screenshot" width="300px" /> <img src="https://raw.githubusercontent.com/bhwarren/BudgetMaster-2000/master/Screenshot_20170908-144040.png" alt="Adding Screenshot" width="300px" />
