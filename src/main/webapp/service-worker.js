importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "34f498797fbb0a88315b4d4814a889e9"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "4b1fe462b12d14cb66a41e72353c24dd"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "8acd653d31d1e6e1b4fd49d4efe2469f"
  },
  {
    "url": "js/shapes.min.js",
    "revision": "d4e08647ed1af5535730685f546a454f"
  },
  {
    "url": "js/math-print.js",
    "revision": "9d98c920695f6c3395da4b68f723e60a"
  },
  {
    "url": "index.html",
    "revision": "8ef6cab30fadfb9eaef35903e8b9a379"
  },
  {
    "url": "open.html",
    "revision": "d71816b3b00e769fc6019fcdd6921662"
  },
  {
    "url": "styles/grapheditor.css",
    "revision": "705c15d388d662654170b53efd9cd317"
  },
  {
    "url": "styles/atlas.css",
    "revision": "07ff03bf40985d2740d142012b24c7d1"
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
    "url": "js/viewer-static.min.js",
    "revision": "63c1dc945eff0960cbbe074bcfdaf302"
  },
  {
    "url": "connect/jira/editor-1-3-3.html",
    "revision": "fb7e91ab8890425d55f0122a01cc5b20"
  },
  {
    "url": "connect/jira/viewerPanel-1-3-12.html",
    "revision": "9020fb8d69a51d0162b8dfd938315259"
  },
  {
    "url": "connect/jira/fullScreenViewer-1-3-3.html",
    "revision": "c58a7c55a335f49d84bc4b1aac9885aa"
  },
  {
    "url": "connect/jira/viewerPanel.js",
    "revision": "d632930efc15a750f1c8c2d22c62aa5a"
  },
  {
    "url": "connect/jira/spinner.gif",
    "revision": "7d857ab9d86123e93d74d48e958fe743"
  },
  {
    "url": "connect/jira/editor.js",
    "revision": "435d01373a459c134b05b6640c88c327"
  },
  {
    "url": "connect/jira/fullscreen-viewer-init.js",
    "revision": "197ed5837ed27992688fc424699a9a78"
  },
  {
    "url": "connect/jira/fullscreen-viewer.js",
    "revision": "bd97b40b9dc692b1b696b188263799ff"
  },
  {
    "url": "plugins/connectJira.js",
    "revision": "87b1e0ab3d6805952c8ed4e405d04af5"
  },
  {
    "url": "plugins/cConf-comments.js",
    "revision": "c787357209cff2986dcca567b599e2ef"
  },
  {
    "url": "plugins/cConf-1-4-8.js",
    "revision": "1f821d59718fc7e0d87dbb27ae781800"
  },
  {
    "url": "connect/confluence/connectUtils-1-4-8.js",
    "revision": "894e07934070f2d77fe7636ce4c0e690"
  },
  {
    "url": "connect/new_common/cac.js",
    "revision": "b1eb16ac1824f26824c748e8b8028e30"
  },
  {
    "url": "connect/gdrive_common/gac.js",
    "revision": "582003cc53daba7ef313e67bfe309f92"
  },
  {
    "url": "connect/onedrive_common/ac.js",
    "revision": "ae7907eb44e764836342bf4341d5ddde"
  },
  {
    "url": "connect/confluence/viewer-init.js",
    "revision": "4a60c6c805cab7bc782f1e52f7818d9f"
  },
  {
    "url": "connect/confluence/viewer.js",
    "revision": "43c2b73df894d7a52706206f720a2451"
  },
  {
    "url": "connect/confluence/viewer-1-4-42.html",
    "revision": "c154ee66bab65cd0e476c1d64c64cb8d"
  },
  {
    "url": "connect/confluence/macroEditor-1-4-8.html",
    "revision": "689fa63fd3a384662b4199f6e4a5b5c1"
  },
  {
    "url": "connect/confluence/includeDiagram-1-4-8.js",
    "revision": "a38cf3bb0d05d131dd0560e2a9baa5f8"
  },
  {
    "url": "connect/confluence/includeDiagram.html",
    "revision": "cef317d4cb01edd98ed49ef91d24951b"
  },
  {
    "url": "connect/confluence/macro-editor.js",
    "revision": "26a726d518d3927274cfc35eff079e5f"
  },
  {
    "url": "math/MathJax.js",
    "revision": "b2c103388b71bb3d11cbf9aa45fe9b68"
  },
  {
    "url": "math/config/TeX-MML-AM_SVG-full.js",
    "revision": "d5cb8ac04050983170ae4af145bc66ff"
  },
  {
    "url": "math/jax/output/SVG/fonts/TeX/fontdata.js",
    "revision": "495e5a410955d1b6178870e605890ede"
  },
  {
    "url": "math/jax/element/mml/optable/BasicLatin.js",
    "revision": "cac9b2e71382e62270baa55fab07cc13"
  },
  {
    "url": "math/jax/output/SVG/fonts/TeX/Size2/Regular/Main.js",
    "revision": "e3e5e4d5924beed29f0844550b5c8f46"
  },
  {
    "url": "math/jax/output/SVG/fonts/TeX/Main/Regular/LetterlikeSymbols.js",
    "revision": "0767cbad7275b53da128e7e5e1109f7c"
  },
  {
    "url": "math/jax/output/SVG/fonts/TeX/Main/Regular/GreekAndCoptic.js",
    "revision": "346302a5c5ee00e01c302148c56dbfe3"
  },
  {
    "url": "resources/dia.txt",
    "revision": "8b601dc162344f5931295a0273cee36d"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "81c007c71d74d4210bc816293fef8add"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "ef8bb6d5453c117b2c376c570bb781d7"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "57a61fb793446b735487a9e8cc9d8d7f"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "edc1e7d3c68b22e3c3d685a781a08943"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "3a141de0b9b2447db366405c88ee8565"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "825b1ce9fce73eb078fe3c9d4ecc76d0"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "e4b8c35dbeb60b20e90d7088613fff3d"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "604ea664f2f3587100f1cbb86570864d"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "c551936cd113c9495cffe40524b1804e"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "4574634f3619e7bb27e86e0f3bdb0628"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "f21cfe9383241482118fce67e72b403a"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "09158843515d8b4de3f1ad761ea44754"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "4017b199d2d73c1737446263e508b453"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "43b0afc5ebb11821c43516ab349a72cc"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "c17a065239e8c342841da6d087a26f3f"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "6d6aa4c67d976256c6119b0a38316aae"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "3da0c3da7ffcf3f9c51164f199a7d32e"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "898146a3a6e190ce0e7605117cfc3bbf"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "0c8043ec6d6929572e68bd2745ca4180"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "b6915097bbd603818c8c0cc1eb69dc56"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "09027312e006ba1c17859dadc1295f97"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "3b8f348e23b6ed5d726625c9fade269b"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "3f85add21c2601db9f2f520c3ec9fab0"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "b1fb1673066bbe6e231d2699d5d9974e"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "6160c2bee633cf760bfa124421336f53"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "5a4eff93e8db1302d0b8c0754acc1b11"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "2c54c9b4f93b4115dd6563a8aae89b2f"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "3bae85c22224dfe3d2ef7ac7ac2a8f05"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "0e793aeb30cc7a0913def2460e70c70c"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "bc036476d139f3da345c341563325f4c"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "50c35d16ce98cfee05780e7a7fcbdc4f"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "46c82d9550e37b29dfc1aea84ac17392"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "c8e75642b08dee614de01525619bd83c"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "e118a53f59f3073f697ddf93adb0e211"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "8b601dc162344f5931295a0273cee36d"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "651dec6eed61f55ebaf05c7c3bd2d611"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "6aafbf8f90a34ae72ae7cd15162bb9cf"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "bda92d1226ca3d54a8260bf55de2abec"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "5b556ad3d32065a2073c994cf072789b"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "0a2069db667afed80dd65d9b4e47cd9e"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "71289967d82ca5935874775dd0912b53"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "53029880611ded37a081ea8d22b74d03"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "8b601dc162344f5931295a0273cee36d"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "46f22a0fca9bdba7a1ce143015613f8e"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "b3605c6402e79e9af37ac0c52ad370d8"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "cdeb9ee69af48b517b4a56ca4779fe78"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "67d55d668d2ddca3c52baf95aae0f9b1"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "ffe1c86408728668ebae9f947197b637"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "32ce0222db5eb9acf6002d3539e76a91"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "42fe1400f565ab4fd3d51578fe7a8381"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "1bfcf9c1a57c0a9107623fd80e0fbf46"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "075540063050940c2546336644c90b5c"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "6fabec5373ed5fc72b28a5806e9be13f"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "ab1ff1886f64b0c7ef50f9a7faca7296"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "b1705007d8366130e4077e286a0fda25"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "8ef30b3744eb483f6758e1f7bd65572a"
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
    "url": "images/drawlogo48.png",
    "revision": "8b13428373aca67b895364d025f42417"
  },
  {
    "url": "images/drawlogo-gray.svg",
    "revision": "0aabacbc0873816e1e09e4736ae44c7d"
  },
  {
    "url": "images/drawlogo-text-bottom.svg",
    "revision": "f6c438823ab31f290940bd4feb8dd9c2"
  },
  {
    "url": "images/logo-flat-small.png",
    "revision": "4b178e59ff499d6dd1894fc498b59877"
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
    "url": "images/aui-wait.gif",
    "revision": "5a474bcbd8d2f2826f03d10ea44bf60e"
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
