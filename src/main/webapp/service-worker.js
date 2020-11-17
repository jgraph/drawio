importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "afa164e29bb80736c99fd23950f8a47d"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "f784fd1367da48ff95ea153bd9c8006b"
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
    "revision": "cad6a55aea16d40dbe3128ac7fe1c105"
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
    "revision": "4b7c6ea1cd878f501963a86b94d599d5"
  },
  {
    "url": "connect/confluence/connectUtils-1-4-8.js",
    "revision": "38448282f113992b1f346eb97ccc3542"
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
    "revision": "c6956490a00676ee14b35d0bd40bc913"
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
    "revision": "de190b93a3c076cf40af8bb39e40dfa9"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "a1fc7526ca5b8588a64e3377cf3120e2"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "f9af9cb1752563f5acaf08e0b07f1da4"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "f57ae7fd8ccec11e7a3529b76af3d747"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "68037102409786433d60ed3f859b642a"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "f532a0707851af566347518d89c27b51"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "d85e93465cca8b428c1120f0acd9ae28"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "06b339ee3b4085efc351b685e3f1354d"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "acbd9a62a875b281829f905767128230"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "09ed8e10641968d8de962911ef65da3f"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "38102572412a5b8faf10aa8344a9f83a"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "ef1c6c2ed3fd4e0db2ee4e04f1187b21"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "24cd67b6662d18541ccaaabbaad88f87"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "bb6a46eb04283b7283ae0c158df4700e"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "391aa438973d87ee6d5287e1bf838487"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "d28c5040da8bf451bc4aa051d7f1ab46"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "748df968c98b7868181be88730fbd2b4"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "9b60dc89bb166e7f45cdf39cb76a84d0"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "1a62e1035ea8a24080b8b26d6d6ff632"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "674a3f4e374102420f5194f189bc3d5b"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "78e1be784facbe7a8d6d9e159282c5b3"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "889d173e04f3b4e7b32a2e415f4c69d7"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "f901763535a205b60cc8389042e52b2b"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "ff16616e64764d1ab11a92c69e6c1626"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "5d9a49cbd35eb4f43d10e4af5056778f"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "40cdcbb9109b4b131b358740f2ddde13"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "ab99719bd6e55e787960bd0507988d96"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "4faaea87a512259d48e0a7fd275427a6"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "4b64ea13e6955b8bb5a490776588148a"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "9e1591491419d4fabc51c3ba3ff90120"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "6a375ff56f396a660e59bf4e46afcdc6"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "27667f03e94a77ac53bbafbadafa50e1"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "631140efb84d374c61b83e277bad4977"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "e0d581fd2624b03a3deea989ae366e96"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "879f0629abc5091b6a78ebc8d5b600d5"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "de190b93a3c076cf40af8bb39e40dfa9"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "96e55140a04b2415fd2f4ee3334b480f"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "c50f94d04d94bec6c93676826d377b85"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "6e88c8020d687f6ebce9e2e08ebac7c9"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "35fb06e216b780dbaf96464e3c2dc90c"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "5aca1ccc4d3a2d7cfc168ea33493842e"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "2a1c1e4a553388708fc117fd340239c8"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "973f0a7477fdbda66f5f15edf925b7c3"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "de190b93a3c076cf40af8bb39e40dfa9"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "d33eb3bc05b94cbfe9ad2420ee8882a2"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "dc573e3fd72ba4c6d32d7882065d02c2"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "97a823046ba86b73534a0f6b085d52cd"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "be7f71786839774295d08c1767067d9e"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "0341a01387ca54b6f2dd76ed2b8e30e4"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "98e410b8833291cd7ef265954410b5d2"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "6c44b88ee6d6e7991c8277bc846880e6"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "b055d031e851b170bd3693499410f2ce"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "8f25ae2a3cbb883b445a8da0405ea22c"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "1e86ccfec7303deab0ca13b3636bade4"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "65d91d3054b75a53e380cdde8a1461da"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "fbdd9b26946969bceb2aad61931f2068"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "496906f6793ba62f3afcc07343f1fb1f"
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
