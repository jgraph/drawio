importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "70d8688ff8f38ca1d14b5eef3abe465a"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "9d2e305bf5eb05accb783c2d8dc826a9"
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
    "revision": "19c2493cfb9df170af11ea62445fa8ea"
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
    "revision": "264382652fe65fde4f87e89788c1fc0d"
  },
  {
    "url": "connect/new_common/cac.js",
    "revision": "b1eb16ac1824f26824c748e8b8028e30"
  },
  {
    "url": "connect/gdrive_common/gac.js",
    "revision": "582003cc53daba7ef313e67bfe309f92"
  },
  {
    "url": "connect/onedrive_common/ac.js",
    "revision": "ae7907eb44e764836342bf4341d5ddde"
  },
  {
    "url": "connect/confluence/viewer-init.js",
    "revision": "4a60c6c805cab7bc782f1e52f7818d9f"
  },
  {
    "url": "connect/confluence/viewer.js",
    "revision": "e5cef7b43700d9b3608eafdcb27dee02"
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
    "revision": "17658d24e7f2e37b24f787b06b8d1722"
  },
  {
    "url": "connect/confluence/includeDiagram.html",
    "revision": "cef317d4cb01edd98ed49ef91d24951b"
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
    "revision": "386be79b74aef5d8f0b668deeaea656c"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "2b5464d2f4e6e4a569acb5ecd9b8440c"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "69c8f83c3949da7875c6e8700953d417"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "e9e5efef2d071e29ce3818c8fa21f55d"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "85432e2267738a8b68939c56dea07fd7"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "8ca0f69fa75de2ddc7072de492530c97"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "dae561ae5bd3446da462caea8eada434"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "a7857661e314b0dec2b43fb303113c62"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "22bcc130aecf20467dd8ef1b649ab5a0"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "22bfa35b4b1e95ab6a7e2572b0e9e65e"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "cdd2f507bf6d8c1c3dc3e504459c70f0"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "feab7c944440bfb2845b55bc07c63d62"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "c134de673ab4b3fbd20d5ccea03ff9da"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "56a735c7e6cf1d046b9ebade95ef7eb0"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "ad9682a81090bf770b48a3295683a343"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "53a45d5703acb5a9b6a38510815d4bc1"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "c5e87468c0e998c5de9a67dd3213436e"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "5f1d9402cbfbc06d050960fcc6301eaa"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "756ae86d14a23788294c09b972cfa675"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "c5d9816438bb82c38d2595ac7e40b095"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "34db49ee4ab0dcb7bb9c6c043e0d18c1"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "9e265c5e4d3a7d42a584e206c0c2cca2"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "51717c8a95eace9f611bd3fc70122e16"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "0711003ea6f35aae2c638de277cacbab"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "3ef99d23795d761fa6cbfef74659da81"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "fa63591be0cf614dc6b047eb5ccb0133"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "21e0351dd3f6f3b25883ec5b1ad2eb50"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "43c0e434736a436a0e3974de8d09b80e"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "f13dcd95b4986924e0418ee695154e5f"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "313ff96c434821506a266f94d1b85311"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "7849bcc2585c4e798989eef30ae7f2f4"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "417492d0580eb7bc1aabfbeb34106c4c"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "77bde58c0f6cd3f91d6f82383f1591ad"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "bf28066880270b6f35771dfc7d4fc1f5"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "51a15d119e1f4f7be10436419ecf78dc"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "386be79b74aef5d8f0b668deeaea656c"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "4f79af72ba5f88b9c9f8ddc57aaa49a4"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "3a4331b4198b7c17854373c598a01619"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "c859bf4e295e3def8dc80f304e7aa47d"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "8ff8f948182572637f9104b2ef566038"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "a25ac3afe6ca5c9d1c02e1c40375b2ca"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "75755bc36dea57a75cb37f04559a41af"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "9a0a2ee6b1cacf31aa068f79bb0385b2"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "386be79b74aef5d8f0b668deeaea656c"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "c153193c1875eb1636d4d21e2b2af417"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "5c7747a91cad6b2f0d5ef4759e1f0e77"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "6a6e0183da4dc609a2121df60419826d"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "f9abd6fbf843fc5725e8d4fef532bd54"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "2e3b422b24a3d0e3c67ae46431cce485"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "b0d218bfe8e7c1750ddb9630d3029d44"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "4efc90b2045e67ccedaf1f946a5cc135"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "ae3739e23eb90ed930a137190532e956"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "0ed8aa6a2c1fb0912ea6a4ab66c8d6e8"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "97bf2f2060ccaf7e99baa24777a94c64"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "3581e18fd23a04dddb4517946e02f897"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "f4fe2ca9aaf3c3a000092b1393c6bedc"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "19df0d82085d51cd0b6af99b206e35d4"
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
