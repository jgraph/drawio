importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "e46ca5711e458931e5d698de69bd891e"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "e178b1bd98121a088e43ac8028583d40"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "a6620368de26b57e1a60f45f470a9e87"
  },
  {
    "url": "js/shapes.min.js",
    "revision": "9b887f2907288abde17aec69290469f0"
  },
  {
    "url": "js/math-print.js",
    "revision": "9d98c920695f6c3395da4b68f723e60a"
  },
  {
    "url": "index.html",
    "revision": "c356c0a671c0e709c0b49d17dbf99cf9"
  },
  {
    "url": "open.html",
    "revision": "dd24217f6c21207b54475409848f31ff"
  },
  {
    "url": "styles/grapheditor.css",
    "revision": "6ca3b89237f1c6cb9cfcbd3032b43431"
  },
  {
    "url": "styles/atlas.css",
    "revision": "40f54334c7a62821dbf1f7c7d8ad62cc"
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
    "url": "math/MathJax.js",
    "revision": "c32a502b8b4a6bd6bad8ddb1b59e9e72"
  },
  {
    "url": "resources/dia.txt",
    "revision": "72792b496f28142991b3f81483fa1238"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "86d277dc934a8db5a7778952d6d3ba66"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "72792b496f28142991b3f81483fa1238"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "cda116799deeb3ab93d85a3c07f05612"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "8136242db90372174a1c1c36fb548065"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "9e6cc14e2fb5206beda5078ae255467a"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "adb6137de46cb00a5b71b5793a2398ce"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "64e5952d6f4423a5e5094e6659560774"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "f5032ac613ccd68606fb191bb5bebb4e"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "271414a6ddcc5c358b2b3c1ee2ce44c0"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "4100dce2b3e2d91cdbee17026b838d54"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "9f1d88c704a3a2a82f16eae0e2ed91f9"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "2aded2e2e77c6b5193851dbf1c7d0a92"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "7dc120b7a2a5a7c2b4edb749df5a7f37"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "8ce8fc16e6d0436b51da3fda69ce666b"
  },
  {
    "url": "resources/dia_eu.txt",
    "revision": "b0c42eb4e99ee30bf7990e426d2826de"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "2fdaf65e20a23060c786eafc4e78fa01"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "72792b496f28142991b3f81483fa1238"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "0f633a8983b1bdcdcd3707613edad753"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "8287a2b2cb1370404e70b8dbd5308e51"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "b3c0cb65e9ecdfcb31f60cfcdaaa1ff2"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "630b332a50d31c0747f9397aed02b3cf"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "3b400aba8b4bbf1890fa622b47eae05e"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "cee43f7e7d84000dfddaf8e3a426f254"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "0eb1184778a44b2a20e808e34b0dc08c"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "632ee5c1337a511dfdb11ba734d53a0a"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "406a552e743a9b2fbb829b32087c3006"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "4bf4177dbddde35eccf4367bb02c3c50"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "0d9bf20e87a68aa35753c600817000a1"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "35ef6927582803a298cc07d9638c50cf"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "889f64722751eba68fa6b45e640a3666"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "1a5eba1aa57473e73ac573755178d8f3"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "7660dbf25f83d3e381648ed60cd7b39b"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "fd67011f56690d70e7b3a7634163e6d6"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "34a2cee8c6c366bd38b7e35cc693901e"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "e7c691a0c0e49789c1aa0b580226f662"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "d745c550a2f41ef543ffdb6c11dbb69c"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "a7f99f751ff941030a7d7755b9131dd5"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "00b8967ec499f3b615bc1ee584540b29"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "39de6dfc14fce8444b6a19bca978dd30"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "5bf1ff2332b3676e57ba4ec9afe13456"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "b5b3292ffd68180f991c871cba103a58"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "37f0d3bd1b89041097aa8cdc355a3d60"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "164478897773b4245f74f8f0e96881b1"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "f6844bf467d7fd644d66449815e19b7b"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "a00914399989e101025337826a400c4f"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "02de594868271c2db577b4712d216856"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "3b8ae0d3ca228096d93f7ccd2df7e781"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "fc6cde005ee3f1efaa83dbe0f3f2cb3b"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "2a2b689dc6162b02a5f94210e1e055dc"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "456b482f7af5c6816e164c4dab0f81c7"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "280436c829befea0c54cb7a9d159a7ef"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "b6b952026bdc5f2eae72aec367ea0f03"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "dd57625d42bd22d1c8cfaac8643f725c"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "5447425212fcf40765d9df704966ac5f"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "041625b23f19458ea5c2737c2582dc2f"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "3219623da81228b23e88828e95483118"
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
