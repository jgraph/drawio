/**
 * Copyright (c) 2011-2020, JGraph Ltd
 */

async function handleRequest(request) {
  let requestURL = new URL(request.url)
  let host = requestURL.host
  let path = requestURL.pathname
  
  let hostRedirectMap = redirectMap.get(host)
  
  if (hostRedirectMap)
  {
	  //Match full path then reduce one level at a time
	  let redirect, notUsedPath = '', done = false
	  
	  do
	  {
		  redirect = hostRedirectMap.get(path) || hostRedirectMap.get(path + '/');
		  
		  if (redirect) 
		  {
			  //Complete the URL
			  if (redirect.startsWith('/'))
			  {
				  redirect = requestURL.protocol + '//' + host + redirect;
			  }
			  
			  return Response.redirect(redirect + notUsedPath, 301)
		  }
		  else
		  {
			  let lastSlash = path.lastIndexOf('/');
			  
			  if (lastSlash >= 0)
			  {
				  notUsedPath = path.substr(lastSlash) + notUsedPath;
				  path = path.substr(0, lastSlash);
			  }
			  else
			  {
				  done = true
			  }
		  }
	  } while (!done)
  }
  
  // If not in the map, return 404
  return new Response('NOT_FOUND', { status: 404 });
}

addEventListener('fetch', async event => {
  event.respondWith(handleRequest(event.request))
})

const redirectMap = new Map([
	['about.draw.io', new Map([
		['/drawio-desktop-10-7-5-release', 'https://github.com/jgraph/drawio-desktop/releases/tag/v10.7.5'],
		['/insert-from-text-now-supports-plantuml', '/use-plantuml-in-draw-io'],
		['/integrate-draw-io/', '/integrations-ecosystem/'],
		['/new-edge-styles/', '/connector-styles-and-animations-in-draw-io/'],
		['/publish-diagrams-to-github/', '/github-support/'],
		['/prefer-draw-io-in-an-atlassian-style/', '/pick-your-favorite-draw-io-theme-kennedy-atlas-dark-or-minimal/'],
		['/drawio-desktop-10-7-5-release', 'https://github.com/jgraph/drawio-desktop/releases/tag/v10.7.5'],
		['/insert-from-text-now-supports-plantuml', '/use-plantuml-in-draw-io'],
		['/integrate-draw-io/', '/integrations-ecosystem/'],
		['/new-edge-styles/', '/connector-styles-and-animations-in-draw-io/'],
		['/publish-diagrams-to-github/', '/github-support/'],
		['/prefer-draw-io-in-an-atlassian-style/', '/pick-your-favorite-draw-io-theme-kennedy-atlas-dark-or-minimal/'],
		['/integrations/confluence-integration-2/', 'https://www.diagrams.net/integrations.html'],
		['/integrations/jira-integration/', 'https://www.diagrams.net/integrations.html'],
		['/integrations/', 'https://www.diagrams.net/integrations.html'],
		['/features/examples/', 'https://drawio-app.com/'],
		['/features/training-material/', 'https://drawio-app.com/tutorials/'],
		['/features/', 'https://www.diagrams.net/'],
		['/integrations-ecosystem/', 'https://www.diagrams.net/integrations'],
		['/multiple-pages-per-diagram/', 'https://www.diagrams.net/blog/multiple-page-diagrams'],
		['/drawio-data-protection/', 'https://www.diagrams.net/blog/data-protection'],
		['/use-draw-io-offline/', 'https://www.diagrams.net/blog/diagrams-offline'],
		['/use-your-own-fonts-in-draw-io/', 'https://www.diagrams.net/blog/external-fonts'],
		['/4-ways-to-connect-shapes/', 'https://www.diagrams.net/blog/connect-shapes'],
		['/export-cloudockit-architecture-to-drawio/', 'https://www.diagrams.net/blog/cloudockit-to-drawio'],
		['/google-drive-connector-for-confluence-cloud/', 'https://www.diagrams.net/'],
		['/document-your-aws-architecture-with-cloudcraft-and-draw-io/', 'https://www.diagrams.net/blog/drawio-aws-cloudcraft'],
		['/use-draw-io-diagrams-in-google-docs/', 'https://www.diagrams.net/blog/diagrams-google-docs'],
		['/improved-import/', 'https://www.diagrams.net/blog/import-formats'],
		['/incremental-find-plugin/', 'https://www.diagrams.net/doc/faq/find-shapes'],
		['/sidebar-click/', 'https://www.diagrams.net/blog/quick-add-shapes'],
		['/find-plugin-update/', 'https://www.diagrams.net/doc/faq/find-shapes'],
		['/how-to-quickly-remove-sensitive-information-from-draw-io-diagrams/', 'https://www.diagrams.net/doc/faq/anonymize-plugin'],
		['/draw-io-privacy-and-google-analytics/', 'https://www.diagrams.net/blog/google-analytics'],
		['/share-diagrams-with-draw-io/', 'https://www.diagrams.net/blog/online-diagram-viewer'],
		['/publish-link-and-embed-html/', 'https://www.diagrams.net/blog/publish-link'],
		['/public-google-files/', 'https://www.diagrams.net/blog/share-diagrams-via-google'],
		['/export-diagrams-as-urls/', 'https://www.diagrams.net/blog/export-url'],
		['/using-draw-io-diagrams-in-wordpress/', 'https://www.diagrams.net/blog/export-svg'],
		['/insert-from-text-now-supports-lists-and-graphs/', 'https://www.diagrams.net/blog/insert-from-text'],
		['/altdrop/', 'https://www.diagrams.net/blog/shortcut-overlay-shapes'],
		['/animation-and-automatic-layout-explore-complex-diagrams/', 'https://www.diagrams.net/doc/faq/explore-plugin'],
		['/google-team-drives-support/', 'https://www.diagrams.net/blog/google-shared-drives'],
		['/30k-reviews/', 'https://www.diagrams.net'],
		['/external-fonts-in-draw-io/', 'https://www.diagrams.net/blog/external-fonts'],
		['/analysing-vulnerabilities-with-threat-modelling-in-draw-io/', 'https://www.diagrams.net/blog/threat-modelling'],
		['/fosdem2020-sponsor/', 'https://www.diagrams.net/blog/fosdem-sponsor'],
		['/google-docs-add-on-now-supports-high-resolution-images/', 'https://www.diagrams.net/blog/high-resolution-images-google-docs'],
		['/sql-plugin/', 'https://www.diagrams.net/blog/insert-sql'],
		['/properties-plugin/', 'https://www.diagrams.net/doc/faq/properties-plugin'],
		['/number-plugin/', 'https://www.diagrams.net/doc/faq/plugins'],
		['/40k-reviews/', 'https://www.diagrams.net'],
		['/new-veeam-stencil-set/', 'https://www.diagrams.net/blog/veeam-stencils'],
		['/new-github-repository/', 'https://www.diagrams.net/blog/example-diagrams-github'],
		['/updates-to-draw-io-desktop/', 'https://www.diagrams.net/blog/desktop-updates'],
		['/simplified-tags-plugin/', 'https://www.diagrams.net/doc/faq/tags-plugin'],
		['/github-support/', 'https://www.diagrams.net/blog/github-support'],
		['/support-for-your-language-in-draw-io/', 'https://www.diagrams.net/blog/translate-drawio'],
		['/altshiftcursor/', 'https://www.diagrams.net/blog/shortcut-clone-connect'],
		['/altshiftselect-now-removes-selected-cells%ef%bb%bf/', 'https://www.diagrams.net/blog/shortcut-deselect-shapes'],
		['/draw-io-diagrams-for-confluence/', 'https://www.diagrams.net/integrations'],
		['/scratchpad-in-chrome-app/', 'https://www.diagrams.net/blog/drawio-chrome-app'],
		['/find-and-tags/', 'https://www.diagrams.net/doc/faq/find-shapes'],
		['/disable-recursive-resize/', 'https://www.diagrams.net/blog/disable-resize-children'],
		['/placeholder-scope/', 'https://www.diagrams.net/blog/placeholder-scope'],
		['/scissors-tool/', 'https://www.diagrams.net/blog/shortcut-move-area'],
		['/shiftdelete-in-toolbar-now-deletes-cells-with-connections%ef%bb%bf/', 'https://www.diagrams.net/blog/shortcut-shift-delete'],
		['/snap-to-point/', 'https://www.diagrams.net/blog/snap-to-point'],
		['/features/examples/', 'https://drawio-app.com/'],
		['/features/training-material/', 'https://drawio-app.com/tutorials/'],
		['/terms-conditions/', 'https://seibert-media.com/general-terms/'],
		['/support/', 'https://github.com/jgraph/drawio/wiki/Getting-Support'],
		['/', 'https://drawio-app.com/']
	])],
	['blog.draw.io', new Map([
		['/', 'https://drawio-app.com/blog']
	])],
	['download.draw.io', new Map([
		['/', 'https://github.com/jgraph/drawio-desktop/releases/latest']
	])],
	['get.draw.io', new Map([
		['/', 'https://github.com/jgraph/drawio-desktop/releases/latest']
	])],
	['docsaddon.draw.io', new Map([
		['/', 'https://gsuite.google.com/marketplace/app/drawio_viewer_for_docs/224440279306']
	])],
	['gsuite.draw.io', new Map([
		['/', 'https://gsuite.google.com/marketplace/app/drawio_diagrams/671128082532']
	])],
	['office.draw.io', new Map([
		['/', 'https://appsource.microsoft.com/product/office/wa200000113']
	])],
	['slidesaddon.draw.io', new Map([
		['/', 'https://gsuite.google.com/marketplace/app/drawio_diagrams_for_slides/588283048931']
	])],
	['sheetsaddon.draw.io', new Map([
		['/', 'https://gsuite.google.com/marketplace/app/drawio_diagrams_for_sheets/948903782998']
	])],
	['doc.draw.io', new Map([
		['/i18n', 'https://docs.google.com/spreadsheets/d/1FoYdyEraEQuWofzbYCDPKN7EdKgS_2ZrsDrOA8scgwQ'],
		['/', 'https://support.draw.io']
	])],
	['app.draw.io', new Map([
		['/', 'https://www.draw.io/app']
	])],
	['new.draw.io', new Map([
		['/', 'https://www.draw.io/?splash=0']
	])]
])