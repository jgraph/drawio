importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "497dc7fc0f4c3063866bc58c68462fbd"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "98655f6a208f911f78f5cb3611e7ca31"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "8f09eee243202b723a6d71d6e8fbf78e"
  },
  {
    "url": "js/shapes.min.js",
    "revision": "90d8f1edfecfe931438f4cd995bed5b0"
  },
  {
    "url": "index.html",
    "revision": "ef6e260760a1fa3ca029dbbc0fb6231a"
  },
  {
    "url": "open.html",
    "revision": "d10cdcb6f34a8c8aa9d6a649d6cc8904"
  },
  {
    "url": "app.html",
    "revision": "d3b6efffecb556234c73284cb9922806"
  },
  {
    "url": "styles/grapheditor.css",
    "revision": "4b2c4b76bae7c1a7c7df74fff3cb75af"
  },
  {
    "url": "styles/atlas.css",
    "revision": "40f54334c7a62821dbf1f7c7d8ad62cc"
  },
  {
    "url": "styles/dark.css",
    "revision": "c7688082f9e2101d8c4150124835070f"
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
    "url": "math/config/TeX-MML-AM_HTMLorMML.js",
    "revision": "35c6f70100f11ab8f38be59ad53b903e"
  },
  {
    "url": "resources/dia.txt",
    "revision": "eba2f16bf47e2172a81b035872a5a427"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "c97dbf4c55ccdbb45aece940e0aed5ce"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "eba2f16bf47e2172a81b035872a5a427"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "f03b5466f9e374be85505b0f31d349be"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "4c3b4a0ecbd476f84e087e3097f63091"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "4bb396c915aafaa941e5367c59e50a94"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "fd170bdfc306112bb8b8e58972546870"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "1ec3789741020efc6560494f3f68e048"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "a053f079e42afb60c005bf78b5c899ac"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "fa85941cca48dc09c1bd8e1c4ea490e2"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "a3f396c3807e4ab8a17d6dc6a07d204e"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "cbf35661aa6467189d9be1e4c7941e37"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "df4e519d845f3bfd7ae8ecf36265b316"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "ac1c8107def646ab6595fdd1d5bc9ee0"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "54735b98a3fe561eb61ad6cbca4877d1"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "4eff005be19447989144c73d1c3eff3a"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "eba2f16bf47e2172a81b035872a5a427"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "0049821aa274dbf8a444872c2bf2d00d"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "18b7a9e22347732c86da75ed3903523a"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "8e68dc812264a658c1ccf775a2a434ea"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "eac04955c8c2018973f300070f7039a4"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "d062b859d285acc1edf71684c2c8d024"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "b2e17e03253a316d60c01e595d00f9db"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "a96a54d2710cea485d10827f3b45b5f0"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "f48adf7fdcc48ef992c06c7008feb0d9"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "dda8cfc86d1028d7973a55f783344c69"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "08e9f8258bdbdf01d56d1703abf6882d"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "6f4d980b47fa6b962ddf403cf743b783"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "5bd35c5e315b5c46aa6e5be08d067f36"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "73cec301dec142eebf738368b1a5dc62"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "b9cf616e4cd2140aae785af4e4b94434"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "91dbfd8ad428bdea3c0a90fe88950419"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "62e907bb44efd872bc66eafca23e95d5"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "aaceb8e75da3234526f563668afb2f1c"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "99cbea5ced630baf4e4d84a3c7145709"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "56e50361500f9801039888f4d00e122d"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "9168fa2eb0e53bc71f5f9ff047687ce7"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "871d3d2155e88488439a7872c2861fab"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "98d8bc1cf002d16af3fc058ac60b3b73"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "a4186ed3f8e1c7d212e016831174a2fa"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "0cc9ac90c881108f7fe0733f15a2fe44"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "32ef339f2971ba2565e535ea40acaa63"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "59acfaefdd404019961c8386ca886fe2"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "a3f5fef73aab61db4f2a5cedcf5028db"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "6520d86313622d1ff9d768989b2ed46d"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "039cd731db8d574ebb94688ec4ce9174"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "6456ece2b388778a80b2e352cde8a129"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "122fa6b7d50af120f22b26ebaa9ff383"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "15579b14cea4063685f1b1e579056684"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "9f286466dceb97c0eeecce0daab35c50"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "4c951019ce4f56dcac08787e93e2edb3"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "bf9d6b66e0cb4fc1b250bae2c6d33c3d"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "430069dbd9b0102c54f4c82dce12d498"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "73178e18b55d990211abf16716a7b12d"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "e297a200a8c56c986fc74a9a2632b47d"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "5878d5fd9bebb90b2f4a3aad2b6d78e9"
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
