importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "613f32d1af5404bd2d10a368c9d92ab9"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "330950838ae73ae958c21dc9e5936134"
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
    "revision": "8307502a5269297cb73ebd4b42acdd25"
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
    "revision": "9c6e8b9c86f5ce569083f2fe8f7a7830"
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
    "revision": "0fd49c564e14bf1ca7b2e0c6c7a71741"
  },
  {
    "url": "connect/confluence/includeDiagram.html",
    "revision": "9f0658477ece6384b7fb75eb769e54bc"
  },
  {
    "url": "connect/confluence/macro-editor.js",
    "revision": "9b1c5395a3c3ee9b7d41873f37fc7875"
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
    "revision": "45b035c56b39456bcef8f89f267d7ad3"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "250a0d986771ee10febbe0f4ba75d78f"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "c785a2e40cb708ea9ffc1f6d7cec1ac2"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "106467485518aa1e07562b547f4e9be7"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "099b81588d49786b20df0c4c8c0ef0d0"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "9a907eda9c2460cc3a30b9db3afbf0f3"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "f8733ee030948a617766830f1800ceca"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "0ec42b68cffcf9f3cc4defd3122927f7"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "c5382c12964e5a092d665eb49d3e83e8"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "e0c55e55d515c5ba30d8751181ff617d"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "a947399711a3aa6d2e3e364ab542c8e2"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "931ddd7d9ef9bd5581ac959322af05f5"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "f8464573c73cfb814e13126b211f587d"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "2885343a211d1620afb4ccb5e5e5dc82"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "efc3464a064bac61990aee4feb12b258"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "f2463a51ed28bfb766914abc2008f30c"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "bef8118357ef0624179c65d37bcbc297"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "15f865548bd04612c483b762e370fa2a"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "9b87ec170a8a1221dbe86db9a9c989e7"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "84fcb55f251a9e1dbf2cf7068952f2b7"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "5507fbb36648ff04625b8034654bb5f4"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "9ee9bdbf10d12ec8e15f7db15c9230b4"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "8ea5e2788ad9e2f01bd592e38d7cf5c5"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "ac8665f18eb2bb1f920125c52bb22c3e"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "4a3c04e3f25bc519e95958dd9cb4f6ce"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "78771f1c30a7c435e4fe46f22d3a8668"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "54a2b77cc84d988089057c5a4303b4e4"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "055bcc106130bcaa7b49542568e4b457"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "189350d48ddd75ee038cd695146bbc07"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "573c888e783ae87fddecfc7e8343ec82"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "f85a9d1119056a5869ae32be50fcf083"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "e5138a552aefc8b5134f3e1f4d2cdf5e"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "ffc7e6aa0357f1ddfa758c707468ef9e"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "325e3cabc8c8806ed28a0184294454cd"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "9b04c99850d9495dbf9da1a5deba922d"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "45b035c56b39456bcef8f89f267d7ad3"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "225d317d641a24aeacdc18b8b889c067"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "6fd6737d1f0b820b01500da8768f0087"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "aa7b5260f9b30807325f697c8e200c8a"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "b504c0fc8d70dfb9a554d3a559bd09ad"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "fc1032fba1ee931b4e2c97eeebeb1b91"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "ad5ffaf255c9a531f9bf2cbbcf27b96c"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "444f8767a0e9e85f57d4ddf06e1f95bf"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "45b035c56b39456bcef8f89f267d7ad3"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "486b917129eb602f0124d2d72daf8583"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "e3924200d9f870efb669ebd4683723ce"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "27e35ee68fd92a2c70da25694f4e453a"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "0d0613826d29e59352a8cddb284be526"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "b6946af7db0d9568f825b4b74d406a61"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "5831e4c536e9cfebf289d91600a4c3b8"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "cd91df602f3098a2ae9a1269262e3533"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "9056c135714e843eccb3d831ddab8d8b"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "c144c80d60a289e0e3824721ac25af81"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "75425aec80431fe76b61f648463d4fb1"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "fc3634d9e671222a00756dbd8443aa66"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "b015bbab77e801135cde7852f607b17a"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "9c954103f3fc416ed07eb69161a99d01"
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
