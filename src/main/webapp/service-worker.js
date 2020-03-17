importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
{
	// This is replaced in build process
	workbox.precaching.precacheAndRoute([
  {
    "url": "js/app.min.js",
    "revision": "b3c84ef4201239f05506af6d479dc319"
  },
  {
    "url": "js/extensions.min.js",
    "revision": "95db907440ef0e84924ea4e674fd486a"
  },
  {
    "url": "js/diagramly/ElectronApp.js",
    "revision": "0669ba361d68da2bd7ed3676c7add5ea"
  },
  {
    "url": "js/stencils.min.js",
    "revision": "a1ffae1ccfc3919e5df304f6703db220"
  },
  {
    "url": "js/shapes.min.js",
    "revision": "fca9101e6fffc0c4d4b4d660c4589b3b"
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
    "revision": "0000ea515861d492ecb72b6918cada9b"
  },
  {
    "url": "resources/dia_cs.txt",
    "revision": "8c88fef0a411e663b6768805c0c8ff91"
  },
  {
    "url": "resources/dia_my.txt",
    "revision": "0000ea515861d492ecb72b6918cada9b"
  },
  {
    "url": "resources/dia_am.txt",
    "revision": "7f80c025aa70a1cce8a369c6bf25e4ae"
  },
  {
    "url": "resources/dia_ml.txt",
    "revision": "30b8a69088a3215b52ed9d870b2731b8"
  },
  {
    "url": "resources/dia_uk.txt",
    "revision": "ff41d15f846a29b65e186ea6a3ab83ca"
  },
  {
    "url": "resources/dia_bg.txt",
    "revision": "e44677eea89592064c84749b36c2ce95"
  },
  {
    "url": "resources/dia_ca.txt",
    "revision": "843fe3b317725aaac2a0242d43ce07df"
  },
  {
    "url": "resources/dia_th.txt",
    "revision": "86b225a8c59aa872ae95774e3fd558c6"
  },
  {
    "url": "resources/dia_bs.txt",
    "revision": "8ae9f33011bc1504264ab3b564bd3b6b"
  },
  {
    "url": "resources/dia_id.txt",
    "revision": "a739902c0d78700ddaf5f2fcfe9b4996"
  },
  {
    "url": "resources/dia_sk.txt",
    "revision": "60741888ca8d01f9b5ff373e21f64290"
  },
  {
    "url": "resources/dia_ro.txt",
    "revision": "a4e649d5b5ecd03a77351785bb88502c"
  },
  {
    "url": "resources/dia_gl.txt",
    "revision": "575505ec3cd43bd30252f9a4440ae37d"
  },
  {
    "url": "resources/dia_es.txt",
    "revision": "076999c104c8185ce98e17f3c983aad5"
  },
  {
    "url": "resources/dia_ko.txt",
    "revision": "b9dac896d4bba3488a511da72362415c"
  },
  {
    "url": "resources/dia_si.txt",
    "revision": "0000ea515861d492ecb72b6918cada9b"
  },
  {
    "url": "resources/dia_kn.txt",
    "revision": "9b386dedb71d3bab69135294e019247b"
  },
  {
    "url": "resources/dia_hu.txt",
    "revision": "ea0e4807516a09e2139fa642e8306979"
  },
  {
    "url": "resources/dia_fi.txt",
    "revision": "21040a91304e4dcaaacee1e8fbe580f1"
  },
  {
    "url": "resources/dia_da.txt",
    "revision": "52c5e26b38aed6530988d3599c51a488"
  },
  {
    "url": "resources/dia_de.txt",
    "revision": "87dbeb930ec3474c6d25a1abdfa55aeb"
  },
  {
    "url": "resources/dia_sl.txt",
    "revision": "5621b0f57cc5f5471bb83195c4ea16dc"
  },
  {
    "url": "resources/dia_it.txt",
    "revision": "461cf188df25b104a042e387217d35d4"
  },
  {
    "url": "resources/dia_hr.txt",
    "revision": "c17c53c1e49e68c5657be2fb6b79d913"
  },
  {
    "url": "resources/dia_he.txt",
    "revision": "cbdb0a7f7400526afccdf79e729e305b"
  },
  {
    "url": "resources/dia_pt.txt",
    "revision": "b551e6921822ba62594716f474bba1bc"
  },
  {
    "url": "resources/dia_zh-tw.txt",
    "revision": "92edbd644d5a0fea8c5ce3cc6fc1404e"
  },
  {
    "url": "resources/dia_et.txt",
    "revision": "707790727525e027df29d8c682235eaa"
  },
  {
    "url": "resources/dia_ja.txt",
    "revision": "f062f477fc3f25690ff3bf278d0fd916"
  },
  {
    "url": "resources/dia_hi.txt",
    "revision": "126a4d96a6639a9eda82b362f368e3d6"
  },
  {
    "url": "resources/dia_eo.txt",
    "revision": "a486b8d02497898de973eeb29dcd954d"
  },
  {
    "url": "resources/dia_fa.txt",
    "revision": "531ca17703fa18590357d4bd5abf717c"
  },
  {
    "url": "resources/dia_sw.txt",
    "revision": "e4f42ea170d0e77666f1912ee26af2e5"
  },
  {
    "url": "resources/dia_pl.txt",
    "revision": "d67b5e069c654ed98f1231fe392b373b"
  },
  {
    "url": "resources/dia_pt-br.txt",
    "revision": "5f3bb54f5d5be1b2675a96149c7e717d"
  },
  {
    "url": "resources/dia_sv.txt",
    "revision": "311743ef516cdc20ae936444929e1917"
  },
  {
    "url": "resources/dia_el.txt",
    "revision": "70f459e9f1f8bbef6eeed9525d4ec88d"
  },
  {
    "url": "resources/dia_sr.txt",
    "revision": "155a48607cda3abcf6b2145121aedb1a"
  },
  {
    "url": "resources/dia_fr.txt",
    "revision": "8b6301cbc8c1c6de7b76070beaf26d49"
  },
  {
    "url": "resources/dia_ru.txt",
    "revision": "b350df1f17b1fa1d25f53d324bfeda3c"
  },
  {
    "url": "resources/dia_gu.txt",
    "revision": "9d030e2fc565fb7fdeb9436c53a5ef3d"
  },
  {
    "url": "resources/dia_ar.txt",
    "revision": "fb572e536c28337f7702759558fe9830"
  },
  {
    "url": "resources/dia_tr.txt",
    "revision": "fa7f9a7223958375f9d5f8343dd3f2c2"
  },
  {
    "url": "resources/dia_te.txt",
    "revision": "13ec1cc41d73d5bee70fdb7f7631c847"
  },
  {
    "url": "resources/dia_lt.txt",
    "revision": "1e46309c5eeda2ff07704ae09c8aa8c6"
  },
  {
    "url": "resources/dia_lv.txt",
    "revision": "783c2b966968e478f463fe9756e5c30c"
  },
  {
    "url": "resources/dia_mr.txt",
    "revision": "acb6f8bac0a8eeea42a6a2bc879369da"
  },
  {
    "url": "resources/dia_ms.txt",
    "revision": "539cef49a14b6f9a18ad09e22065728e"
  },
  {
    "url": "resources/dia_nl.txt",
    "revision": "9665b0d05498edb80f172cda95c5867f"
  },
  {
    "url": "resources/dia_fil.txt",
    "revision": "dadb9964c3f1dcde75573e717f608582"
  },
  {
    "url": "resources/dia_zh.txt",
    "revision": "9fe7993077487f59faae0f35bf7d1844"
  },
  {
    "url": "resources/dia_bn.txt",
    "revision": "818f351d7f6b5fec1375a83481536845"
  },
  {
    "url": "resources/dia_no.txt",
    "revision": "069359dfd7f7054450c4bce369f56df1"
  },
  {
    "url": "resources/dia_vi.txt",
    "revision": "65dc37855ef176b02d452525c9298538"
  },
  {
    "url": "resources/dia_ta.txt",
    "revision": "c4e88cd8b06a95fe7c073397ae70cb67"
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
