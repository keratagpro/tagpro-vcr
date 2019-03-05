The game.html file is the main TagPro game file, retrieved using View
Source in any active game, with the following changes:

* Header section replaced entirely
* Exit button replaced with Seek button
* All Google ads & analytics removed
* All Joiner stuff removed
* URLs on assets changed to local paths
* Seek input box added
* Local scripts added

All referenced game assets are downloaded into the assets/vendor
subdirectories. They are all unmodified, except stylesheets/style.css,
which has the URL paths replaced with local paths.