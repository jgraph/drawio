importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "a2325780f416a14a1c9f3f06f8ed6c2d"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "55851b6a2150f678be7c76e2ed22ab65"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "8acd653d31d1e6e1b4fd49d4efe2469f"
  },
  {
    "url": "js/shapes.min.js",
    "revision": "d4e08647ed1af5535730685f546a454f"
  },
  {
    "url": "js/math-print.js",
    "revision": "9d98c920695f6c3395da4b68f723e60a"
  },
  {
    "url": "index.html",
    "revision": "8ef6cab30fadfb9eaef35903e8b9a379"
  },
  {
    "url": "open.html",
    "revision": "d71816b3b00e769fc6019fcdd6921662"
  },
  {
    "url": "styles/grapheditor.css",
    "revision": "705c15d388d662654170b53efd9cd317"
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
    "revision": "ca5d647f27aa8841f962bcf260fed362"
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
    "revision": "e855467cfe258b0acdacca54dd71cd69"
  },
  {
    "url": "connect/jira/spinner.gif",
    "revision": "7d857ab9d86123e93d74d48e958fe743"
  },
  {
    "url": "connect/jira/editor.js",
    "revision": "435d01373a459c134b05b6640c88c327"
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
    "revision": "5c95b786643a1ac77b77af773ea0d428"
  },
  {
    "url": "connect/confluence/connectUtils-1-4-8.js",
    "revision": "057a22aa1322514a72d488cefac57c92"
  },
  {
    "url": "connect/new_common/cac.js",
    "revision": "b1eb16ac1824f26824c748e8b8028e30"
  },
  {
    "url": "connect/gdrive_common/gac.js",
    "revision": "582003cc53daba7ef313e67bfe309f92"
  },
  {
    "url": "connect/onedrive_common/ac.js",
    "revision": "ae7907eb44e764836342bf4341d5ddde"
  },
  {
    "url": "connect/confluence/viewer-init.js",
    "revision": "4a60c6c805cab7bc782f1e52f7818d9f"
  },
  {
    "url": "connect/confluence/viewer.js",
    "revision": "13a998bf7cd4b3ce20988de54a24f781"
  },
  {
    "url": "connect/confluence/viewer-1-4-42.html",
    "revision": "c154ee66bab65cd0e476c1d64c64cb8d"
  },
  {
    "url": "connect/confluence/macroEditor-1-4-8.html",
    "revision": "689fa63fd3a384662b4199f6e4a5b5c1"
  },
  {
    "url": "connect/confluence/includeDiagram-1-4-8.js",
    "revision": "a38cf3bb0d05d131dd0560e2a9baa5f8"
  },
  {
    "url": "connect/confluence/includeDiagram.html",
    "revision": "cef317d4cb01edd98ed49ef91d24951b"
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
    "url": "math/config/TeX-MML-AM_SVG-full.js",
    "revision": "d5cb8ac04050983170ae4af145bc66ff"
  },
  {
    "url": "math/jax/output/SVG/fonts/TeX/fontdata.js",
    "revision": "495e5a410955d1b6178870e605890ede"
  },
  {
    "url": "math/jax/element/mml/optable/BasicLatin.js",
    "revision": "cac9b2e71382e62270baa55fab07cc13"
  },
  {
    "url": "math/jax/output/SVG/fonts/TeX/Size2/Regular/Main.js",
    "revision": "e3e5e4d5924beed29f0844550b5c8f46"
  },
  {
    "url": "math/jax/output/SVG/fonts/TeX/Main/Regular/LetterlikeSymbols.js",
    "revision": "0767cbad7275b53da128e7e5e1109f7c"
  },
  {
    "url": "math/jax/output/SVG/fonts/TeX/Main/Regular/GreekAndCoptic.js",
    "revision": "346302a5c5ee00e01c302148c56dbfe3"
  },
  {
    "url": "resources/dia.txt",
    "revision": "af588f1b467a317db3c7cd2d4529d0d2"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "c6d4c22312336802cc68595443d3cca4"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "51617b17a59eb0789586dcd01849ecfa"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "dfd66f121b05edd232b160d224b287b1"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "2f3fb02abebee0760d748f64b0683c65"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "4a0009393c5905e4f809655e720f3656"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "c82b76a5529ee1524f9867ffd3f159ba"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "340f004b86eceac3fd25e8e264ee719e"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "5448cd89d46d65a34bc98ed0eda3c424"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "8efd94ebb1cb6ce5a31bf84373330359"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "9b8c9795895e986ea5f6ef91a1f7f6a8"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "0e461312e5e7dc69d028ba3975951cc5"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "6f6b55cd9066f4b322d592d8e65be803"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "1bbc6fd751185766bf3e46bfd2bbd86b"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "8e85432e3a0523e295f1ffb24f184a2b"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "31dbcab7f5f8d669beec8b30c6e31d9a"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "2b8de24d3b752a2529901dfe45c35fa1"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "2fa5248ec20ea932d335c19c7e5f41a5"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "25ab20aaba64c3c547111d0c340ec734"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "90f3cbc69987bc092f5e28381eed629b"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "8fb4cd6c5cdd54b6f10c7bb03c4679f4"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "e710a60d5277e32d4d39af99e530edd0"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "ddf680f27606cec2efaa30a82a6ed3bd"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "6f5731ddcaa4f0efbf13587513b23ca5"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "8d9d440a1f4ca50754928f6fc846102e"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "bd48c3effff1c6acbfbd7daf40210afe"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "f0aff5b5b4c06906d55c03c907b97012"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "83a0da6b3609afc78e0bb7295bef21a6"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "e1edfb7b0a8e4221801c5444e2c8d6ab"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "6303fb0491072096008116669605e0c5"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "7f9b27935551a02b9b3442f9cd3dd635"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "678a81e80e3dd0a0fd74bc3dd817001c"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "378d390d34c9b6141e5069058e4db398"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "c653c6e30be36d5807c9e63f400ad8fb"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "8938aed7d051c7e2e48cbdedcc535061"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "af588f1b467a317db3c7cd2d4529d0d2"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "faae76dd923c4a8567bca2e16bab06b9"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "e58a8efe37d6d6734aa6fdd36654e871"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "37bdc4cf4b0e4ff31b8da54d0a462d03"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "3e4dd5dd5ad51040927477c90d4b605d"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "2a3f980e5a033b64c07b183a48bba23e"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "fd2e2f91295645a1dcaff74943d8326f"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "a5776def368223f8f9d92cf10f0f6e3c"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "af588f1b467a317db3c7cd2d4529d0d2"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "ac8a63d881473eba2d2c9feb05001fa3"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "f1ada0e34b7a3669c7beea49d5074bc2"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "16a56c4330ae46a4c233a0d23cbfd677"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "19a7fdd449ac944aa44cdaee5c630c5d"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "d3fb7687fc2f8568cae2064da906ac25"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "caedb5c11db41f78a4361deeece3a3a7"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "1299d9199426cff9671dce5aeb8ed5ba"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "3a14f1ae52ce410953431b44c795d7bf"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "1a631e24bafc58e1bd997e2565e613cc"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "8ccc4350373d855c9b38eeb8bd4e942e"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "94c1e6f8adc65acffb93ac821fe749fe"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "5b9c9aa367dae8b73ac3c1215c529d34"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "9711f6d5af6254ed41ca30b7c329b089"
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
    "url": "images/drawlogo48.png",
    "revision": "8b13428373aca67b895364d025f42417"
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
