importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "887b6bc2f181d2888215c8712415a3e7"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "205dd0e7a7fbd8cbcb7d0752de501b18"
  },
  {
    "url": "js/diagramly/ElectronApp.js",
    "revision": "0669ba361d68da2bd7ed3676c7add5ea"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "8f09eee243202b723a6d71d6e8fbf78e"
  },
  {
    "url": "js/shapes.min.js",
    "revision": "8f40e5ae3dff71f75031e4bd3d714856"
  },
  {
    "url": "index.html",
    "revision": "ef6e260760a1fa3ca029dbbc0fb6231a"
  },
  {
    "url": "open.html",
    "revision": "d10cdcb6f34a8c8aa9d6a649d6cc8904"
  },
  {
    "url": "app.html",
    "revision": "d3b6efffecb556234c73284cb9922806"
  },
  {
    "url": "styles/grapheditor.css",
    "revision": "2f1b366eeffa3dae8b004b5e632a22e8"
  },
  {
    "url": "styles/atlas.css",
    "revision": "40f54334c7a62821dbf1f7c7d8ad62cc"
  },
  {
    "url": "styles/dark.css",
    "revision": "c7688082f9e2101d8c4150124835070f"
  },
  {
    "url": "js/croppie/croppie.min.css",
    "revision": "fc297c9002c79c15a132f13ee3ec427e"
  },
  {
    "url": "resources/dia.txt",
    "revision": "a0b626aa5a9b4bc5d8524ca30db73b11"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "8fb23f8239f2e13d37692d8ec061661e"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "a0b626aa5a9b4bc5d8524ca30db73b11"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "937ea1a4d54ff5f59b5b6cdcc8920a04"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "cf22b535eaa26be9750690dc7880011b"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "5fba80ad77d8e3f45f1dd419cf7862c0"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "925a8e94cd6463e66a09c31ec2ecae18"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "ed11b66e5acd5574c3826cd46018416f"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "30fe8b6e6aedc6bdb769482ebd54780d"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "c522322c6c862c962999f666041aa638"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "c6c647f7790ef7dbeb9cad4761d4a2d1"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "5fda20d402c9669c1c87bab55245c0cc"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "8b97b267c7e8b7d560fa00fa93cadd74"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "f15141edded7bfa86425b1b7176058ee"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "594533805d4dbf17537addf71dde12ab"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "6dde215ff8af2305ba7efecd484c36f4"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "a0b626aa5a9b4bc5d8524ca30db73b11"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "ba46dc6265aff4169e58c894d0d7dec9"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "21f886d985785b682e7656317ec8bb4f"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "5a00fe4b38f421bf31616ae79104478d"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "916406d3d08938e5446870b3f216a440"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "b6ae3fb33adb20d01c7e935804123aab"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "c7343ec2a3fd77071ae327799274ecde"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "4269a63e7a1abfb47b248bf4738bac37"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "6305ef00ff3077a75a790baaeca9f550"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "2385c59647424614efef1f068d886da3"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "5f710829b3616b33caed08327a7fb546"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "ec68c20c6a9874d5549287c7ca1548a4"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "b2b69d88aba6228a7883f177fe08b12b"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "42036017d76ac89013264b6eeff32057"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "3a1375c324a4db6e6ce359c3bf376a9d"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "5647b55ec686c0cc4f414d59d09375e6"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "7c82efa9a4877381238099be11299073"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "04ef383e2cc2873bd6972e5cbc778406"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "f16487102b4a75b3ec240d3f89cedb6f"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "aa3b5922dca48813cea02c86ea5c7080"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "6461292cba48f8fae12673f468eb4af7"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "573a2a1dfb159e771814cc69be2a40e6"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "dbe54b6020ad89297dd7fbce0993bfba"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "76e6158614908615933148d551e48dd6"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "aa335af32d19e42079836e531102caff"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "251fa3372f7c37162e973d03fef41b15"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "a30e037d54d35184d00ca3a857045978"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "4223f879e349946936581c38e142a128"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "d44f48d62205f1bd129c177d36d5d0c6"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "1010f3da7d38afd9a9d8a442f3165f16"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "597b55627f415f54cd246170ca626708"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "43c411936666e1a31faceaacfc500682"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "2f2080a935bf18535bc920bdfc6303d4"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "2cff9fd3287888b1c234278532c717d6"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "9ec39f2d86e495b5729b29328c201b44"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "2613670f0bb3a8e057d660e8e6479b45"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "ee1d53a8d8d6e01df1162e3284f076ab"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "82f9c918eb85b73f9f48ee85cd0ff0b1"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "e753c4ab73524fad3d3e1d14d6274d80"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "194024ea1068559759079fdbe90c79a2"
  },
  {
    "url": "favicon.ico",
    "revision": "fab2d88b37c72d83607527573de45281"
  },
  {
    "url": "images/manifest.json",
    "revision": "dbd6ca1756a56c64e9e9f4437a37286d"
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
    "url": "images/osa_drive-harddisk.png",
    "revision": "b954e1ae772087c5b4c6ae797e1f9649"
  },
  {
    "url": "images/osa_database.png",
    "revision": "c350d9d9b95f37b6cfe798b40ede5fb0"
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
		// Ignore all URL parameters.
		ignoreURLParametersMatching: [/.*/]
	});
}
