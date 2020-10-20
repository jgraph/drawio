importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "5f5f114e28603c9ea325bd6839db869a"
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
    "revision": "c5d91ed7b184745f8cd26782fbb34b5a"
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
    "revision": "30ad296401d5e01e24905763071c57b2"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "c78cc699de385314d18526b6ee4b59bc"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "30ad296401d5e01e24905763071c57b2"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "ac7cfb4e53123caa02c1aee6d109fe96"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "072cb742618a4a67417ff8ce1396ff4a"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "e7bb5482a36deecb6844fbe6a4633057"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "af9de481e31005e8288aeb3756fd93b0"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "79f78a41415420e78c12f9e74e0c726c"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "2ff1d9d26d24c4d06fdf40e9444e2352"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "65729d0966b053f918973b2e96b628a0"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "799fba099041fb4d1d4416632c205b3a"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "ed3c02610e49d92fdc2720f071c4b279"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "36a371a0993ebef8a1eab2b722bcbd48"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "6727ea52812e218a384b3deae0878e68"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "9f2d392c3788bfd95cc380da27cdf33c"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "4162d8cc818a48c07795346e82701bec"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "91015047b95b0ad84697ae55bdfea546"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "30ad296401d5e01e24905763071c57b2"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "7a52538cb35d07deb9de7967f6ea07f4"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "17e3d9229a0250e3b2cc86c51012a86e"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "296bf8c3bc0b9f116fc568ded205b9b3"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "3979d24e0f950b6a7acf95e91f8e3629"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "30d1070fcf6004b76bd47912db9483ac"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "66e4e2f16bfae413c8448c0526587d2a"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "e13bfdfab6e1b0b2c2f9f930c18fc1c1"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "992ae03b8b0b2e9130be2e2074f59896"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "fb35b2ffdee6e090623bb4faa9a10851"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "4a553fb981922faea44518c03623fffc"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "a68e3bad3b78b17a9dbf1f76c483f87f"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "ebee85eca4f86613ff891edfd3a0ca12"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "95d72381f76b78fccb790e03ac1e0139"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "0b01ef96d9dde2a42124a8c9aa1526ad"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "24d7bd5545ff53930afa534952e544fa"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "ba202637079cdefed3dfeb0ab2e2c893"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "7c03dcd8ce98b03a3378f4e7be229350"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "3996983c4508702ec6953089e2a7f152"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "40724d9132019424f3a5a7dab2a59b6b"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "08fe3c3e3e46dc60d6855ff349448f5c"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "15c4869cdd6126118cdef665b922e7d6"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "124454e1675d3c359c3b7b1abe5488a7"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "05852e901dddd4c6aa229b3030202ac7"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "b4a570305a388db4958b5bfd22a930bf"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "383dc20baf87ab379023e17013a9bc37"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "6ef89e8359f6c89a9370d8c685b8be51"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "fbdece7806fb4d151c4e2c8e3b2cb864"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "f8bec97fbc47e81ba5c11d804620db4e"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "47bcc1300b4372f69c405b3ff83840f6"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "edd8ff14fd825867e92cb30827e455cf"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "5df8573200d95c796ac60578709e6ffe"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "69440c5825bb3c0e76fb7280f8d3e6a6"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "2a40e4c70e31e84492d3676a03bf1ec8"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "cde631d573875dcc32821c659b6ab380"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "8a98314e8a8df0881c81f79a8f453b55"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "13b8697b23d956a367d3e36fdfd3f75f"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "46824caa8e1489231a67b7bbff2c3699"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "34533263ed39bcb75e597c2e577743e6"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "38db7c0aff475269e3b7c0465c7f4014"
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
