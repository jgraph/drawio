importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "99a058e8ced83e8674f2780b9b9dfcb8"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "45d38084f4fa0a9dae672100ab822afa"
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
    "revision": "f4750d091a7a958d992ab3737131e523"
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
    "revision": "e1b2eb0a04d171920f795b8f4416db26"
  },
  {
    "url": "connect/confluence/connectUtils-1-4-8.js",
    "revision": "4b5bd65474e55d4039795d7482b097fb"
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
    "revision": "a38cf3bb0d05d131dd0560e2a9baa5f8"
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
    "revision": "e0175311bb693b739bc99d63deb7b360"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "9353ed59550573638ec68a582730e8b9"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "ae7f29c1bf75315ee36ac64352f394ce"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "e838aeae6492f1c80c45a354401d51a1"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "a968688e374257e428bbf0eb2066d819"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "e70ffce566a81ddbe9af142d98f57502"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "8e7c2ea41a33c4e26f3d1fc96cd60222"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "b29464a189505bcb2a1138c793da1fe6"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "1e055903a7ea972924b66bf5b07b0113"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "a701645ee31d93bd67b023346bcfe0a4"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "21d75ea4bbc189f87057198cb037e2c2"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "846c69462fee665bd77d530b6e50bde2"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "d23006154ccfcfee8bf5f310cb38a3f8"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "b2788465887f31ca97750fe2d020cfd4"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "e121fa181a48a700382242a47cbf310a"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "2ab3d2234a0eb8c310f030b2f4ea1065"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "5e5e5d967c83be7271729d7c6ffd0a74"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "9ccc54c1947cd19e4a9a4a3ca90c186f"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "b0c1d93696b79c8814100ef245fd81e9"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "f4f9896fdda1164c2848e45e6acd5e2e"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "67aff8a3b63bb9109ef43af987e4b76a"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "964f909fe0a71ab4ec5d9d2a7b20bb91"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "738f32b2c4e22f990476a55d2254df21"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "3e7308102e6ff9f62240d4cebcb3afe3"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "3cf1f983e44ef3408775df31ffcee1e8"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "7e9e13c9d60a348123722a6f4630616a"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "b3dac9c74ff5ac24ecbaee45dc48902a"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "7dd6b8acb2171541cb49ec87fe501780"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "471d8633b37d452715961777c6144f5c"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "65bb0f2cf66c0bcdfa7481f628b74980"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "9e6e26f8a4761e5563d49813f8c838f7"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "08691334abcf40a27fec31d3b79634ed"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "f5907a0ec8807ec1de67d5f57e7496d7"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "ce165e37d8cec836dcae5cb03e46843c"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "f6ad04579aaf7bf1cd1f70efdf8a9c88"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "e0175311bb693b739bc99d63deb7b360"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "e9f117eecea40078ec3f8612fab6090d"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "96c92bef390786cd32b6ca1b4510716e"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "0d48ee7e1394639b32988d8dd3c0514b"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "cb2a3e2d5e6fa2791995ea46863d1bbc"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "c4febac4c9297849cc592968ef5f9828"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "46eb6401f7d345c3be0a8c8bcce6c1f4"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "d561af21bf76c2e6a42a18f5ef939f13"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "e0175311bb693b739bc99d63deb7b360"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "fb2c9a13676e5bdf6c55a8a5eb70d428"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "86abe9ccf10298f660a5c8a2d7b194b8"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "ea4f9186846264b07546f31fef5127bf"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "64f9d5c4264d6ff4926a37f7077ab4f8"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "1032e0eb9c1bd745b8e232e8d7134d61"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "07723ab2d850e03a572c85a0199957e4"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "c50b0cea0a1006086c7c00a774d45ca9"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "093bff7ccc70e5452af08226d9f9c814"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "4303d7b045bae83222ab97df97b6f925"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "cf5ba20187d494ce343294a3b1f10ce9"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "3eedba14f9cfbb9b999f9fba55bae623"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "296db4f5277d9ae507910dcd9d4524f0"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "114b46f7836b00bb6483df5639e66137"
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
