importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "0e87c7a99826a5fb32b4c7694376f69d"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "b24f190f5b615ac2488ca86208143d59"
  },
  {
    "url": "js/shapes.min.js",
    "revision": "fafef0a25b40d8a14ae6c88f225ce50f"
  },
  {
    "url": "js/math-print.js",
    "revision": "9d98c920695f6c3395da4b68f723e60a"
  },
  {
    "url": "index.html",
    "revision": "24304c88f3933b6f91910c339f8a2c7a"
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
    "url": "math/MathJax.js",
    "revision": "b2c103388b71bb3d11cbf9aa45fe9b68"
  },
  {
    "url": "resources/dia.txt",
    "revision": "b60363a6346142974bfee87b70fdae87"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "a377dcb6d569e1f8813336091b42f878"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "b60363a6346142974bfee87b70fdae87"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "0119eaf1146ee2d83ef997aa31c878d7"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "695140b5ed11d882833a85cb13fba49c"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "b1cb41c5fe2a688aaa5c1cf8b0958b14"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "b93a013a4cd31e248abc433fe42193f0"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "040564ea4eed721c15dbf3ad28da8d7e"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "70d9a5929789e37267c69e13b3f0ea38"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "418e5f20f68c2a1cd810cfe2d633053d"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "5c1ab50c62be2d29fbad51f97683d331"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "3205440ad12ebb8788f9631395255bcc"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "9225ffae67763e473c9e4ba2da7cec39"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "d06bc0c67db191ff829bd44a7322c8cb"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "133752a094857cd6d30b11e2f46523a1"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "8b0d6a63c057e78bc74b7909eb2f4cf5"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "010c06c47c42432945686769dbbecfe5"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "b60363a6346142974bfee87b70fdae87"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "7df158a82b5886eee06e13b9c8e91810"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "3ca47dfdbd83fa773e0d42e2cf3c176d"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "197418f7a41eb848862a11ec52f45f14"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "448a14ba5e3c93e8a709c08ab05e8be5"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "ab28f1da640f9581e505184e97b04f9f"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "ad17cb8844de48c378cd1a0df7e75027"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "eef68ada859eb5c34777d0ab06874784"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "df2e4746574a52b96922e9b0f985a16b"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "3789abaf661f41c957f0d30d4ec0de5f"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "1dc0aa27ec864a5ff5f36845b3a20c7e"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "7c46d96889942aad148e922d6f2ebc5f"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "e7022d05309d441ec5cfcee45f3aec05"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "418193cc8c9bc27e1d96ea90980e0bf4"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "d6f2aa8e0066f013736ba771c1c7d4ef"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "c88b89af86ef0fe83adf87d221bac437"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "5998916ee3be2945ab6e09720cf804fe"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "c838acb9d39a20c5da2dc221dea88848"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "529b02863c2baf32df2f443e2de484b2"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "c1464bd19ab819f771a0300f01016357"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "dbcb057f8b8f2de8484e8de8776a6117"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "dee88627c709c895bdae7e27656285e0"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "8a03f77ea3980c1705552a42e28adc28"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "0013ebca3f76586c36b1d2ef022efcbe"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "378145660d8a716d118d9d287a37c8b9"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "641159751b878ebab87c0863a8a3a9de"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "78e616502b54b96492a871a38cb4038a"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "b4959378cd22097c8517a396f7cf7c09"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "352cb210117dfe48de767c8a2a529afc"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "9f6afc2da37466db0974466ef07ca8f8"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "119c7c190c3074eb7b2de9ef2b1e5361"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "d0bf6ec6e000ed566c10086a101e1e4a"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "862171e716388d4bb76936b221abe1f1"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "17a3557ebc49ea861f9fa1481598227e"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "f9cb36f205e162d307f4e7a0cdd85f0e"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "ae339945d9d70dc8fbc8aa3371c41fa3"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "29ded70b7f3aea8c90e52a6236da2acd"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "907c573bff8b2c1e1aeeb962141064f6"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "2d2e414c14afd8da20f0744ef7a72069"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "ea8bb796a900a5b1e384ad027257dee6"
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
