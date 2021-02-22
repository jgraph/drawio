importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "aa2a357c99ed9281142a5962df644ace"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "8d0d1c742cc16c328012ad27a5c5853b"
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
    "revision": "705c15d388d662654170b53efd9cd317"
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
    "revision": "a0a00120805f6c3b38e620f965bff33e"
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
    "revision": "769bc857ad5bb4dbbea9dc40fa530c75"
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
    "revision": "94471897ad83bcd2ac2518f563bfd06a"
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
    "revision": "3e2dd0ab776eae77103a51e1ad15ff90"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "6402c05cc88931967ab517c57f293a7e"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "755cea532de72be044a13392595327ec"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "95c9170b3c49b95c5c9c183cb43249fe"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "25962fb06109ea8666d2ec0ab0744c1c"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "10c27b6a621505c49297ee8acbdc06e3"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "5fd0e77cb0d5b5e3903dba5b195373b6"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "eaf1778a0a25825da564a49a94ecd7f2"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "00622877f695e26ca5545b16904dd1e3"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "e4b6052df805f80bd97e6879f04b8709"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "394eaf985708b491f926a17d93dee4cb"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "e8e9397352668b64665527a812876361"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "f919e5d0e319fe2e4770bde6cf4e5994"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "47d0caa24df756494659a145905dd112"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "a1113a80101b3421a3dd83b183c9f7e0"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "24f44981fe4a01362db2d79e1aeb0b89"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "b5ab2f5bea04045a49ed047c8c963ecf"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "f4251dc00db76100bb11bf128b0641b2"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "06a75eba44a0e561d4dfcb68da498800"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "178ee68d9a99343ea3d4d0097b017f3f"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "b6743887cfeea5453d80eeff076c8d9a"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "4eaa487eadfbd54355d2b2609c5417be"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "c8ac19dedcb1d9860c207907f1950fc5"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "642ef11bc8b0f8441c865ecaa84de017"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "c55f62b1a2bb5285f8571b1a63d840a8"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "f5cd87874330123c3102e419b687f3a7"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "729c532af0640eb21a88cc8b2c0f5372"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "0a5f01af131df8a764f3d28aa3d3f920"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "574a0c93503b4a0f3f8e56f772537e0d"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "54ab3ec95629984e94b72ac1646daff3"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "d1cf8934b7ef68de3900c6f164af94e7"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "8f6c4be146ac3c771ff1c09bd892a163"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "36105b7b30adeff6301352cb1975a281"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "7c302f9b34d1993c086be567782ee848"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "1764d0c71a6a0eb5a997a6e581c42809"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "3e2dd0ab776eae77103a51e1ad15ff90"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "53a169f186ed965aad517375d01af65d"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "7860d72c8307ef774ca5a8c540360d0f"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "94bfca5280d72b62e9f4ebccb1bfdc0e"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "9569a14d2eda756c22998822ffaccd24"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "90e102cc6d590a763cd0fd5ae28523be"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "e4c8ba84fb42ae98915331b338d109fe"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "d27fc65428649d77f2cf23e65d2ecea5"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "3e2dd0ab776eae77103a51e1ad15ff90"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "b9863cd247dd1803cb1a93d65b75e5d5"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "1592628a920221484a894954bc8cd155"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "535caef0e3d9615a4559bbda455d3b3b"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "1c44482e45092e4986336f68a97edccf"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "01fa72ae78aa42d4e4b78dfd4793b5cc"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "e919a3b194fbfcc758f64ba9aa3c9022"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "e515d74b7139c92e8f69f8f6f17c8e59"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "7fff117e4a2204f6e3a0e577fa65e9b1"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "67566f11e947835cf8e576410252bda9"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "6cd06dce212c30812e2cbae73290ded5"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "e103a845a0afc14352c6880b930d20f6"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "aa3f7622d2a7cae143c83e35cda20807"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "41f50753e414c31f1f54b7c9828b431d"
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
