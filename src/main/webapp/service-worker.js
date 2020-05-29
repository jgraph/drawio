importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "945297eb7314367c6029a0122ec99067"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "ecd53ce33feef17a0ac6be648bfd056f"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "be66334d69e1fc4bead3535f87dfa611"
  },
  {
    "url": "js/shapes.min.js",
    "revision": "90d8f1edfecfe931438f4cd995bed5b0"
  },
  {
    "url": "index.html",
    "revision": "a656f54b727cb6956aeaf2ed56eb2eba"
  },
  {
    "url": "open.html",
    "revision": "f7de43d2d8d04cdc6f0d923942fad4d4"
  },
  {
    "url": "app.html",
    "revision": "e28e1516e715420680ab6f3bc3fe2288"
  },
  {
    "url": "styles/grapheditor.css",
    "revision": "4b2c4b76bae7c1a7c7df74fff3cb75af"
  },
  {
    "url": "styles/atlas.css",
    "revision": "40f54334c7a62821dbf1f7c7d8ad62cc"
  },
  {
    "url": "styles/dark.css",
    "revision": "bd0e851bff9047866cfa0683fe89ac38"
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
    "url": "math/MathJax.js",
    "revision": "c32a502b8b4a6bd6bad8ddb1b59e9e72"
  },
  {
    "url": "resources/dia.txt",
    "revision": "566c40fd69752783a093b32b28eb98cf"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "2a181c4fd68559bab01d3db5011ed050"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "566c40fd69752783a093b32b28eb98cf"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "138b6875d12860b14ff1aaaa6bb80da8"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "52a9e39c1e6bb367d3b764e15903c2b6"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "52c9ee7f8fe5ded1b412454ca9b76dd5"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "519967d576645a4e77385e5c874d7a73"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "17025b72fd74c4c894a7909970a069e8"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "f95aab8985ae3612fc9d64e62f035098"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "8c5cc8ed52dd99d4c4d8a2c6deedc430"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "09b0be439257a5e648c9f4b3d1ee2706"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "e34a5eb4cab6000eccd82b7b92a2d793"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "978ebac9f57d036b5e4d20a505f209fd"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "097d79496f590ef346093fe117da183d"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "94be775c840c8f010f21727e37a91c3e"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "467b2121c8e2313421f81335d8bcd646"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "588d651ae4680fd01613b0dc4b7a009f"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "566c40fd69752783a093b32b28eb98cf"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "51a5e373e5b17bef75c29ae2d133f2ef"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "b4b5fc9d2202888b3b241540921180e9"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "ff7ad12f24bcbf83feabd80d31481aa5"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "64b4d600c995997e4a6b865bf2f9297c"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "9999834cf05ea01cfa66ceb9c3132015"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "bdedc03d6a161f0785cd3c86de9812c9"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "63a4b879a08a807d2b1f97fc7e9081e5"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "39f9fd7bc75d0dfe797de20cdafa321a"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "a8211c153af5628ad8abb2b3c891e806"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "e7a16acf016d9c44df55b046f646e592"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "9dcb5f9edd1ef7f3fe114d146d15e4de"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "c983ffd38089ef14f0fb4b79fba3a270"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "deeeb9ee6b528f5c97623daf1c41abde"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "9a0eea69b84323f98950b5d290c8649a"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "590289f937014f78a3c119ece175d41b"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "462f15e995c8b8f8039fbfdc68c4e7a3"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "c2473d4373a1706a3adbd24974435ced"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "55c8ad18b1b85174968131e6722c53d4"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "a961725bf74365dbf085deaa52101cfc"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "192d03ba5387a08af56596c8d9dcf2b1"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "a0a748122aba16a095daff7607fdd4a1"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "1de85bc0c9a08d0c72e875db8830a85a"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "43084b576112d2f748215c870b341c48"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "a2118b3326b618ce00faf147d82e8ba4"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "fba35ba1d8f467a293d77f75a816e12f"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "2ebfed9bd7456fb9190e545c2911708f"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "5d4bfd15d0034d048d216cbad237c7ad"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "ef46829fd7b623514cd282c1c8e7c771"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "25ec3135ad03308bf4bdfa501756ed28"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "3124c0bd6ccabc9abcf793275df7efeb"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "b366684f0d5931339ee0223d0ed4a2aa"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "857a51c45995cd311dbd706b63cb7b6b"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "c64e6e231ae284cc926e518c880531a4"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "98048d4062bfaea79f891b60f83629a4"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "d868e4fd1f5acc16ad6d67d26d360653"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "6c9a6a3e9f9ce56be1702d7423abf275"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "f7e447e358e0b19af1434d7e08accd89"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "2341b6b28875fb87af91a8f180dbff25"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "f3e42d2330c443134a0ae22feee81d53"
  },
  {
    "url": "favicon.ico",
    "revision": "fab2d88b37c72d83607527573de45281"
  },
  {
    "url": "images/manifest.json",
    "revision": "078a1ee03d5b64100c5b760d8e73dc88"
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
    "url": "images/drawlogo-gray.svg",
    "revision": "0aabacbc0873816e1e09e4736ae44c7d"
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
    "url": "images/android-chrome-192x192.png",
    "revision": "a886234330ea25d4ba1c47f678b00ef2"
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
