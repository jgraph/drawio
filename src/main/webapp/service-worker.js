importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "a8fa137840b7ae79e23008940db6f095"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "99a5699e7051a810fdee45e0fd91be93"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "a6620368de26b57e1a60f45f470a9e87"
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
    "revision": "18c33f3af16a7c95000d868f1886c7b5"
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
    "revision": "27d259545a1519fb23cbec0f7360c9ce"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "5b06409cae80df1fb4db967a43198db8"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "27d259545a1519fb23cbec0f7360c9ce"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "8e270ea2a00eec62ed3056d8b173a343"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "6c6f33d1dafa9ad1763f8a0e1c77d9ea"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "31f1c8f4b0f4c7f247e2e4575ed049a7"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "205118129e8df0dc956285fcb6e13de7"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "35b6a1ad89db2335060404dc242678ca"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "2cd2be36fdf3465b7665ce13bc0322aa"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "a2616c76f9c6249a4f78a53a1cfd8891"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "e6a5f79703ae2c8d0e4b23375c19975a"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "5d687f54cd8ee2061387af6f4cfe4fcf"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "a6697aaa230a97fd286a4f0aaa0727db"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "c88b2f76aeaa3138ade917bc399c98a8"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "15ab7e88a09d87498a4b6d048353eb34"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "ba5bb8c3bd6a492e3b45b69e9a4cf6bd"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "da301eab521972967e51a5453fde6cb5"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "27d259545a1519fb23cbec0f7360c9ce"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "f1cc8799dbfe7883329b037a632aa96e"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "0366546206854c2f3b53fbc2c1da106b"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "736f51f7280ec763d7d8f69a2e2caf72"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "5ef39ca0106a36a0c3fe2039aa78d8bd"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "944822c5ff72d5fdcda8954ba7da66e2"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "69599e42b93790a257b3b108cc5afc6c"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "8921764a2b7fad5602adc21e64a5ac2c"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "7a245f1d5410c0aec61dd838a1fbac30"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "89dfe0393507de57306bc533b09a7162"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "6592ba85798cc4e975d84939eaf2892f"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "d2539f7b1fbd103087202bd3123d897e"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "e7bb4f0421d8e5c243ecdbf84a2164de"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "290c8c8cf18bbade8db53b61a5b2f621"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "b775a5584628174079d451e431399eb3"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "8b6ce98e046bd84c5bdd760567e8d122"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "dbf6176fc59f0f80725d8ca386d4bd7c"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "a433ab4b602e23136d8307ed0ae08aea"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "193eb613e1cab6b1f9e64ff65a85e6d7"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "0309a91a9f59afa320b5e7cd00e321ab"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "e42b8f7023416170ecb52ca4690925f1"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "05c8cae5b44a635d63bbd802fce54461"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "219552d03be1a6852f09d5194795034c"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "5ab266f4cfadfefd0961ad38cd9cfbd9"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "9ef9ef97ff682cd1be8e7f7532f54b1c"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "bff8275e7576dbad9cec254aaa984dda"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "17819885a1e96766a80d7ea95fe92402"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "4465c048e1310af4e0bd07fc96144590"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "358f9f49641432b8b08a9865b098b765"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "b521e91ade6f51790cc522703097c93c"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "0692d5056e41a364defe7a9e874667ab"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "74f5f13d5328ad08891f287a216b2b25"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "d1d4a4304760f021d14ae78d4c63c7ba"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "1eafabf4cc207df9d56d263f107db94c"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "0b519f89bea709a535a4b324ab2d4d0e"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "52cdaffa00947dc3d6fef9f3469cc532"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "e9ac087d108743305398c1161eb81549"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "7ed3af9c4b4024168069dedc96c4c26b"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "928311f19eaf8a634720389e4e2ff489"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "022f9360053e669c9d1d03b87a84a5a7"
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
