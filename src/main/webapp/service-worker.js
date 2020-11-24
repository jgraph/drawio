importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "76d131e174ed6c95f69ee8f13a236a5d"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "f200da4699564c731c291bd441caca4c"
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
    "revision": "e9d353f60056a44f9477a3e97cea79d2"
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
    "revision": "4876a0c8bd503b20c29ed4f1d0eebcc5"
  },
  {
    "url": "connect/confluence/connectUtils-1-4-8.js",
    "revision": "3af15271d48f7b5ee5c7efbc1028e035"
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
    "revision": "62579ffbb9ec15f6db8de1905eae5493"
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
    "revision": "89fbf5627db3c57633fbc3a64949e58b"
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
    "revision": "621b721cd90b5a0b19dff79cfa0d1794"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "f13c620ef8de8e17bde7fbf36f37552b"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "4730b8fb55d9336016758a2127b2947c"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "a32a09e99b8c334147b4aea3ac2bb134"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "51c283bad263854edff53c7c273796bf"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "37218bef76f1b4e151aed55e64652d55"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "bdecc22646b22f0b9c92a784fb73c311"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "ce493f7cecb8704c76e34ef60afbc6a6"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "bccd7c2dee82d371162c44bbc5f802a4"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "bad6de70baa3fc52845f31987f922ec6"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "13073cc113c1e4d02414f8bf926cffed"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "6fb05c9b2d565adacfeb6fd1c37041ca"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "57a2c1e7f15d06fd22fcdc6b75869f09"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "09c17a17b5972241ea9ba93b6cdc5216"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "78e4c33a5289e77c4f1f94490a119b3c"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "583a3529d05d7e53f8d2954eecdf5bda"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "66806151c9f8854dbcea03e6f4ef4ffc"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "f198eb7107c674e260cc7b99116ab2c5"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "0bd8a81b56aed100062bdcd66292d4f1"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "1dbe699f13a181e7aeeea9ea3eb5f467"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "69f870a101be7ad9109980042e69c66e"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "da51131e77752a4d51f979964cd6455b"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "ba7bdeaa8723e38a533670f3c6ca7986"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "617797074252f8f66980e98b4a448065"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "e3b9970afcab42b764eeb862836ee1d7"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "97efe13406ddbc2856c271cb43a0d45c"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "555b939f73ee050b141df687ea431e32"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "90ba996e2f1a63e9eaade0e59be62726"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "ebac45c357d9eb3d155ecd1b5fd9739e"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "efae47058e0a5a3ab45abe8d5a0a61ea"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "30ffba8d04b8dbd006b40a4a34075fe6"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "502c72bc435b3bc79194ac1c13489ee2"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "a363d89b196427074a82eb66810c03ff"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "5748b82c4233e54c800e53396c344892"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "8c24edefb7eec78eb6761d441cc885e7"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "621b721cd90b5a0b19dff79cfa0d1794"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "4964c6b27b6e28ba95d53d3240d59db4"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "dbce2c7fe82b2a8b48818ee97dcbc884"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "9113e38ec324ea1de0d0400ef2f6b585"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "cf06e5116b705ef55781477872dd30a9"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "6754b0258cc8fd60aad605a2f4a0fd21"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "501d75029ef76a861118534c7940e3a1"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "92bf72e3885c5decbc74d6d29f60dbd5"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "621b721cd90b5a0b19dff79cfa0d1794"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "70f2098cb14df18c4b9d8d716c3b18a5"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "c187579457e0214326f1551457b01aa2"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "596bcd8459dbca4ca93c810c95878211"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "e03107b23be0137203d44641c47946b7"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "e9045a026f0fc6b4e195f0eec0a1051a"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "ea69b5f894961d0645e5e5bb4372e28a"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "8467fd9c016af0d262bdc15dcd23b967"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "d9526a3afd83d0effdfa5cb99fecd40f"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "c021f38c9cd516c52de7b1875555a1be"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "374402bdbd80b577ec4c33c4630ac16b"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "8db46c4125e6e29f19faada214cbfb78"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "acf8aaf6c32c5bd62311bc08060acc4f"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "ccf28007c4fa311039701e416ca6a83c"
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
