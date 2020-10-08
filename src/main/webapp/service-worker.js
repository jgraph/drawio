importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "f344fb87e07f2b2df1eda0c2d39f62ac"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "70864fa5181f017afbb074a5f7af0c9c"
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
    "revision": "26c7b5d2f2cdaca6ec1ff64f1467e49c"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "820b0d42d268bf166ffd3cf8fc051195"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "26c7b5d2f2cdaca6ec1ff64f1467e49c"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "3f544b86403ae9b2cbf3a4e1cc51c977"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "cccefcb04036c3a329e5ed9de92c8f5c"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "ade08195f057f7c3ed03dc8fd28b80fa"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "ff129b7e851444e7be7bda404209faea"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "cca595441b41d7b8e786f1de90742798"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "00f6f36f3069e13878a1c39e56d71820"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "ba2a52c9c05dbf0f70ec7632292901c4"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "3f0eed852a4da30e83930430a4633274"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "f8731ad06deb2164cb15046fbdc76303"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "a2a8e46916433b2a88cab86834a95331"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "e19bf539b33c072529d831126ba23826"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "88b9ecb74f9411080907c8421f8bb8d1"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "d83bc122921d0d6e3854cdb3680b832c"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "c760edc9c626eca546d953d029bc1c61"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "26c7b5d2f2cdaca6ec1ff64f1467e49c"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "432a538734227b729c8e9c71899be32e"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "24042a87ac9ee5e7e01448362e1d2b44"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "248ac9f8f8c1acaadc6cab82a4f875cc"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "9f68b0fed63fb6c5b8cc36a0dbfea5a8"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "e04dfad66c12cbb8c92141b524ededaa"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "35061bfc4173bbe7a41d4ccc7539cf3b"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "9689b039469e3be32b0fb8bb4d2f2356"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "8610462539dfaffc61945703359b4ae0"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "1d7d80ee6aaded767bcdd20e83b16443"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "1997ad71ef485c73b7c091794286e0dc"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "fd19c4a9024079feef8172a56b9a2a8c"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "bcc23d99e353b0161bdbd7647c833691"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "e7fca3143004bf78aeb63b39d0411301"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "d2fbbe3eabaf1a1dff9b3668ad0159a2"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "bdffe435389ee9d990e3915672cf9f51"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "cd039d0707103a2e03cae40ffa07b988"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "155122e470b5d080b29bedb488252716"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "9370e7365c4ac66b42f33b75a2395ec9"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "196094b8751a06a24dcefecf4a4b3ca0"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "f9070bc6eaa8c8390b5489acca7c8703"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "a566ddafb3c3f785482211338ffef552"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "cb0f7c27a1dca5019623ab7006dc8860"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "68263415aa8ab38cd07ecba7c7ddba23"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "97e4513bda9fe87af1d91a3760298913"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "934800ca795d0988a996ccc1f4fec631"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "64b10d2e9ac7abe021ecee420a6bc3b8"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "3c3a57723cda33c429b91d592529cfdc"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "99a8ecbab52b33ea1329847edfac8343"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "10d26e6a58609ecf450004ca5955ee4f"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "d586f59b356a9e44b69d588c56c9ac7c"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "b3aba520d08c44f14bffa6192f3f06cf"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "c526dc374ea3dbf82a892925da8a192e"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "54e470acdbd08bb77681f639e4e7757d"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "25dcb4a2d27a3e7d6e66ec37e6104d34"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "b8640922d162879117b6f951430e4e42"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "15a7278bcb22effd4e9bff13010bacb7"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "199bd3c4026125219d8fccd4e41dfb03"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "2fb3530ae6cd6b1a94f9da50fee7de15"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "6556398dbd61d74125f55cccc98289ae"
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
