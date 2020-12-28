importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "e7273b4d1a47ccf8550f58b706e514c2"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "441dda769aa367d7a8e96e2106b914e4"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "dfd6700d74c9e746589368e903e1c50f"
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
    "revision": "11761d6ddbbfea9b45077b10621be6d5"
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
    "revision": "bd4bd1793dd558f8746928c26f4b6fc8"
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
    "revision": "4a60c6c805cab7bc782f1e52f7818d9f"
  },
  {
    "url": "connect/confluence/viewer.js",
    "revision": "b45421970eafa6ea34306b9aaed4b477"
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
    "revision": "ee0d8fcf6e8c3ad95059d8329a7d4980"
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
    "revision": "c374640ee780110a1b22f3e4b5c945d7"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "996b8f4f467b041b8f1a2e132411178b"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "abd13cc4f785708d5bb5cf5dece575f3"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "ebcb6e1cb20ebc1027f4dc04ff96d495"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "08920d56c9c4a290fa7d38700a9ec2a5"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "49da55629dedbbdc20c9e856b4288922"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "efe22529dedb44db16562e476d851420"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "02bae16f54504fddbe06e687a0358658"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "b1f2f403eed3d0b5bc7a8496e55712c0"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "c9ac55352ca17442fbd1df61a812db17"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "d628a3d0c32114aa9766eb5267d305ea"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "9a3e8a901abd405d64d9055d73fc66ae"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "4895a4bac1ae1951df2bce9768370ee9"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "cce60cf423b1fe104670743416c1f2c7"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "7d8656925ae433a9dc413860a466cef3"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "9b23216690e8700c7ab268edf771030f"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "8bf6a4df29dfece40c88c4d679e86bb7"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "bf06d3ce9a30f00994dc79eb790d7a5e"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "e0e222721597a7da96f19d29887b21bc"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "b8b4dc79d5ea74012ef1768ec55e86b5"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "9cf44ccdb42b9ac1e98faf0a2db79e79"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "3f42fa97bd641b2aeafc3a37d49ee1c1"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "0f49ff019520af30c680345f6f6dc351"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "8fb2119dde3d0402809e4a571e307960"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "08cb6119136ca7dd9d159c8bdcabecd7"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "c4e7d8f29e29a6179c41ad060357b2c5"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "fa81efd32ae9cbfd6f73599fb1a54424"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "6d89969bf7a0ccfc26311c9ed7efb68b"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "024db6f868607b0b01bef4839b38a1a2"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "884263613d9607fb104ddaefd0f1c0a9"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "974dbedc5ee3cec83f797f7f8163e6cd"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "bd0e4762363141b8c8407caf315fb5cf"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "bd2b3a6ead35a08e8791e6b968c93c25"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "a883f59878e09632056b00838c4fac65"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "3a7b609a0aa9ea63021ab3b6bc1817ec"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "c374640ee780110a1b22f3e4b5c945d7"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "cf4f901d90216749089837235f638d22"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "57fe9799da4eada6695099400bf4ba3c"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "672239ba31abe7e98a507c9d77e22f39"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "90c3ece0146fe576e862f25a30576dbd"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "70601ecdd94bda270e418d05bb6a7e9a"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "2aabec59bed74be846d39e97d25ad21e"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "33307381f9b9799d3e5bbdb8e71e1f47"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "c374640ee780110a1b22f3e4b5c945d7"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "b8c1815f2b9392be6040169e1ffc153a"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "31213f57364a85bc25f32435d8334472"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "dd8280fa6b9c9b545e324869b359a0ef"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "e53728f40d078325fd6ec2ead0ad4b62"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "f630153e675de9fc24b0ee6a758819e4"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "2a12d9a8c89365bab29dd32aca8cd8b8"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "b3f353d07e9c2d74c8002fe5c8b86f68"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "f193d78c6c6132db80959b67f19c2f53"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "482691e04fd5c41fc4078e80ef731718"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "b12c328beaf0ce4c3037942081c4df23"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "651c4d47b002e8f7f61513473d9e735d"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "4f6e722607b5cb7bbc6674c037abd445"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "8738bc4e5850a5e0688f9b6500efe0da"
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
