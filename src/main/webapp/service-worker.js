importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "a828ab06d614020791572b04e7bd2439"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "893339da522233313562df9d1c4dc633"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "a6620368de26b57e1a60f45f470a9e87"
  },
  {
    "url": "js/shapes.min.js",
    "revision": "61f3aabca704197ff03079b7ac69af35"
  },
  {
    "url": "js/math-print.js",
    "revision": "9d98c920695f6c3395da4b68f723e60a"
  },
  {
    "url": "index.html",
    "revision": "00d237fa834f4fef1176fe0928576643"
  },
  {
    "url": "open.html",
    "revision": "dd24217f6c21207b54475409848f31ff"
  },
  {
    "url": "styles/grapheditor.css",
    "revision": "35b5b9d556faa375612c04addcd5819c"
  },
  {
    "url": "styles/atlas.css",
    "revision": "40f54334c7a62821dbf1f7c7d8ad62cc"
  },
  {
    "url": "styles/dark.css",
    "revision": "372fe7bbfa631d8c6ebbde5445b36c1d"
  },
  {
    "url": "js/croppie/croppie.min.css",
    "revision": "fc297c9002c79c15a132f13ee3ec427e"
  },
  {
    "url": "js/dropbox/Dropbox-sdk.min.js",
    "revision": "4b9842892aa37b156db0a8364b7a83b0"
  },
  {
    "url": "js/onedrive/OneDrive.js",
    "revision": "d82b9c14d7a069efabef719a8a5f3975"
  },
  {
    "url": "math/MathJax.js",
    "revision": "c32a502b8b4a6bd6bad8ddb1b59e9e72"
  },
  {
    "url": "resources/dia.txt",
    "revision": "7b51951d9be4b4af381614d9a70b0e54"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "7092be76e025c2be4d2b095d20dce1a0"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "7b51951d9be4b4af381614d9a70b0e54"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "f7cd875cf8a7aeb2def9eac99f35ee88"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "ea78185b6a530c67d8bd1ed9ccef2996"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "b48e3f60822816f0402d29ace0b591b4"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "d90b96470fbc65f3750edd386abc7b5c"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "76d6c2d351f547bcdedd869f2b340596"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "e069994a9b1423c5e835614a56951bcc"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "6a74c2f4263d300cefe3f844431ee992"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "9c7164b5e0cee4f210a953cfa535fe2e"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "35fdb386e95b259ebf826a652987d5f8"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "b5b0c3078aec6ad5b75592d2cd6cf80e"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "fd035ccf28fff797115fa3e7a04cb37c"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "67bf79b292e2fe1e1f675218c62e901a"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "1207dc4988ec49be4f8330a0bfcbb277"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "c13023395048796a0f628a6a33b04caf"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "7b51951d9be4b4af381614d9a70b0e54"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "5029957296ddada5f63bd61c496b5657"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "b2d9e166358c389688d7b1cdc843fc5d"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "b6d5a414d81994d83d5d5b39b5f6c73b"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "904727c8ad41ffa0b2a4f8f06bf521ae"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "c8577046d13009456f88d1c7ab5fce6b"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "b3df425d75b9a1cd0ef63807fe28fa47"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "718a29af426b63d97007d90abacb3ccf"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "1a4ba1b5c536ee70dd3f58c89be14f9d"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "bde1dd0584080bc4b6895c69ab4f2352"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "91b808cd6ec64d1d9ec07ec610f33b58"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "2f430045fc3df85b66d96da55283f749"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "60bddb18ed2caf165b0160288b52fe82"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "6fc78e6a847b8c3f71846f68a258542a"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "291ba0f2b384883caf5e484003ad91c7"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "0e8956dfb34e07f36b3c5b549cbc3668"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "f8db46e7ae04253049a4756e0e3179a6"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "5c8837d720f44a1c37c3ae2766eec9f6"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "21e2c45fa8b7c3c0a044a580de51e927"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "5b0787a0805f5485e107204b56088cea"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "019c0b5d209d0a791b5cc63bb12f55c2"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "ce736476c7dee4fca198ee0eaec3db68"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "5e3ae7acec8ab7562d6a755b597c2709"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "e766e1e688afd645db64211b6ffd511a"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "9326ab227b5ad1b8cdb58f7e65d95b1f"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "879ffb34f742ad9a6367d3aae39b1fb2"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "9544848fc962c9924e21bb96145bb76c"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "97cd332a9adbe9102bc38e67c28bf4bb"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "a55dc2c124853353fe9497357a213c7f"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "981b5f92324949c8107f3174d7f209a0"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "235d82a64540abd3931cca55fd2857d5"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "04a4a4befd52d06ebf2bd1b36ac037a4"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "dc734a9c003544162e60e0e1a3ea1a69"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "76e90770a7fdeb5e8b05c1d57c283058"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "edf323375a66c16d39477c451f097978"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "134cb4f7c221a8bda029b4c75f1b4a6d"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "04f545e2fc62b442993c429ec991d14d"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "6f586a84bd640c99956adb0650bfea02"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "ca0b9fa59433953a6dc729b20ee61f48"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "7abc0f2549f77a22143917ae90cbb248"
  },
  {
    "url": "favicon.ico",
    "revision": "fab2d88b37c72d83607527573de45281"
  },
  {
    "url": "images/manifest.json",
    "revision": "c6236bde53ed79aaaec60a1aca8ee2ef"
  },
  {
    "url": "images/logo.png",
    "revision": "89630b64b911ebe0daa3dfe442087cfa"
  },
  {
    "url": "images/drawlogo.svg",
    "revision": "4bf4d14ebcf072d8bd4c5a1c89e88fc6"
  },
  {
    "url": "images/drawlogo-gray.svg",
    "revision": "0aabacbc0873816e1e09e4736ae44c7d"
  },
  {
    "url": "images/apple-touch-icon.png",
    "revision": "73da7989a23ce9a4be565ec65658a239"
  },
  {
    "url": "images/favicon-16x16.png",
    "revision": "1a79d5461a5d2bf21f6652e0ac20d6e5"
  },
  {
    "url": "images/favicon-32x32.png",
    "revision": "e3b92da2febe70bad5372f6f3474b034"
  },
  {
    "url": "images/android-chrome-196x196.png",
    "revision": "38b32aefe5d1456144ae00d2c67aab46"
  },
  {
    "url": "images/android-chrome-512x512.png",
    "revision": "959b5fac2453963ff6d60fb85e4b73fd"
  },
  {
    "url": "images/delete.png",
    "revision": "5f2350f2fd20f1a229637aed32ed8f29"
  },
  {
    "url": "images/droptarget.png",
    "revision": "bbf7f563fb6784de1ce96f329519b043"
  },
  {
    "url": "images/help.png",
    "revision": "9266c6c3915bd33c243d80037d37bf61"
  },
  {
    "url": "images/download.png",
    "revision": "35418dd7bd48d87502c71b578cc6c37f"
  },
  {
    "url": "images/logo-flat.png",
    "revision": "038070ab43aee6e54a791211859fc67b"
  },
  {
    "url": "images/google-drive-logo.svg",
    "revision": "5d9f2f5bbc7dcc252730a0072bb23059"
  },
  {
    "url": "images/onedrive-logo.svg",
    "revision": "3645b344ec0634c1290dd58d7dc87b97"
  },
  {
    "url": "images/dropbox-logo.svg",
    "revision": "e6be408c77cf9c82d41ac64fa854280a"
  },
  {
    "url": "images/github-logo.svg",
    "revision": "a1a999b69a275eac0cb918360ac05ae1"
  },
  {
    "url": "images/gitlab-logo.svg",
    "revision": "0faea8c818899e58533e153c44b10517"
  },
  {
    "url": "images/trello-logo.svg",
    "revision": "006fd0d7d70d7e95dc691674cb12e044"
  },
  {
    "url": "images/osa_drive-harddisk.png",
    "revision": "b954e1ae772087c5b4c6ae797e1f9649"
  },
  {
    "url": "images/osa_database.png",
    "revision": "c350d9d9b95f37b6cfe798b40ede5fb0"
  },
  {
    "url": "images/google-drive-logo-white.svg",
    "revision": "f329d8b1be7778515a85b93fc35d9f26"
  },
  {
    "url": "images/dropbox-logo-white.svg",
    "revision": "4ea8299ac3bc31a16f199ee3aec223bf"
  },
  {
    "url": "images/onedrive-logo-white.svg",
    "revision": "b3602fa0fc947009cff3f33a581cff4d"
  },
  {
    "url": "images/github-logo-white.svg",
    "revision": "537b1127b3ca0f95b45782d1304fb77a"
  },
  {
    "url": "images/gitlab-logo-white.svg",
    "revision": "5fede9ac2f394c716b8c23e3fddc3910"
  },
  {
    "url": "images/trello-logo-white-orange.svg",
    "revision": "e2a0a52ba3766682f138138d10a75eb5"
  },
  {
    "url": "images/logo-confluence.png",
    "revision": "ed1e55d44ae5eba8f999aba2c93e8331"
  },
  {
    "url": "images/logo-jira.png",
    "revision": "f8d460555a0d1f87cfd901e940666629"
  },
  {
    "url": "images/clear.gif",
    "revision": "db13c778e4382e0b55258d0f811d5d70"
  },
  {
    "url": "images/spin.gif",
    "revision": "487cbb40b9ced439aa1ad914e816d773"
  },
  {
    "url": "images/checkmark.gif",
    "revision": "ba764ce62f2bf952df5bbc2bb4d381c5"
  },
  {
    "url": "images/hs.png",
    "revision": "fefa1a03d92ebad25c88dca94a0b63db"
  },
  {
    "url": "mxgraph/css/common.css",
    "revision": "b5b7280ec98671bb6c3847a36bc7ea12"
  },
  {
    "url": "mxgraph/images/maximize.gif",
    "revision": "5cd13d6925493ab51e876694cc1c2ec2"
  },
  {
    "url": "mxgraph/images/minimize.gif",
    "revision": "8957741b9b0f86af9438775f2aadbb54"
  },
  {
    "url": "mxgraph/images/close.gif",
    "revision": "8b84669812ac7382984fca35de8da48b"
  },
  {
    "url": "mxgraph/images/resize.gif",
    "revision": "a6477612b3567a34033f9cac6184eed3"
  },
  {
    "url": "mxgraph/images/separator.gif",
    "revision": "7819742ff106c97da7a801c2372bbbe5"
  },
  {
    "url": "mxgraph/images/window.gif",
    "revision": "fd9a21dd4181f98052a202a0a01f18ab"
  },
  {
    "url": "mxgraph/images/window-title.gif",
    "revision": "3fb1d6c43246cdf991a11dfe826dfe99"
  },
  {
    "url": "mxgraph/images/button.gif",
    "revision": "00759bdc3ad218fa739f584369541809"
  },
  {
    "url": "mxgraph/images/point.gif",
    "revision": "83a43717b284902442620f61bc4e9fa6"
  }
],
	{
		// Ignore all URL parameters
		// FIXME: Using this /open redirects to /open.html so
		// DO NOT use filenames matching servlet mappings!
		// See https://github.com/GoogleChromeLabs/sw-precache#ignoreurlparametersmatching-arrayregex
		ignoreURLParametersMatching: [/.*/]
	});
}
