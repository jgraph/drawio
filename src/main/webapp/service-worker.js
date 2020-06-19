importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "b2f2f1d34545f1ac468e8248c45586f4"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "e178b1bd98121a088e43ac8028583d40"
  },
  {
    "url": "js/shapes.min.js",
    "revision": "9b887f2907288abde17aec69290469f0"
  },
  {
    "url": "js/math-print.js",
    "revision": "9d98c920695f6c3395da4b68f723e60a"
  },
  {
    "url": "index.html",
    "revision": "c356c0a671c0e709c0b49d17dbf99cf9"
  },
  {
    "url": "open.html",
    "revision": "dd24217f6c21207b54475409848f31ff"
  },
  {
    "url": "styles/grapheditor.css",
    "revision": "6ca3b89237f1c6cb9cfcbd3032b43431"
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
    "revision": "e262127c80ca9ed2a7f8b4798031e10b"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "4f586de33ce2bfdfcd22561dd09f4ffc"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "e262127c80ca9ed2a7f8b4798031e10b"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "8776147c0ce74eb72155524e8388b604"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "13c898dfcb09b8b2fb49bd15c6d66e8d"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "fea2363c21d7fe6146e38469b7e0111e"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "8d36aa82ccd09e041afd71ed40ae3353"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "bb2be2714c551762baaa5aa4c1e1fb27"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "1e42c6cb62af3b7e83eea6fe70ed075e"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "19ade924cea04396234a54c91e8211a5"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "c59d2e98432e7453950d8a69de45eb72"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "26dbc4b6cd1b98137cc9f930ea3a7a87"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "81a383f941d3af98eafaca7debc1110a"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "687b9909be4eb68a8322cdfda4fa3baa"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "91b5faf8084b9e80856d7f7034f172da"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "b1f4ed658be1ced576ff4c9b1f85e96c"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "4c53913e69947880c69d129370efa446"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "e262127c80ca9ed2a7f8b4798031e10b"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "46e0963a77e64cd28d51e0f704ddc9e9"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "03c724c933aab7204ac917f586d7f66f"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "1a59151e3dafc3c8303d10179248a8cb"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "2b3b469e60d149f60c53c0138d6fc6a9"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "6886357648395a03c97159bf15a7903e"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "ad3d8f914b7aa65709abaea87168738b"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "f9f13ed2669fed33442439899f405f78"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "e31bb6e77e63fc5521d0fedbea233d01"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "d754e8673836ed6b736f03f0f0d993fa"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "cf151d40ca2bb223a8e00c5cf11dc94f"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "6a3380511c395cf4ddf43fadd6dada58"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "694804eff540a32ba9e6cacf67934996"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "5920ff309a7057e495b4f7394cf67e24"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "8ac004075d841f90ae473236572d7d5f"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "12d3ccc250d76bb48f55ff193106d852"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "42362ecdbed6a0870c02676c7dd58a0b"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "bb2ec0067c9f3b6fb1c0aac41e2317c6"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "24043da11485643b7024219c0cad608a"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "c2bd2106669fc64cb468e51ea5584351"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "f05c334e1aa9c716fe3314ef5977c26c"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "c2d491d14d585b99d63ac93fe7aa4fd5"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "04cac25708f0ae323935090c8cb863e9"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "b1b46f58bec4280eb4b3041c776e8b4b"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "5f22f6833fe0cf139d236bb36101a0c7"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "0d13cbaace826307171be3a58325c738"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "76fbec7a75cf2157969c68bbf236a466"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "581ba6fe5c55176c121218f5376e9a86"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "0d0da9d192074a4078609492f5b72c74"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "35964e5c81eb9d29bc1e630f9196eb01"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "af3335cb38beece53ee5445910dd8ab9"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "091cfa5efa3342507f6e176b800949c9"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "e191ac4d854c8dc4a254153be5a462f8"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "30d0e5368b9a328422dc0221da81914c"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "f60283687ebcaccd72794e729a64088e"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "5e887954cab0ef597f0976f7c3b00a83"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "e5d407c535f41ce8396e0cf95928b63c"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "5718768da8045510a117565626bb9c28"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "ba50880007d95e0019b3439f462ab5f5"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "07c514312f908d6edce74ba36f52336a"
  },
  {
    "url": "favicon.ico",
    "revision": "fab2d88b37c72d83607527573de45281"
  },
  {
    "url": "images/manifest.json",
    "revision": "078a1ee03d5b64100c5b760d8e73dc88"
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
    "url": "images/android-chrome-192x192.png",
    "revision": "a886234330ea25d4ba1c47f678b00ef2"
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
