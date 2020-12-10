importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "a910759041a203b2a6d19b7bc9da3b09"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "381bc2dd0a645122ea0c4aa7f9a8be27"
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
    "revision": "c540e127498dbd3f828d71b206ffefe2"
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
    "revision": "4bed2100741e0b11e44ac4a87ecf77e8"
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
    "revision": "d632930efc15a750f1c8c2d22c62aa5a"
  },
  {
    "url": "connect/jira/spinner.gif",
    "revision": "7d857ab9d86123e93d74d48e958fe743"
  },
  {
    "url": "connect/jira/editor.js",
    "revision": "e87a4df2f14bb93a2a1cd1621e96ca21"
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
    "revision": "af11c975889afc094500e326f737e7b5"
  },
  {
    "url": "connect/confluence/connectUtils-1-4-8.js",
    "revision": "3384f50029ccefcf7636aa842a243367"
  },
  {
    "url": "connect/new_common/cac.js",
    "revision": "5ceb5c1e81e26f18f6f78e4807920a3d"
  },
  {
    "url": "connect/gdrive_common/gac.js",
    "revision": "4b19c3b6ad18439d58cd71050582b9bb"
  },
  {
    "url": "connect/onedrive_common/ac.js",
    "revision": "f2f323e93c946e3d8e5731d63215e35a"
  },
  {
    "url": "connect/confluence/viewer-init.js",
    "revision": "295febf1a6a80a0d57805672107961b0"
  },
  {
    "url": "connect/confluence/viewer.js",
    "revision": "ddb0a01fe6fcb2c5ff300a12ffbfe709"
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
    "revision": "0fd311281bfd91c255adff803f1e13c3"
  },
  {
    "url": "connect/confluence/includeDiagram.html",
    "revision": "e763d30011ed12d883e2be4a1cf0c675"
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
    "url": "math/jax/element/mml/jax.js",
    "revision": "70c06ee3014f9b36027101a7ca1fdd0f"
  },
  {
    "url": "math/jax/output/SVG/jax.js",
    "revision": "983708db351371378d03356a7848f4d1"
  },
  {
    "url": "math/extensions/TeX/AMSmath.js",
    "revision": "2a0d678068a6a80be023bad13a50d845"
  },
  {
    "url": "math/jax/output/SVG/fonts/TeX/Main/Regular/GreekAndCoptic.js",
    "revision": "346302a5c5ee00e01c302148c56dbfe3"
  },
  {
    "url": "math/extensions/TeX/AMSsymbols.js",
    "revision": "aef5a6cdabcbb03c017905b91157999d"
  },
  {
    "url": "math/extensions/TeX/noErrors.js",
    "revision": "83663e8d081cb5b405482e041be951e5"
  },
  {
    "url": "math/extensions/TeX/noUndefined.js",
    "revision": "133cd9dd68f0e555ecc1358fd707948f"
  },
  {
    "url": "math/jax/output/SVG/fonts/TeX/fontdata.js",
    "revision": "495e5a410955d1b6178870e605890ede"
  },
  {
    "url": "math/extensions/MathEvents.js",
    "revision": "1ba83b0ae280ef29dab5fcd2888f5992"
  },
  {
    "url": "math/jax/input/AsciiMath/jax.js",
    "revision": "1cc6cdd2618226f0c6d7f4d02666a06a"
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
    "url": "resources/dia.txt",
    "revision": "a95c98c307f11594448558c5e8df5763"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "f78de26314c458a3ac9f1f9c8dcfdfae"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "925228735fd3a14d98c26ec419463548"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "c7018616fce9d9bd6b8d1eb0837d761c"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "5a0a99df77e255f64ce48175791425da"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "6b46cfc626af3aa58b3a9759f5237c41"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "cb9dd2e0a4859a779d0f7ba6157f37e9"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "b441f4c304bb43f1fd5b3a5e95390c1d"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "82d839b04694ebe0881f7bf0cd394ae0"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "ff75e14b18b48c4e8b78d45ef8e5c7fb"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "f034d30d71fd79edff3a7a9083221297"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "15029d4bf866c97a30c6ba82d74cc982"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "754338cbf8fa112aa62d84f8f9601268"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "624c3362fdeb19a89af69fcd3d2c32c3"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "f9f0a0eacff8e2ea0cc4d8941fbf5080"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "086793dcbd435c7dd283c38d1589190c"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "2a642b81a44730a158836454ce57e076"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "c672a11650c1e00da66e58bf049ee94a"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "ff5fd39114a79ee480df1b352b5fe631"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "e401d8dce5c6e2f0c8e3d7c467b61772"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "fa00aa6a9d56ca6b97d8603de0bd7e17"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "724447e9cf78fe53606233c8c56427ea"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "79d637ae06b4fbc91b20d0ce3ed97c1f"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "c98fa89b8da637b77e17b5d5aebf64b4"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "df9124b5f8d69d57955afcb37ba77596"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "c31143b7a74b3027512b813c3dfb87c0"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "980103dc0e777c77e5cf8cb1e1492121"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "7df9fdb2e949a997debf48b0f8894ad2"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "355f8e2592c8a47c8dc2fe636cb2ab26"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "6ec5ea1397be947e618c93a85aa14aef"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "ce387f112fbc3721b6efa0ae4cc32364"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "97a2b4cd7d3f5376e6f3f08595c88086"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "c73787de7e331808228dd01072db2051"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "8d5a3c89c33551f098f491b6dca9f9ba"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "a58f6e0df875901ee4caa693c73173c0"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "a95c98c307f11594448558c5e8df5763"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "ae4dc35bbc244e467266fdfa507cec11"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "d7d8a03f4fb71242be03411bcbbc0ddb"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "f4948f04032f8e8a0805126d859bdccf"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "60686f9fe926e6c5a7fd617e3ddf43ce"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "b5573e4f2edb8f274175de7e8e69ea20"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "52d0115cfb6c4f88f07cfaa3594ac605"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "fc8ba64c382445c31a7757e3406fc19f"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "a95c98c307f11594448558c5e8df5763"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "47ef313bd2fbb967bd6af1351ea365d6"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "eaa415f455ae004efebb3d4d7d53e068"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "c4aa45d8f068d7c84bcc731f5365cdd0"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "cad51fff8b9bc129813bed81b3559593"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "f9396f256b95faa9e4f47d97cf046fe4"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "5c0878a78e5f192c903639e8be234d0f"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "a8f3172033814d33a98b28d07e481d41"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "8d5f01a0c3deba4513edcb2d6b99b61c"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "56cf92a42c7e80ec8e5fa2b85137ade3"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "cd5d3bc9178fa28a0b116a7edce020c9"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "4f9fdc22d48c6e0cd0259a561384f4af"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "992bd40767c5573693081eb5b59a99c4"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "d7f0a7b5415df7aabc47d568a00ce312"
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
