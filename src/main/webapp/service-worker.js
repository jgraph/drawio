importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "4defe785fc3a0d1d91b0c6c1e221d86e"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "67ad6bddc50bdd1d80e26924919804c2"
  },
  {
    "url": "js/diagramly/ElectronApp.js",
    "revision": "589bd3c8cf3107a71286adf2db71b4d2"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "033242ce61a98a1223a9f896b97ec107"
  },
  {
    "url": "js/shapes.min.js",
    "revision": "6d1fdbc4b5e424d0713b28de2676d9e9"
  },
  {
    "url": "index.html",
    "revision": "51c6852dcfa89abe9195ac4b125149f2"
  },
  {
    "url": "open.html",
    "revision": "cb5b1553e62c4c21fae0a3890bd9bc10"
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
    "revision": "0ffb13c4a7e327b1a0536e1bcd8c8551"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "fcc00b1a3599fed715703faa0920f45d"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "0ffb13c4a7e327b1a0536e1bcd8c8551"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "fa9ba97e86958a7ac4027d40f9b64102"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "0df8046dd7688bdead5215ef63cdb665"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "58a863a2a956e027816630572dead623"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "f43b824d4a38ebdf23c4fea22544c5bb"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "6c3f8dd76f87881095f997482a0a5bd0"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "aaee97929896f55271ec0ffe71116cab"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "c6f1c6862868b909f13a66cfbd20c1a1"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "ba27ada0ebe69f8a3476c2e5fc9acbc7"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "9a9564152039f3b80226351edc1b8155"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "a92912ccfcc7cf6f97234bb3b5ece7b7"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "e76b823db8cae1f95505a2e3bbfb40d5"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "307a5bfc2afe64b3620f555e2893b2e2"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "0b24703c32a619588a3316584b123b43"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "0ffb13c4a7e327b1a0536e1bcd8c8551"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "2dbbc8908798ae46085fd862efa3dea2"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "d12fdc7709cb5346c71a959321490ba2"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "02432f86bf17dbcc6fd7a627a92fe8fa"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "595cd9e84264b15d9bef954776174173"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "bfb1fac4ed2ae58b16ab5cb623ac2067"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "5904db353ee6acbc7146ec43fe022d5f"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "68b5601d490848db198425d6f0819f38"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "00b152a1cd8b900939aaa65ab7862ba9"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "a0507b19eac40211542c56e4242063bc"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "4efc4024aa9b6b4040f1074a811c67dd"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "3b5e51fb4e45b60fd08dd3c8e8fb4dcb"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "fc2210eb6314d2ca03bbe15bb6c1604b"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "8857748501a86039ed7a8f88641b0ffb"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "6a009270e1413ca78eb52a1c0cb03d91"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "cf5482d67fb416ba3882d4fc826c18da"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "41dd6ad545d9a0da10e5806ecc5be06e"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "e969319e64b39462168d894f75298211"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "5c797e5d449675b9172e77e24a1eb476"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "e1536a2620da9b6c83030bba1a19e2d4"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "1a621c3eece170114778d151f5fb3e65"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "2a4fdc5931155ad284a9f593ec1556b2"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "e9a2f5c1d73ed0118d2e8cfde8bab3f6"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "95c90d2b98c57b0d7457a0713632dc09"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "b60a599e9f49e5b3ef66c96ac8a22799"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "4cbb7de7de8d88d8a12f502a6e8caf59"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "63f48a54a0e205a04fd6bb808e7cf815"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "7ae3b8ab3a86fb245c3ef97876cca636"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "dc57c22760ab2a6e6a45183b61ed1b81"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "23815c60e572907024e985116299f0d0"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "9068dca850fb7810732ff9d03d3d0394"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "844e7ee829905fc1b2c01487b54f2380"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "7fb391b417db8a5b5472590bc5747762"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "890fa5efdca83ee2f252b91ee0017dd9"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "efdedc328b3eeb8f2a09309b762b5f7c"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "8c1d9ac549b62be85d91d87809cc8550"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "a3b39a087b70014ccc034fcc6f4b5f19"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "b915f6ff1c861d62d38b6d324550247a"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "b3f2840da47040193a8787406008b9b2"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "b3ed40a6157cd50d9939a143adf36792"
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
    "url": "images/drawlogo-text-bottom.svg",
    "revision": "f6c438823ab31f290940bd4feb8dd9c2"
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
