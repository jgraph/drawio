importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "2dfc36038e638cdb6a1c96b9beb0547d"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "52001a4f62a2034fd6d6385c10e16da7"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "6a805bdcc488c2f63d32c6582cba89f7"
  },
  {
    "url": "js/shapes.min.js",
    "revision": "90f20c3500b9ca12c9a33271b89c0dc8"
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
    "revision": "d7ec716669228f4e5840b283b876bf25"
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
    "revision": "e855467cfe258b0acdacca54dd71cd69"
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
    "revision": "87b1e0ab3d6805952c8ed4e405d04af5"
  },
  {
    "url": "plugins/cConf-comments.js",
    "revision": "c787357209cff2986dcca567b599e2ef"
  },
  {
    "url": "plugins/cConf-1-4-8.js",
    "revision": "679977b35afbddb2aa4a0a2d1c7946d0"
  },
  {
    "url": "connect/confluence/connectUtils-1-4-8.js",
    "revision": "c1e3dcb6e56d57a8c24cdfcfa7ed7de2"
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
    "revision": "36fa96104ff0c8f1e4591b7f8a93ce44"
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
    "revision": "0fd49c564e14bf1ca7b2e0c6c7a71741"
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
    "revision": "4d59f7b35d7ef94a8c29e95a1f74e816"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "778bf17a8dcdfa24b42b7e88b9b12167"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "3e4540e98bad46866d7207e18208eb2c"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "057a0a3a26406b08dec83195072097cc"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "039854799ae52c79b65cb075e7518a6a"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "f6a0060958d2df9c067937be66cc7f04"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "32f3910c809950e6373282b4aae4962f"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "0bdb4a84350560d28106ef77b5efa0fc"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "9968375dac7262948238b6dfc12cc0b8"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "abcfc52a70007d9d8c979e57bf1db6a5"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "138bc67f1d7eba7ce401605c7829bc39"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "1e01e811e0c9d8e035bd8d9a348576d5"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "f3df2142a43fd56fcccf17d889b4f30f"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "50b1338a4abf464407245e91535811c4"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "941cb30bed694e6f04f48e670f88f1a2"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "0e6efda9ee5eeb62058ca465ab17d87c"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "81f8896b839865ad793496da8484bdb0"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "5288756eaae47ca508ea05fc4eb9e791"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "a66a8658eb01837ff96933aca69c4a02"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "e016b6f864b663e6bbaf2101e870c646"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "25dbd0206cec86a57f97ddcd6e57cd13"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "70b2416b6452fb2af2bb68b3e2c49d95"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "a36b567c35328bded17ce394b5205c1f"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "52f1e46c684386215c015a7b07ae3117"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "1e2fccc70b362cd2cba7a3ed5c2a7bcb"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "17c67b6929c6b0a188ff6ab06806dbc9"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "e6403a2d0ff806717923ae97acb9eac0"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "f190b88637cbd736e0fb0f7a3f2b43c9"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "0c9d15b9630b2e087acc32e3a127cfda"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "f3fda47162650384add57b045401bbd8"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "a407efba8b9b9c7ca858dfaba64eedfa"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "7103e0c2616ebb93226fd67d49cd3e0b"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "29250b274ad48f8c5c6c708fb0cb2a89"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "9ea146d7ba33524bd67e21c7f11052e7"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "2a54623652440e93a4e74f33af3e4a25"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "4d59f7b35d7ef94a8c29e95a1f74e816"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "c93de6c04451b0f260cfec64240452c4"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "b7a0b02a59f7f36198d7a5a93e36040c"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "27eb079c058d4f73ace38947e19b1aea"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "7f07c4be9e6874ca32e7ac6d6022cd64"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "8d493d1f818162d847b9167d33e8c13b"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "cac8614c9c753a8b31a33c54955c5b31"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "775a84a39ef1454fbba4c471dbcae7a6"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "4d59f7b35d7ef94a8c29e95a1f74e816"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "6cda9aba40212eddb877369cab08411e"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "599fc9ac7e63cccc8b859ab1d8e3df07"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "3d63060db04613931b1b0382842ef2e9"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "11bf7450046bd598d70666bc0d7e20d8"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "ad33695aa7e8c6c321682a4b85f50caa"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "b6e615164d3bf3afb9bde50398f85f48"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "dbe04633dfa6c9301bc63ea1702a7733"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "8ac425364fc6e5fd8dc74b1a7f760147"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "f7d08e1a2fd1804993cabff20a2e5a36"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "95db5308f5137c0c89f4f938e4c979d1"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "dd1527ab8b802a7e139cad22b453ea9a"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "51225e37a7cc3aefe979df5c41899f8f"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "a69d685cb661136b6ca72610a532f9b8"
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
