importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "2acf6db821a4a187fb321a798cc6883f"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "6d131150050e77dbf1684827f5fd8515"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "6a805bdcc488c2f63d32c6582cba89f7"
  },
  {
    "url": "js/shapes.min.js",
    "revision": "1f17925ceff0b5fb2994d63c31396bdf"
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
    "revision": "eea703b9c14c50ef256e8a3674922e99"
  },
  {
    "url": "styles/atlas.css",
    "revision": "e8152cda9233d3a3af017422993abfce"
  },
  {
    "url": "styles/dark.css",
    "revision": "b8072196fe3cff2ae39b39f8d7751447"
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
    "revision": "baa15b34faac174e2627f9db6b6cf40e"
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
    "revision": "5bae94315bd183ef6434ff863c55e0ed"
  },
  {
    "url": "connect/confluence/connectUtils-1-4-8.js",
    "revision": "67f26f64db53bb51dc9e9a41dc103d1f"
  },
  {
    "url": "connect/new_common/cac.js",
    "revision": "b1eb16ac1824f26824c748e8b8028e30"
  },
  {
    "url": "connect/gdrive_common/gac.js",
    "revision": "06a30c8936357c186240e9a18a1cd34c"
  },
  {
    "url": "connect/onedrive_common/ac.js",
    "revision": "994c3113d437180945c51e63e6a9b106"
  },
  {
    "url": "connect/confluence/viewer-init.js",
    "revision": "4a60c6c805cab7bc782f1e52f7818d9f"
  },
  {
    "url": "connect/confluence/viewer.js",
    "revision": "36fa96104ff0c8f1e4591b7f8a93ce44"
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
    "revision": "bfbc1d2190a305d243ff079a89fe123f"
  },
  {
    "url": "connect/confluence/includeDiagram.html",
    "revision": "288b6324fe369efe20a5f1a7d65486e9"
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
    "revision": "e7b3b3a1d013240195cf14263e886102"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "32406e4c6ab45dc6ef564fc82a742943"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "33784c166d281f7ace9f3a7e0158d66e"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "631bf6a91dda40d10e241e50a7c65963"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "610698cc07c5ba027c47ed74468f8952"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "2634146b4c56e717198304fec394d042"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "729368a4771c7f6934c81d8a3501a058"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "1418716a6ef93430b6b3679d7fe03f76"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "a613868b03a4c613ee20baaf1fdb560c"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "4d5b00e5f3479aea6f39e8337644360e"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "1b852dd339b32a938c802c1a28101194"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "cb0aecd4c4ff6deb76b4bc8c80432049"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "352d6a48db175a3657ae8d1269731ac5"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "fe1f8d8751d48642f687a787bad14dab"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "6863d18d7af67169709cdd93290733fc"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "5190a70f777a21e872c9c87b103e3d39"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "49f0fe3917528784f165532fb3ba46ca"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "cab63e345bf2f0a76ba087c57ac57bc0"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "2b5c715592b803e8ac63bc6283a06557"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "27a5c90b324010b18c1f825fb33af839"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "860023c8fa606f3874afe9526cf8a9d5"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "4d23ad3105612b6748e98aeaff59c1b7"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "cc55e9c7f3aa05a4515a6a1570cc2437"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "dc76a37b4117791999a74cf8779f50ac"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "3579e446fc84141764b596b5d1728a1e"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "6104a90954cd9b0368925d7ea4a010d4"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "6ff34134513c65eb48d5c722ab21aec3"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "e6bd3b7221a1eac9d47a23c1b727e7c0"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "9edbf681b871bea297a22611bedcd334"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "5bbd87b9d88ecd2e3cd10d02031a77ec"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "dae679b8077146087ed40ff2b289dc30"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "fd03d401dcef8d35563dfa498e636176"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "16e6037db5d5b50770932a421baf83cd"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "aef94c786591f95b9836a931af1d7a38"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "b7f253d0df1d9ecec4b35c0d58287971"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "e7b3b3a1d013240195cf14263e886102"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "cb7cb373ff2413d0911eff9ef22c5648"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "c543e31043f57f20d80aaf7ab5f8312f"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "0c32a47d99acd9fa3225f8bd9944a970"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "c48593d18ae1e089882d285852bdc7e1"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "fac0f9d5a32bfa9861c6c38da2578e7f"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "99fa5e1ab4e33679ea159173c7b10ff1"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "5255015a2f2fcf398b231dcf0298b42e"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "e7b3b3a1d013240195cf14263e886102"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "7c988e2b2cb8004d08169738d66e37cc"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "9bf4496735565e07f62e5c875c63d94e"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "9a6bbee9a5afa1eecd6f0cffbd041e54"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "e90b14a6ec7af63f46864861b0bed719"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "e748137baa6c0c7723765c13014a787c"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "e8a7005f4f0dfa855dde5617ca1fde2a"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "a923dd50113a079fc0141e7796facc9d"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "21e4d8c7a1ec1240fe500454d8e512ca"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "33cb0ba42f9f3c150afc55b8e4a16dc4"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "f9f8b6465f379e9172d6d5fb563f07e8"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "da8b8ce5ad2d78ce043f0beef2b7a21f"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "a220c10d50ef9f14b4504f5dc54cbbaa"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "a6c1ee8b13e2e1d670f8040e2228570d"
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
