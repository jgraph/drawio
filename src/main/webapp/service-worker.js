importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "927ac324f9868d3bbc475d518f17ea88"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "521912d0a99ae4b3bbc41951933feaab"
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
    "revision": "0d230ea924531724d0f5cd5f7c645993"
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
    "revision": "100851032a654455901b717572cb5759"
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
    "revision": "715b5f869dd391e32d8d8b85deb91a86"
  },
  {
    "url": "connect/new_common/cac.js",
    "revision": "4d1fca3ba65b2c1f10d20682539488cd"
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
    "revision": "80a5ae235f44b8073a7add327feaee94"
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
    "revision": "471f06461524480973df1afb7fbb59c8"
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
    "revision": "8f69219c45dae79aba8f3c74f6e6513f"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "8fcafd92ca4fd7ce46c75a8d890cefef"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "ac572c22e5c53204e545d94c3fc5c2bd"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "18b460c85ca598cdf39f57d8fd6a6bfb"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "f95e2752e5a76c461ae643dcc6247d27"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "5871ee838bf6ad5d2e8d7f2a1888ce08"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "a1b680a782d23e6ec1333c1320c73628"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "114a9c659d9aabe41ff560fe12c1d665"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "fc0fe232d0a8a00d5321be7b7b8c36fc"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "ff75e14b18b48c4e8b78d45ef8e5c7fb"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "9b917b2f9a4c6a61147b9642e22dea05"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "b708b8a4c53fd97c841607da962380ed"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "96ebc09ad9ff72d39ac88676010b2839"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "590cdfed5b7c40e68d4b2dbcbfa0287e"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "d50548870690902740dd44c0b847982d"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "4839a903fd0c39d7a2da6aaed33bf789"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "124b28e12501ac04c18d78d3327499f6"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "69b1d4ddfc6ef3bf26dc58af320c3baa"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "1b124dfb0f61ac2f38533596b5156ced"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "d9046507bfcb71bb5f75a035d6a70ce7"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "4e99f6ab7b2f58ed56ca486b7a959ac8"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "a769cc1e8a1bd321b318b6f16c5e7d21"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "84a7a4d6570e4ed3a5832663a409e7de"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "01d90b53063d751beedd4f8c9fa52a7f"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "5a9f40eca7e2be0fb43c8dd4a4e9fb17"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "5ed8ac4a22808ce282b1c29593979ab1"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "e63e1dabb64dba1ee81b476f3eebe811"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "00e72975209f73ce276dfd7b0ea67439"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "d91afcaa8d86b2d2f4b2a97663b78882"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "8b13aa1c79408761b9d00ab62642cdf5"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "2cba7d31cef3e35a48585929a41e055c"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "128984149ef57f1fceabfdd7734f0adc"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "cdc579b42679a63324786e1415134828"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "03434ce0cef6316448144b00607dbdc4"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "e79d0ef3382465dfd4a222253c1e6960"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "8f69219c45dae79aba8f3c74f6e6513f"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "a19417df08fb6630869f38f6cf054fa3"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "14681d51c2b310150e20f13d869a0777"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "6893f874646899067baeeb6a833c7d9c"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "a2b80d029ae4549beb71c92115232618"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "b6fa7b9c041168cf29af7929e3910fa7"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "4d5cd22faf78897c437c6e8c731883c9"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "c140e9c4f64e433b66e81d98b4c44e15"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "8f69219c45dae79aba8f3c74f6e6513f"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "ebe5de01a714397dcfb168ab1ff423de"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "030ec83c580d23344286a5b850ca7f52"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "07691143eef799e6cba14037efeec6b0"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "f668b2ce8439858fdf065063ab9ad704"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "738b771953dbb60fb591868944684d1e"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "48e4e2d4a0dbbcf800ff18de40c6c10f"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "54eee5e1c1b162413528cb4b5cd50b7e"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "ddf78da2f04359e60092f61a21461866"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "cdf138005f7c6839edf11b7890d47bdc"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "12f12bf3d1fb6b7227f94cac7b91a83a"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "8e7ca1e99ecaaacece3df7a557ffd021"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "11577eaba44af8217de73aa9a7314370"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "2367ca64c09e909a80c0eba1b8c13eec"
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
