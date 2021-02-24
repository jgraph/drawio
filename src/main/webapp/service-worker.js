importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "0c2329f554982cdfed24bcbc27d7c659"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "8d0d1c742cc16c328012ad27a5c5853b"
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
    "revision": "e484a29caad971e5f00891d9e426cbc6"
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
    "revision": "6f288a8f542669491938245db6adf392"
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
    "revision": "769bc857ad5bb4dbbea9dc40fa530c75"
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
    "revision": "8b81191082e56b2a9134afede269f13d"
  },
  {
    "url": "connect/confluence/includeDiagram.html",
    "revision": "adc9ff3aab2f3e4195199030fd1c3a85"
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
    "revision": "7572ccf91d66ce7ed0df9277b0e5113c"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "8a228511ceb4db6b52f5882558605704"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "36ec5c7a61984f89f27be842750ddb0e"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "dbfdd91df71c24ffd3e6399ec45ffc5d"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "7488d00edbdb24f17d6cdb5f2391f8fa"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "82c182eeed467892d62d8597605ef426"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "c6a5ee4917073d2af480af4917675404"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "e1d171f5f86829bec1973492e807cc8d"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "3ff31c868106a973fb99929875f09b48"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "5e7c2fd603eedac26c69333449af8088"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "bcb953ed7edede566f40bd13d2743f28"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "1cacaf34fb6164f4c438d100c2f0ac52"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "1d8da01e1e04f06d98ed1dfa82e4d86d"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "9b4452d67407026e453424bbf99ccb58"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "5a5038630fbba8a661eee457af5441b3"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "0141bba419d50d299aa0304e89d8ed7e"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "e18ab303368c011181b0ada35a01bc6d"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "5054c1b0d0a26ed27b005dcf0d2839f1"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "6d1f2c666bfe183a77fa64c380d12476"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "ead42820ea8d8949b89983a7681ef3f4"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "19598094d368006fa58bf6936b6a34cf"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "c5f130088cd5486ca8abaac2d3df3e28"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "42953621eb8e1d6c47438085c2d27c69"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "7c18e1731a40bed71d8d856620a4e1df"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "b8e7aba470bb8692c6536c77a4f6074b"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "a5a69b6c876861e278b4879030f4d9b1"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "96bdde96ffc82bcbffbd7cd6a0c4a634"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "2a4e9165aab9d08f85eaef6a2e9c6023"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "7a133516052138ee84e83556b38466d1"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "9dd16eb8da245ea82499dc944b640369"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "1e5d0b04bc05f8035841d936106ade3f"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "a56827d86e903dfb352be20ac30fb058"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "7aa53d267f4d0b960481a4f876118873"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "0a300886598cb2fbf22d8dc10d2c2574"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "a02de1a0b4d4230a445f913206771eb9"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "7572ccf91d66ce7ed0df9277b0e5113c"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "7035fd3fc0ab49414510212cc57f17c0"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "eac65aecb73465bab62d85ea8b4f44c6"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "ef595fb8dcad31722701cd49af35c377"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "6d23a4c353b662948ad64715a9abe560"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "cc28ec15ed7695d8f54d9860c3042a22"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "8aafb26dc23394fe0b1784ba3a6e5186"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "42463331d172c1e59b9485436664e9ce"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "7572ccf91d66ce7ed0df9277b0e5113c"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "a03bdd8863a921cf715d86bca40a2fc5"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "3068e643ebf5bb92e1672cd7cf29604b"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "35e004b1dd0b384d72d3d764780f6527"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "f212760f7c7642c4ec2894ed52a96657"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "5334b2d732ff7a7669eba710354f6562"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "624614130110cb46a324a45a2ae01727"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "4e7309f136ba85da5d5898e968a3ccc6"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "852b77250be33ddd839976cd91646cfa"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "f73bdcbd6de5bf43c1e749ce8053dd94"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "7bfac9696ac58cc0c72a224a45e42566"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "0afa748cad90c3b7ddcfe8b70888ade6"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "691b4bb524d9ebc1cc083552bc543acc"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "88af494f433516aa4b5b33c5f9fc5290"
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
