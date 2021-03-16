The game.html file is the main TagPro game file, retrieved using View
Source in any active game, with the following changes:

* Header section replaced entirely
* Exit button removed
* All Google ads & analytics removed
* All Joiner stuff removed
* URLs on assets changed to local paths
* Local scripts added

All referenced game assets are downloaded into the assets/vendor
subdirectories. They are all unmodified, except stylesheets/style.css,
which has the URL paths replaced with local paths.

The game-egg.html file has additional eggball-specific assets.
