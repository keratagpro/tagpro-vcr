import Cookies from 'js-cookie';
import React from 'react';
import Select from 'react-select';

const cookieOptions = {
	expires: 36500
};

let currentTexture;

// Texture definitions are copied from the "texture-pack-data" section
// at https://tagpro.koalabeast.com/textures/

const textures = {
	"Classic": {
		"author": "LuckySpammer",
		"name": "Classic",
		"popularity": 2921165341,
		"portal": "./vendor/textures/classic/portal.png",
		"portalBlue": "./vendor/textures/classic/portalblue.png",
		"portalRed": "./vendor/textures/classic/portalred.png",
		"speedpad": "./vendor/textures/classic/speedpad.png",
		"speedpadBlue": "./vendor/textures/classic/speedpadblue.png",
		"speedpadRed": "./vendor/textures/classic/speedpadred.png",
		"splats": "./vendor/textures/classic/splats.png",
		"tiles": "./vendor/textures/classic/tiles.png",
		"url": "classic"
	},
	"Sniper Pack": {
		"author": "DOKE",
		"name": "Sniper Pack",
		"popularity": 1126558074,
		"portal": "./vendor/textures/sniperpack/portal.png",
		"portalBlue": "./vendor/textures/sniperpack/portalblue.png",
		"portalRed": "./vendor/textures/sniperpack/portalred.png",
		"speedpad": "./vendor/textures/sniperpack/speedpad.png",
		"speedpadBlue": "./vendor/textures/sniperpack/speedpadblue.png",
		"speedpadRed": "./vendor/textures/sniperpack/speedpadred.png",
		"splats": "./vendor/textures/sniperpack/splats.png",
		"tiles": "./vendor/textures/sniperpack/tiles.png",
		"url": "sniperpack"
	},
	"Coral Light": {
		"author": "MagicPigeon",
		"name": "Coral Light",
		"popularity": 980595502,
		"portal": "./vendor/textures/corallight/portal.png",
		"portalBlue": "./vendor/textures/corallight/portalblue.png",
		"portalRed": "./vendor/textures/corallight/portalred.png",
		"speedpad": "./vendor/textures/corallight/speedpad.png",
		"speedpadBlue": "./vendor/textures/corallight/speedpadblue.png",
		"speedpadRed": "./vendor/textures/corallight/speedpadred.png",
		"splats": "./vendor/textures/corallight/splats.png",
		"tiles": "./vendor/textures/corallight/tiles.png",
		"url": "corallight"
	},
	"Muscle's Cup Gradients": {
		"author": "MuscleCups",
		"name": "Muscle's Cup Gradients",
		"popularity": 923618899,
		"portal": "./vendor/textures/musclescupgradients/portal.png",
		"portalBlue": "./vendor/textures/musclescupgradients/portalblue.png",
		"portalRed": "./vendor/textures/musclescupgradients/portalred.png",
		"speedpad": "./vendor/textures/musclescupgradients/speedpad.png",
		"speedpadBlue": "./vendor/textures/musclescupgradients/speedpadblue.png",
		"speedpadRed": "./vendor/textures/musclescupgradients/speedpadred.png",
		"splats": "./vendor/textures/musclescupgradients/splats.png",
		"tiles": "./vendor/textures/musclescupgradients/tiles.png",
		"url": "musclescupgradients"
	},
	"Muscle's Cup OG": {
		"author": "MuscleCups",
		"name": "Muscle's Cup OG",
		"popularity": 574009262,
		"portal": "./vendor/textures/musclescupog/portal.png",
		"portalBlue": "./vendor/textures/musclescupog/portalblue.png",
		"portalRed": "./vendor/textures/musclescupog/portalred.png",
		"speedpad": "./vendor/textures/musclescupog/speedpad.png",
		"speedpadBlue": "./vendor/textures/musclescupog/speedpadblue.png",
		"speedpadRed": "./vendor/textures/musclescupog/speedpadred.png",
		"splats": "./vendor/textures/musclescupog/splats.png",
		"tiles": "./vendor/textures/musclescupog/tiles.png",
		"url": "musclescupog"
	},
	"Coral": {
		"author": "MagicPigeon",
		"name": "Coral",
		"popularity": 397846887,
		"portal": "./vendor/textures/coral/portal.png",
		"portalBlue": "./vendor/textures/coral/portalblue.png",
		"portalRed": "./vendor/textures/coral/portalred.png",
		"speedpad": "./vendor/textures/coral/speedpad.png",
		"speedpadBlue": "./vendor/textures/coral/speedpadblue.png",
		"speedpadRed": "./vendor/textures/coral/speedpadred.png",
		"splats": "./vendor/textures/coral/splats.png",
		"tiles": "./vendor/textures/coral/tiles.png",
		"url": "coral"
	},
	"MTBad": {
		"author": "mtbkr24",
		"name": "MTBad",
		"popularity": 384471824,
		"portal": "./vendor/textures/mtbad/portal.png",
		"portalBlue": "./vendor/textures/mtbad/portalblue.png",
		"portalRed": "./vendor/textures/mtbad/portalred.png",
		"speedpad": "./vendor/textures/mtbad/speedpad.png",
		"speedpadBlue": "./vendor/textures/mtbad/speedpadblue.png",
		"speedpadRed": "./vendor/textures/mtbad/speedpadred.png",
		"splats": "./vendor/textures/mtbad/splats.png",
		"tiles": "./vendor/textures/mtbad/tiles.png",
		"url": "mtbad"
	},
	"Flat": {
		"author": "why",
		"name": "Flat",
		"popularity": 364039388,
		"portal": "./vendor/textures/flat/portal.png",
		"portalBlue": "./vendor/textures/flat/portalblue.png",
		"portalRed": "./vendor/textures/flat/portalred.png",
		"speedpad": "./vendor/textures/flat/speedpad.png",
		"speedpadBlue": "./vendor/textures/flat/speedpadblue.png",
		"speedpadRed": "./vendor/textures/flat/speedpadred.png",
		"splats": "./vendor/textures/flat/splats.png",
		"tiles": "./vendor/textures/flat/tiles.png",
		"url": "flat"
	},
	"MLTP Live": {
		"author": "Ron Spawnson",
		"name": "MLTP Live",
		"popularity": 268288375,
		"portal": "./vendor/textures/mltplive/portal.png",
		"portalBlue": "./vendor/textures/mltplive/portalblue.png",
		"portalRed": "./vendor/textures/mltplive/portalred.png",
		"speedpad": "./vendor/textures/mltplive/speedpad.png",
		"speedpadBlue": "./vendor/textures/mltplive/speedpadblue.png",
		"speedpadRed": "./vendor/textures/mltplive/speedpadred.png",
		"splats": "./vendor/textures/mltplive/splats.png",
		"tiles": "./vendor/textures/mltplive/tiles.png",
		"url": "mltplive"
	},
	"Plumb": {
		"author": "SuperTed",
		"name": "Plumb",
		"popularity": 195240879,
		"portal": "./vendor/textures/plumb/portal.png",
		"portalBlue": "./vendor/textures/plumb/portalblue.png",
		"portalRed": "./vendor/textures/plumb/portalred.png",
		"speedpad": "./vendor/textures/plumb/speedpad.png",
		"speedpadBlue": "./vendor/textures/plumb/speedpadblue.png",
		"speedpadRed": "./vendor/textures/plumb/speedpadred.png",
		"splats": "./vendor/textures/plumb/splats.png",
		"tiles": "./vendor/textures/plumb/tiles.png",
		"url": "plumb"
	},
	"Isometric": {
		"author": "mtbkr24",
		"name": "Isometric",
		"popularity": 183844878,
		"portal": "./vendor/textures/isometric/portal.png",
		"portalBlue": "./vendor/textures/isometric/portalblue.png",
		"portalRed": "./vendor/textures/isometric/portalred.png",
		"speedpad": "./vendor/textures/isometric/speedpad.png",
		"speedpadBlue": "./vendor/textures/isometric/speedpadblue.png",
		"speedpadRed": "./vendor/textures/isometric/speedpadred.png",
		"splats": "./vendor/textures/isometric/splats.png",
		"tiles": "./vendor/textures/isometric/tiles.png",
		"url": "isometric"
	},
	"Plique": {
		"author": "Despair",
		"name": "Plique",
		"popularity": 167979698,
		"portal": "./vendor/textures/plique/portal.png",
		"portalBlue": "./vendor/textures/plique/portalblue.png",
		"portalRed": "./vendor/textures/plique/portalred.png",
		"speedpad": "./vendor/textures/plique/speedpad.png",
		"speedpadBlue": "./vendor/textures/plique/speedpadblue.png",
		"speedpadRed": "./vendor/textures/plique/speedpadred.png",
		"splats": "./vendor/textures/plique/splats.png",
		"tiles": "./vendor/textures/plique/tiles.png",
		"url": "plique"
	},
	"CamsPP Light": {
		"author": "Cam",
		"name": "CamsPP Light",
		"popularity": 161206545,
		"portal": "./vendor/textures/camspplight/portal.png",
		"portalBlue": "./vendor/textures/camspplight/portalblue.png",
		"portalRed": "./vendor/textures/camspplight/portalred.png",
		"speedpad": "./vendor/textures/camspplight/speedpad.png",
		"speedpadBlue": "./vendor/textures/camspplight/speedpadblue.png",
		"speedpadRed": "./vendor/textures/camspplight/speedpadred.png",
		"splats": "./vendor/textures/camspplight/splats.png",
		"tiles": "./vendor/textures/camspplight/tiles.png",
		"url": "camspplight"
	},
	"Sparkle": {
		"author": "MagicPigeon",
		"name": "Sparkle",
		"popularity": 157434127,
		"portal": "./vendor/textures/sparkle/portal.png",
		"portalBlue": "./vendor/textures/sparkle/portalblue.png",
		"portalRed": "./vendor/textures/sparkle/portalred.png",
		"speedpad": "./vendor/textures/sparkle/speedpad.png",
		"speedpadBlue": "./vendor/textures/sparkle/speedpadblue.png",
		"speedpadRed": "./vendor/textures/sparkle/speedpadred.png",
		"splats": "./vendor/textures/sparkle/splats.png",
		"tiles": "./vendor/textures/sparkle/tiles.png",
		"url": "sparkle"
	},
	"24K": {
		"author": "MagicPigeon",
		"name": "24K",
		"popularity": 151940555,
		"portal": "./vendor/textures/24k/portal.png",
		"portalBlue": "./vendor/textures/24k/portalblue.png",
		"portalRed": "./vendor/textures/24k/portalred.png",
		"speedpad": "./vendor/textures/24k/speedpad.png",
		"speedpadBlue": "./vendor/textures/24k/speedpadblue.png",
		"speedpadRed": "./vendor/textures/24k/speedpadred.png",
		"splats": "./vendor/textures/24k/splats.png",
		"tiles": "./vendor/textures/24k/tiles.png",
		"url": "24k"
	},
	"CamsPP Old": {
		"author": "Cam",
		"name": "CamsPP Old",
		"popularity": 148573697,
		"portal": "./vendor/textures/camsppold/portal.png",
		"portalBlue": "./vendor/textures/camsppold/portalblue.png",
		"portalRed": "./vendor/textures/camsppold/portalred.png",
		"speedpad": "./vendor/textures/camsppold/speedpad.png",
		"speedpadBlue": "./vendor/textures/camsppold/speedpadblue.png",
		"speedpadRed": "./vendor/textures/camsppold/speedpadred.png",
		"splats": "./vendor/textures/camsppold/splats.png",
		"tiles": "./vendor/textures/camsppold/tiles.png",
		"url": "camsppold"
	},
	"CMYK": {
		"author": "MagicPigeon",
		"name": "CMYK",
		"popularity": 126742621,
		"portal": "./vendor/textures/cmyk/portal.png",
		"portalBlue": "./vendor/textures/cmyk/portalblue.png",
		"portalRed": "./vendor/textures/cmyk/portalred.png",
		"speedpad": "./vendor/textures/cmyk/speedpad.png",
		"speedpadBlue": "./vendor/textures/cmyk/speedpadblue.png",
		"speedpadRed": "./vendor/textures/cmyk/speedpadred.png",
		"splats": "./vendor/textures/cmyk/splats.png",
		"tiles": "./vendor/textures/cmyk/tiles.png",
		"url": "cmyk"
	},
	"CamsPP Dark": {
		"author": "Cam",
		"name": "CamsPP Dark",
		"popularity": 120137217,
		"portal": "./vendor/textures/camsppdark/portal.png",
		"portalBlue": "./vendor/textures/camsppdark/portalblue.png",
		"portalRed": "./vendor/textures/camsppdark/portalred.png",
		"speedpad": "./vendor/textures/camsppdark/speedpad.png",
		"speedpadBlue": "./vendor/textures/camsppdark/speedpadblue.png",
		"speedpadRed": "./vendor/textures/camsppdark/speedpadred.png",
		"splats": "./vendor/textures/camsppdark/splats.png",
		"tiles": "./vendor/textures/camsppdark/tiles.png",
		"url": "camsppdark"
	},
	"Precision Dark": {
		"author": "Peach Fuzz",
		"name": "Precision Dark",
		"popularity": 116594193,
		"portal": "./vendor/textures/precisiondark/portal.png",
		"portalBlue": "./vendor/textures/precisiondark/portalblue.png",
		"portalRed": "./vendor/textures/precisiondark/portalred.png",
		"speedpad": "./vendor/textures/precisiondark/speedpad.png",
		"speedpadBlue": "./vendor/textures/precisiondark/speedpadblue.png",
		"speedpadRed": "./vendor/textures/precisiondark/speedpadred.png",
		"splats": "./vendor/textures/precisiondark/splats.png",
		"tiles": "./vendor/textures/precisiondark/tiles.png",
		"url": "precisiondark"
	},
	"PastelPro": {
		"author": "SuperTed",
		"name": "PastelPro",
		"popularity": 115963179,
		"portal": "./vendor/textures/pastelpro/portal.png",
		"portalBlue": "./vendor/textures/pastelpro/portalblue.png",
		"portalRed": "./vendor/textures/pastelpro/portalred.png",
		"speedpad": "./vendor/textures/pastelpro/speedpad.png",
		"speedpadBlue": "./vendor/textures/pastelpro/speedpadblue.png",
		"speedpadRed": "./vendor/textures/pastelpro/speedpadred.png",
		"splats": "./vendor/textures/pastelpro/splats.png",
		"tiles": "./vendor/textures/pastelpro/tiles.png",
		"url": "pastelpro"
	},
	"Element+": {
		"author": "MagicPigeon",
		"name": "Element+",
		"popularity": 113423416,
		"portal": "./vendor/textures/element/portal.png",
		"portalBlue": "./vendor/textures/element/portalblue.png",
		"portalRed": "./vendor/textures/element/portalred.png",
		"speedpad": "./vendor/textures/element/speedpad.png",
		"speedpadBlue": "./vendor/textures/element/speedpadblue.png",
		"speedpadRed": "./vendor/textures/element/speedpadred.png",
		"splats": "./vendor/textures/element/splats.png",
		"tiles": "./vendor/textures/element/tiles.png",
		"url": "element"
	},
	"Sketch+": {
		"author": "MagicPigeon",
		"name": "Sketch+",
		"popularity": 94563964,
		"portal": "./vendor/textures/sketch/portal.png",
		"portalBlue": "./vendor/textures/sketch/portalblue.png",
		"portalRed": "./vendor/textures/sketch/portalred.png",
		"speedpad": "./vendor/textures/sketch/speedpad.png",
		"speedpadBlue": "./vendor/textures/sketch/speedpadblue.png",
		"speedpadRed": "./vendor/textures/sketch/speedpadred.png",
		"splats": "./vendor/textures/sketch/splats.png",
		"tiles": "./vendor/textures/sketch/tiles.png",
		"url": "sketch"
	},
	"Electric": {
		"author": "Bug",
		"name": "Electric",
		"popularity": 90140000,
		"portal": "./vendor/textures/electric/portal.png",
		"portalBlue": "./vendor/textures/electric/portalblue.png",
		"portalRed": "./vendor/textures/electric/portalred.png",
		"speedpad": "./vendor/textures/electric/speedpad.png",
		"speedpadBlue": "./vendor/textures/electric/speedpadblue.png",
		"speedpadRed": "./vendor/textures/electric/speedpadred.png",
		"splats": "./vendor/textures/electric/splats.png",
		"tiles": "./vendor/textures/electric/tiles.png",
		"url": "electric"
	},
	"Sharp": {
		"author": "MagicPigeon",
		"name": "Sharp",
		"popularity": 84223773,
		"portal": "./vendor/textures/sharp/portal.png",
		"portalBlue": "./vendor/textures/sharp/portalblue.png",
		"portalRed": "./vendor/textures/sharp/portalred.png",
		"speedpad": "./vendor/textures/sharp/speedpad.png",
		"speedpadBlue": "./vendor/textures/sharp/speedpadblue.png",
		"speedpadRed": "./vendor/textures/sharp/speedpadred.png",
		"splats": "./vendor/textures/sharp/splats.png",
		"tiles": "./vendor/textures/sharp/tiles.png",
		"url": "sharp"
	},
	"Mural": {
		"author": "DaEvil1",
		"name": "Mural",
		"popularity": 58661716,
		"portal": "./vendor/textures/mural/portal.png",
		"portalBlue": "./vendor/textures/mural/portalblue.png",
		"portalRed": "./vendor/textures/mural/portalred.png",
		"speedpad": "./vendor/textures/mural/speedpad.png",
		"speedpadBlue": "./vendor/textures/mural/speedpadblue.png",
		"speedpadRed": "./vendor/textures/mural/speedpadred.png",
		"splats": "./vendor/textures/mural/splats.png",
		"tiles": "./vendor/textures/mural/tiles.png",
		"url": "mural"
	},
	"TerminalPX": {
		"author": "pooppants",
		"name": "TerminalPX",
		"popularity": 58605743,
		"portal": "./vendor/textures/terminalpx/portal.png",
		"portalBlue": "./vendor/textures/terminalpx/portalblue.png",
		"portalRed": "./vendor/textures/terminalpx/portalred.png",
		"speedpad": "./vendor/textures/terminalpx/speedpad.png",
		"speedpadBlue": "./vendor/textures/terminalpx/speedpadblue.png",
		"speedpadRed": "./vendor/textures/terminalpx/speedpadred.png",
		"splats": "./vendor/textures/terminalpx/splats.png",
		"tiles": "./vendor/textures/terminalpx/tiles.png",
		"url": "terminalpx"
	},
	"Supreme": {
		"author": "bicycle",
		"name": "Supreme",
		"popularity": 56012886,
		"portal": "./vendor/textures/supreme/portal.png",
		"portalBlue": "./vendor/textures/supreme/portalblue.png",
		"portalRed": "./vendor/textures/supreme/portalred.png",
		"speedpad": "./vendor/textures/supreme/speedpad.png",
		"speedpadBlue": "./vendor/textures/supreme/speedpadblue.png",
		"speedpadRed": "./vendor/textures/supreme/speedpadred.png",
		"splats": "./vendor/textures/supreme/splats.png",
		"tiles": "./vendor/textures/supreme/tiles.png",
		"url": "supreme"
	},
	"Circlejerk": {
		"author": "Bizkut and Ion",
		"name": "Circlejerk",
		"popularity": 54315659,
		"portal": "./vendor/textures/circlejerk/portal.png",
		"portalBlue": "./vendor/textures/circlejerk/portalblue.png",
		"portalRed": "./vendor/textures/circlejerk/portalred.png",
		"speedpad": "./vendor/textures/circlejerk/speedpad.png",
		"speedpadBlue": "./vendor/textures/circlejerk/speedpadblue.png",
		"speedpadRed": "./vendor/textures/circlejerk/speedpadred.png",
		"splats": "./vendor/textures/circlejerk/splats.png",
		"tiles": "./vendor/textures/circlejerk/tiles.png",
		"url": "circlejerk"
	},
	"Crystal": {
		"author": "MagicPigeon",
		"name": "Crystal",
		"popularity": 50792579,
		"portal": "./vendor/textures/crystal/portal.png",
		"portalBlue": "./vendor/textures/crystal/portalblue.png",
		"portalRed": "./vendor/textures/crystal/portalred.png",
		"speedpad": "./vendor/textures/crystal/speedpad.png",
		"speedpadBlue": "./vendor/textures/crystal/speedpadblue.png",
		"speedpadRed": "./vendor/textures/crystal/speedpadred.png",
		"splats": "./vendor/textures/crystal/splats.png",
		"tiles": "./vendor/textures/crystal/tiles.png",
		"url": "crystal"
	},
	"Turbo": {
		"author": "Ooops",
		"name": "Turbo",
		"popularity": 38707709,
		"portal": "./vendor/textures/turbo/portal.png",
		"portalBlue": "./vendor/textures/turbo/portalblue.png",
		"portalRed": "./vendor/textures/turbo/portalred.png",
		"speedpad": "./vendor/textures/turbo/speedpad.png",
		"speedpadBlue": "./vendor/textures/turbo/speedpadblue.png",
		"speedpadRed": "./vendor/textures/turbo/speedpadred.png",
		"splats": "./vendor/textures/turbo/splats.png",
		"tiles": "./vendor/textures/turbo/tiles.png",
		"url": "turbo"
	},
	"Celeste": {
		"author": "MagicPigeon",
		"name": "Celeste",
		"popularity": 37567955,
		"portal": "./vendor/textures/celeste/portal.png",
		"portalBlue": "./vendor/textures/celeste/portalblue.png",
		"portalRed": "./vendor/textures/celeste/portalred.png",
		"speedpad": "./vendor/textures/celeste/speedpad.png",
		"speedpadBlue": "./vendor/textures/celeste/speedpadblue.png",
		"speedpadRed": "./vendor/textures/celeste/speedpadred.png",
		"splats": "./vendor/textures/celeste/splats.png",
		"tiles": "./vendor/textures/celeste/tiles.png",
		"url": "celeste"
	},
	"Flat (Bug)": {
		"author": "Bug",
		"name": "Flat (Bug)",
		"popularity": 36605283,
		"portal": "./vendor/textures/flatbug/portal.png",
		"portalBlue": "./vendor/textures/flatbug/portalblue.png",
		"portalRed": "./vendor/textures/flatbug/portalred.png",
		"speedpad": "./vendor/textures/flatbug/speedpad.png",
		"speedpadBlue": "./vendor/textures/flatbug/speedpadblue.png",
		"speedpadRed": "./vendor/textures/flatbug/speedpadred.png",
		"splats": "./vendor/textures/flatbug/splats.png",
		"tiles": "./vendor/textures/flatbug/tiles.png",
		"url": "flatbug"
	},
	"Starlight": {
		"author": "MagicPigeon",
		"name": "Starlight",
		"popularity": 34834874,
		"portal": "./vendor/textures/starlight/portal.png",
		"portalBlue": "./vendor/textures/starlight/portalblue.png",
		"portalRed": "./vendor/textures/starlight/portalred.png",
		"speedpad": "./vendor/textures/starlight/speedpad.png",
		"speedpadBlue": "./vendor/textures/starlight/speedpadblue.png",
		"speedpadRed": "./vendor/textures/starlight/speedpadred.png",
		"splats": "./vendor/textures/starlight/splats.png",
		"tiles": "./vendor/textures/starlight/tiles.png",
		"url": "starlight"
	},
	"Bold": {
		"author": "MagicPigeon",
		"name": "Bold",
		"popularity": 30256001,
		"portal": "./vendor/textures/bold/portal.png",
		"portalBlue": "./vendor/textures/bold/portalblue.png",
		"portalRed": "./vendor/textures/bold/portalred.png",
		"speedpad": "./vendor/textures/bold/speedpad.png",
		"speedpadBlue": "./vendor/textures/bold/speedpadblue.png",
		"speedpadRed": "./vendor/textures/bold/speedpadred.png",
		"splats": "./vendor/textures/bold/splats.png",
		"tiles": "./vendor/textures/bold/tiles.png",
		"url": "bold"
	},
	"Mumbo": {
		"author": "MagicPigeon",
		"name": "Mumbo",
		"popularity": 26355501,
		"portal": "./vendor/textures/mumbo/portal.png",
		"portalBlue": "./vendor/textures/mumbo/portalblue.png",
		"portalRed": "./vendor/textures/mumbo/portalred.png",
		"speedpad": "./vendor/textures/mumbo/speedpad.png",
		"speedpadBlue": "./vendor/textures/mumbo/speedpadblue.png",
		"speedpadRed": "./vendor/textures/mumbo/speedpadred.png",
		"splats": "./vendor/textures/mumbo/splats.png",
		"tiles": "./vendor/textures/mumbo/tiles.png",
		"url": "mumbo"
	},
	"Maxima": {
		"author": "MagicPigeon",
		"name": "Maxima",
		"popularity": 24527963,
		"portal": "./vendor/textures/maxima/portal.png",
		"portalBlue": "./vendor/textures/maxima/portalblue.png",
		"portalRed": "./vendor/textures/maxima/portalred.png",
		"speedpad": "./vendor/textures/maxima/speedpad.png",
		"speedpadBlue": "./vendor/textures/maxima/speedpadblue.png",
		"speedpadRed": "./vendor/textures/maxima/speedpadred.png",
		"splats": "./vendor/textures/maxima/splats.png",
		"tiles": "./vendor/textures/maxima/tiles.png",
		"url": "maxima"
	},
	"Chip": {
		"author": "nom",
		"name": "Chip",
		"popularity": 17276938,
		"portal": "./vendor/textures/chip/portal.png",
		"portalBlue": "./vendor/textures/chip/portalblue.png",
		"portalRed": "./vendor/textures/chip/portalred.png",
		"speedpad": "./vendor/textures/chip/speedpad.png",
		"speedpadBlue": "./vendor/textures/chip/speedpadblue.png",
		"speedpadRed": "./vendor/textures/chip/speedpadred.png",
		"splats": "./vendor/textures/chip/splats.png",
		"tiles": "./vendor/textures/chip/tiles.png",
		"url": "chip"
	},
	"nom": {
		"author": "nom",
		"name": "nom",
		"popularity": 6966621,
		"portal": "./vendor/textures/nom/portal.png",
		"portalBlue": "./vendor/textures/nom/portalblue.png",
		"portalRed": "./vendor/textures/nom/portalred.png",
		"speedpad": "./vendor/textures/nom/speedpad.png",
		"speedpadBlue": "./vendor/textures/nom/speedpadblue.png",
		"speedpadRed": "./vendor/textures/nom/speedpadred.png",
		"splats": "./vendor/textures/nom/splats.png",
		"tiles": "./vendor/textures/nom/tiles.png",
		"url": "nom"
	}
};

function getTexture(name) {
	return textures[name];
}

function getTextureList() {
	return Object.keys(textures).map(key => { return { label: key, value: key } });
}

function setTextureCookie() {
	Cookies.set('textures', JSON.stringify(currentTexture), cookieOptions);
}

function handleTextureChange(selection) {
	currentTexture = getTexture(selection.label);
	setTextureCookie();
}

export function renderTextureSelect() {
	currentTexture = getTexture("Muscle's Cup Gradients");

	const cookie = Cookies.get('textures');
	if (cookie) {
		currentTexture = JSON.parse(cookie);
	}

	const selected = { label: currentTexture['name'] === 'custom' ? 'Custom' : currentTexture['name']};

	return (
		<Select
			defaultValue={selected}
			options={getTextureList()}
			onChange={handleTextureChange}
			menuPosition="fixed"
		/>
	);
}

export function renderCustomTextureInput(id: string, name: string, props: { [key: string]: number }) {
	return (
		<div className="form-group">
			<div className="col-3">
				<label className="form-label" htmlFor={id}>{name}</label>
			</div>
			<div className="col-9">
				<input className="form-input texture-url" type="text" id={id} data-label={name}
					placeholder="Enter URL" defaultValue={currentTexture[id]}
					{...props}
				/>
			</div>
		</div>
	);
}

function getTextureFields() {
	return Array.from(document.getElementsByClassName("texture-url")).map(elt => elt.id);
}

function checkTextureFile(file: string) {
	const elt = document.getElementById(file) as HTMLInputElement;
	const url = elt.value;
	const name = elt.getAttribute("data-label");

	// The logic below is copied from global-texturePackPicker.js

	return new Promise<void>((resolve, reject) => {
		if (!url) {
			return resolve();
		}

		const img = new Image();

		img.onload = () => {
			return elt.hasAttribute("imagewidth") && img.width !== +elt.getAttribute("imagewidth")
			? reject(`${name}: width (${img.width}) should be ${elt.getAttribute("imagewidth")}.`)
			: elt.hasAttribute("imagewidthatleast") && img.width < +elt.getAttribute("imagewidthatleast")
			? reject(`${name}: width (${img.width}) should be at least ${elt.getAttribute("imagewidthatleast")}.`)
			: elt.hasAttribute("imagewidthmultipleof") && img.width % +elt.getAttribute("imagewidthmultipleof") !== 0
			? reject(`${name}: width (${img.width}) should be a multiple of ${elt.getAttribute("imagewidthmultipleof")}.`)
			: elt.hasAttribute("imageheight") && img.height !== +elt.getAttribute("imageheight")
			? reject(`${name}: height (${img.height}) should be ${elt.getAttribute("imageheight")}.`)
			: resolve();
		};

		img.onerror = () => {
			return reject(`${name}: URL cannot be loaded.`);
		}

		img.src = url;
	})
}

export function checkCustomTextures(okHandler: () => void, errorHandler: (error: string) => void) {
	const each = (promise: Promise<void>, file: string) => {
		return promise
			.then(_ => checkTextureFile(file))
			.catch(reason => { throw reason });
	};

	const files = getTextureFields();
	const chain = files.reduce(each, Promise.resolve());

	chain.then(okHandler).catch(errorHandler);
}

export function saveCustomTextures() {
	const files = getTextureFields();
	currentTexture = { name: 'custom' };

	files.forEach(field => currentTexture[field] = (document.getElementById(field) as HTMLInputElement).value);

	setTextureCookie();
}
