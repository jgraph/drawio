importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "849cfcb8dae64a5980b1f3afd90d97e2"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "b37ff8ed5a0096ea8412d2a1c8d7133d"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "20b6dfa54dbd0388353cc7d56775b8ef"
  },
  {
    "url": "js/shapes.min.js",
    "revision": "f4d00b12b7b2c1996e118f5604d7c67a"
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
    "revision": "a40865ed8fa44a14f03d37f1ab706263"
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
    "revision": "32763e62c3a7498a8ee479fee8a55bb7"
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
    "revision": "4cefa13414e0d406550f3c073923080c"
  },
  {
    "url": "plugins/cConf-comments.js",
    "revision": "c787357209cff2986dcca567b599e2ef"
  },
  {
    "url": "plugins/cConf-1-4-8.js",
    "revision": "159835ebab73810cc3f4fea9d904fab6"
  },
  {
    "url": "connect/confluence/connectUtils-1-4-8.js",
    "revision": "9c3226f911b9df4ea6b93e216e24fea9"
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
    "revision": "2ca0ba975239852bc84df1333f0bf2a1"
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
    "revision": "259248f0077c6506703d5b4ecaff36dc"
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
    "revision": "53fab577d099f0f69f3f0ca3b3b3cede"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "5b646bdd433b3b6d4bb811a85473f60f"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "b131e98c4aa5e536ba783de7a547b58e"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "8c3b24389799e75d940b8db28fcdf1cc"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "a423836642ba3129f77da5d820cda371"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "d020b4e0865323256d32c6c30d2effa5"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "2f583f040fb9d83b1d0bee3ad5690578"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "7e337bbf162642a132fd0ed147eb920f"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "fa3aa430fe68d57b1460c0c3b2ff9027"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "fde967199bf30e6ba8467f90c0ce8730"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "d658ef00c7fcfab66afdfc4ad77f15a9"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "c592cb690dd6ede84d58b27dde53060a"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "84f356597a98d7392240bea024d57392"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "18117709d6cc65d479f00e7cef631edc"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "010d5e5ec82ad539c94962e1f3d826f1"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "6950af995ce70edd1278bc3dd6d16223"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "de801cb514e4dc6751ce2ce30727ba4a"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "18a080dfa8d1428920b3546220068345"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "b6278c59d3354d78ccba9443c5f8603e"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "faf3e9174b90de64448a647b4d260007"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "d44c92c6551933cd85c862654c59fe88"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "4ea6909840150f1765b9d833ff7a0501"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "c7dd44dfe01afca19fdea363cc976735"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "ad46611c0fc54ecb1f7bbe83a2e1d10b"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "651ba5c33d4e4d34d0f2a37533862d9f"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "0cb448ca986b83d2c121387ae46e8b1c"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "f71b153c71e4075d5882000c36923a15"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "1ba378d893afdaa3ba683fde2eecbec9"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "cb80260f63ebc9640bc1c986bb99d73f"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "d8e8c67adc20bb3aa7aee557a4f0d053"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "ad17c7429b50346b9c1d2e2e422c71c5"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "34641c084d78eb31a04bb945f77c8956"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "323bc29ee73b5a626a5a712baa2bb00f"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "e6583de81d4e83f0dee46e0e9019bac9"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "cda7fe7c29d44200b87ed62c93c45913"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "53fab577d099f0f69f3f0ca3b3b3cede"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "f133a14bd644b50ef1dadbcc8b8813b0"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "9d2477c19e3e8c3ff29a04f4b3e1cefb"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "cf5cd892bd7d850f17c4ee66549a0e0e"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "932a636bdbc05009108ea498db199f86"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "3c93496ca95a11f4e77f64645f485928"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "347cdf35499dfcc45a8a81aeb6ed097a"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "b2515f4b189293e2bb8806c7cfeada8a"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "53fab577d099f0f69f3f0ca3b3b3cede"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "9bdb5a016fdbec803a82fb0f5636e25a"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "97bd348532541fbdc66292213e161d4d"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "b40441053a2a8670ffaa07b09809c04a"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "ab1450bf1955fb3dfce08201cd97163a"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "93e4bc002be8224cacf24101288ea565"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "57003ed4b25300c572246bfd6bda6f2d"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "1517bc63e2226669b662ba2cf15b51c3"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "955910f9e5c06086e70c0967f0a9d71f"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "a412ede0867f0551d784f7d2764f4cd9"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "6c9ee51f8fe2ce03b892ab63be563032"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "1a2909a3955812d1f6887ae2dc1397d8"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "652aa1890b628f5a722a594ad33addce"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "510f08142ac552524cfb73e1fe03839a"
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
