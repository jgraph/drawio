importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "08f0ac76a3b5bf3aecdbccc500a87612"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "f401b03f1145a3a76eba114ec7e80b83"
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
    "revision": "84c5670cc69d7e0704f863c78b1504de"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "7cc42e3a373d6c500def64511b593e7f"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "84c5670cc69d7e0704f863c78b1504de"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "05d7c4e48b6d1a77e1ed63348e8fc3fb"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "e8de1751473062527c057d9288ae774a"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "fe07a34d958ba8a4d3f249657312d777"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "7c2028d6e68c38e4e3f8997a9ea04e17"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "d5f20ce4508a13d4137945da4f02700d"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "f8b7788abffca66d08abb81d29ab4891"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "ff477b6802359a1fb9faab6c61a22e79"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "1d35e616d93b1ada6da502b70933ba38"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "ae389ff931e19d5b8a6e66f613cfddb5"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "90546cb6b08b3fa164751b324b0ec72b"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "23a2087716ab0f7452198a743a83d8bc"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "4749ece0f2e6e5b09ac454233dd07a9b"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "0efbc89a7f11389ea895c04ab0846d9c"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "592da9713b3648cacef15222007c3a4b"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "84c5670cc69d7e0704f863c78b1504de"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "95eece78fb95494d6c23d6bd4fefd3e4"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "0f6a4fdf54398c423e43c099c4c3a99c"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "0358e49c467e9b56a666e3b6342f2135"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "0c46a9089640ac1eeecf95dee4aa853d"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "d5a7fc9948631b97cfc243f6d90d7d07"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "6f1848ca42f4043a5bd6ea4afc89924c"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "c3639da81781d9bc4f221e2e4d746215"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "32ece3222e679b263bea16e5887a3097"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "74cd559d96379f8403a36afbc16ca95d"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "4fd553b9ef0b9197245918243ce8a8c2"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "0724b57ec2bd99f9939ceb481e8bce06"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "70da2473e4c9781cb847608122f818d2"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "013c93517982e3aed1ceebb6dc641dae"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "be691f2e4daf2620c97b585ac07958ba"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "adf11c778d030597a99ba114b7529ed2"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "ad287de72e903c935172633ccec020ef"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "58d6282fb75783e7b13234667fd4ee76"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "b3e567f68ddde3a121df6431578adf50"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "1c148e3fc006d07ab7c48cdc49a0c143"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "1ffa33bbb93541f2eb173889b1f85e23"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "097173aa81255fd66bde347987cd4e6e"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "ab1985a41a4e32cd35c43b8b64c34a7c"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "348f42cb77b8401463e15525c58c4054"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "937cfcf76519dd02215637991b84b2d9"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "648f040ee5aa8b1b4426b1c85c90f508"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "316a613a51f7573b73c60bbe607dfba7"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "e1cf56d011355c393bbeb49da3c939a8"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "da3e01d839aff6ba95369e9eeca72b49"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "0525cd9ccc8b457f14bc6ee18803c888"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "19a0fcff5dc481fefc475c3a4236df28"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "461814f4a2c895d3bdf4fcddb36aad36"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "f88f68023a0745952aa626e61160c7f0"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "4d8a08d9a9bf85d76bce2878d24c15d9"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "9143b8577ab8bfb38db1d2b71aa551ed"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "9d7194cc4f2a6d6fddc5425d71462f77"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "97f2d336d6caa8db00aaa49a7e0a1a5e"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "082025f45c4c74e064f9ed79d1c9bc0a"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "64c468455ec461f4ca0a41b5bdb8611d"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "43c54c16a2b6641e2aea783753eeeccf"
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
