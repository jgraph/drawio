importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "cf303d7b373638c6f3d38f011be104ba"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "94711a4e146fc217df65537e2b43a914"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "a6620368de26b57e1a60f45f470a9e87"
  },
  {
    "url": "js/shapes.min.js",
    "revision": "33a522bf405197aa947647cfbac4ae18"
  },
  {
    "url": "js/math-print.js",
    "revision": "9d98c920695f6c3395da4b68f723e60a"
  },
  {
    "url": "index.html",
    "revision": "2c4bf96b7cc65a1c5b153d55832aa705"
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
    "revision": "056e6e45a1cf0b5dcf64512f1708314f"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "349dd7fa410893c82768743455f11558"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "056e6e45a1cf0b5dcf64512f1708314f"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "87ca49daa5aca507bba6e6ed01ad6370"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "ebe543620d88c3a09a09c68cf05c43a3"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "7220391fbe0027c88e789ddaa8ff2a75"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "d6720b26f6a8a9974f23f7eb9786b70d"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "834ce0ead33125ab0f05b942be433239"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "2cb38568af63f0c6fd8fb72a4ae9409e"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "fd881259654bf91f918b46da3b54d69b"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "52c2dbf156db4d4dcdf8d6a0c41033b3"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "4c027c68aecab9f2122f989f7e8d9d58"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "f541b0c99977a54333b14054ed89a8cf"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "bf23d9e561b1ba92f1d43862ced2e51f"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "586f89950b9eb01dfe974447eb3481e6"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "e383e7e556cae6226eef39d6fbce30c3"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "1336721d5286b7a96f810ac35d47dd58"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "056e6e45a1cf0b5dcf64512f1708314f"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "237b4025d46694933c85d42e7ad63245"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "ccac54049a4030d3711c91d895b56c66"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "be18dc54e947285dff1972758566fba8"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "08ebaa04a6ef818bc01095dadd8f84f7"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "aea7526194d50e3edef81c0952ec352e"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "64936a8797ede5bfac8aa2a60f6bcff8"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "2405b0347b2d18bc54d36e8892e597b2"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "036653f52759815fe8e2be5c3bb53e96"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "39b607ada96b68429ff6f4309dae183b"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "f84746863a838bca3f63aaa990626561"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "c66ac58eae85088d1f0d9ed1094dbd49"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "c03016b2ea79b7bb0336090aec8433fc"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "1731aa2e60463ebfebf62264addd4f82"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "e4490486e062022c16ec96cf71a59558"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "104021e104d1ae57dc3e0754bc29c06e"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "6816b3b2bbbdc19f31f90538d1002a19"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "94416b358b42d47f25e0dc5da4502755"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "e29ff7ae404d2050cfe44a0863ef15ae"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "a22c37635a1e90d9a10c2af54bd90cd1"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "0188480624efd21aa87f99fb2a0482ff"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "c0c141716e107d6bcf4488d6d46741fa"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "1542d701f13e58ee30aeb11b48910557"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "7da6942fb3fb14e842bac99c225cf696"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "431d4ac88cc200f945245df1bf128e73"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "5228be56d12b7b115eed4147b9cf562d"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "3aaa1af719a0fc87b6c3e7b9aaef4a13"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "a211b9fb65cad325d50fa974dc735fa2"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "b90bd5cd95035f8c34f8d18597be033c"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "bd620c1558d9156494c257faf834f9bb"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "4afe7da399a8b42708e1836619844e2a"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "1b130ee36986100790765788fb66c3d0"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "52d8ae70fd159d8f914a4dacb6bea7d8"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "a0a4fa0edb56c84b3e90aa339f1beb17"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "2e1e184c41fe0bab0eb9f12ab47d0e67"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "890faaaf000fa706b251047917fc64f8"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "d88336ee3de4240b40f3041db3ea6d75"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "340263eabe5af10e972e61fe454c32d5"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "f65508207aa2a44caff8b35676cc9603"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "297070d292fe275bec73d56dde70c7a5"
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
