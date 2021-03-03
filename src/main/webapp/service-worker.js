importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "76263201ee58f2c47ae2f305712e6c74"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "6d131150050e77dbf1684827f5fd8515"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "6a805bdcc488c2f63d32c6582cba89f7"
  },
  {
    "url": "js/shapes.min.js",
    "revision": "bd99a6864e7f02101ee1991b6d5f67bd"
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
    "revision": "10373e4f23ea654a97baa28e45c3c93b"
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
    "revision": "5bae94315bd183ef6434ff863c55e0ed"
  },
  {
    "url": "connect/confluence/connectUtils-1-4-8.js",
    "revision": "6f288a8f542669491938245db6adf392"
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
    "revision": "e0887470c6bc10becc19ac516b49a0d1"
  },
  {
    "url": "connect/confluence/viewer-1-4-42.html",
    "revision": "337086bfe29db854b7e634830b33b202"
  },
  {
    "url": "connect/confluence/macroEditor-1-4-8.html",
    "revision": "689fa63fd3a384662b4199f6e4a5b5c1"
  },
  {
    "url": "connect/confluence/includeDiagram-1-4-8.js",
    "revision": "8b81191082e56b2a9134afede269f13d"
  },
  {
    "url": "connect/confluence/includeDiagram.html",
    "revision": "adc9ff3aab2f3e4195199030fd1c3a85"
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
    "revision": "cac9adddcb72a49afa0b5f35f11550bb"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "9dcf42bcb4963c7d8c25fc806b600ea2"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "96ee88b552a3c9d709064eaf88df2104"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "9d04ec45cf9a4f4896caaf5561c15d7d"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "c82c00fdd4e01513478221788c74fd1e"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "ae55eeabc4decf19fb876173ae36c672"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "68c835b5bc344046d291c62ceab4bd46"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "6dd948bbc72d6027cdc3e2ca706d13ea"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "ebf95990c317a85c8a81b773555726fa"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "ac3fa9aedf2f387cb904c097695df938"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "8eac317dbc85015105b5f5c84c51b417"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "3bf66cb6d37ab148c3c9ba16d079be5d"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "417d572dcdacb4f48713cf599cb6114e"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "f98353ae7d2aebef0e8a8cde8800cb04"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "91d7fcf5c93dc362bc389041d002ad6f"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "b28ae9d2aa371ba689a09b738739efbc"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "fd65cb0a0583e936b7aae9ddb2cce949"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "a7ae25b3fd725cc135aed30861040b8c"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "7ab2b00a898914929e9897a459b239d4"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "69e1ede35369e5902496a91e083c3b6e"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "683750dfd039fe6c88b3f9ebc5057d70"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "7a51a5c9b2ea7ba88dcadc27fc6badcd"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "219faaf0ccd430534a6a87dd0d2e899f"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "c6fd1973178ac4a385fe579c990ca135"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "58496cf329dcd778fc5e479bf4972f98"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "d387352c2bdfc9eb2fe9f823e9e88278"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "65fb54b24aa17155f8bf38aa2dbb055c"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "687ae2e3e1c19b87863df2db31598612"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "9ce3d2d7385d2df044d70e6d3ace2f4a"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "3486ca40db22b8a065ea3af8c905da66"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "70ddec479aa68f7fb2ce71ee12905448"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "bb5f4ecc2dab8a350011d5000d1ad70f"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "8a5f45a1037cc6400bf6e5e0eb38661f"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "60fa851152aadbd5306162b809e3c029"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "4f3e66efc822960fbeb2a859b7dea056"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "cac9adddcb72a49afa0b5f35f11550bb"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "2fd491462a7435ceb99b1a347262a309"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "e9405a753d7d537be4b8885993b6f9f4"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "486bfb3d2eaf8be1b676911af7a81b6c"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "1e85b9ffff4c18243530ac27dd8c4eb8"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "23abb474f88dac83bd38d57f5eadab1f"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "2fcd48c5bdbc8f0e63fab90078b9fa66"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "5ff401c2fdd57a0433bbb9cbccf56e1e"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "cac9adddcb72a49afa0b5f35f11550bb"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "b30be945335bc05d3d62f8a878aa602c"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "0fc834b3fc8f4da51477f3f078d23d4f"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "9fd4f2010ceee5baae4385039058d866"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "8f6020d9533ee8ff5d069b5bf305a1d0"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "d35de8cff8f59e8712ee9687069e7855"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "2196caf9b164ab6dc9a02708b9392019"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "5ec0bd3ed73f8d228e744747e170fd5e"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "e31890f471485e13270b0008e2515d97"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "c82f9811f9007bb4692d93d0ff345fb9"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "d5b6dd552166a3f83ca96cd2603f9540"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "3e0a1e2993e30079ac6c26c25042db3e"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "30322568d899d124215559d16dcea92f"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "eb35b4767af17356a3f18b297b5e4da0"
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
