importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "cf21a583000380231a4ced8f5e13345e"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "509438d35ee02968e6abd6af13814198"
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
    "revision": "24304c88f3933b6f91910c339f8a2c7a"
  },
  {
    "url": "open.html",
    "revision": "d71816b3b00e769fc6019fcdd6921662"
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
    "url": "js/viewer-static.min.js",
    "revision": "89c875be6afc07905a9a40a1cec22239"
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
    "revision": "c3281d8afae94bad5b349c5ccb84501f"
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
    "revision": "dc57594d2cefbe35c15962a3ec356d24"
  },
  {
    "url": "plugins/cConf-1-4-8.js",
    "revision": "5f51c9102e55474da1f3012c011d6191"
  },
  {
    "url": "connect/confluence/connectUtils-1-4-8.js",
    "revision": "d54d62f9176629eca20430ebd4971e44"
  },
  {
    "url": "connect/new_common/cac.js",
    "revision": "659b958b774f9eba916b07325420098b"
  },
  {
    "url": "connect/gdrive_common/gac.js",
    "revision": "eb7db3700937a2a30d178ab25c9f13ea"
  },
  {
    "url": "connect/onedrive_common/ac.js",
    "revision": "9cd01be6b3a233401d77595e2c38ce14"
  },
  {
    "url": "connect/confluence/viewer-init.js",
    "revision": "295febf1a6a80a0d57805672107961b0"
  },
  {
    "url": "connect/confluence/viewer.js",
    "revision": "a41b5d96a4f970e26b15e61547827f41"
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
    "url": "connect/confluence/macro-editor.js",
    "revision": "257473ece79f2f7d822a1698699c5479"
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
    "revision": "02ad7d4e5e54c75f141fa58d708baddc"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "d3de221973ece1ed5d2e7f9b6fa517a1"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "11e99e1e7ed3bfb8c25621ab776ad548"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "d7983ddec18de990d291f6c0a702c6b4"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "5f3a318445d92d78f088785933bf417b"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "cffdc3d2cc4f81d6f658e54ca77899a0"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "b8d0c773ddeb3ac742f89b73de69f28a"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "be70129f8b92e2acdea02a08aab9758d"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "bc644e489d8e1be68675b1472921d6a4"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "cb1b8ca04c6335a7be7fd8299222615f"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "a4644f9e58c25fd73d03ec20cd36cc6a"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "65b4fce7a984fd1ed636d131b024e5bc"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "4749e807ad9ce2a040ffb49642bca64a"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "fe4b7a57bbbf878bb95240672ed68ad8"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "de772ff6f60611da3974a147b3362978"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "58c1de889c587d3c37505e2364d409aa"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "322085c1cf30660a636177f06d600976"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "bedc08a4ecb27fe25a2dfac7fe637bef"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "9266b4850159d6875071c245d8b2a9e7"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "ad7ae57736c6a488d179c92237bd2d9d"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "8b157e7e5bb87eec37d34c790f76d0cb"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "19a782a83856e1b7fd9cebc8475cdcf5"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "4c42580d4874a1b0a2c46e386ae4310f"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "577da4069bb12fdeb169fb59a928db6f"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "dc3c73f6c51ff4248f7c4d9eee05763f"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "680d8c96bde54dc08919e9608fd38866"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "7f16d4ce9120b6cf379d8a158e58fb3f"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "8bd638a87b2bd3f0214fd5a15ce0f642"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "b7bbfdc941bb18c38cfad5ebd97065ac"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "63f9e5d20045f7c8ab5f7b319ee7728c"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "6447ae31ede7b9739856e58057bb4162"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "d404caf0e89158a589988f6707e35335"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "5b54f25e874487cc80aeb25ccadaeda9"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "71ca677d625d5184739105603fa90df5"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "53193aa4383e57d07951cc6df586b6f4"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "02ad7d4e5e54c75f141fa58d708baddc"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "12271a094d66fe1f7b9bfcede9df8046"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "8352587bbd8ea6561c3f3f1936469291"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "c7a7dcb8c10b02afb46ef2f716412fce"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "a24e0dc956408b447a9a0e292f977dba"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "9793914165038f718bbbdd94cd68006c"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "2f66710ab60f9c02f6f3a8ac2cfb616c"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "f70d8af3b7767a9d50d48992e792a9ec"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "02ad7d4e5e54c75f141fa58d708baddc"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "cc037fa952e7f24c40cbdc394d3ad0e2"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "f6871254c6c7d95710b20021ba1b82b6"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "644ee5f2a31ce0194dbaf9b24ee3cd33"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "33f3547ef3692ee2ca82be94e707d6a5"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "6f446b25b897c02a9b4673672bc99705"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "66431dc060c64a43bda9c949d855a128"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "aed7c53f75da87064eefe1da9e920951"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "7495b746fa3cdccfdbb162089bd6b794"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "e443d749d38196914d34736b71e971ec"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "6021b4f6908ba4f2bf856e45281654c7"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "7c2fe2a2590364e755772bd9c8d0259e"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "6206ce07f81460667ea68825742d7aae"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "7c2915f7e832f8c77d1d95bde0490131"
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
