importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "319cc654d54a8737befada3433cd2c78"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "7e985a8c8ea46163d24e15c0177203ed"
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
    "revision": "1ec12a0dd13b43b8d7f380cd1bf6b9ad"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "06c1109d996b1dad062b05c771a61920"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "1ec12a0dd13b43b8d7f380cd1bf6b9ad"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "1a122f299214bc6fc0cf300270f6d869"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "97631cb2737b0e746b7f8ecc8941c727"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "1a825bf39d1c36c2fa9b2ab48fd2e9e3"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "630a27fef0624423314d0926df57d5d4"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "fa1bf307f00d923528574ea211dd227a"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "3ad389e87a0e85681d6d8e2202ff7908"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "3466869f2e29324c2b3bf55081826454"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "25b23ac9f923266cd1182fe39923ad47"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "8e3c3fbfa22dc7ddb97965e8deed2c4a"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "b80c03fd6a1057df2049c953ce75c8c1"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "a742a45372dafe715d15132779e2b375"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "72bb27405fb620dbc9fff23cae9ab785"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "6b8bd23addfe2c3d39e09bf378d83074"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "0128304941e2bacfc3a1c5e13647de5d"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "1ec12a0dd13b43b8d7f380cd1bf6b9ad"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "06cfad9581f1e9dacd9eb5b9e8a927ba"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "4da4e966274427f93c1ffa0fbb62a131"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "6d3b18a576cb038a0bb7f6d8b2203d1c"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "31e166718131d82495b1fcbea5eaa13d"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "c758942c6cf34797186db837c73f62fc"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "a0ba7ed84175d151fb1aed287cfc688d"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "5eb7f89a1f2d470c54af6a631df49e4a"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "7d098875272b5ebc2f8cc34429ad2d8a"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "8d42d60f44ceae0e2c98e7db877e0b0e"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "481877838da3c834ea62a666b9cb60a7"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "2ebb56adc00cf11923807fbcef5ecf66"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "86aeccdd67fe3c30e6648c0f11b3ac34"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "e3b2828c0c6907655d8a7456a11dec84"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "3923df3b657d8b0c57e2748d95dd1570"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "fade58d52b126e3a8b40e7a004f9db80"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "6ccdc8b9382d820ff4e3a1f94344f4b8"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "da1651246e84f1a54c0b83611a9a73ec"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "c803cb9d37d0a40e7805a51af61f3d53"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "578125b9508f38fdb7b9123c5d7b325f"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "e6d546be7ad01b4874771a6a9bcf6999"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "dca71bd35edd43717e61c5f86bc5738f"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "460007c43fded3f0d7fe175d3df8f26b"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "e0fe5b4a4cfd300747e2458c1eac57a6"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "a2f77277acb7a9abca0be8cfcb6e78b5"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "a56c935f2e0f4465456c587abde38612"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "b754b0206f8c0ef01730e417f0fa4490"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "9669902495e40a08e814a76a5b43e55f"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "4e858034bc8bc1ce2025f988d614bf6e"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "3bc2f077588dda41cbd59c4177af6524"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "9cc27e78ab552a3923ace242b08cc5f8"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "ad00ca68e1fdb634a86a2eff13c02cce"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "9836aa97e4f4ca206eb0b244496cb44b"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "92fa763a7fd00e53042b6a25935108c6"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "29d5ab8f9f37afc217dbe2667d11ba52"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "bceb1463e5553ba0a9fc41b46e5766e2"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "26a8dbbd11d8ef8340f333701816957b"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "8bfea6e400b8dea4801baa9a5a7fcc02"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "c1de0ba62ec390bc459c267e5ee73b07"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "0e4e12b9042c9ba41a69897e9771c691"
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
