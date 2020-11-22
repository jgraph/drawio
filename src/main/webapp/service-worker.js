importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "9755cf32df14e4340e24c253a865a134"
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
    "revision": "9f1555fdbfde8e5f789b05b595d6078e"
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
    "revision": "e5ad69a35d812ed3233edb0eab9b677d"
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
    "revision": "b437d1ab44bbe4999b3396abbd6fb7ab"
  },
  {
    "url": "connect/confluence/connectUtils-1-4-8.js",
    "revision": "09f7a64cb2e15aa5d10f4ebf8b78fa11"
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
    "revision": "002ca191edcb0ea140aae6969be98e87"
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
    "revision": "8733209e276e6a4a505ee5125f909975"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "ace5bc749217e6a77134f02390e4f1f1"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "73fd084da82bcc0b5790448a3816b29d"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "3a8e15d99e4b543a5e85655a5338c281"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "a3feffd9e506733e9a841b1ee10658c1"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "236811473861bbffaa18241ee4d8a97a"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "5b950f2a4fc0746b94e9ac69f2ce8916"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "724f31a43ce428f5862ded71ef054dcf"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "371d2351e0345d3abe502814b013f4df"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "3129c81de199ef19bf3f8bc61ac13f1a"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "892f0e1063d1af586471379c47b87ab8"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "7264f5f103d310564431fb0d491e5286"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "05d8118ad9b594c10bef527a78a87059"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "f433b2f1121fd1f626266ea2a27408db"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "6b651aeadfaadf21009ac21372b067a6"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "e4a5f3d81aeb1362fbd09387fed596c7"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "a35ce05dcc8814ff84d7b8234e61b55a"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "76ebe03a9b39af0dfd10cc9d32d5665c"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "e58f690c8f149e0f696a779a7c0320e7"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "acb4aa76289adcf1f32bae208f748bb1"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "e6a3caf222fe156a973f59d5dfedcb07"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "35686a29265e71a690db39ccb7239d3d"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "3a6e7ed4790cfe5769bc9c1800e7d875"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "538b746015c0657327a9e729a155d6e5"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "d1f0be963d5c4e575e0f165fdcfa298a"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "45e7a5e2f179f042bc0ebc23a6f676d3"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "bace48a922fe3307752896d7c900f9b2"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "cd3f22d7d11ec0bde5cfcba668273d23"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "221958b7acc2488670290a6ef4390e4d"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "ecf668d65f943c6acb0a94563e79c553"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "3f1e6ca57cf264e829f8892f77225cbc"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "457cb8526d28b4fbd6c926b9665c5deb"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "b326f760d3be39cb5e77f2f4b8b8a4b8"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "c4743ae7481e253e8e0909cf27ceeaaf"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "f77d4640df1b3dd7d0d67cb8203295b4"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "8733209e276e6a4a505ee5125f909975"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "da5d1549c389e8e7a2a18a29a7d95cba"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "5072c414b9287b37cd4fdccf5a9b0919"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "6acc732c2861dffc23a253ff0dd6761d"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "70d696ea980c3e3115cc43dc9ef4dc3b"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "fb0af09caad5ae27bfb858aa666dfee8"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "cd45bd63b6806b80949b0c7c5508f6bb"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "4f0c9aeded5da47b88c3f917fca54ced"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "8733209e276e6a4a505ee5125f909975"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "03edad1f1eff6bb1026e47e1921909db"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "16f343699e4b881220119fe9551d1353"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "cfc44e5f8535b6d187e63f7b22a1ac1d"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "1bbf251296bff1f7910fdf5a1b21eb36"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "dd58003191a30814dad67783bc6f995f"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "cd8b95a81b04959b689ac30d56b77cd3"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "9813a1ce0b0b8f98c25234f71bcd2830"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "3183c27c1e51a55ab577d67648d3b96c"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "d0980646e2ff1a05714f842b6d9e43cc"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "ebf1e79c45e9f34b290f949493484176"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "e7e9b62dbb979bd79e38f13bee281ec1"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "b3b0fa685db998e0cd35e79377457d35"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "7a960dab42bbe246881e38f4f4a71816"
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
