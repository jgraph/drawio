importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "3d97e34c4880b7281f99f5027b381f10"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "53703efdada6d9b9367cd1cda0bbb430"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "dfd6700d74c9e746589368e903e1c50f"
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
    "revision": "f87ce0748d93986b03a627996b07183b"
  },
  {
    "url": "open.html",
    "revision": "d71816b3b00e769fc6019fcdd6921662"
  },
  {
    "url": "styles/grapheditor.css",
    "revision": "160296d3dea84bec84ee1b466c62c41f"
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
    "revision": "56dfe70e4aeaadb696db8104bbf2d2c9"
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
    "revision": "f17df2deede03adcbb80e59484357e77"
  },
  {
    "url": "connect/jira/spinner.gif",
    "revision": "7d857ab9d86123e93d74d48e958fe743"
  },
  {
    "url": "connect/jira/editor.js",
    "revision": "eb91265dea9def43886bd30e223b50d0"
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
    "revision": "af11c975889afc094500e326f737e7b5"
  },
  {
    "url": "connect/confluence/connectUtils-1-4-8.js",
    "revision": "99182f3b2b75c406c4535a0fd8bdaa7a"
  },
  {
    "url": "connect/new_common/cac.js",
    "revision": "659b958b774f9eba916b07325420098b"
  },
  {
    "url": "connect/gdrive_common/gac.js",
    "revision": "6a425ce403e549411e4985ad9b43cb7b"
  },
  {
    "url": "connect/onedrive_common/ac.js",
    "revision": "b41c370f9c1ae64a32d9063ac1d8972b"
  },
  {
    "url": "connect/confluence/viewer-init.js",
    "revision": "295febf1a6a80a0d57805672107961b0"
  },
  {
    "url": "connect/confluence/viewer.js",
    "revision": "41476faa529e04d39b75bfd3e728c4b2"
  },
  {
    "url": "connect/confluence/viewer-1-4-42.html",
    "revision": "0e9ad57d31303c201f285b2739f34169"
  },
  {
    "url": "connect/confluence/macroEditor-1-4-8.html",
    "revision": "689fa63fd3a384662b4199f6e4a5b5c1"
  },
  {
    "url": "connect/confluence/includeDiagram-1-4-8.js",
    "revision": "07de6f401ce7570df84ecbbd31a8eea0"
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
    "url": "math/jax/input/TeX/config.js",
    "revision": "c6de0381e92b311e75264dac618de39d"
  },
  {
    "url": "math/jax/input/MathML/config.js",
    "revision": "cf85ea4a5bc5ac677243e755a7c31464"
  },
  {
    "url": "math/jax/input/AsciiMath/config.js",
    "revision": "e9f16b23a8e666d60ab746e001b3b85b"
  },
  {
    "url": "math/jax/output/SVG/config.js",
    "revision": "2331dfa04ed33a371d8735e1798c4980"
  },
  {
    "url": "math/extensions/tex2jax.js",
    "revision": "6313aa4e8b7edf452102de2729ec6aed"
  },
  {
    "url": "math/extensions/mml2jax.js",
    "revision": "835e7b107ce67d0e09a002302b64d979"
  },
  {
    "url": "math/extensions/asciimath2jax.js",
    "revision": "ba4a24f0884938191d5cc8a719050c08"
  },
  {
    "url": "resources/dia.txt",
    "revision": "be8b5c300f0cfcdc4e53589d122185a5"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "bee87d9ce24b5790628c3007d5d2e8b1"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "5bf1bab399fb15567036c7e74b62ab26"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "d711225781702c7832ee0b2a457f8d92"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "56b9a3b0cc078753279de48201b24bf8"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "ad55fe4e6db5a5b09a72722a90cde4c9"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "e613433a6d6790b90375e7f81992a492"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "1ca62cdf182ba8344effcc43a3c0070b"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "e3123ff50632f7f6880e8014020bfc54"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "529243d814719a09f1e8cfd3205ef253"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "f483c373c5676fac744542079e63d796"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "df1a64faf69cf9179f665d3560c778ac"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "757b3604d0c99aed76b6094ad79a4b0a"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "9299cd894f49bfc56ac6d695f3820eba"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "27129da0ef51176a2ce375a61fc47e80"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "3cd2674e23694d5ea511e077bb94c1d9"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "497bc4854c40ad5a68689161a9bdc8a9"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "4d232bc81b7028531754c2c0aa518aeb"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "5e668830ce6b45c4036561bf10f041c1"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "48b3a2b11f20a2483956b98c29dddbee"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "f6b30c2a69e6298c1f86bed25ab7cf55"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "8bd1b3bf5fe3458cb22a83b2b2ed7307"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "2813177fd203e90c1741f4d7a508d502"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "a9d49e697b9ca3edca6ea4532cc2d2e6"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "f56b319b11590148a3889af743ac146d"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "fcd39cd5b0c68e86d58096be8f16168d"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "e3fec3edae86b637d783d1fa3f86285c"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "1529954ff0a0abdc576a12e5a3139dae"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "44f68b5a6ca2ad0e276fcf8ab30ac86f"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "62326145aff892b80f3d4da70e4a3af1"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "0bae894a5cdb2f139f73ba1e1fcc5eb0"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "3d3148dc8522ec87fbd6eb069f5bf940"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "3b1248ae80c12f67d1857e4334cc23f2"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "8af8177e964edf562b605662718549f3"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "c84edaefd3514ab5f14c7e6ffdf6f7f6"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "be8b5c300f0cfcdc4e53589d122185a5"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "ad7a4e53f670fff29008bd76304e0cf7"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "856d68f6e779556ed1b7e1a5fec58fa4"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "01b685806ccf2d2e17dfa8aa4f9ff548"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "17a5306c56e4d5bf5b421dec2e7d7371"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "703544179acdd89c45110a23c61dbc53"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "da851e7cae3c38fddfa3b863a47f8ee5"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "69034b02931fefe9f54527fe1dab9f14"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "be8b5c300f0cfcdc4e53589d122185a5"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "bc7994fe49087b9885e51f49c49bb3c0"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "fc97b1f416bda481a132d26d5469b58b"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "ac862cab7e36f48130910b01747e3c5d"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "cd6e65a076599a28b22161e852f8f863"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "2a36a3f0b3637ed1ecfa9c4e2933d5ca"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "e8645f5f9cb9119c893e25d372cc7e6e"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "c009dd22858f5d9bc755a51c00cd2200"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "1c74ecbb23d232a6c1c5c451e70bffe1"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "667ba94e72fd2b646f59f2972ab6a6c5"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "e166c98a798963887f36fe34aa9712b2"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "44311aa7d02cda6e976579fbedc65ac5"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "83742095b48a83037a290ec574f959dd"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "6e2eee2edc5483ea9c365766f8fe4d6a"
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
