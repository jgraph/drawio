importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "9f9b552da674a7274fbbb709e65c3c07"
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
    "revision": "527562de0573b0d6817d48652803de21"
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
    "revision": "974427b356fb203bfea099d5fec1506c"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "6c30d8c2c812dd13d25fa603b5aac875"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "091c75bd61bbe8667b0aee1f512529ff"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "34c3a5d16bb1d4f01079d314e43ec368"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "eceb58f6077e8c132f01bba2a7c2c6d7"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "6777006b09eba1204c62d0ae2983cd97"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "0228c86b3968fae19a2f8a6e18247712"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "d341a6805588cd69b511a7a157b4528e"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "aa9e8aec5bca0216092ba3f69d9e4dec"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "faa250b88f59c2cc7e790847eec57be2"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "b917f0c2a0616a3b7c96dd38705e0177"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "0c1e66155d549eb5d30fa8a6935088d6"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "23d7af87c1410cda21421807fef517c0"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "582b51a70356ca51e6adc453cac82a2f"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "5fa21eca58d91a567e6035f5f4493191"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "98a4f2c5c9c53c90277da11da989a8eb"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "e3a4317451ee9607f71f51b47bead7e6"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "7f4df521b9b9124273a35d73eabe928b"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "9111b3fb6c66a4773d11f884968181b8"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "172196bc4441911ad11c3d57c7133742"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "0c2de740b16295cb1ac6242d88de646a"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "b69e6000566063f59013538313573df0"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "98c4b3e4d40e6761592d284b2fa87359"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "01e607074916cf583ef444edc995e75d"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "40697c05141b6ab4747c38819637d6fa"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "4d5ee412d8773b69494db043cb4d55ce"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "377ad049bff7a567c6dce948a0db751d"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "550b496f41635ff4934028ee1976b85b"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "17da68696b837d44819b300bfe9a97b8"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "4a5577b5e13596ec2fdc27111ce9e3c2"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "e8ef7f240be21aac46566c4350f77855"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "6f57f14a2d86f176bee925b536fc4b7a"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "4586c395c4e3680676feb5c79183f6d8"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "049e5c6eead9aa47750ac4a685f87087"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "9b6122ba60eca7d8c357ab72637fa0cb"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "974427b356fb203bfea099d5fec1506c"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "e1c20b98caeada6e79a26157acc81373"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "fba6942fd91ae3a33c0ea67eb792c94b"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "9173d1192704b376b7bf41bb2daf0835"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "69f0808a8abde38c63defe614d889a21"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "29215ea6d7477ed2168b737b48a007db"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "0963551659cc54cd156194c3926ccb15"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "27e123ec73aaf7da8db0eccd64dfe802"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "974427b356fb203bfea099d5fec1506c"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "61b4e5fbeda363b33feba1d01d43de64"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "437582a15582d53af7b96884e098e527"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "5eb732fa6c8d7a7b64a4413f112abb3f"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "27d76c360dccd6cd93dc206c0106bfef"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "48ccd906dbae118ad27c709a6fa26958"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "6a205628dece31ebc2e59fe1f774fd8e"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "616b1207c34dca52ef316a74b771b95d"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "0cff4a873f9f78869ab05ceb68f8d1ce"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "3da8abe5abe8f275e1cab830b79816a4"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "31b559e168a733c389d2971f8b3e648d"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "58b97b1b9e89a143769f8fc7f1d6abd6"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "6440a5040bb96de56fe8ed659dabe8ee"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "b49d9a79f2da005fd2a4ba82ad5e7048"
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
