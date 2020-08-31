importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "85e09c30754090f23c40ca6230e0b178"
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
    "revision": "52b45e18821d918e2ecdcf94d00ce5bf"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "a8133ad1a7a5004562d1fd6e99e88729"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "52b45e18821d918e2ecdcf94d00ce5bf"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "c8800a70ae019543a6797ec3aba0ec87"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "6df9a1f4d5ba7d3c5af54d0483510324"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "a64279474e4340fb403dcf1b9081058d"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "36536150c36da69db0d8617096bbae7e"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "adc5bdbd9f38be3c07e80058863690cc"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "e1aed68be65af3fc9a7d6abb4af0dc90"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "450d6feb312e752f5df9ac604c7445fb"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "3721b2a9b604dec174190ae59e02cd39"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "d0a98ac489b90b5b32802462fabf2884"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "b4938cf98666cf018a54f1e9f9de2d1b"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "38153ca7068f7b37aef485861b01f27e"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "7cc5c227f96198c9cc0eba2f575676bc"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "aa96da9f282254db5a9a192f311e0345"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "7f4d495e18588267a6bba527ee9f25c7"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "52b45e18821d918e2ecdcf94d00ce5bf"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "5a4a61e00d894e75dd52c5e5c8125f41"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "4aac3fd589fbff4e19606d023a4c58e7"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "537be4666b35d92ecc957b2a9ba8489e"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "78b2211a96d18cd9082b6cfde91d9b86"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "35dcfd5b610021a21dce8543351e2444"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "9e2ccdb2d1bbded8e8ecbda5b786fd73"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "6855bd4cd3bfd94fc378a1008c0fbf53"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "9553382601b131b822c059efab1f9344"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "265c039b834913d472d2e42b3fdc96e9"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "32ccf2654a22d81e1aa34ba81a59b8fd"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "cea88b74ebece497e852a3646ec46546"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "d552c6abc3e63379a27adc712a1d640f"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "b477993ba9da62d7fc158a9aae801fd4"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "e2a850dc8ed7b814c7df70fc9dde39dd"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "0b4d4422fecf9aa10afdc31af71892de"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "d77be3a6a5a681fe353e6fbb285058c6"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "9cbb5d06b5a7a7c8a0a0d2b837cd13e1"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "17a38a34de1cb6a698316c63e6f5c4ec"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "07694b295a13a02529184e95a2d82d50"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "07ee3799bb00c2be71ea5ef26490fecc"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "cbbbbbf863e9e2dcf7c6d35d019d55c6"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "1b8b00759f617eb22c7fa34b7edd408c"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "9c34e4ad7e340e182d8e2424da6a3a78"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "ba92d8d2ed922d54ea25eedf3eb215de"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "8bb9931c6b9db93a76efe512985e6100"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "64b739175960123ce2777e95140ce448"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "ab8b132c852906bac5807693218f2128"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "4afc732f7a021ead65f1a111dcadac8d"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "dc307820f1ae022b238bc13ebfb3ba25"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "44ebb955b669047e57c5e9b4435b80cf"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "56e476ef7bd74671095fd103fcb741a9"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "d4f65d360b0a4fbd45486cdddba39921"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "55e4b45b21faf78b835b946a851131dd"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "9421623a716a40f110c5e9725c2edba6"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "3625428d4b068419e473506054b6e44d"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "54f9d0527ebbcd7d5ba03e5d4299401c"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "e2a39c2dc34dae7115deb7bb09bfbb80"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "4e8d4618a2fabe1ee1f94d0c04ea5df9"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "217b5ed3cd5dcf7f72b509739f83d4d4"
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
