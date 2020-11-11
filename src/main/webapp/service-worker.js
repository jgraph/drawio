importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "a87e550a0b63acad9cbce46bf868ac41"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "c2c9c58a0546e7778478a1c776522371"
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
    "revision": "a5ddc3d436695ead0b667108603fe0b8"
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
    "revision": "d4b6949adc409b03e1d5b59a86097c2c"
  },
  {
    "url": "connect/confluence/connectUtils-1-4-8.js",
    "revision": "e8f43aacb75e2c30255d54f1ec6aa329"
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
    "revision": "d7fccec24c1f564fe1bf5bcbf90e995c"
  },
  {
    "url": "connect/confluence/viewer-1-4-42.html",
    "revision": "41d092d7582c7f7883ebba7e99cc3b16"
  },
  {
    "url": "connect/confluence/macroEditor-1-4-8.html",
    "revision": "689fa63fd3a384662b4199f6e4a5b5c1"
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
    "revision": "11ce4fb81945aac8ba5cfe87c636484b"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "d82601393635ec5c2338d18a45a64131"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "cfa4e188a4fd194e97b143f0789669bc"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "78c936e02a72ef62a2540a2fb5f12863"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "1f5e17f4a2159adbd1532c55e2e306f1"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "a58f30597790d433b05123a3b8efc56c"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "6f279dc0dd3f2ee3d8abd539c6137068"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "60face218e728f50553899e41b53baba"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "430ee9cbd0048a4f6feda522d53db0da"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "16bdea754bf2db930bf1c775355f57cc"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "9d220a1c596d4f1a54f3639afdf28c40"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "d6a69efd9b04f58ab2b0a24066870cc2"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "481d3fdba9ff6b33e16d39896a724ec5"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "b93ae1409a2d38cd4d3bdbd1637f8c30"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "b2b37273f96ea41cca07d9aad17822c1"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "c22528b486423408cc07401318e26fb2"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "7f08b31037759597e376a30372c98e00"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "7273262b24526ee424806999f2260809"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "3809916bd5e9ae58c021edd43896299d"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "c1d448a5ba0aa8cc7df3de0c58e4e249"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "6f1108b9ecac74fb63530726902f8911"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "fcd7c301da2c927d9ab6f2c1a6701a33"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "077402a9dfc0360cd60adc18e595224a"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "6474da2abd1cd6339fd8d29079806175"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "b6302d571f30135c8bd9e0bf867ca393"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "c76489584f18c793c79e90d3612a615f"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "53a7356fe2395f181df9c73f1ec166b6"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "e103221b9fcdb3705388982cb293fc38"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "77887c8129a07d7a7da1428e0a86a4c6"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "fcaf1cc3f235374b84116d7adcaaa024"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "d769564ff2954aaa1b0eb832fb20025d"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "51cf65539e82fe59ea609f3896bae4da"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "8455c9e57112ccf5a28b5b508688b9e2"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "a6939ffe1cbe2a46594b6eefd3fd1e57"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "04b8e980fed6a6492c9c3add33d8dd6e"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "11ce4fb81945aac8ba5cfe87c636484b"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "24be82440c05edd53abb926ab8b829e1"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "c259a6aa90082500a5310b09df2fdc05"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "effbf8b2a186bdc6fcc5a405c53f362a"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "f0dbd356697853263f0a21fbc06290a2"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "0f29bda3beed56de8d1da91769e50755"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "1286fb97d37883aaca0c585e11d1f956"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "0febeab0c72b73ba00ce9ce9cb84cdc2"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "11ce4fb81945aac8ba5cfe87c636484b"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "bcecb590101b79d332104e56709be0d4"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "4683b272d388c3a7c04815edf4d36201"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "fb469c24f2f64f7e614315fba0f3f291"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "3ca92e418fac9fbc5ea73430821b5d93"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "fb94bf63129398898e207bb3ac7feecf"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "e369a464b893711206e1c6c30e3b07be"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "3a411f6a3168525bf7f2a9443fda2411"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "856a7e0ad35fa1120cdf608e3f2962ac"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "e8322c5f6b5cfb87400869d28989583c"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "f8bb4ba327192673807e944b8148adb7"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "e8cca2cb94315a9d8b7172370d69e47a"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "80ffe4fc5b7d90334a33376970ea480b"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "09ff14b1ad4834b60433e7191abe10b2"
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
