importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "9803e180ddfc40f7f1f91bb4d657bbe7"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "6bb7f0ffcbbe1d14c8bc8f1bef625ed8"
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
    "revision": "8a5e1e79a7ae0c4fcf556579e58f2eb2"
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
    "revision": "31ef16ae88264cbad165621b561a28bb"
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
    "revision": "22298c18348bec2adfe15da9908fe2f7"
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
    "revision": "7943d926bf5d0d6e5e394687640272a6"
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
    "revision": "9ad65e789f5cd45c2fec79a93fc3fd99"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "89c8cb7470fadd4d026515447e261b05"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "264e6d9f0df7545aac7f43669e28bc3d"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "51ccda8d944ba47bbbc77645edd882ec"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "303dddc607a1442c0151aa3f685ab9e2"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "d2c5017e8de29858aaeb4b0429dc31ad"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "831a8ee627ece739dd80c8857ce6fee2"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "f759edd0781643b54f27920ec643b631"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "f05c366d46c6c7a7096fc3668ddf81f6"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "f049a1aac51d95320bf044be5a212455"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "79f5ed3fb91b677426bc64f9c242bea0"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "73175034e4d3577b136edc2d088c0f83"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "e52e9115366abd1833c4ee8935e94a46"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "d14b1b14f994ddd86b2c8e70ab42ae6f"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "e531a81a4ac32d0e422665c42144f49d"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "effd8cf302f29c91df27129897ae4511"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "2e80d751a5aa11ea93d8a42a5a837690"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "ccddc8b796147e15663cebc0989e2f40"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "74f71de85eaf2487b4b7fee62d105b8c"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "b653f7359c636f7fd2595ad57c9fa04a"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "8a8277e9b6f22957ac813c4aa52d413a"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "889b0d5fb13713040092f5558466fc62"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "3c6bb35b66488ac59749cf22fddeefe7"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "b555c27614fa93a6da66524f6bf137c7"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "238c9e9d1fd6b2936802462c5c7554ba"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "a042b99641f73c4f23b9051002af5ea0"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "9e5a273bfb365360bc3303128dc2fe67"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "a98cef7fedf243b20b720d02e83175f5"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "5b30a52e40b716bb01cee51e9ac9e482"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "3deb7bdc0e2168200928f3df280cda38"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "fbad366d5fa65fe714236359a19d60fa"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "85711ef24c1417f2936efca93326c39d"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "7e1d18c6abec54ec40d11133ad6b8d83"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "502ace9aaa9e06d677746ea943e2d281"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "f33617fa557eb5fbffae81ab905c5767"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "9ad65e789f5cd45c2fec79a93fc3fd99"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "e9df2fddd3cbcdeb6496969fac3d81b1"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "c60a6c49ead9e5850e7021086599143b"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "32b5748ae926e9bc3ef60ba0d4eb3ec7"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "5971aac0b489521374af2b17465e2ff7"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "48dbd1d44033ac12e89ea0453cccebb6"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "823cd5d2cee2939b21cb4a0a4ee392e7"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "b5c203cd843937d21e2d95f5eca7bdd5"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "9ad65e789f5cd45c2fec79a93fc3fd99"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "5c62768f201f630c1d21acd82770ade9"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "13538241a1548fec0b6f0905e399aa86"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "19efbeef1ded87a6d2bb3ac6af193632"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "9dea135834dae19bfb1e1fce3cdf87b6"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "a1f99b8aa2c8433d5b47240043f1bec3"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "3a60cd792a1d87203db24573ef12dff2"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "10ee73ff992fd4637d96c07de48499a4"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "bacb1e9d618104d13a645ca47245fd69"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "647c11a2f14cad9ebc671d32daeb112e"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "2bd5de3b11d71f85716417792b17c76d"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "b826aa0c92849016a7f0a4701bfe7d75"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "0692d696b1d0fe06053e98b507018a1f"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "f8dc7c45147b7558c9bd5d27712e99a0"
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
