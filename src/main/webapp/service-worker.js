importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "567ee0779366db99e9cc12114365ca7d"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "95db907440ef0e84924ea4e674fd486a"
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
    "revision": "d02fab970652db6d01c214ad995cdc32"
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
    "revision": "a1c5a4d14096b730028f498176f08f7e"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "94e07a2822e6ef0a1a24919f681e2f46"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "a1c5a4d14096b730028f498176f08f7e"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "f14a3f890f8b72daca2ed4e6bd6512e8"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "c44f4bb7a61d69ca8b61cd8db913d641"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "af6f171ebb43002943a90bb81361980f"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "f8efce7244b17ee16a1c328b134f44e7"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "35aa94c327195771a50ee63cd0bbc1f8"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "fd5b4bacb00ea272da79c523915e95d5"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "c9efd946cab6038db919287bbf5dcb52"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "f4e6be9931d9330f7469cbb5aa9aaa1b"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "7b15bc44ec635510d2b35fbf5c9d93f6"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "264177b887583d5032cab8d33c9c5964"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "3dd01e023564827ece6ff847482b773f"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "87c1f2d3b1bd4a3f864db272e7139a6d"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "6cbee414ac12c42ee45ba0c48755b40a"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "a1c5a4d14096b730028f498176f08f7e"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "c325e2e2c101228ceb2478d8a3a143e3"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "0cdd4386e6b51aa4c8bdc52fb5c8ab92"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "94596a7c043e004340dcb511c23e1804"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "644bd965290ec6ac8a4b922c6d36f99a"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "55e2c43a5d460409522b6602be122772"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "4cc72ba71d32b565d7e3e148c8010f2d"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "4033b75570eaca0f2e0b8d9f8aae0b40"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "51dbcbc5fbdd5c9fbdd72dca6fd05616"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "06ddca532bed3823eeef623940cc66bd"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "8b4a368ce08bb9b69e9ccf18a47ad342"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "58ee29fa12705db0e7b4cff45f6d1d4c"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "9ea6c94f0e27956d0d095e32bda72554"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "700d4d49447015c47028f73c0a29ab42"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "17e69099197dbd43dbc2dea6633b281a"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "88bf8f57268796262fd7184ae98daa8f"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "3c18995d0c8160ac5517e0702f743a60"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "5b6f23e518cd7f01a910c4957da5bf6f"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "4763ca00e0734045c3ef81d827bd7bb5"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "3e7ebabd36a7ab5da037eec467c9c3e6"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "3ab8effb061fff5d560f0ca983a22e19"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "54545ce9165bb36775ae3cd8a79c5c87"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "bc97b517815ac3f8f1d9e7f9b6ad7a41"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "09d6f56a8bec90f4138a66eb49e2f39f"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "4ece1610fe891e055001fdd1dd0516f5"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "1469934746d924fe6cecfba70421e9ff"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "f875039b28724265a9db7e088560e34d"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "71a21d373e69f79ff95d70f062b46bdb"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "c787ab641a91873d92c6732978055a0e"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "623cf7dddb58e425a73d26b4300b7d20"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "2a6fd50dd0c79a95368b82d33148a928"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "939d867c2f49aad06c95cdd3c893f3dc"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "3e48439795dcb80d156c30ea4e131a04"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "fadc2b81bd442f766cec6119dc21e0a9"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "4f5104acb834b20406dcb8812dc80cd3"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "855f330460adbd553559f27ddb30e707"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "cc554c65a4c1f8ec9f73b8c9dc132c3b"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "e5b037d3d9d90710eee7aeb1eb6e9bfe"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "dbf687fe115ba5a26d36fd7bb450b119"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "42936ec2dbbe033d0eaebcd9153b941c"
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
