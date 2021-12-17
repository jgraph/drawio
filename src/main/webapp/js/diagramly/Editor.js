/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
(function()
{
	if (typeof html4 !== 'undefined')
	{
		/**
		 * Enables paste from Lucidchart
		 */
		html4.ATTRIBS['span::data-lucid-content'] = 0;
		html4.ATTRIBS['span::data-lucid-type'] = 0;
		
		/**
		 * Enables custom fonts in labels.
		 */
		html4.ATTRIBS['font::data-font-src'] = 0;
	}

	/**
	 * Specifies the app name. Default is document.title.
	 */
	Editor.prototype.appName = 'diagrams.net';
		
	/**
	 * Known file types.
	 */
	Editor.prototype.diagramFileTypes = [
		{description: 'diagramXmlDesc', extension: 'drawio', mimeType: 'text/xml'},
		{description: 'diagramPngDesc', extension: 'png', mimeType: 'image/png'},
		{description: 'diagramSvgDesc', extension: 'svg', mimeType: 'image/svg'},
		{description: 'diagramHtmlDesc', extension: 'html', mimeType: 'text/html'},
		{description: 'diagramXmlDesc', extension: 'xml', mimeType: 'text/xml'}];

	/**
	 * Known file types.
	 */
	Editor.prototype.libraryFileTypes = [{description: 'Library (.drawiolib, .xml)', extensions: ['drawiolib', 'xml']}];

	/**
	 * Additional help text for special file extensions.
	 */
	Editor.prototype.fileExtensions = [
		{ext: 'html', title: 'filetypeHtml'},
		{ext: 'png', title: 'filetypePng'},
		{ext: 'svg', title: 'filetypeSvg'}];
	
	/**
	 * 
	 */
	Editor.styles = [{},
		{commonStyle: {fontColor: '#5C5C5C', strokeColor: '#006658', fillColor: '#21C0A5'}},
		{commonStyle: {fontColor: '#095C86', strokeColor: '#AF45ED', fillColor: '#F694C1'},
			edgeStyle: {strokeColor: '#60E696'}},
		{commonStyle: {fontColor: '#46495D', strokeColor: '#788AA3', fillColor: '#B2C9AB'}},
		{commonStyle: {fontColor: '#5AA9E6', strokeColor: '#FF6392', fillColor: '#FFE45E'}},
		{commonStyle: {fontColor: '#1D3557', strokeColor: '#457B9D', fillColor: '#A8DADC'},	
			graph: {background: '#F1FAEE'}},
		{commonStyle: {fontColor: '#393C56', strokeColor: '#E07A5F', fillColor: '#F2CC8F'},	
			graph: {background: '#F4F1DE', gridColor: '#D4D0C0'}},
		{commonStyle: {fontColor: '#143642', strokeColor: '#0F8B8D', fillColor: '#FAE5C7'},
			edgeStyle: {strokeColor: '#A8201A'},
			graph: {background: '#DAD2D8', gridColor: '#ABA4A9'}},
		{commonStyle: {fontColor: '#FEFAE0', strokeColor: '#DDA15E', fillColor: '#BC6C25'},
			graph: {background: '#283618', gridColor: '#48632C'}},
		{commonStyle: {fontColor: '#E4FDE1', strokeColor: '#028090', fillColor: '#F45B69'},
			graph: {background: '#114B5F', gridColor: '#0B3240'}},
		{},
		{vertexStyle: {strokeColor: '#D0CEE2', fillColor: '#FAD9D5'},
			edgeStyle: {strokeColor: '#09555B'},
			commonStyle: {fontColor: '#1A1A1A'}},
		{vertexStyle: {strokeColor: '#BAC8D3', fillColor: '#09555B', fontColor: '#EEEEEE'},
			edgeStyle: {strokeColor: '#0B4D6A'}},
		{vertexStyle: {strokeColor: '#D0CEE2', fillColor: '#5D7F99'},
			edgeStyle: {strokeColor: '#736CA8'},
			commonStyle: {fontColor: '#1A1A1A'}},
		{vertexStyle: {strokeColor: '#FFFFFF', fillColor: '#182E3E', fontColor: '#FFFFFF'},
			edgeStyle: {strokeColor: '#23445D'},
			graph: {background: '#FCE7CD', gridColor: '#CFBDA8'}},
		{vertexStyle: {strokeColor: '#FFFFFF', fillColor: '#F08E81'},
			edgeStyle: {strokeColor: '#182E3E'},
			commonStyle: {fontColor: '#1A1A1A'},
			graph: {background: '#B0E3E6', gridColor: '#87AEB0'}},
		{vertexStyle: {strokeColor: '#909090', fillColor: '#F5AB50'},
			edgeStyle: {strokeColor: '#182E3E'},
			commonStyle: {fontColor: '#1A1A1A'},
			graph: {background: '#EEEEEE'}},
		{vertexStyle: {strokeColor: '#EEEEEE', fillColor: '#56517E', fontColor: '#FFFFFF'},
			edgeStyle: {strokeColor: '#182E3E'},
			graph: {background: '#FAD9D5', gridColor: '#BFA6A3'}},
		{vertexStyle: {strokeColor: '#BAC8D3', fillColor: '#B1DDF0', fontColor: '#182E3E'},
			edgeStyle: {strokeColor: '#EEEEEE', fontColor: '#FFFFFF'},
			graph: {background: '#09555B', gridColor: '#13B4C2'}},
		{vertexStyle: {fillColor: '#EEEEEE', fontColor: '#1A1A1A'},
			edgeStyle: {fontColor: '#FFFFFF'},
			commonStyle: {strokeColor: '#FFFFFF'},
			graph: {background: '#182E3E', gridColor: '#4D94C7'}}
	];
	
	/**
	 * 
	 */
	Editor.saveImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iYmxhY2siIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTkgMTJ2N0g1di03SDN2N2MwIDEuMS45IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0ydi03aC0yem0tNiAuNjdsMi41OS0yLjU4TDE3IDExLjVsLTUgNS01LTUgMS40MS0xLjQxTDExIDEyLjY3VjNoMnoiLz48L3N2Zz4=';

	/**
	 * 
	 */
	Editor.smallPlusImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/plus.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDdCMTdENjVCOEM4MTFFNDlCRjVBNDdCODU5NjNBNUMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDdCMTdENjZCOEM4MTFFNDlCRjVBNDdCODU5NjNBNUMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowN0IxN0Q2M0I4QzgxMUU0OUJGNUE0N0I4NTk2M0E1QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowN0IxN0Q2NEI4QzgxMUU0OUJGNUE0N0I4NTk2M0E1QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtjrjmgAAAAtSURBVHjaYvz//z8DMigvLwcLdHZ2MiKLMzEQCaivkLGsrOw/dU0cAr4GCDAARQsQbTFrv10AAAAASUVORK5CYII=';
	
	/**
	 * 
	 */
	Editor.spinImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/spin.gif' : 'data:image/gif;base64,R0lGODlhDAAMAPUxAEVriVp7lmCAmmGBm2OCnGmHn3OPpneSqYKbr4OcsIScsI2kto6kt46lt5KnuZmtvpquvpuvv56ywaCzwqK1xKu7yay9yq+/zLHAzbfF0bjG0bzJ1LzK1MDN18jT28nT3M3X3tHa4dTc49Xd5Njf5dng5t3k6d/l6uDm6uru8e7x8/Dz9fT29/b4+Pj5+fj5+vr6+v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkKADEAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAADAAMAAAGR8CYcEgsOgYAIax4CCQuQldrCBEsiK8VS2hoFGOrlJDA+cZQwkLnqyoJFZKviSS0ICrE0ec0jDAwIiUeGyBFGhMPFBkhZo1BACH5BAkKAC4ALAAAAAAMAAwAhVB0kFR3k1V4k2CAmmWEnW6Lo3KOpXeSqH2XrIOcsISdsImhtIqhtJCmuJGnuZuwv52wwJ+ywZ+ywqm6yLHBzbLCzrXEz7fF0LnH0rrI0r7L1b/M1sXR2cfT28rV3czW3s/Z4Nfe5Nvi6ODm6uLn6+Ln7OLo7OXq7efs7+zw8u/y9PDy9PX3+Pr7+////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZDQJdwSCxGDAIAoVFkFBwYSyIwGE4OkCJxIdG6WkJEx8sSKj7elfBB0a5SQg1EQ0SVVMPKhDM6iUIkRR4ZFxsgJl6JQQAh+QQJCgAxACwAAAAADAAMAIVGa4lcfZdjgpxkg51nhp5ui6N3kqh5lKqFnbGHn7KIoLOQp7iRp7mSqLmTqbqarr6br7+fssGitcOitcSuvsuuv8uwwMyzw861xNC5x9K6x9K/zNbDztjE0NnG0drJ1NzQ2eDS2+LT2+LV3ePZ4Oba4ebb4ufc4+jm6+7t8PLt8PPt8fPx8/Xx9PX09vf19/j3+Pn///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGQ8CYcEgsUhQFggFSjCQmnE1jcBhqGBXiIuAQSi7FGEIgfIzCFoCXFCZiPO0hKBMiwl7ET6eUYqlWLkUnISImKC1xbUEAIfkECQoAMgAsAAAAAAwADACFTnKPT3KPVHaTYoKcb4yjcY6leZSpf5mtgZuvh5+yiqG0i6K1jqW3kae5nrHBnrLBn7LCoLPCobTDqbrIqrvIs8LOtMPPtcPPtcTPuMbRucfSvcrUvsvVwMzWxdHaydTcytXdzNbezdff0drh2ODl2+Ln3eTp4Obq4ujs5Ont5uvu6O3w6u7w6u7x7/L09vj5+vr7+vv7////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkdAmXBILHIcicOCUqxELKKPxKAYgiYd4oMAEWo8RVmjIMScwhmBcJMKXwLCECmMGAhPI1QRwBiaSixCMDFhLSorLi8wYYxCQQAh+QQJCgAxACwAAAAADAAMAIVZepVggJphgZtnhp5vjKN2kah3kqmBmq+KobSLorWNpLaRp7mWq7ybr7+gs8KitcSktsWnuManucexwM2ywc63xtG6yNO9ytS+ytW/zNbDz9jH0tvL1d3N197S2+LU3OPU3ePV3eTX3+Xa4efb4ufd5Onl6u7r7vHs7/Lt8PLw8/Xy9Pby9fb09ff2+Pn3+Pn6+vr///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGSMCYcEgseiwSR+RS7GA4JFGF8RiWNiEiJTERgkjFGAQh/KTCGoJwpApnBkITKrwoCFWnFlEhaAxXLC9CBwAGRS4wQgELYY1CQQAh+QQJCgAzACwAAAAADAAMAIVMcI5SdZFhgZtti6JwjaR4k6mAma6Cm6+KobSLorWLo7WNo7aPpredsMCescGitMOitcSmuMaqu8ixwc2zws63xdC4xtG5x9K9ytXAzdfCztjF0NnF0drK1d3M1t7P2N/P2eDT2+LX3+Xe5Onh5+vi5+vj6Ozk6e3n7O/o7O/q7vHs7/Lt8PPu8fPx8/X3+Pn6+vv7+/v8/Pz///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGRcCZcEgsmkIbTOZTLIlGqZNnchm2SCgiJ6IRqljFmQUiXIVnoITQde4chC9Y+LEQxmTFRkFSNFAqDAMIRQoCAAEEDmeLQQAh+QQJCgAwACwAAAAADAAMAIVXeZRefplff5lhgZtph59yjqV2kaeAmq6FnbGFnrGLorWNpLaQp7mRqLmYrb2essGgs8Klt8apusitvcquv8u2xNC7yNO8ydS8ytTAzdfBzdfM1t7N197Q2eDU3OPX3+XZ4ObZ4ebc4+jf5erg5erg5uvp7fDu8fPv8vTz9fb09vf19/j3+Pn4+fn5+vr6+/v///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGRUCYcEgspkwjEKhUVJ1QsBNp0xm2VixiSOMRvlxFGAcTJook5eEHIhQcwpWIkAFQECkNy9AQWFwyEAkPRQ4FAwQIE2llQQAh+QQJCgAvACwAAAAADAAMAIVNcY5SdZFigptph6BvjKN0kKd8lquAmq+EnbGGn7KHn7ONpLaOpbearr+csMCdscCescGhtMOnuMauvsuzws60w862xdC9ytW/y9a/zNbCztjG0drH0tvK1N3M1t7N19/U3ePb4uff5urj6Ozk6e3l6u7m6u7o7PDq7vDt8PPv8vTw8vTw8/X19vf6+vv///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGQ8CXcEgsvlytVUplJLJIpSEDUESFTELBwSgCCQEV42kjDFiMo4uQsDB2MkLHoEHUTD7DRAHC8VAiZ0QSCgYIDxhNiUEAOw==';

	/**
	 * 
	 */
	Editor.globeImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTEuOTkgMkM2LjQ3IDIgMiA2LjQ4IDIgMTJzNC40NyAxMCA5Ljk5IDEwQzE3LjUyIDIyIDIyIDE3LjUyIDIyIDEyUzE3LjUyIDIgMTEuOTkgMnptNi45MyA2aC0yLjk1Yy0uMzItMS4yNS0uNzgtMi40NS0xLjM4LTMuNTYgMS44NC42MyAzLjM3IDEuOTEgNC4zMyAzLjU2ek0xMiA0LjA0Yy44MyAxLjIgMS40OCAyLjUzIDEuOTEgMy45NmgtMy44MmMuNDMtMS40MyAxLjA4LTIuNzYgMS45MS0zLjk2ek00LjI2IDE0QzQuMSAxMy4zNiA0IDEyLjY5IDQgMTJzLjEtMS4zNi4yNi0yaDMuMzhjLS4wOC42Ni0uMTQgMS4zMi0uMTQgMiAwIC42OC4wNiAxLjM0LjE0IDJINC4yNnptLjgyIDJoMi45NWMuMzIgMS4yNS43OCAyLjQ1IDEuMzggMy41Ni0xLjg0LS42My0zLjM3LTEuOS00LjMzLTMuNTZ6bTIuOTUtOEg1LjA4Yy45Ni0xLjY2IDIuNDktMi45MyA0LjMzLTMuNTZDOC44MSA1LjU1IDguMzUgNi43NSA4LjAzIDh6TTEyIDE5Ljk2Yy0uODMtMS4yLTEuNDgtMi41My0xLjkxLTMuOTZoMy44MmMtLjQzIDEuNDMtMS4wOCAyLjc2LTEuOTEgMy45NnpNMTQuMzQgMTRIOS42NmMtLjA5LS42Ni0uMTYtMS4zMi0uMTYtMiAwLS42OC4wNy0xLjM1LjE2LTJoNC42OGMuMDkuNjUuMTYgMS4zMi4xNiAyIDAgLjY4LS4wNyAxLjM0LS4xNiAyem0uMjUgNS41NmMuNi0xLjExIDEuMDYtMi4zMSAxLjM4LTMuNTZoMi45NWMtLjk2IDEuNjUtMi40OSAyLjkzLTQuMzMgMy41NnpNMTYuMzYgMTRjLjA4LS42Ni4xNC0xLjMyLjE0LTIgMC0uNjgtLjA2LTEuMzQtLjE0LTJoMy4zOGMuMTYuNjQuMjYgMS4zMS4yNiAycy0uMSAxLjM2LS4yNiAyaC0zLjM4eiIvPjwvc3ZnPg==';

	/**
	 * 
	 */
	Editor.commentImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuOTkgNGMwLTEuMS0uODktMi0xLjk5LTJINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNGw0IDQtLjAxLTE4ek0xOCAxNEg2di0yaDEydjJ6bTAtM0g2VjloMTJ2MnptMC0zSDZWNmgxMnYyeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4=';

	/**
	 * 
	 */
	Editor.userImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+PC9zdmc+';

	/**
	 * 
	 */
	Editor.shareImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTggMTYuMDhjLS43NiAwLTEuNDQuMy0xLjk2Ljc3TDguOTEgMTIuN2MuMDUtLjIzLjA5LS40Ni4wOS0uN3MtLjA0LS40Ny0uMDktLjdsNy4wNS00LjExYy41NC41IDEuMjUuODEgMi4wNC44MSAxLjY2IDAgMy0xLjM0IDMtM3MtMS4zNC0zLTMtMy0zIDEuMzQtMyAzYzAgLjI0LjA0LjQ3LjA5LjdMOC4wNCA5LjgxQzcuNSA5LjMxIDYuNzkgOSA2IDljLTEuNjYgMC0zIDEuMzQtMyAzczEuMzQgMyAzIDNjLjc5IDAgMS41LS4zMSAyLjA0LS44MWw3LjEyIDQuMTZjLS4wNS4yMS0uMDguNDMtLjA4LjY1IDAgMS42MSAxLjMxIDIuOTIgMi45MiAyLjkyIDEuNjEgMCAyLjkyLTEuMzEgMi45Mi0yLjkycy0xLjMxLTIuOTItMi45Mi0yLjkyeiIvPjwvc3ZnPg==';

	/**
	 *
	 */
	Editor.syncImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgNFYxTDggNWw0IDRWNmMzLjMxIDAgNiAyLjY5IDYgNiAwIDEuMDEtLjI1IDEuOTctLjcgMi44bDEuNDYgMS40NkMxOS41NCAxNS4wMyAyMCAxMy41NyAyMCAxMmMwLTQuNDItMy41OC04LTgtOHptMCAxNGMtMy4zMSAwLTYtMi42OS02LTYgMC0xLjAxLjI1LTEuOTcuNy0yLjhMNS4yNCA3Ljc0QzQuNDYgOC45NyA0IDEwLjQzIDQgMTJjMCA0LjQyIDMuNTggOCA4IDh2M2w0LTQtNC00djN6Ii8+PC9zdmc+';

	/**
	 *
	 */
	Editor.syncDisabledImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTAgNi4zNVY0LjI2Yy0uOC4yMS0xLjU1LjU0LTIuMjMuOTZsMS40NiAxLjQ2Yy4yNS0uMTIuNS0uMjQuNzctLjMzem0tNy4xNC0uOTRsMi4zNiAyLjM2QzQuNDUgOC45OSA0IDEwLjQ0IDQgMTJjMCAyLjIxLjkxIDQuMiAyLjM2IDUuNjRMNCAyMGg2di02bC0yLjI0IDIuMjRDNi42OCAxNS4xNSA2IDEzLjY2IDYgMTJjMC0xIC4yNS0xLjk0LjY4LTIuNzdsOC4wOCA4LjA4Yy0uMjUuMTMtLjUuMjUtLjc3LjM0djIuMDljLjgtLjIxIDEuNTUtLjU0IDIuMjMtLjk2bDIuMzYgMi4zNiAxLjI3LTEuMjdMNC4xNCA0LjE0IDIuODYgNS40MXpNMjAgNGgtNnY2bDIuMjQtMi4yNEMxNy4zMiA4Ljg1IDE4IDEwLjM0IDE4IDEyYzAgMS0uMjUgMS45NC0uNjggMi43N2wxLjQ2IDEuNDZDMTkuNTUgMTUuMDEgMjAgMTMuNTYgMjAgMTJjMC0yLjIxLS45MS00LjItMi4zNi01LjY0TDIwIDR6Ii8+PC9zdmc+';

	/**
	 * 
	 */
	Editor.calendarImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiMwMDAwMDAiPjxnPjxwYXRoIGQ9Ik0wLDBoMjR2MjRIMFYweiIgZmlsbD0ibm9uZSIvPjwvZz48Zz48cGF0aCBkPSJNMjAsNEg0QzIuOSw0LDIsNC45LDIsNnYxMmMwLDEuMSwwLjksMiwyLDJoMTZjMS4xLDAsMi0wLjksMi0yVjZDMjIsNC45LDIxLjEsNCwyMCw0eiBNOCwxMUg0VjZoNFYxMXogTTE0LDExaC00VjZoNFYxMXogTTIwLDExaC00VjZoNFYxMXogTTgsMThINHYtNWg0VjE4eiBNMTQsMThoLTR2LTVoNFYxOHogTTIwLDE4aC00di01aDRWMTh6Ii8+PC9nPjwvc3ZnPg==';
	
	/**
	 *
	 */
 	Editor.syncProblemImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMyAxMmMwIDIuMjEuOTEgNC4yIDIuMzYgNS42NEwzIDIwaDZ2LTZsLTIuMjQgMi4yNEM1LjY4IDE1LjE1IDUgMTMuNjYgNSAxMmMwLTIuNjEgMS42Ny00LjgzIDQtNS42NVY0LjI2QzUuNTUgNS4xNSAzIDguMjcgMyAxMnptOCA1aDJ2LTJoLTJ2MnpNMjEgNGgtNnY2bDIuMjQtMi4yNEMxOC4zMiA4Ljg1IDE5IDEwLjM0IDE5IDEyYzAgMi42MS0xLjY3IDQuODMtNCA1LjY1djIuMDljMy40NS0uODkgNi00LjAxIDYtNy43NCAwLTIuMjEtLjkxLTQuMi0yLjM2LTUuNjRMMjEgNHptLTEwIDloMlY3aC0ydjZ6Ii8+PC9zdmc+';

	/**
	 *
	 */
	Editor.drawLogoImage = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJFYmVuZV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjUwIDI1MCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjUwIDI1MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MntmaWxsOiMwMDA7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLDE1KSIgZD0iTTE5Ny4xLDEzOC4zaC0yMy43bC0yNS00Mi43YzUuNy0xLjIsOS44LTYuMiw5LjctMTJWNTEuNWMwLTYuOC01LjQtMTIuMy0xMi4yLTEyLjNjMCwwLTAuMSwwLTAuMSwwaC00MS43CgljLTYuOCwwLTEyLjMsNS40LTEyLjMsMTIuMmMwLDAsMCwwLjEsMCwwLjF2MzIuMWMwLDUuOCw0LDEwLjgsOS43LDEybC0yNSw0Mi43SDUyLjljLTYuOCwwLTEyLjMsNS40LTEyLjMsMTIuMmMwLDAsMCwwLjEsMCwwLjEKCXYzMi4xYzAsNi44LDUuNCwxMi4zLDEyLjIsMTIuM2MwLDAsMC4xLDAsMC4xLDBoNDEuN2M2LjgsMCwxMi4zLTUuNCwxMi4zLTEyLjJjMCwwLDAtMC4xLDAtMC4xdi0zMi4xYzAtNi44LTUuNC0xMi4zLTEyLjItMTIuMwoJYzAsMC0wLjEsMC0wLjEsMGgtNGwyNC44LTQyLjRoMTkuM2wyNC45LDQyLjRoLTQuMWMtNi44LDAtMTIuMyw1LjQtMTIuMywxMi4yYzAsMCwwLDAuMSwwLDAuMXYzMi4xYzAsNi44LDUuNCwxMi4zLDEyLjIsMTIuMwoJYzAsMCwwLjEsMCwwLjEsMGg0MS43YzYuOCwwLDEyLjMtNS40LDEyLjMtMTIuMmMwLDAsMC0wLjEsMC0wLjF2LTMyLjFjMC02LjgtNS40LTEyLjMtMTIuMi0xMi4zCglDMTk3LjIsMTM4LjMsMTk3LjIsMTM4LjMsMTk3LjEsMTM4LjN6Ii8+Cjwvc3ZnPgo=';

	/**
	 * 
	 */
	Editor.tailSpin = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9Ii0yIC0yIDQ0IDQ0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPGRlZnM+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSI4LjA0MiUiIHkxPSIwJSIgeDI9IjY1LjY4MiUiIHkyPSIyMy44NjUlIiBpZD0iYSI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiM4MDgwODAiIHN0b3Atb3BhY2l0eT0iMCIgb2Zmc2V0PSIwJSIvPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjODA4MDgwIiBzdG9wLW9wYWNpdHk9Ii42MzEiIG9mZnNldD0iNjMuMTQ2JSIvPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjODA4MDgwIiBvZmZzZXQ9IjEwMCUiLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgogICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxIDEpIj4KICAgICAgICAgICAgPHBhdGggZD0iTTM2IDE4YzAtOS45NC04LjA2LTE4LTE4LTE4IiBzdHJva2U9InVybCgjYSkiIHN0cm9rZS13aWR0aD0iNiI+CiAgICAgICAgICAgICAgICA8YW5pbWF0ZVRyYW5zZm9ybQogICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIKICAgICAgICAgICAgICAgICAgICB0eXBlPSJyb3RhdGUiCiAgICAgICAgICAgICAgICAgICAgZnJvbT0iMCAxOCAxOCIKICAgICAgICAgICAgICAgICAgICB0bz0iMzYwIDE4IDE4IgogICAgICAgICAgICAgICAgICAgIGR1cj0iMC45cyIKICAgICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICAgICAgICAgICAgPC9wYXRoPgogICAgICAgICAgICA8Y2lyY2xlIGZpbGw9IiM4MDgwODAiIGN4PSIzNiIgY3k9IjE4IiByPSIxIj4KICAgICAgICAgICAgICAgIDxhbmltYXRlVHJhbnNmb3JtCiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIgogICAgICAgICAgICAgICAgICAgIHR5cGU9InJvdGF0ZSIKICAgICAgICAgICAgICAgICAgICBmcm9tPSIwIDE4IDE4IgogICAgICAgICAgICAgICAgICAgIHRvPSIzNjAgMTggMTgiCiAgICAgICAgICAgICAgICAgICAgZHVyPSIwLjlzIgogICAgICAgICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogICAgICAgICAgICA8L2NpcmNsZT4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=';

	/**
	 * Used in the GraphViewer lightbox.
	 */
	Editor.tweetImage = IMAGE_PATH + '/tweet.png';

	/**
	 * Used in the GraphViewer lightbox.
	 */
	Editor.facebookImage = IMAGE_PATH + '/facebook.png';

	/**
	 *
	 */
	Editor.blankImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

	/**
	 *
	 */
	Editor.hiResImage = (mxClient.IS_SVG) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA+CAMAAACLMWy1AAAAh1BMVEUAAABMTExERERBQUFBQUFFRUVAQEBCQkJAQEA6OjpDQ0NKSkpBQUFBQUFERERERERBQUFCQkJCQkJCQkJJSUlBQUFCQkJDQ0NDQ0NCQkJDQ0NBQUFBQUFCQkJBQUFCQkJCQkJDQ0NCQkJHR0dBQUFCQkJCQkJAQEBCQkJDQ0NAQEBERERCQkIk1hS2AAAAKnRSTlMAAjj96BL7PgQFRwfu3TYazKuVjRXl1V1DPCn1uLGjnWNVIgy9hU40eGqPkM38AAACG0lEQVRYw+2X63KbMBCFzwZblgGDceN74muatpLe//m6MHV3gHGFAv2RjM94MAbxzdnVsQbBDKwH8AH8MDAyafzjqYeyOG04XE7RS8nIRDXg6BlT+rA0nmtAPh+NQRDxIASIMG44rAMrGunBgHwy3uUldxggIStGKp2f+DQc2O4h4eQsX3O2IFB/oEbsjOKbStnjAEA+zJ0ylZTbgvoDn8xNyn6Dbj5Kd4GsNpABa6duQPfSdEj88TgMAhKuCWjAkgmFXPLnsD0pWd3OFGdrMugQII/eOMPEiGOzqPMIeWrcSoMCg71W1pXBPvCP+gS/OdXqQ3uW23+93XGWLl/OaBb805bNcBPoEIcVJsnHzcxpZH86u5KZ9gDby5dQCcnKqdbke4ItI4Tzd7IW9hZQt4EO6GG9b9sYuuK9Wwn8TIr2xKbF2+3Nhr+qxChJ/AI6pIfCu4z4Zowp4ZUNihz79vewzctnHDwTvQO/hCdFBzrUGDOPn2Y/F8YKT4oOATLvlhOznzmBSdFBJWtc58y7r+UVFOCQczy3wpN6pegDqHtsCPTGvH9JuTO0Dyg8icldYPk+RB6g8Aofj4m2EKBvtTmUPD9xDd1pPcSReV2U5iD/ik2yrngtvvqBfPzOvKiDTKTsCdoHZJ7pLLffgTwlJ5vJdtJV2/jiAYaLvLGhMAEDO5QcDg2M/jOw/8Zn+K3ZwJvHT7ZffgC/NvA3zcybTeIfE4EAAAAASUVORK5CYII=' : IMAGE_PATH + '/img-hi-res.png';

	/**
	 *
	 */
	Editor.loResImage = (mxClient.IS_SVG) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA+CAMAAACLMWy1AAAAS1BMVEVAQEAAAAA1NTVBQUFDQ0NDQ0NFRUVERERBQUFBQUFBQUFAQEBBQUFBQUFCQkJCQkJCQkJBQUFCQkJDQ0NDQ0NCQkJCQkJCQkJGRkb5/XqTAAAAGXRSTlP+AAWODlASCsesX+Lc2LyWe3pwa1tCPjohjSJfoAAAAI1JREFUWMPt1MkKhTAMRuG0anvneXr/J71nUypKcdqI/N8yhLMKMZE1CahnClDQzMPB44ED3EgeCubgDWnWQMHpwTtKwTe+UHD4sJ94wbUEHHFGhILlYDeSnsQeabeCgsPBgB0MOZZ9oGA5GJFiJSfUULAfjLjARrhCwX7wh2YCDwVbwZkUBKqFFJRN+wOcwSgR2sREcgAAAABJRU5ErkJggg==' : IMAGE_PATH + '/img-lo-res.png';

	/**
	 *
	 */
	Editor.cameraImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMThweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMThweCIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE0LjEyIDRsMS44MyAySDIwdjEySDRWNmg0LjA1bDEuODMtMmg0LjI0TTE1IDJIOUw3LjE3IDRINGMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxNmMxLjEgMCAyLS45IDItMlY2YzAtMS4xLS45LTItMi0yaC0zLjE3TDE1IDJ6bS0zIDdjMS42NSAwIDMgMS4zNSAzIDNzLTEuMzUgMy0zIDMtMy0xLjM1LTMtMyAxLjM1LTMgMy0zbTAtMmMtMi43NiAwLTUgMi4yNC01IDVzMi4yNCA1IDUgNSA1LTIuMjQgNS01LTIuMjQtNS01LTV6Ii8+PC9zdmc+';
		
	/**
	 *
	 */
	Editor.tagsImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjE4cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjE4cHgiIGZpbGw9IiMwMDAwMDAiPjxnPjxwYXRoIGQ9Ik0wLDBoMjR2MjRIMFYweiIgZmlsbD0ibm9uZSIvPjwvZz48Zz48Zz48cGF0aCBkPSJNMjEuNDEsMTEuNDFsLTguODMtOC44M0MxMi4yMSwyLjIxLDExLjcsMiwxMS4xNywySDRDMi45LDIsMiwyLjksMiw0djcuMTdjMCwwLjUzLDAuMjEsMS4wNCwwLjU5LDEuNDFsOC44Myw4LjgzIGMwLjc4LDAuNzgsMi4wNSwwLjc4LDIuODMsMGw3LjE3LTcuMTdDMjIuMiwxMy40NiwyMi4yLDEyLjIsMjEuNDEsMTEuNDF6IE0xMi44MywyMEw0LDExLjE3VjRoNy4xN0wyMCwxMi44M0wxMi44MywyMHoiLz48Y2lyY2xlIGN4PSI2LjUiIGN5PSI2LjUiIHI9IjEuNSIvPjwvZz48L2c+PC9zdmc+';

	/**
	 * Broken image symbol for offline SVG.
	 */
	Editor.svgBrokenImage = Graph.createSvgImage(10, 10, '<rect x="0" y="0" width="10" height="10" stroke="#000" fill="transparent"/><path d="m 0 0 L 10 10 L 0 10 L 10 0" stroke="#000" fill="transparent"/>');

	/**
	 * Error image for not found images
	 */	
	Editor.errorImage = 'data:image/gif;base64,R0lGODlhEAAQAPcAAADGAIQAAISEhP8AAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAAAALAAAAAAQABAAAAhoAAEIFBigYMGBCAkGGMCQ4cGECxtKHBAAYUQCEzFSHLiQgMeGHjEGEAAg4oCQJz86LCkxpEqHAkwyRClxpEyXGmGaREmTIsmOL1GO/DkzI0yOE2sKIMlRJsWhCQHENDiUaVSpS5cmDAgAOw==';
	
	/**
	 * Error image for not found images
	 */	
	Editor.configurationKey = '.configuration';
		
	/**
	 * Error image for not found images
	 */	
	Editor.settingsKey = '.drawio-config';
	
	/**
	 * Default value for custom libraries in mxSettings.
	 */
	Editor.defaultCustomLibraries = [];
	
	/**
	 * Default value for custom libraries in mxSettings.
	 */
	Editor.enableCustomLibraries = true;
	
	/**
	 * Specifies if custom properties should be enabled.
	 */
	Editor.enableCustomProperties = true;
	
	/**
	 * Sets the default value for including a copy of the diagram.
	 * Default is true.
	 */
	Editor.defaultIncludeDiagram = true;

	/**
	 * Specifies if custom properties should be enabled.
	 */
	Editor.enableServiceWorker = urlParams['pwa'] != '0' &&
		'serviceWorker' in navigator && (urlParams['offline'] == '1' ||
		/.*\.diagrams\.net$/.test(window.location.hostname) ||
		/.*\.draw\.io$/.test(window.location.hostname));

	/**
	 * Specifies if web fonts are enabled.
	 */
	Editor.enableWebFonts = urlParams['safe-style-src'] != '1';

	/**
	 * Disables the shadow option in the format panel.
	 */
	Editor.enableShadowOption = !mxClient.IS_SF;

	/**
	 * Disables the export URL function.
	 */
	Editor.enableExportUrl = true;

	/**
	 * Specifies if XML files should be compressed. Default is true.
	 */
	Editor.compressXml = true;

	/**
	 * Specifies if XML files should be compressed. Default is true.
	 */
	Editor.oneDriveInlinePicker = (window.urlParams != null && window.urlParams['inlinePicker'] == '0') ? false : true;

	/**
	 * Specifies global variables.
	 */
	Editor.globalVars = null;

	/**
	 * Reference to the config object passed to <configure>.
	 */
	Editor.config = null;

	/**
	 * Reference to the version of the last config object in
	 * <configure>. If this is different to the last version in
	 * mxSettings.parse, then the settings are reset.
	 */
	Editor.configVersion = null;

	/**
	 * Default border for image export (to allow for sketch style).
	 */
	Editor.defaultBorder = 5;

	/**
	 * Common properties for all edges.
	 */
	Editor.commonProperties = [
        {name: 'comic', dispName: 'Comic', type: 'bool', defVal: false, isVisible: function(state, format)
        {
        	return mxUtils.getValue(state.style, 'sketch', '0') != '1';
        }},
        {name: 'jiggle', dispName: 'Jiggle', type: 'float', min: 0, defVal: 1, isVisible: function(state, format)
        {
        	return mxUtils.getValue(state.style, 'comic', '0') == '1' ||
        		mxUtils.getValue(state.style, 'sketch', (urlParams['rough'] == '1') ? '1' : '0') == '1';
        }},
        {name: 'fillWeight', dispName: 'Fill Weight', type: 'int', defVal: -1, isVisible: function(state, format)
        {
        	return mxUtils.getValue(state.style, 'sketch', (urlParams['rough'] == '1') ? '1' : '0') == '1';
        }},
        {name: 'hachureGap', dispName: 'Hachure Gap', type: 'int', defVal: -1, isVisible: function(state, format)
        {
        	return mxUtils.getValue(state.style, 'sketch', (urlParams['rough'] == '1') ? '1' : '0') == '1';
        }},
        {name: 'hachureAngle', dispName: 'Hachure Angle', type: 'int', defVal: -41, isVisible: function(state, format)
        {
        	return mxUtils.getValue(state.style, 'sketch', (urlParams['rough'] == '1') ? '1' : '0') == '1';
        }},
        {name: 'curveFitting', dispName: 'Curve Fitting', type: 'float', defVal: 0.95, isVisible: function(state, format)
        {
        	return mxUtils.getValue(state.style, 'sketch', (urlParams['rough'] == '1') ? '1' : '0') == '1';
        }},
        {name: 'simplification', dispName: 'Simplification', type: 'float', defVal: 0, min: 0, max: 1, isVisible: function(state, format)
        {
        	return mxUtils.getValue(state.style, 'sketch', (urlParams['rough'] == '1') ? '1' : '0') == '1';
        }},
        {name: 'disableMultiStroke', dispName: 'Disable Multi Stroke', type: 'bool', defVal: false, isVisible: function(state, format)
        {
        	return mxUtils.getValue(state.style, 'sketch', (urlParams['rough'] == '1') ? '1' : '0') == '1';
        }},
        {name: 'disableMultiStrokeFill', dispName: 'Disable Multi Stroke Fill', type: 'bool', defVal: false, isVisible: function(state, format)
        {
        	return mxUtils.getValue(state.style, 'sketch', (urlParams['rough'] == '1') ? '1' : '0') == '1';
        }},
        {name: 'dashOffset', dispName: 'Dash Offset', type: 'int', defVal: -1, isVisible: function(state, format)
        {
        	return mxUtils.getValue(state.style, 'sketch', (urlParams['rough'] == '1') ? '1' : '0') == '1';
        }},
        {name: 'dashGap', dispName: 'Dash Gap', type: 'int', defVal: -1, isVisible: function(state, format)
        {
        	return mxUtils.getValue(state.style, 'sketch', (urlParams['rough'] == '1') ? '1' : '0') == '1';
        }},
        {name: 'zigzagOffset', dispName: 'ZigZag Offset', type: 'int', defVal: -1, isVisible: function(state, format)
        {
        	return mxUtils.getValue(state.style, 'sketch', (urlParams['rough'] == '1') ? '1' : '0') == '1';
        }},
        {name: 'jiggle', dispName: 'Jiggle', type: 'float', min: 0, defVal: 1, isVisible: function(state, format)
        {
        	return mxUtils.getValue(state.style, 'comic', '0') == '1' ||
        		mxUtils.getValue(state.style, 'sketch', (urlParams['rough'] == '1') ? '1' : '0') == '1';
        }},
        {name: 'sketchStyle', dispName: 'Sketch Style', type: 'enum', defVal: 'rough',
        	enumList: [{val: 'rough', dispName: 'Rough'}, {val: 'comic', dispName: 'Comic'}],
        	isVisible: function(state, format)
        {
        	return mxUtils.getValue(state.style, 'sketch', (urlParams['rough'] == '1') ? '1' : '0') == '1';
        }}
	];

	/**
	 * Common properties for all edges.
	 */
	Editor.commonEdgeProperties = [
        {type: 'separator'},
        {name: 'arcSize', dispName: 'Arc Size', type: 'float', min:0, defVal: mxConstants.LINE_ARCSIZE},
        {name: 'sourcePortConstraint', dispName: 'Source Constraint', type: 'enum', defVal: 'none',
        	enumList: [{val: 'none', dispName: 'None'}, {val: 'north', dispName: 'North'}, {val: 'east', dispName: 'East'}, {val: 'south', dispName: 'South'}, {val: 'west', dispName: 'West'}]
        },
        {name: 'targetPortConstraint', dispName: 'Target Constraint', type: 'enum', defVal: 'none',
        	enumList: [{val: 'none', dispName: 'None'}, {val: 'north', dispName: 'North'}, {val: 'east', dispName: 'East'}, {val: 'south', dispName: 'South'}, {val: 'west', dispName: 'West'}]
        },
        {name: 'jettySize', dispName: 'Jetty Size', type: 'int', min: 0, defVal: 'auto', allowAuto: true, isVisible: function(state)
        {
    		return mxUtils.getValue(state.style, mxConstants.STYLE_EDGE, null) == 'orthogonalEdgeStyle';
        }},
        {name: 'fillOpacity', dispName: 'Fill Opacity', type: 'int', min: 0, max: 100, defVal: 100},
        {name: 'strokeOpacity', dispName: 'Stroke Opacity', type: 'int', min: 0, max: 100, defVal: 100},
        {name: 'startFill', dispName: 'Start Fill', type: 'bool', defVal: true},
        {name: 'endFill', dispName: 'End Fill', type: 'bool', defVal: true},
        {name: 'perimeterSpacing', dispName: 'Terminal Spacing', type: 'float', defVal: 0},
        {name: 'anchorPointDirection', dispName: 'Anchor Direction', type: 'bool', defVal: true},
        {name: 'snapToPoint', dispName: 'Snap to Point', type: 'bool', defVal: false},
        {name: 'fixDash', dispName: 'Fixed Dash', type: 'bool', defVal: false},
        {name: 'editable', dispName: 'Editable', type: 'bool', defVal: true},
        {name: 'metaEdit', dispName: 'Edit Dialog', type: 'bool', defVal: false},
        {name: 'backgroundOutline', dispName: 'Background Outline', type: 'bool', defVal: false},
        {name: 'bendable', dispName: 'Bendable', type: 'bool', defVal: true},
        {name: 'movable', dispName: 'Movable', type: 'bool', defVal: true},
        {name: 'cloneable', dispName: 'Cloneable', type: 'bool', defVal: true},
        {name: 'deletable', dispName: 'Deletable', type: 'bool', defVal: true},
        {name: 'noJump', dispName: 'No Jumps', type: 'bool', defVal: false},
        {name: 'flowAnimation', dispName: 'Flow Animation', type: 'bool', defVal: false},
		{name: 'ignoreEdge', dispName: 'Ignore Edge', type: 'bool', defVal: false},
        {name: 'orthogonalLoop', dispName: 'Loop Routing', type: 'bool', defVal: false},
		{name: 'orthogonal', dispName: 'Orthogonal', type: 'bool', defVal: false}
	].concat(Editor.commonProperties);

	/**
	 * Common properties for all vertices.
	 */
	Editor.commonVertexProperties = [
        {name: 'colspan', dispName: 'Colspan', type: 'int', min: 1, defVal: 1, isVisible: function(state, format)
        {
        	var graph = format.editorUi.editor.graph;
        	
    		return state.vertices.length == 1 && state.edges.length == 0 && graph.isTableCell(state.vertices[0]);
        }},
        {name: 'rowspan', dispName: 'Rowspan', type: 'int', min: 1, defVal: 1, isVisible: function(state, format)
        {
        	var graph = format.editorUi.editor.graph;
        	
    		return state.vertices.length == 1 && state.edges.length == 0 && graph.isTableCell(state.vertices[0]);
        }},
        {type: 'separator'},
        {name: 'resizeLastRow', dispName: 'Resize Last Row', type: 'bool', getDefaultValue: function(state, format)
        {
        	var cell = (state.vertices.length == 1 && state.edges.length == 0) ? state.vertices[0] : null;
        	var graph = format.editorUi.editor.graph;
        	var style = graph.getCellStyle(cell);
        	
        	return mxUtils.getValue(style, 'resizeLastRow', '0') == '1';
        }, isVisible: function(state, format)
        {
        	var graph = format.editorUi.editor.graph;
        	
    		return state.vertices.length == 1 && state.edges.length == 0 &&
    			graph.isTable(state.vertices[0]);
        }},
        {name: 'resizeLast', dispName: 'Resize Last Column', type: 'bool', getDefaultValue: function(state, format)
        {
        	var cell = (state.vertices.length == 1 && state.edges.length == 0) ? state.vertices[0] : null;
        	var graph = format.editorUi.editor.graph;
        	var style = graph.getCellStyle(cell);
        	
        	return mxUtils.getValue(style, 'resizeLast', '0') == '1';
        }, isVisible: function(state, format)
        {
        	var graph = format.editorUi.editor.graph;
        	
    		return state.vertices.length == 1 && state.edges.length == 0 &&
    			graph.isTable(state.vertices[0]);
        }},
        {name: 'fillOpacity', dispName: 'Fill Opacity', type: 'int', min: 0, max: 100, defVal: 100},
        {name: 'strokeOpacity', dispName: 'Stroke Opacity', type: 'int', min: 0, max: 100, defVal: 100},
        {name: 'overflow', dispName: 'Text Overflow', defVal: 'visible', type: 'enum',
        	enumList: [{val: 'visible', dispName: 'Visible'}, {val: 'hidden', dispName: 'Hidden'}, {val: 'block', dispName: 'Block'},
        		{val: 'fill', dispName: 'Fill'}, {val: 'width', dispName: 'Width'}]
        },
        {name: 'noLabel', dispName: 'Hide Label', type: 'bool', defVal: false},
        {name: 'labelPadding', dispName: 'Label Padding', type: 'float', defVal: 0},
        {name: 'direction', dispName: 'Direction', type: 'enum', defVal: 'east',
        	enumList: [{val: 'north', dispName: 'North'}, {val: 'east', dispName: 'East'}, {val: 'south', dispName: 'South'}, {val: 'west', dispName: 'West'}]
        },
        {name: 'portConstraint', dispName: 'Constraint', type: 'enum', defVal: 'none',
        	enumList: [{val: 'none', dispName: 'None'}, {val: 'north', dispName: 'North'}, {val: 'east', dispName: 'East'}, {val: 'south', dispName: 'South'}, {val: 'west', dispName: 'West'}]
        },
        {name: 'portConstraintRotation', dispName: 'Rotate Constraint', type: 'bool', defVal: false},
        {name: 'connectable', dispName: 'Connectable', type: 'bool', getDefaultValue: function(state, format)
        {
        	var cell = (state.vertices.length > 0 && state.edges.length == 0) ? state.vertices[0] : null;
        	var graph = format.editorUi.editor.graph;
        	
        	return graph.isCellConnectable(cell);
        }, isVisible: function(state, format)
        {
    		return state.vertices.length > 0 && state.edges.length == 0;
        }},
        {name: 'allowArrows', dispName: 'Allow Arrows', type: 'bool', defVal: true},
        {name: 'snapToPoint', dispName: 'Snap to Point', type: 'bool', defVal: false},
        {name: 'perimeter', dispName: 'Perimeter', defVal: 'none', type: 'enum',
        	enumList: [{val: 'none', dispName: 'None'},
        			{val: 'rectanglePerimeter', dispName: 'Rectangle'}, {val: 'ellipsePerimeter', dispName: 'Ellipse'},
        			{val: 'rhombusPerimeter', dispName: 'Rhombus'}, {val: 'trianglePerimeter', dispName: 'Triangle'},
        			{val: 'hexagonPerimeter2', dispName: 'Hexagon'}, {val: 'lifelinePerimeter', dispName: 'Lifeline'},
        			{val: 'orthogonalPerimeter', dispName: 'Orthogonal'}, {val: 'backbonePerimeter', dispName: 'Backbone'},
        			{val: 'calloutPerimeter', dispName: 'Callout'}, {val: 'parallelogramPerimeter', dispName: 'Parallelogram'},
        			{val: 'trapezoidPerimeter', dispName: 'Trapezoid'}, {val: 'stepPerimeter', dispName: 'Step'},
        			{val: 'centerPerimeter', dispName: 'Center'}]
        },
        {name: 'fixDash', dispName: 'Fixed Dash', type: 'bool', defVal: false},
        {name: 'autosize', dispName: 'Autosize', type: 'bool', defVal: false},
        {name: 'container', dispName: 'Container', type: 'bool', defVal: false, isVisible: function(state, format)
        {
    		return state.vertices.length == 1 && state.edges.length == 0;
        }},
        {name: 'dropTarget', dispName: 'Drop Target', type: 'bool', getDefaultValue: function(state, format)
        {
        	var cell = (state.vertices.length == 1 && state.edges.length == 0) ? state.vertices[0] : null;
        	var graph = format.editorUi.editor.graph;
        	
        	return cell != null && (graph.isSwimlane(cell) || graph.model.getChildCount(cell) > 0);
        }, isVisible: function(state, format)
        {
    		return state.vertices.length == 1 && state.edges.length == 0;
        }},
        {name: 'collapsible', dispName: 'Collapsible', type: 'bool', getDefaultValue: function(state, format)
        {
        	var cell = (state.vertices.length == 1 && state.edges.length == 0) ? state.vertices[0] : null;
        	var graph = format.editorUi.editor.graph;
        	
        	return cell != null && ((graph.isContainer(cell) && state.style['collapsible'] != '0') ||
        		(!graph.isContainer(cell) && state.style['collapsible'] == '1'));
        }, isVisible: function(state, format)
        {
    		return state.vertices.length == 1 && state.edges.length == 0;
        }},
        {name: 'recursiveResize', dispName: 'Resize Children', type: 'bool', defVal: true, isVisible: function(state, format)
        {
    		return state.vertices.length == 1 && state.edges.length == 0 &&
    			!format.editorUi.editor.graph.isSwimlane(state.vertices[0]) &&
    			mxUtils.getValue(state.style, 'childLayout', null) == null;
        }},
        {name: 'expand', dispName: 'Expand', type: 'bool', defVal: true},
        {name: 'part', dispName: 'Part', type: 'bool', defVal: false, isVisible: function(state, format)
        {
        	var model = format.editorUi.editor.graph.model;
        	
        	return (state.vertices.length > 0) ? model.isVertex(model.getParent(state.vertices[0])) : false;
        }},
        {name: 'editable', dispName: 'Editable', type: 'bool', defVal: true},
        {name: 'metaEdit', dispName: 'Edit Dialog', type: 'bool', defVal: false},
        {name: 'backgroundOutline', dispName: 'Background Outline', type: 'bool', defVal: false},
        {name: 'movable', dispName: 'Movable', type: 'bool', defVal: true},
        {name: 'movableLabel', dispName: 'Movable Label', type: 'bool', defVal: false, isVisible: function(state, format)
        {
    		var geo = (state.vertices.length > 0) ? format.editorUi.editor.graph.getCellGeometry(state.vertices[0]) : null;
    		
    		return geo != null && !geo.relative;
        }},
        {name: 'resizable', dispName: 'Resizable', type: 'bool', defVal: true},
        {name: 'resizeWidth', dispName: 'Resize Width', type: 'bool', defVal: false},
        {name: 'resizeHeight', dispName: 'Resize Height', type: 'bool', defVal: false},
        {name: 'rotatable', dispName: 'Rotatable', type: 'bool', defVal: true},
        {name: 'cloneable', dispName: 'Cloneable', type: 'bool', defVal: true},
        {name: 'deletable', dispName: 'Deletable', type: 'bool', defVal: true},
        {name: 'treeFolding', dispName: 'Tree Folding', type: 'bool', defVal: false},
        {name: 'treeMoving', dispName: 'Tree Moving', type: 'bool', defVal: false},
        {name: 'pointerEvents', dispName: 'Pointer Events', type: 'bool', defVal: true, isVisible: function(state, format)
        {
        	var fillColor = mxUtils.getValue(state.style, mxConstants.STYLE_FILLCOLOR, null);
        	
        	return format.editorUi.editor.graph.isSwimlane(state.vertices[0]) ||
        		fillColor == null || fillColor == mxConstants.NONE ||
				mxUtils.getValue(state.style, mxConstants.STYLE_FILL_OPACITY, 100) == 0 ||
				mxUtils.getValue(state.style, mxConstants.STYLE_OPACITY, 100) == 0 ||
				state.style['pointerEvents'] != null;
        }},
        {name: 'moveCells', dispName: 'Move Cells on Fold', type: 'bool', defVal: false, isVisible: function(state, format)
        {
        	return state.vertices.length > 0 && format.editorUi.editor.graph.isContainer(state.vertices[0]);
        }}
	].concat(Editor.commonProperties);
	
	/**
	 * Default value for the CSV import dialog.
	 */
	Editor.defaultCsvValue = '##\n' +
		'## Example CSV import. Use ## for comments and # for configuration. Paste CSV below.\n' +
		'## The following names are reserved and should not be used (or ignored):\n' +
		'## id, tooltip, placeholder(s), link and label (see below)\n' +
		'##\n' +
		'#\n' +
		'## Node label with placeholders and HTML.\n' +
		'## Default is \'%name_of_first_column%\'.\n' +
		'#\n' +
		'# label: %name%<br><i style="color:gray;">%position%</i><br><a href="mailto:%email%">Email</a>\n' +
		'#\n' +
		'## Node style (placeholders are replaced once).\n' +
		'## Default is the current style for nodes.\n' +
		'#\n' +
		'# style: label;image=%image%;whiteSpace=wrap;html=1;rounded=1;fillColor=%fill%;strokeColor=%stroke%;\n' +
		'#\n' +
		'## Parent style for nodes with child nodes (placeholders are replaced once).\n' +
		'#\n' +
		'# parentstyle: swimlane;whiteSpace=wrap;html=1;childLayout=stackLayout;horizontal=1;horizontalStack=0;resizeParent=1;resizeLast=0;collapsible=1;\n' +
		'#\n' +
		'## Optional column name that contains a reference to a named style in styles.\n' +
		'## Default is the current style for nodes.\n' +
		'#\n' +
		'# stylename: -\n' +
		'#\n' +
		'## JSON for named styles of the form {"name": "style", "name": "style"} where style is a cell style with\n' +
		'## placeholders that are replaced once.\n' +
		'#\n' +
		'# styles: -\n' +
		'#\n' +
		'## JSON for variables in styles of the form {"name": "value", "name": "value"} where name is a string\n' +
		'## that will replace a placeholder in a style.\n' +
		'#\n' +
		'# vars: -\n' +
		'#\n' +
		'## Optional column name that contains a reference to a named label in labels.\n' +
		'## Default is the current label.\n' +
		'#\n' +
		'# labelname: -\n' +
		'#\n' +
		'## JSON for named labels of the form {"name": "label", "name": "label"} where label is a cell label with\n' +
		'## placeholders.\n' +
		'#\n' +
		'# labels: -\n' +
		'#\n' +
		'## Uses the given column name as the identity for cells (updates existing cells).\n' +
		'## Default is no identity (empty value or -).\n' +
		'#\n' +
		'# identity: -\n' +
		'#\n' +
		'## Uses the given column name as the parent reference for cells. Default is no parent (empty or -).\n' +
		'## The identity above is used for resolving the reference so it must be specified.\n' +
		'#\n' +
		'# parent: -\n' +
		'#\n' +
		'## Adds a prefix to the identity of cells to make sure they do not collide with existing cells (whose\n' +
		'## IDs are numbers from 0..n, sometimes with a GUID prefix in the context of realtime collaboration).\n' +
		'## Default is csvimport-.\n' +
		'#\n' +
		'# namespace: csvimport-\n' +
		'#\n' +
		'## Connections between rows ("from": source colum, "to": target column).\n' +
		'## Label, style and invert are optional. Defaults are \'\', current style and false.\n' +
		'## If placeholders are used in the style, they are replaced with data from the source.\n' +
		'## An optional placeholders can be set to target to use data from the target instead.\n' +
		'## In addition to label, an optional fromlabel and tolabel can be used to name the column\n' +
		'## that contains the text for the label in the edges source or target (invert ignored).\n' +
		'## In addition to those, an optional source and targetlabel can be used to specify a label\n' +
		'## that contains placeholders referencing the respective columns in the source or target row.\n' +
		'## The label is created in the form fromlabel + sourcelabel + label + tolabel + targetlabel.\n' +
		'## Additional labels can be added by using an optional labels array with entries of the\n' +
		'## form {"label": string, "x": number, "y": number, "dx": number, "dy": number} where\n' +
		'## x is from -1 to 1 along the edge, y is orthogonal, and dx/dy are offsets in pixels.\n' +
		'## An optional placeholders with the string value "source" or "target" can be specified\n' +
		'## to replace placeholders in the additional label with data from the source or target.\n' +
		'## The target column may contain a comma-separated list of values.\n' +
		'## Multiple connect entries are allowed.\n' +
		'#\n' +
		'# connect: {"from": "manager", "to": "name", "invert": true, "label": "manages", \\\n' +
		'#          "style": "curved=1;endArrow=blockThin;endFill=1;fontSize=11;"}\n' +
		'# connect: {"from": "refs", "to": "id", "style": "curved=1;fontSize=11;"}\n' +
		'#\n' +
		'## Node x-coordinate. Possible value is a column name. Default is empty. Layouts will\n' +
		'## override this value.\n' +
		'#\n' +
		'# left: \n' +
		'#\n' +
		'## Node y-coordinate. Possible value is a column name. Default is empty. Layouts will\n' +
		'## override this value.\n' +
		'#\n' +
		'# top: \n' +
		'#\n' +
		'## Node width. Possible value is a number (in px), auto or an @ sign followed by a column\n' +
		'## name that contains the value for the width. Default is auto.\n' +
		'#\n' +
		'# width: auto\n' +
		'#\n' +
		'## Node height. Possible value is a number (in px), auto or an @ sign followed by a column\n' +
		'## name that contains the value for the height. Default is auto.\n' +
		'#\n' +
		'# height: auto\n' +
		'#\n' +
		'## Padding for autosize. Default is 0.\n' +
		'#\n' +
		'# padding: -12\n' +
		'#\n' +
		'## Comma-separated list of ignored columns for metadata. (These can be\n' +
		'## used for connections and styles but will not be added as metadata.)\n' +
		'#\n' +
		'# ignore: id,image,fill,stroke,refs,manager\n' +
		'#\n' +
		'## Column to be renamed to link attribute (used as link).\n' +
		'#\n' +
		'# link: url\n' +
		'#\n' +
		'## Spacing between nodes. Default is 40.\n' +
		'#\n' +
		'# nodespacing: 40\n' +
		'#\n' +
		'## Spacing between levels of hierarchical layouts. Default is 100.\n' +
		'#\n' +
		'# levelspacing: 100\n' +
		'#\n' +
		'## Spacing between parallel edges. Default is 40. Use 0 to disable.\n' +
		'#\n' +
		'# edgespacing: 40\n' +
		'#\n' +
		'## Name or JSON of layout. Possible values are auto, none, verticaltree, horizontaltree,\n' +
		'## verticalflow, horizontalflow, organic, circle or a JSON string as used in Layout, Apply.\n' +
		'## Default is auto.\n' +
		'#\n' +
		'# layout: auto\n' +
		'#\n' +
		'## ---- CSV below this line. First line are column names. ----\n' +
		'name,position,id,location,manager,email,fill,stroke,refs,url,image\n' +
		'Tessa Miller,CFO,emi,Office 1,,me@example.com,#dae8fc,#6c8ebf,,https://www.draw.io,https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-3-128.png\n' +
		'Edward Morrison,Brand Manager,emo,Office 2,Tessa Miller,me@example.com,#d5e8d4,#82b366,,https://www.draw.io,https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-10-3-128.png\n' +
		'Alison Donovan,System Admin,rdo,Office 3,Tessa Miller,me@example.com,#d5e8d4,#82b366,"emo,tva",https://www.draw.io,https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-2-128.png\n' +
		'Evan Valet,HR Director,tva,Office 4,Tessa Miller,me@example.com,#d5e8d4,#82b366,,https://www.draw.io,https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-9-2-128.png\n';

	/**
	 * Compresses the given string.
	 */
	Editor.createRoughCanvas = function(c)
	{
		var rc = rough.canvas(
		{
			// Provides expected function but return value is not used
			getContext: function()
			{
				return c;
			}
		});
		
		rc.draw = function(drawable)
		{
			var sets = drawable.sets || [];
			var o = drawable.options || this.getDefaultOptions();

			for (var i = 0; i < sets.length; i++)
			{
				var drawing = sets[i];
				
				switch (drawing.type)
				{
					case 'path':
						if (o.stroke != null)
						{
							this._drawToContext(c, drawing, o);
						}
						break;
					case 'fillPath':
						this._drawToContext(c, drawing, o);
						break;
					case 'fillSketch':
						this.fillSketch(c, drawing, o);
						break;
				}
			}
		};
	
		rc.fillSketch = function(ctx, drawing, o)
		{
			var strokeColor = c.state.strokeColor;
			var strokeWidth = c.state.strokeWidth;
			var strokeAlpha = c.state.strokeAlpha;
			var dashed = c.state.dashed;
			
			var fweight = o.fillWeight;
			if (fweight < 0)
			{
				fweight = o.strokeWidth / 2;
			}

			c.setStrokeAlpha(c.state.fillAlpha);
			c.setStrokeColor(o.fill || '');
			c.setStrokeWidth(fweight);
			c.setDashed(false);
			
			this._drawToContext(ctx, drawing, o);
			
			c.setDashed(dashed);
			c.setStrokeWidth(strokeWidth);
			c.setStrokeColor(strokeColor);
			c.setStrokeAlpha(strokeAlpha);
		};
	
		rc._drawToContext = function(ctx, drawing, o)
		{
			ctx.begin();
			
			for (var i = 0; i < drawing.ops.length; i++)
			{
				var item = drawing.ops[i];
				var data = item.data;
				
				switch (item.op)
				{
					case 'move':
						ctx.moveTo(data[0], data[1]);
						break;
					case 'bcurveTo':
						ctx.curveTo(data[0], data[1], data[2], data[3], data[4], data[5]);
						break;
					case 'lineTo':
						ctx.lineTo(data[0], data[1]);
						break;
				}
			};
	
			ctx.end();
	
			if (drawing.type === 'fillPath' && o.filled)
			{
				ctx.fill();
			}
			else
			{
				ctx.stroke();
			}
		};
	
		return rc;
	};
	
	/**
	 * Uses RoughJs for drawing comic shapes.
	 */
	(function()
	{	
		/**
		 * Adds handJiggle style (jiggle=n sets jiggle)
		 */
		function RoughCanvas(canvas, rc, shape)
		{
			this.canvas = canvas;
			this.rc = rc;
			this.shape = shape;
			
			// Avoids "spikes" in the output
			this.canvas.setLineJoin('round');
			this.canvas.setLineCap('round');
			
			this.originalBegin = this.canvas.begin;
			this.canvas.begin = mxUtils.bind(this, RoughCanvas.prototype.begin);
			
			this.originalEnd = this.canvas.end;
			this.canvas.end = mxUtils.bind(this, RoughCanvas.prototype.end);
					
			this.originalRect = this.canvas.rect;
			this.canvas.rect = mxUtils.bind(this, RoughCanvas.prototype.rect);
	
			this.originalRoundrect = this.canvas.roundrect;
			this.canvas.roundrect = mxUtils.bind(this, RoughCanvas.prototype.roundrect);
			
			this.originalEllipse = this.canvas.ellipse;
			this.canvas.ellipse = mxUtils.bind(this, RoughCanvas.prototype.ellipse);
			
			this.originalLineTo = this.canvas.lineTo;
			this.canvas.lineTo = mxUtils.bind(this, RoughCanvas.prototype.lineTo);
			
			this.originalMoveTo = this.canvas.moveTo;
			this.canvas.moveTo = mxUtils.bind(this, RoughCanvas.prototype.moveTo);
			
			this.originalQuadTo = this.canvas.quadTo;
			this.canvas.quadTo = mxUtils.bind(this, RoughCanvas.prototype.quadTo);
			
			this.originalCurveTo = this.canvas.curveTo;
			this.canvas.curveTo = mxUtils.bind(this, RoughCanvas.prototype.curveTo);
			
			this.originalArcTo = this.canvas.arcTo;
			this.canvas.arcTo = mxUtils.bind(this, RoughCanvas.prototype.arcTo);
			
			this.originalClose = this.canvas.close;
			this.canvas.close = mxUtils.bind(this, RoughCanvas.prototype.close);
			
			this.originalFill = this.canvas.fill;
			this.canvas.fill = mxUtils.bind(this, RoughCanvas.prototype.fill);
			
			this.originalStroke = this.canvas.stroke;
			this.canvas.stroke = mxUtils.bind(this, RoughCanvas.prototype.stroke);
			
			this.originalFillAndStroke = this.canvas.fillAndStroke;
			this.canvas.fillAndStroke = mxUtils.bind(this, RoughCanvas.prototype.fillAndStroke);
			
			this.path = [];
			this.passThrough = false;
		};
	
		RoughCanvas.prototype.moveOp = 'M';
		RoughCanvas.prototype.lineOp = 'L';
		RoughCanvas.prototype.quadOp = 'Q';
		RoughCanvas.prototype.curveOp = 'C';
		RoughCanvas.prototype.closeOp = 'Z';
	
		RoughCanvas.prototype.getStyle = function(stroke, fill)
		{
			// Random seed created from cell ID
			var seed = 1;

			if (this.shape.state != null)
			{
				var str = this.shape.state.cell.id;
				
				if (str != null)
				{
					for (var i = 0; i < str.length; i++)
					{
				    	seed = ((seed << 5) - seed + str.charCodeAt(i)) << 0;
					}
				}
			}

			var style = {strokeWidth: this.canvas.state.strokeWidth, seed: seed, preserveVertices: true};
			var defs = this.rc.getDefaultOptions();
			
			if (stroke)
			{
				style.stroke = this.canvas.state.strokeColor === 'none' ? 'transparent' : this.canvas.state.strokeColor;
			}
			else
			{
				delete style.stroke;
			}
			
			var gradient = null;
			style.filled = fill;
			
			if (fill)
			{
				style.fill = this.canvas.state.fillColor === 'none' ? '' : this.canvas.state.fillColor;
				gradient = this.canvas.state.gradientColor === 'none' ? null : this.canvas.state.gradientColor;
			}
			else
			{
				style.fill = '';
			}
			
			// Applies cell style
			style['bowing'] = mxUtils.getValue(this.shape.style, 'bowing', defs['bowing']);
			style['hachureAngle'] = mxUtils.getValue(this.shape.style, 'hachureAngle', defs['hachureAngle']);
			style['curveFitting'] = mxUtils.getValue(this.shape.style, 'curveFitting', defs['curveFitting']);
			style['roughness'] = mxUtils.getValue(this.shape.style, 'jiggle', defs['roughness']);
			style['simplification'] = mxUtils.getValue(this.shape.style, 'simplification', defs['simplification']);
			style['disableMultiStroke'] = mxUtils.getValue(this.shape.style, 'disableMultiStroke', defs['disableMultiStroke']);
			style['disableMultiStrokeFill'] = mxUtils.getValue(this.shape.style, 'disableMultiStrokeFill', defs['disableMultiStrokeFill']);
		
			var hachureGap = mxUtils.getValue(this.shape.style, 'hachureGap', -1);
			style['hachureGap'] = (hachureGap == 'auto') ? -1 : hachureGap;
			style['dashGap'] = mxUtils.getValue(this.shape.style, 'dashGap', hachureGap);
			style['dashOffset'] = mxUtils.getValue(this.shape.style, 'dashOffset', hachureGap);
			style['zigzagOffset'] = mxUtils.getValue(this.shape.style, 'zigzagOffset', hachureGap);
			
			var fillWeight = mxUtils.getValue(this.shape.style, 'fillWeight', -1);
			style['fillWeight'] = (fillWeight == 'auto') ? -1 : fillWeight;
			
			var fillStyle = mxUtils.getValue(this.shape.style, 'fillStyle', 'auto');
			
			if (fillStyle == 'auto')
			{
				var bg = mxUtils.hex2rgb((this.shape.state != null) ?
					this.shape.state.view.graph.shapeBackgroundColor :
					(Editor.isDarkMode() ? Editor.darkColor : '#ffffff'));
				fillStyle = (style.fill != null && (gradient != null || (bg != null &&
					style.fill == bg))) ? 'solid' : defs['fillStyle'];
			}
			
			style['fillStyle'] = fillStyle;
			
			return style;
		};
		
		RoughCanvas.prototype.begin = function()
		{
			if (this.passThrough)
			{
				this.originalBegin.apply(this.canvas, arguments);
			}
			else
			{
				this.path = [];
			}
		};
		
		RoughCanvas.prototype.end = function()
		{
			if (this.passThrough)
			{
				this.originalEnd.apply(this.canvas, arguments);
			}
			else
			{
				// do nothing
			}
		};
		
		RoughCanvas.prototype.addOp = function()
		{
			if (this.path != null)
			{
				this.path.push(arguments[0]);
				
				if (arguments.length > 2)
				{
					var s = this.canvas.state;
		
					for (var i = 2; i < arguments.length; i += 2)
					{
						this.lastX = arguments[i - 1];
						this.lastY = arguments[i];
						
						this.path.push(this.canvas.format((this.lastX)));
						this.path.push(this.canvas.format((this.lastY)));
					}
				}
			}
		};
	
		RoughCanvas.prototype.lineTo = function(endX, endY)
		{
			if (this.passThrough)
			{
				this.originalLineTo.apply(this.canvas, arguments);
			}
			else
			{
				this.addOp(this.lineOp, endX, endY);
				this.lastX = endX;
				this.lastY = endY;
			}
		};
		
		RoughCanvas.prototype.moveTo = function(endX, endY)
		{
			if (this.passThrough)
			{
				this.originalMoveTo.apply(this.canvas, arguments);
			}
			else
			{
				this.addOp(this.moveOp, endX, endY);
				this.lastX = endX;
				this.lastY = endY;
				this.firstX = endX;
				this.firstY = endY;
			}
		};
		
		RoughCanvas.prototype.close = function()
		{
			if (this.passThrough)
			{
				this.originalClose.apply(this.canvas, arguments);
			}
			else
			{
				this.addOp(this.closeOp);
			}
		};
		
		RoughCanvas.prototype.quadTo = function(x1, y1, x2, y2)
		{
			if (this.passThrough)
			{
				this.originalQuadTo.apply(this.canvas, arguments);
			}
			else
			{
				this.addOp(this.quadOp, x1, y1, x2, y2);
				this.lastX = x2;
				this.lastY = y2;
			}
		};
		
		RoughCanvas.prototype.curveTo = function(x1, y1, x2, y2, x3, y3)
		{
			if (this.passThrough)
			{
				this.originalCurveTo.apply(this.canvas, arguments);
			}
			else
			{
				this.addOp(this.curveOp, x1, y1, x2, y2, x3, y3);
				this.lastX = x3;
				this.lastY = y3;
			}
		};
		
		RoughCanvas.prototype.arcTo = function(rx, ry, angle, largeArcFlag, sweepFlag, x, y)
		{
			if (this.passThrough)
			{
				this.originalArcTo.apply(this.canvas, arguments);
			}
			else
			{
				var curves = mxUtils.arcToCurves(this.lastX, this.lastY, rx, ry, angle, largeArcFlag, sweepFlag, x, y);
				
				if (curves != null)
				{
					for (var i = 0; i < curves.length; i += 6) 
					{
						this.curveTo(curves[i], curves[i + 1], curves[i + 2],
							curves[i + 3], curves[i + 4], curves[i + 5]);
					}
				}
				
				this.lastX = x;
				this.lastY = y;
			}
		};
			
		RoughCanvas.prototype.rect = function(x, y, w, h)
		{
			if (this.passThrough)
			{
				this.originalRect.apply(this.canvas, arguments);
			}
			else
			{
				this.path = [];
				this.nextShape = this.rc.generator.rectangle(x, y, w, h, this.getStyle(true, true));
			}
		};
	
		RoughCanvas.prototype.ellipse = function(x, y, w, h)
		{
			if (this.passThrough)
			{
				this.originalEllipse.apply(this.canvas, arguments);
			}
			else
			{
				this.path = [];
				this.nextShape = this.rc.generator.ellipse(x + w / 2, y + h / 2, w, h, this.getStyle(true, true));
			}
		};
			
		RoughCanvas.prototype.roundrect = function(x, y, w, h, dx, dy)
		{
			if (this.passThrough)
			{
				this.originalRoundrect.apply(this.canvas, arguments);
			}
			else
			{
				this.begin();
				this.moveTo(x + dx, y);
				this.lineTo(x + w - dx, y);
				this.quadTo(x + w, y, x + w, y + dy);
				this.lineTo(x + w, y + h - dy);
				this.quadTo(x + w, y + h, x + w - dx, y + h);
				this.lineTo(x + dx, y + h);
				this.quadTo(x, y + h, x, y + h - dy);
				this.lineTo(x, y + dy);
				this.quadTo(x, y, x + dx, y);
			}
		};
	
		RoughCanvas.prototype.drawPath = function(style)
		{
			if (this.path.length > 0)
			{
				this.passThrough = true;
				try
				{
					this.rc.path(this.path.join(' '), style);
				}
				catch (e)
				{
					// ignore
				}
				this.passThrough = false;
			}
			else if (this.nextShape != null)
			{
				for (var key in style)
				{
					this.nextShape.options[key] = style[key];
				}
				
				if (style['stroke'] == null)
				{
					delete this.nextShape.options['stroke'];
				}
				
				if (!style.filled)
				{
					delete this.nextShape.options['fill'];
				}
	
				this.passThrough = true;
				this.rc.draw(this.nextShape);
				this.passThrough = false;
			}	
		};
		
		RoughCanvas.prototype.stroke = function()
		{
			if (this.passThrough)
			{
				this.originalStroke.apply(this.canvas, arguments);
			}
			else
			{
				this.drawPath(this.getStyle(true, false));
			}
		};
		
		RoughCanvas.prototype.fill = function()
		{
			if (this.passThrough)
			{
				this.originalFill.apply(this.canvas, arguments);
			}
			else
			{
				this.drawPath(this.getStyle(false, true));
			}
		};
		
		RoughCanvas.prototype.fillAndStroke = function()
		{
			if (this.passThrough)
			{
				this.originalFillAndStroke.apply(this.canvas, arguments);
			}
			else
			{
				this.drawPath(this.getStyle(true, true));
			}
		};
		
		RoughCanvas.prototype.destroy = function()
		{
			 this.canvas.lineTo = this.originalLineTo;
			 this.canvas.moveTo = this.originalMoveTo;
			 this.canvas.close = this.originalClose;
			 this.canvas.quadTo = this.originalQuadTo;
			 this.canvas.curveTo = this.originalCurveTo;
			 this.canvas.arcTo = this.originalArcTo;
			 this.canvas.close = this.originalClose;
			 this.canvas.fill = this.originalFill;
			 this.canvas.stroke = this.originalStroke;
			 this.canvas.fillAndStroke = this.originalFillAndStroke;
			 this.canvas.begin = this.originalBegin;
			 this.canvas.end = this.originalEnd;
			 this.canvas.rect = this.originalRect;
			 this.canvas.ellipse = this.originalEllipse;
			 this.canvas.roundrect = this.originalRoundrect;
		};
				
		// Returns a new HandJiggle canvas
		mxShape.prototype.createRoughCanvas = function(c)
		{
			return new RoughCanvas(c, Editor.createRoughCanvas(c), this);	
		};
			
		// Overrides to include sketch style
		var shapeCreateHandJiggle = mxShape.prototype.createHandJiggle;
		mxShape.prototype.createHandJiggle = function(c)
		{
			if (!this.outline && this.style != null && mxUtils.getValue(this.style,
					'sketch', /*(urlParams['sketch'] != '1' && urlParams['rough'] == '1') ?
						'1' : */'0') != '0')
			{
				if (mxUtils.getValue(this.style, 'sketchStyle', 'rough') == 'comic')
				{
					return this.createComicCanvas(c);
				}
				else
				{
					return this.createRoughCanvas(c);	
				}
			}
			else
			{
				return shapeCreateHandJiggle.apply(this, arguments);
			}
		};
		
		// Overrides for event handling on transparent background for sketch style
		var shapePaint = mxShape.prototype.paint;
		mxShape.prototype.paint = function(c)
		{
			var addTolerance = c.addTolerance;
			var events = true;
			
			if (this.style != null)
			{
				events = mxUtils.getValue(this.style, mxConstants.STYLE_POINTER_EVENTS, '1') == '1';
			}
			
			if (c.handJiggle != null && c.handJiggle.constructor == RoughCanvas && !this.outline)
			{
				// Save needed for possible transforms applied during paint
				c.save();
				var fill = this.fill;
				var stroke = this.stroke;
				this.fill = null;
				this.stroke = null;
				
				var configurePointerEvents = this.configurePointerEvents;
				
				// Ignores color changes during paint
				var setStrokeColor = c.setStrokeColor;
				
				c.setStrokeColor = function()
				{
					// ignore
				};
		
				var setFillColor = c.setFillColor;
				
				c.setFillColor = function()
				{
					// ignore
				};
				
				// Adds stroke tolerance for plain rendering if filled
				if (!events && fill != null)
				{
					this.configurePointerEvents = function()
					{
						// ignore
					};
				}
				
				c.handJiggle.passThrough = true;

				shapePaint.apply(this, arguments);

				c.handJiggle.passThrough = false;
				c.setFillColor = setFillColor;
				c.setStrokeColor = setStrokeColor;
				this.configurePointerEvents = configurePointerEvents;
				this.stroke = stroke;
				this.fill = fill;
				c.restore();
				
				// Bypasses stroke tolerance for sketched rendering if filled
				if (events && fill != null)
				{
					c.addTolerance = function()
					{
						// ignore	
					};
				}
			}
			
			shapePaint.apply(this, arguments);
			c.addTolerance = addTolerance;
		};

		// Overrides glass effect to disable sketch style
		var shapePaintGlassEffect = mxShape.prototype.paintGlassEffect;
		mxShape.prototype.paintGlassEffect = function(c, x, y, w, h, arc)
		{
			if (c.handJiggle != null && c.handJiggle.constructor == RoughCanvas)
			{
				c.handJiggle.passThrough = true;
				shapePaintGlassEffect.apply(this, arguments);
				c.handJiggle.passThrough = false;
			}
			else
			{
				shapePaintGlassEffect.apply(this, arguments);
			}
		};
	})();

	/**
	 * Compresses the given string.
	 */
	Editor.fastCompress = function(data)
	{
		if (data == null || data.length == 0 || typeof(pako) === 'undefined')
		{
			return data;
		}
		else
		{
			return Graph.arrayBufferToString(pako.deflateRaw(data));
		}
	};

	/**
	 * Decompresses the given string.
	 */
	Editor.fastDecompress = function(data)
	{
	   	if (data == null || data.length == 0 || typeof(pako) === 'undefined')
		{
			return data;
		}
		else
		{
			return pako.inflateRaw(Graph.stringToArrayBuffer(atob(data)), {to: 'string'});
		}
	};

	/**
	 * Helper function to extract the graph model XML node.
	 */
	Editor.extractGraphModel = function(node, allowMxFile, checked)
	{
		if (node != null && typeof(pako) !== 'undefined')
		{
			var tmp = node.ownerDocument.getElementsByTagName('div');
			var divs = [];
			
			if (tmp != null && tmp.length > 0)
			{
				for (var i = 0; i < tmp.length; i++)
				{
					if (tmp[i].getAttribute('class') == 'mxgraph')
					{
						divs.push(tmp[i]);
						break;
					}	
				}
			}
			
			if (divs.length > 0)
			{
				var data = divs[0].getAttribute('data-mxgraph');

				if (data != null)
				{
					var config = JSON.parse(data);

					if (config != null && config.xml != null)
					{
						var doc2 = mxUtils.parseXml(config.xml);
						node = doc2.documentElement;
					}
				}
				else
				{
					var divs2 = divs[0].getElementsByTagName('div');
					
					if (divs2.length > 0)
					{
						var data = mxUtils.getTextContent(divs2[0]);
		        		data = Graph.decompress(data, null, checked);
		        		
		        		if (data.length > 0)
		        		{
		        			var doc2 = mxUtils.parseXml(data);
		        			node = doc2.documentElement;
		        		}
					}
				}
			}
		}
		
		if (node != null && node.nodeName == 'svg')
		{
			var tmp = node.getAttribute('content');
			
			if (tmp != null && tmp.charAt(0) != '<' && tmp.charAt(0) != '%')
			{
				tmp = unescape((window.atob) ? atob(tmp) : Base64.decode(cont, tmp));
			}
			
			if (tmp != null && tmp.charAt(0) == '%')
			{
				tmp = decodeURIComponent(tmp);
			}
			
			if (tmp != null && tmp.length > 0)
			{
				node = mxUtils.parseXml(tmp).documentElement;
			}
			else
			{
				throw {message: mxResources.get('notADiagramFile')};
			}
		}
		
		if (node != null && !allowMxFile)
		{
			var diagramNode = null;
			
			if (node.nodeName == 'diagram')
			{
				diagramNode = node;
			}
			else if (node.nodeName == 'mxfile')
			{
				var diagrams = node.getElementsByTagName('diagram');

				if (diagrams.length > 0)
				{
					diagramNode = diagrams[Math.max(0, Math.min(diagrams.length - 1, urlParams['page'] || 0))];
				}
			}
			
			if (diagramNode != null)
			{
				node = Editor.parseDiagramNode(diagramNode, checked);
			}
		}
		
		if (node != null && node.nodeName != 'mxGraphModel' && (!allowMxFile || node.nodeName != 'mxfile'))
		{
			node = null;
		}
		
		return node;
	};
	
	/**
	 * Extracts the XML from the compressed or non-compressed text chunk.
	 */
	Editor.parseDiagramNode = function(diagramNode, checked)
	{
		var text = mxUtils.trim(mxUtils.getTextContent(diagramNode));
		var node = null;
		
		if (text.length > 0)
		{
			var tmp = Graph.decompress(text, null, checked);
			
			if (tmp != null && tmp.length > 0)
			{
				node = mxUtils.parseXml(tmp).documentElement;
			}
		}
		else
		{
			var temp = mxUtils.getChildNodes(diagramNode);
			
			if (temp.length > 0)
			{
				// Creates new document for unique IDs within mxGraphModel
				var doc = mxUtils.createXmlDocument();
				doc.appendChild(doc.importNode(temp[0], true));
				node = doc.documentElement;
			}
		}
		
		return node;
	};
	
	/**
	 * Extracts the XML from the compressed or non-compressed text chunk.
	 */
	Editor.getDiagramNodeXml = function(diagramNode)
	{
		var text = mxUtils.getTextContent(diagramNode);
		var xml = null;
		
		if (text.length > 0)
		{
			xml = Graph.decompress(text);
		}
		else if (diagramNode.firstChild != null)
		{
			xml = mxUtils.getXml(diagramNode.firstChild);
		}
		
		return xml;
	};

	/**
	 * Static method for parsing PDF files.
	 */
	Editor.extractGraphModelFromPdf = function(base64)
	{
		base64 = base64.substring(base64.indexOf(',') + 1);

		// Workaround for invalid character error in Safari
		var f = (window.atob && !mxClient.IS_SF) ? atob(base64) : Base64.decode(base64, true);
		
		//The new format of embedding diagram XML as embedded file (attachment) is in PDF 1.7
		if (f.substring(0, 8) == '%PDF-1.7')
		{
			var blockStart = f.indexOf('EmbeddedFile'); 
			
			if (blockStart > -1)
			{
				var streamStart = f.indexOf('stream', blockStart) + 9; //the start of the stream [skipping header check]
				var fileInfo = f.substring(blockStart, streamStart);
				
				if (fileInfo.indexOf('application#2Fvnd.jgraph.mxfile') > 0)
				{
					var streamEnd = f.indexOf('endstream', streamStart - 1);
				
					return pako.inflateRaw(Graph.stringToArrayBuffer(f.substring(streamStart, streamEnd)), {to: 'string'});
				}
			}
			
			//Not found
			return null;
		}
		
		var check = '/Subject (%3Cmxfile';
		var result = null;
		var curline = '';
		var checked = 0;
		var pos = 0;
		var obj = [];
		var buf = null;
		var nr = null;
		
		while (pos < f.length)
		{
			var b = f.charCodeAt(pos);
			pos += 1;
			
			if (b != 10)
			{
				curline += String.fromCharCode(b);
			}
			
			if (b == check.charCodeAt(checked))
			{
				checked++;
			}
			else
			{
				checked = 0;
			}
			
			if (checked == check.length)
			{
				var end = f.indexOf('%3C%2Fmxfile%3E)', pos) + 15; //15 is the length of encoded </mxfile>
				pos -= 9; //9 is the length of encoded <mxfile
				
				// Default case is XML inlined in Subject metadata
				if (end > pos)
				{
					result = f.substring(pos, end);
					
					break;
				}
			}
			
			// Creates table for lookup if no inline data is found
			if (b == 10)
			{
				if (curline == 'endobj')
				{
					buf = null;
				}
				else if (curline.substring(curline.length - 3, curline.length) == 'obj' ||
					curline == 'xref' || curline == 'trailer')
				{
					buf = [];
					obj[curline.split(' ')[0]] = buf;
				}
				else if (buf != null)
				{
					buf.push(curline);
				}
				
				curline = '';
			}
		}
		
		// Extract XML via references
		if (result == null)
		{
			result = Editor.extractGraphModelFromXref(obj);
		}
		
		if (result != null)
		{
			result = decodeURIComponent(result.
					replace(/\\\(/g, "(").
					replace(/\\\)/g, ")"));
		}
		
		return result;
	};

	/**
	 * Static method for extracting Subject via references of the form
	 * 
	 * << /Size 33 /Root 20 0 R /Info 1 0 R and 1 0 obj << /Subject 22 0 R
	 * 
	 * Where Info is the metadata block and Subject is the data block.
	 */
	Editor.extractGraphModelFromXref = function(obj)
	{
		var trailer = obj['trailer'];
		var result = null;

		// Gets Info object
		if (trailer != null)
		{
			var arr = /.* \/Info (\d+) (\d+) R/g.exec(trailer.join('\n'));
			
			if (arr != null && arr.length > 0)
			{
				var info = obj[arr[1]];
				
				if (info != null)
				{
					arr = /.* \/Subject (\d+) (\d+) R/g.exec(info.join('\n'));
				
					if (arr != null && arr.length > 0)
					{
						var subj = obj[arr[1]];
						
						if (subj != null)
						{
							subj = subj.join('\n');
							result = subj.substring(1, subj.length - 1);
						}
					}
				}
			}
		}
		
		return result;
	};

	/**
	 * Extracts any parsers errors in the given XML.
	 */
	Editor.extractParserError = function(node, defaultCause)
	{
		var cause = null;
		var errors = (node != null) ? node.getElementsByTagName('parsererror') : null;
		
		if (errors != null && errors.length > 0)
		{
			cause = defaultCause || mxResources.get('invalidChars');
			var divs = errors[0].getElementsByTagName('div');
			
			if (divs.length > 0)
			{
				cause = mxUtils.getTextContent(divs[0]);
			}
		}
		
		return (cause != null) ? mxUtils.trim(cause) : cause;
	};
	
	/**
	 * Adds the given retry function to the given error.
	 */
	Editor.addRetryToError = function(err, retry)
	{
		if (err != null)
		{
			var e = (err.error != null) ? err.error : err;
			
			if (e.retry == null)
			{
				e.retry = retry;
			}
		}
	};
	
	/**
	 * Global configuration of the Editor
	 * see https://www.diagrams.net/doc/faq/configure-diagram-editor
	 * 
	 * For defaultVertexStyle, defaultEdgeStyle and defaultLibraries, this must be called before
	 * mxSettings.load via global config variable window.mxLoadSettings = false.
	 */
	Editor.configure = function(config, untrusted)
	{
		if (config != null)
		{
			Editor.config = config;
			Editor.configVersion = config.version;
			Menus.prototype.defaultFonts = config.defaultFonts || Menus.prototype.defaultFonts;
			ColorDialog.prototype.presetColors = config.presetColors || ColorDialog.prototype.presetColors;
			ColorDialog.prototype.defaultColors = config.defaultColors || ColorDialog.prototype.defaultColors;
			ColorDialog.prototype.colorNames = config.colorNames || ColorDialog.prototype.colorNames;
			StyleFormatPanel.prototype.defaultColorSchemes = config.defaultColorSchemes || StyleFormatPanel.prototype.defaultColorSchemes;
			Graph.prototype.defaultEdgeLength = config.defaultEdgeLength || Graph.prototype.defaultEdgeLength;
			DrawioFile.prototype.autosaveDelay = config.autosaveDelay || DrawioFile.prototype.autosaveDelay;
			
			if (config.templateFile != null)
			{
				EditorUi.templateFile = config.templateFile;
			}
			
			if (config.styles != null)
			{
				if (Array.isArray(config.styles))
				{
					Editor.styles = config.styles;
				}
				else
				{
					EditorUi.debug('Configuration Error: Array expected for styles');
				}
			}
			
			if (config.globalVars != null)
			{
				Editor.globalVars = config.globalVars;
			}

			if (config.compressXml != null)
			{
				Editor.compressXml = config.compressXml;
			}
			
			if (config.includeDiagram != null)
			{
				Editor.defaultIncludeDiagram = config.includeDiagram;
			}
			
			if (config.simpleLabels != null)
			{
				Editor.simpleLabels = config.simpleLabels;
			}

			if (config.oneDriveInlinePicker != null)
			{
				Editor.oneDriveInlinePicker = config.oneDriveInlinePicker;
			}

			if (config.darkColor != null)
			{
				Editor.darkColor = config.darkColor;
			}

			if (config.lightColor != null)
			{
				Editor.lightColor = config.lightColor;
			}

			if (config.settingsName != null)
			{
				Editor.configurationKey = '.' + config.settingsName + '-configuration';
				Editor.settingsKey = '.' + config.settingsName + '-config';
				mxSettings.key = Editor.settingsKey;
			}
			
			if (config.customFonts)
			{
				Menus.prototype.defaultFonts = config.customFonts.
					concat(Menus.prototype.defaultFonts);
			}
			
			if (config.customPresetColors)
			{
				ColorDialog.prototype.presetColors = config.customPresetColors.
					concat(ColorDialog.prototype.presetColors);
			}
			
			if (config.customColorSchemes != null)
			{
				StyleFormatPanel.prototype.defaultColorSchemes = config.customColorSchemes.
					concat(StyleFormatPanel.prototype.defaultColorSchemes);
			}
			
			// Custom CSS injected directly into the page
			if (config.css != null)
			{
				var s = document.createElement('style');
				s.setAttribute('type', 'text/css');
				s.appendChild(document.createTextNode(config.css));
				
				var t = document.getElementsByTagName('script')[0];
			  	t.parentNode.insertBefore(s, t);
			}
			
			// Configures the custom libraries
			if (config.libraries != null)
			{
				Sidebar.prototype.customEntries = config.libraries;
			}
			
			// Defines the enabled built-in libraries.
			if (config.enabledLibraries != null)
			{
				if (Array.isArray(config.enabledLibraries))
				{
					Sidebar.prototype.enabledLibraries = config.enabledLibraries;
				}
				else
				{
					EditorUi.debug('Configuration Error: Array expected for enabledLibraries');
				}
			}
			
			// Overrides default libraries
			if (config.defaultLibraries != null)
			{
				Sidebar.prototype.defaultEntries = config.defaultLibraries;
			}
			
			// Overrides default custom libraries
			if (config.defaultCustomLibraries != null)
			{
				Editor.defaultCustomLibraries = config.defaultCustomLibraries;
			}
			
			// Disables custom libraries
			if (config.enableCustomLibraries != null)
			{
				Editor.enableCustomLibraries = config.enableCustomLibraries;
			}
			
			// Overrides default vertex style
			if (config.defaultVertexStyle != null)
			{
				Graph.prototype.defaultVertexStyle = config.defaultVertexStyle;
			}

			// Overrides default edge style
			if (config.defaultEdgeStyle != null)
			{
				Graph.prototype.defaultEdgeStyle = config.defaultEdgeStyle;
			}

			// Overrides default page visible
			if (config.defaultPageVisible != null)
			{
				Graph.prototype.defaultPageVisible = config.defaultPageVisible;
			}

			// Overrides default grid enabled
			if (config.defaultGridEnabled != null)
			{
				Graph.prototype.defaultGridEnabled = config.defaultGridEnabled;
			}

			// Overrides mouse wheel function
			if (config.zoomWheel != null)
			{
				Graph.zoomWheel = config.zoomWheel;
			}

			// Overrides zoom factor
			if (config.zoomFactor != null)
			{
				var val = parseFloat(config.zoomFactor);
				
				if (!isNaN(val) && val > 1)
				{
					Graph.prototype.zoomFactor = val;
				}
				else
				{
					EditorUi.debug('Configuration Error: Float > 1 expected for zoomFactor');
				}
			}

			// Overrides grid steps
			if (config.gridSteps != null)
			{
				var val = parseInt(config.gridSteps);
				
				if (!isNaN(val) && val > 0)
				{
					mxGraphView.prototype.gridSteps = val;
				}
				else
				{
					EditorUi.debug('Configuration Error: Int > 0 expected for gridSteps');
				}
			}

			if (config.pageFormat != null)
			{
				var w = parseInt(config.pageFormat.width);
				var h = parseInt(config.pageFormat.height);

				if (!isNaN(w) && w > 0 && !isNaN(h) && h > 0)
				{
					mxGraph.prototype.defaultPageFormat = new mxRectangle(0, 0, w, h);
					mxGraph.prototype.pageFormat = mxGraph.prototype.defaultPageFormat;
				}
				else
				{
					EditorUi.debug('Configuration Error: {width: int, height: int} expected for pageFormat');
				}
			}
			
			if (config.thumbWidth)
			{
				Sidebar.prototype.thumbWidth = config.thumbWidth;
			}
			
			if (config.thumbHeight)
			{
				Sidebar.prototype.thumbHeight = config.thumbHeight;
			}
			
			if (config.emptyLibraryXml)
			{
				EditorUi.prototype.emptyLibraryXml = config.emptyLibraryXml;
			}

			if (config.emptyDiagramXml)
			{
				EditorUi.prototype.emptyDiagramXml = config.emptyDiagramXml;
			}
			
			if (config.sidebarWidth)
			{
				EditorUi.prototype.hsplitPosition = config.sidebarWidth;
			}
			
			if (config.sidebarTitles)
			{
				Sidebar.prototype.sidebarTitles = config.sidebarTitles;
			}
			
			if (config.sidebarTitleSize)
			{
				var val = parseInt(config.sidebarTitleSize);
				
				if (!isNaN(val) && val > 0)
				{
					Sidebar.prototype.sidebarTitleSize = val;
				}
				else
				{
					EditorUi.debug('Configuration Error: Int > 0 expected for sidebarTitleSize');
				}
			}
			
			if (config.fontCss)
			{
				if (typeof config.fontCss === 'string')
				{
					Editor.configureFontCss(config.fontCss);
				}
				else
				{
					EditorUi.debug('Configuration Error: String expected for fontCss');
				}
			}
			
			if (config.autosaveDelay != null)
			{
				var val = parseInt(config.autosaveDelay);
				
				if (!isNaN(val) && val > 0)
				{
					DrawioFile.prototype.autosaveDelay = val;
				}
				else
				{
					EditorUi.debug('Configuration Error: Int > 0 expected for autosaveDelay');
				}
			}
			
			if (config.plugins != null && !untrusted)
			{
				// Required for callback
				App.initPluginCallback();
				
				for (var i = 0; i < config.plugins.length; i++)
				{
					mxscript(config.plugins[i]);
				}
			}
			
			if(config.maxImageBytes != null) 
			{
				EditorUi.prototype.maxImageBytes = config.maxImageBytes;
			}
			
			if(config.maxImageSize != null) 
			{
				EditorUi.prototype.maxImageSize = config.maxImageSize;
			}
		}
	};

	/**
	 * Adds the global fontCss configuration.
	 */
	Editor.configureFontCss = function(fontCss)
	{
		if (fontCss != null)
		{
			Editor.prototype.fontCss = fontCss;
			var t = document.getElementsByTagName('script')[0];
			
			if (t != null && t.parentNode != null)
			{
				var s = document.createElement('style');
				s.setAttribute('type', 'text/css');
				s.appendChild(document.createTextNode(fontCss));
				t.parentNode.insertBefore(s, t);
				
				// Preloads fonts where supported
				var parts = fontCss.split('url(');
				
				for (var i = 1; i < parts.length; i++)
				{
				    var idx = parts[i].indexOf(')');
				    var url = Editor.trimCssUrl(parts[i].substring(0, idx));
				    
				    var l = document.createElement('link');
					l.setAttribute('rel', 'preload');
					l.setAttribute('href', url);
					l.setAttribute('as', 'font');
					l.setAttribute('crossorigin', '');
					
				  	t.parentNode.insertBefore(l, t);
				}
			}
		}
	};
			
	/**
	 * Strips leading and trailing quotes and spaces
	 */
    Editor.trimCssUrl = function(str)
    {
    	return str.replace(new RegExp("^[\\s\"']+", "g"), "").replace(new RegExp("[\\s\"']+$", "g"), "");
    }
    
    /**
     * Prefix for URLs that reference Google fonts.
     */
	Editor.GOOGLE_FONTS = 'https://fonts.googleapis.com/css?family=';
    
	/**
	 * Alphabet for global unique IDs.
	 */
	Editor.GUID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';

	/**
	 * Default length for global unique IDs.
	 */
	Editor.GUID_LENGTH = 20;
	
	/**
	 * Default length for global unique IDs.
	 */
	Editor.guid = function(length)
	{
		var len = (length != null) ? length : Editor.GUID_LENGTH;
		var rtn = [];
	  
		for (var i = 0; i < len; i++)
		{
			rtn.push(Editor.GUID_ALPHABET.charAt(Math.floor(Math.random() * Editor.GUID_ALPHABET.length)));
		}

		return rtn.join('');
	};

	/**
	 * General timeout is 25 seconds.
	 */
	Editor.prototype.timeout = 25000;
	
	/**
	 * Mathjax output ignores CSS transforms in Safari (lightbox and normal mode).
	 * Check the following test case on page 2 before enabling this in production:
	 * https://devhost.jgraph.com/git/drawio/etc/embed/sf-math-fo-clipping.html?dev=1
	 * UPDATE: Fixed via position:static CSS override in initMath.
	 */
	Editor.prototype.useForeignObjectForMath = true;

	/**
	 * Executes the first step for connecting to Google Drive.
	 */
	Editor.prototype.editButtonLink = (urlParams['edit'] != null) ? decodeURIComponent(urlParams['edit']) : null;

	/**
	 * Specifies if img.crossOrigin is supported. This is true for all browsers except IE10 and earlier.
	 */
	Editor.prototype.crossOriginImages = !mxClient.IS_IE;
	
	/**
	 * Adds support for old stylesheets and compressed files
	 */
	var editorSetGraphXml = Editor.prototype.setGraphXml;
	Editor.prototype.setGraphXml = function(node)
	{
		node = (node != null && node.nodeName != 'mxlibrary') ? this.extractGraphModel(node) : null;

		if (node != null)
		{
			// Checks input for parser errors
			var errs = node.getElementsByTagName('parsererror');
			
			if (errs != null && errs.length > 0)
			{
				var elt = errs[0];
				var divs = elt.getElementsByTagName('div');
				
				if (divs != null && divs.length > 0)
				{
					elt = divs[0];
				}
				
				throw {message: mxUtils.getTextContent(elt)};
			}
			else if (node.nodeName == 'mxGraphModel')
			{
				var style = node.getAttribute('style') || 'default-style2';
				
				// Decodes the style if required
				if (urlParams['embed'] != '1' && (style == null || style == ''))
				{
					var node2 = (this.graph.themes != null) ?
						this.graph.themes['default-old'] :
						mxUtils.load(STYLE_PATH + '/default-old.xml').getDocumentElement();
				    
				    if (node2 != null)
				    {
				    	var dec2 = new mxCodec(node2.ownerDocument);
				    	dec2.decode(node2, this.graph.getStylesheet());
				    }
				}
				else if (style != this.graph.currentStyle)
				{
				    var node2 = (this.graph.themes != null) ?
						this.graph.themes[style] :
						mxUtils.load(STYLE_PATH + '/' + style + '.xml').getDocumentElement()
				    
				    if (node2 != null)
				    {
				    	var dec2 = new mxCodec(node2.ownerDocument);
				    	dec2.decode(node2, this.graph.getStylesheet());
				    }
				}
	
				this.graph.currentStyle = style;
				this.graph.mathEnabled = (urlParams['math'] == '1' || node.getAttribute('math') == '1');
				
				var bgImg = node.getAttribute('backgroundImage');
				
				if (bgImg != null)
				{
					this.graph.setBackgroundImage(this.graph.parseBackgroundImage(bgImg));
				}
				else
				{
					this.graph.setBackgroundImage(null);
				}
				
				mxClient.NO_FO = ((this.graph.mathEnabled && !this.useForeignObjectForMath)) ?
					true : this.originalNoForeignObject;
				
				this.graph.useCssTransforms = !mxClient.NO_FO &&
					this.isChromelessView() &&
					this.graph.isCssTransformsSupported();
				this.graph.updateCssTransform();

				this.graph.setShadowVisible(node.getAttribute('shadow') == '1', false);
				
				var extFonts = node.getAttribute('extFonts');
				
				if (extFonts)
				{
					try
					{
						extFonts = extFonts.split('|').map(function(ef)
						{
							var parts = ef.split('^');
							return {name: parts[0], url: parts[1]};
						});
						
						for (var i = 0; i < extFonts.length; i++)
						{
							this.graph.addExtFont(extFonts[i].name, extFonts[i].url);
						}
					}
					catch(e)
					{
						console.log('ExtFonts format error: ' + e.message);
					}
				}
				else if (this.graph.extFonts != null && this.graph.extFonts.length > 0)
				{
					this.graph.extFonts = [];
				}
			}
	
			// Calls updateGraphComponents
			editorSetGraphXml.apply(this, arguments);
		}
		else
		{
			throw { 
			    message: mxResources.get('notADiagramFile') || 'Invalid data',
			    toString: function() { return this.message; }
			};
		}
	};

	/**
	 * Adds persistent style to file
	 */
	var editorGetGraphXml = Editor.prototype.getGraphXml;	
	Editor.prototype.getGraphXml = function(ignoreSelection, resolveReferences)
	{
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		var node = editorGetGraphXml.apply(this, arguments);
		
		// Adds the current style
		if (this.graph.currentStyle != null && this.graph.currentStyle != 'default-style2')
		{
			node.setAttribute('style', this.graph.currentStyle);
		}

		var bgImg = this.graph.getBackgroundImageObject(
			this.graph.backgroundImage,
			resolveReferences);
		
		// Adds the background image
		if (bgImg != null)
		{
			node.setAttribute('backgroundImage', JSON.stringify(bgImg));
		}
		
		node.setAttribute('math', (this.graph.mathEnabled) ? '1' : '0');
		node.setAttribute('shadow', (this.graph.shadowVisible) ? '1' : '0');
		
		if (this.graph.extFonts != null && this.graph.extFonts.length > 0)
		{
			var strExtFonts = this.graph.extFonts.map(function(ef)
			{
				return ef.name + '^' + ef.url;
			});
			
			node.setAttribute('extFonts', strExtFonts.join('|'));
		}
		
		return node;
	};
	
	/**
	 * Helper function to extract the graph model XML node.
	 */
	Editor.prototype.isDataSvg = function(svg)
	{
		try
		{
			var svgRoot = mxUtils.parseXml(svg).documentElement;
			var tmp = svgRoot.getAttribute('content');
			
			if (tmp != null)
			{
				if (tmp != null && tmp.charAt(0) != '<' && tmp.charAt(0) != '%')
				{
					tmp = unescape((window.atob) ? atob(tmp) : Base64.decode(cont, tmp));
				}
				
				if (tmp != null && tmp.charAt(0) == '%')
				{
					tmp = decodeURIComponent(tmp);
				}
				
				if (tmp != null && tmp.length > 0)
				{
					var node = mxUtils.parseXml(tmp).documentElement;
					
					return node.nodeName == 'mxfile' || node.nodeName == 'mxGraphModel';
				}
			}
		}
		catch (e)
		{
			// ignore
		}
		
		return false;
	};
	
	/**
	 * Helper function to extract the graph model XML node.
	 */
	Editor.prototype.extractGraphModel = function(node, allowMxFile, checked)
	{
		return Editor.extractGraphModel.apply(this, arguments);
	};
	
	/**
	 * Overrides reset graph.
	 */
	var editorResetGraph = Editor.prototype.resetGraph;	
	Editor.prototype.resetGraph = function()
	{
		this.graph.mathEnabled = (urlParams['math'] == '1');
		this.graph.view.x0 = null;
		this.graph.view.y0 = null;
		mxClient.NO_FO = ((this.graph.mathEnabled && !this.useForeignObjectForMath)) ?
			true : this.originalNoForeignObject;
		
		this.graph.useCssTransforms = !mxClient.NO_FO &&
			this.isChromelessView() &&
			this.graph.isCssTransformsSupported();
		this.graph.updateCssTransform();
		
		editorResetGraph.apply(this, arguments);
	};

	/**
	 * Math support.
	 */
	var editorUpdateGraphComponents = Editor.prototype.updateGraphComponents;
	Editor.prototype.updateGraphComponents = function()
	{
		editorUpdateGraphComponents.apply(this, arguments);
		mxClient.NO_FO = ((this.graph.mathEnabled && !this.useForeignObjectForMath) &&
			Editor.MathJaxRender != null) ? true : this.originalNoForeignObject;
		
		this.graph.useCssTransforms = !mxClient.NO_FO &&
			this.isChromelessView() &&
			this.graph.isCssTransformsSupported();
		this.graph.updateCssTransform();
	};
	
	/**
	 * Overrides relative position to fix clipping bug in Webkit.
	 */
	Editor.mathJaxWebkitCss = 'div.MathJax_SVG_Display { position: static; }\n' +
		'span.MathJax_SVG { position: static !important; }';
		
	/**
	 * Initializes math typesetting and loads respective code.
	 */
	Editor.initMath = function(src, config)
	{
		if (typeof(window.MathJax) === 'undefined')
		{
			src = ((src != null) ? src : DRAW_MATH_URL + '/MathJax.js') + '?config=TeX-MML-AM_' +
				((urlParams['math-output'] == 'html') ? 'HTMLorMML' : 'SVG') + '-full';
			Editor.mathJaxQueue = [];

			Editor.doMathJaxRender = function(container)
			{
				window.setTimeout(function()
				{
					if (container.style.visibility != 'hidden')
					{
						MathJax.Hub.Queue(['Typeset', MathJax.Hub, container]);
					}
				}, 0);
			};
			
			var font = (urlParams['math-font'] != null) ?
				decodeURIComponent(urlParams['math-font']) : 'TeX';
			
			config = (config != null) ? config :
			{
				'HTML-CSS': {
					availableFonts: [font],
					imageFont: null
				},
				SVG: {
					font: font,
					// Needed for client-side export to work
					useFontCache: false
				},
				// Ignores math in in-place editor
				tex2jax: {
					ignoreClass: 'mxCellEditor'
				},
				asciimath2jax: {
					ignoreClass: 'mxCellEditor'
				}
			};

			// Disables global typesetting and messages on startup, adds queue for
			// asynchronous rendering while MathJax is loading
			window.MathJax =
			{
				skipStartupTypeset: true,
				showMathMenu: false,
				messageStyle: 'none',
				AuthorInit: function ()
				{
					MathJax.Hub.Config(config);
					
					MathJax.Hub.Register.StartupHook('Begin', function()	
					{	
						for (var i = 0; i < Editor.mathJaxQueue.length; i++)	
						{	
							Editor.doMathJaxRender(Editor.mathJaxQueue[i]);	
						}	
					});
				}
			};

			// Adds global enqueue method for async rendering
			Editor.MathJaxRender = function(container)
			{
				// Initial rendering when MathJax finished loading
				if (typeof(MathJax) !== 'undefined' && typeof(MathJax.Hub) !== 'undefined')
				{
					Editor.doMathJaxRender(container);
				}
				else
				{
					Editor.mathJaxQueue.push(container);
				}
			};

			// Adds global clear queue method
			Editor.MathJaxClear = function()
			{
				Editor.mathJaxQueue = [];
			};
			
			// Updates math typesetting after changes
			var editorInit = Editor.prototype.init;
			
			Editor.prototype.init = function()
			{
				editorInit.apply(this, arguments);
				
				this.graph.addListener(mxEvent.SIZE, mxUtils.bind(this, function(sender, evt)
				{
					if (this.graph.container != null && this.graph.mathEnabled && !this.graph.blockMathRender)
					{
						Editor.MathJaxRender(this.graph.container);
					}
				}));
			};
			
			var tags = document.getElementsByTagName('script');
			
			if (tags != null && tags.length > 0)
			{
				var s = document.createElement('script');
				s.setAttribute('type', 'text/javascript');
				s.setAttribute('src', src);
				tags[0].parentNode.appendChild(s);
			}
			
			// Workaround for zoomed math clipping in Webkit
			try
			{
				if (mxClient.IS_GC || mxClient.IS_SF)
				{
					var style = document.createElement('style')
					style.type = 'text/css';
					style.innerHTML = Editor.mathJaxWebkitCss;
					document.getElementsByTagName('head')[0].appendChild(style);
				}
			}
			catch (e)
			{
				// ignore
			}
		}
	};

	/**
	 * Return array of string values, or NULL if CSV string not well formed.
	 */
	Editor.prototype.csvToArray = function(text)
	{
	    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
	    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
	    // Return NULL if input string is not well formed CSV string.
	    if (!re_valid.test(text)) return null;
	    var a = [];                     // Initialize array to receive values.
	    text.replace(re_value, // "Walk" the string using replace with callback.
	        function(m0, m1, m2, m3) {
	            // Remove backslash from \' in single quoted values.
	            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
	            // Remove backslash from \" in double quoted values.
	            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
	            else if (m3 !== undefined) a.push(m3);
	            return ''; // Return empty string.
	        });
	    // Handle special case of empty last value.
	    if (/,\s*$/.test(text)) a.push('');
	    return a;
	};

	/**
	 * Returns true if the given URL is known to have CORS headers and is
	 * allowed by CSP.
	 */
	Editor.prototype.isCorsEnabledForUrl = function(url)
	{
		// Disables proxy for desktop and chrome app as it is served locally
		if (mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
		{
			return true;
		}
		
		// Does not use proxy for same domain
		if (url.substring(0, window.location.origin.length) == window.location.origin)
		{
			return true;
		}

		// Blocked by CSP in production but allowed for hosted deployment
		if (urlParams['cors'] != null && this.corsRegExp == null)
		{
			this.corsRegExp = new RegExp(decodeURIComponent(urlParams['cors']));
		}
		
		// No access-control-allow-origin for some Iconfinder images, add this when fixed:
		// /^https?:\/\/[^\/]*\.iconfinder.com\//.test(url) ||
		return (this.corsRegExp != null && this.corsRegExp.test(url)) ||
			url.substring(0, 34) === 'https://raw.githubusercontent.com/';
	};
	
	
	/**
	 * Converts all images in the SVG output to data URIs for immediate rendering
	 */
	Editor.prototype.createImageUrlConverter = function()
	{
		var converter = new mxUrlConverter();
		converter.updateBaseUrl();

		// Extends convert to avoid CORS using an image proxy server where needed
		var convert = converter.convert;
		var self = this;
		
		converter.convert = function(src)
		{
			if (src != null)
			{
				var remote = src.substring(0, 7) == 'http://' || src.substring(0, 8) == 'https://';
				
				if (remote && !navigator.onLine)
				{
					src = Editor.svgBrokenImage.src;
				}
				else if (remote && src.substring(0, converter.baseUrl.length) != converter.baseUrl &&
						(!self.crossOriginImages || !self.isCorsEnabledForUrl(src)))
				{
					src = PROXY_URL + '?url=' + encodeURIComponent(src);
				}
				else if (src.substring(0, 19) != 'chrome-extension://' && !mxClient.IS_CHROMEAPP)
				{
					src = convert.apply(this, arguments);
				}
			}
			
			return src;
		};
		
		return converter;
	};

	/**
	 * 
	 */
	Editor.createSvgDataUri = function(svg)
	{
		return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
	};

	/**
	 * 
	 */
	Editor.prototype.convertImageToDataUri = function(url, callback)
	{
		try
		{
			var acceptResponse = true;
			
			var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
			{
				acceptResponse = false;
				callback(Editor.svgBrokenImage.src);
			}), this.timeout);
	
			if (/(\.svg)$/i.test(url))
			{
				mxUtils.get(url, mxUtils.bind(this, function(req)
				{
			    	window.clearTimeout(timeoutThread);
					
					if (acceptResponse)
					{
						callback(Editor.createSvgDataUri(req.getText()));
					}
				}),
				function()
				{
			    	window.clearTimeout(timeoutThread);
					
					if (acceptResponse)
					{
						callback(Editor.svgBrokenImage.src);
					}
				});
			}
			else
			{
			    var img = new Image();
			    
			    if (this.crossOriginImages)
		    	{
				    img.crossOrigin = 'anonymous';
			    }
			    
			    img.onload = function()
			    {
			    	window.clearTimeout(timeoutThread);
					
					if (acceptResponse)
					{
				        try
				        {
					        var canvas = document.createElement('canvas');
					        var ctx = canvas.getContext('2d');
					        canvas.height = img.height;
					        canvas.width = img.width;
					        ctx.drawImage(img, 0, 0);

				        	callback(canvas.toDataURL());
				        }
				        catch (e)
				        {
			        		callback(Editor.svgBrokenImage.src);
				        }
					}
			    };
			    
			    img.onerror = function()
			    {
			    	window.clearTimeout(timeoutThread);
					
					if (acceptResponse)
					{
						callback(Editor.svgBrokenImage.src);
					}
			    };
			    
			    img.src = url;
			}
		}
		catch (e)
		{
			callback(Editor.svgBrokenImage.src);
		}
	};
	
	
	/**
	 * Converts all images in the SVG output to data URIs for immediate rendering
	 */
	Editor.prototype.convertImages = function(svgRoot, callback, imageCache, converter)
	{
		// Converts images to data URLs for immediate painting
		if (converter == null)
		{
			converter = this.createImageUrlConverter();
		}
		
		// Barrier for asynchronous image loading
		var counter = 0;
		
		function inc()
		{
			counter++;
		};
		
		function dec()
		{
			counter--;
			
			if (counter == 0)
			{
				callback(svgRoot);
			}
		};

		var cache = imageCache || new Object();
		
		var convertImages = mxUtils.bind(this, function(tagName, srcAttr)
		{
			var images = svgRoot.getElementsByTagName(tagName);
			
			for (var i = 0; i < images.length; i++)
			{
				(mxUtils.bind(this, function(img)
				{
					try
					{
						if (img != null)
						{
							var src = converter.convert(img.getAttribute(srcAttr));
				        	
							// Data URIs are pass-through
							if (src != null && src.substring(0, 5) != 'data:')
							{
								var tmp = cache[src];
								
								if (tmp == null)
								{
									inc();
									
									this.convertImageToDataUri(src, function(uri)
									{
										if (uri != null)
										{
											cache[src] = uri;
											img.setAttribute(srcAttr, uri);
										}
										
										dec();
									});
								}
								else
								{
									img.setAttribute(srcAttr, tmp);
								}
							}
							else if (src != null)
							{
								img.setAttribute(srcAttr, src);
							}
						}
					}
					catch (e)
					{
						// ignore
					}
				}))(images[i]);
			}
		});
		
		// Converts all known image tags in output
		// LATER: Add support for images in CSS
		convertImages('image', 'xlink:href');
		convertImages('img', 'src');
		
		// All from cache or no images
		if (counter == 0)
		{
			callback(svgRoot);
		}
	};

	/**
	 * Base64 encodes the given string. This method seems to be more
	 * robust for encoding PNG from binary AJAX responses.
	 */
	Editor.base64Encode = function(str)
	{
	    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	    var out = "", i = 0, len = str.length, c1, c2, c3;
	    
	    while (i < len)
	    {
	        c1 = str.charCodeAt(i++) & 0xff;
	        
	        if (i == len)
	        {
	            out += CHARS.charAt(c1 >> 2);
	            out += CHARS.charAt((c1 & 0x3) << 4);
	            out += "==";
	            break;
	        }
	        
	        c2 = str.charCodeAt(i++);
	        
	        if (i == len)
	        {
	            out += CHARS.charAt(c1 >> 2);
	            out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
	            out += CHARS.charAt((c2 & 0xF) << 2);
	            out += "=";
	            break;
	        }
	        
	        c3 = str.charCodeAt(i++);
	        out += CHARS.charAt(c1 >> 2);
	        out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	        out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
	        out += CHARS.charAt(c3 & 0x3F);
	    }
	    
	    return out;
	};

	/**
	 * Checks if the client is authorized and calls the next step.
	 */
	Editor.prototype.loadUrl = function(url, success, error, forceBinary, retry, dataUriPrefix, noBinary, headers)
	{
		try
		{
			var binary = !noBinary && (forceBinary || /(\.png)($|\?)/i.test(url) ||
				/(\.jpe?g)($|\?)/i.test(url) || /(\.gif)($|\?)/i.test(url) ||
				/(\.pdf)($|\?)/i.test(url));
			retry = (retry != null) ? retry : true;
			
			var fn = mxUtils.bind(this, function()
			{
				mxUtils.get(url, mxUtils.bind(this, function(req)
				{
					if (req.getStatus() >= 200 && req.getStatus() <= 299)
					{
				    	if (success != null)
				    	{
					    	var data = req.getText();
					    	
				    		// Returns PNG as base64 encoded data URI
							if (binary)
							{
								// NOTE: This requires BinaryToArray VB script in the page
								if ((document.documentMode == 9 || document.documentMode == 10) &&
									typeof window.mxUtilsBinaryToArray !== 'undefined')
								{
									var bin = mxUtilsBinaryToArray(req.request.responseBody).toArray();
									var tmp = new Array(bin.length);
									
									for (var i = 0; i < bin.length; i++)
									{
										tmp[i] = String.fromCharCode(bin[i]);
									}
									
									data = tmp.join('');
								}
								
								// LATER: Could be JPG but modern browsers
								// ignore the mime type in the data URI
								dataUriPrefix = (dataUriPrefix != null) ? dataUriPrefix : 'data:image/png;base64,';
								data = dataUriPrefix + Editor.base64Encode(data);
							}
							
				    		success(data);
				    	}
					}
					else if (error != null)
			    	{
						if (req.getStatus() == 0)
						{
							// Handles CORS errors
							error({message: mxResources.get('accessDenied')}, req);
						}
						else
						{
							error({message: mxResources.get('error') + ' ' + req.getStatus()}, req);
						}
			    	}
				}), function(req)
				{
			    	if (error != null)
			    	{
			    		error({message: mxResources.get('error') + ' ' + req.getStatus()});
			    	}
				}, binary, this.timeout, function()
			    {
				    if (retry && error != null)
					{
						error({code: App.ERROR_TIMEOUT, retry: fn});
					}
			    }, headers);
			});
			
			fn();
		}
		catch (e)
		{
			if (error != null)
			{
				error(e);
			}
		}
	};

	/**
	 * Makes all relative font URLs absolute in the given font CSS.
	 */
    Editor.prototype.absoluteCssFonts = function(fontCss)
    {
    	var result = null;
    	
    	if (fontCss != null)
    	{
    		var parts = fontCss.split('url(');
    		
    		if (parts.length > 0)
    		{
    			result = [parts[0]];
    		
    			// Gets path for URL
    			var path = window.location.pathname;
    			var idx = (path != null) ? path.lastIndexOf('/') : -1;
    			
    			if (idx >= 0)
    			{
    				path = path.substring(0, idx + 1);
    			}
    			
    			// Gets base tag from head
    			var temp = document.getElementsByTagName('base');
    			var base = null;
    			
    			if (temp != null && temp.length > 0)
    			{
    				base = temp[0].getAttribute('href');
    			}
    		
    			for (var i = 1; i < parts.length; i++)
    			{
    				var idx = parts[i].indexOf(')');
    				
    				if (idx > 0)
    				{
	    				var url = Editor.trimCssUrl(parts[i].substring(0, idx));
	    				
	    				if (this.graph.isRelativeUrl(url))
	    				{
	                        url = (base != null) ? base + url : (window.location.protocol + '//' + window.location.hostname +
	                        	((url.charAt(0) == '/') ? '' : path) + url);
	                    }
	    				
	    				result.push('url("' + url + '"' + parts[i].substring(idx));
    				}
    				else
    				{
    					result.push(parts[i]);
    				}
    			}
    		}
    		else
    		{
    			result = [fontCss]
    		}
    	}
    	
    	return (result != null) ? result.join('') : null;
	};
	
	/**
	 * For the fonts in CSS to be applied when rendering images on canvas, the actual
	 * font data must be made available via a data URI encoding of the file.
	 */
    Editor.prototype.embedCssFonts = function(fontCss, then)
    {
        var parts = fontCss.split('url(');
        var waiting = 0;
        
        if (this.cachedFonts == null) 
        {
        	this.cachedFonts = {};
        }

        var finish = mxUtils.bind(this, function()
        {
            if (waiting == 0)
            {
                // Constructs string
                var result = [parts[0]];
                
                for (var j = 1; j < parts.length; j++)
                {
                    var idx = parts[j].indexOf(')');
                    result.push('url("');
                    result.push(this.cachedFonts[Editor.trimCssUrl(parts[j].substring(0, idx))]);
                    result.push('"' + parts[j].substring(idx));
                }
                
                then(result.join(''));
            }
        });
        
        if (parts.length > 0)
        {
            for (var i = 1; i < parts.length; i++)
            {
                var idx = parts[i].indexOf(')');
                var format = null;
                
                // Checks if there is a format directive
                var fmtIdx = parts[i].indexOf('format(', idx);
                
                if (fmtIdx > 0)
                {
                    format = Editor.trimCssUrl(parts[i].substring(fmtIdx + 7, parts[i].indexOf(')', fmtIdx)));
                }

                (mxUtils.bind(this, function(url)
                {
                    if (this.cachedFonts[url] == null)
                    {
                        // Mark font as being fetched and fetch it
                    	this.cachedFonts[url] = url;
                        waiting++;
                        
                        var mime = 'application/x-font-ttf';
                        
                        // See https://stackoverflow.com/questions/2871655/proper-mime-type-for-fonts
                        if (format == 'svg' || /(\.svg)($|\?)/i.test(url))
                        {
                            mime = 'image/svg+xml';
                        }
                        else if (format == 'otf' || format == 'embedded-opentype' || /(\.otf)($|\?)/i.test(url))
                        {
                            mime = 'application/x-font-opentype';
                        }
                        else if (format == 'woff' || /(\.woff)($|\?)/i.test(url))
                        {
                            mime = 'application/font-woff';
                        }
                        else if (format == 'woff2' || /(\.woff2)($|\?)/i.test(url))
                        {
                            mime = 'application/font-woff2';
                        }
                        else if (format == 'eot' || /(\.eot)($|\?)/i.test(url))
                        {
                            mime = 'application/vnd.ms-fontobject';
                        }
                        else if (format == 'sfnt' || /(\.sfnt)($|\?)/i.test(url))
                        {
                            mime = 'application/font-sfnt';
                        }
                        
                        var realUrl = url;
                        
                        if ((/^https?:\/\//.test(realUrl)) && !this.isCorsEnabledForUrl(realUrl))
                        {
                            realUrl = PROXY_URL + '?url=' + encodeURIComponent(url);
                        }

                        // LATER: Remove cache-control header
                        this.loadUrl(realUrl, mxUtils.bind(this, function(uri)
                        {
                        	this.cachedFonts[url] = uri;
                            waiting--;
                            finish();
                        }), mxUtils.bind(this, function(err)
                        {
                            // LATER: handle error
                            waiting--;
                            finish();
                        }), true, null, 'data:' + mime + ';charset=utf-8;base64,');
                    }
                }))(Editor.trimCssUrl(parts[i].substring(0, idx)), format);
            }
            
            //In case all fonts are cached
            finish();
        }
        else
    	{
        	//No font urls found
        	then(fontCss);
    	}
    };
	
	/**
	 * For the fontCSS to be applied when rendering images on canvas, the actual
	 * font data must be made available via a data URI encoding of the file.
	 */
    Editor.prototype.loadFonts = function(then)
    {
        if (this.fontCss != null && this.resolvedFontCss == null)
        {
        	this.embedCssFonts(this.fontCss, mxUtils.bind(this, function(resolvedFontCss)
			{
        		this.resolvedFontCss = resolvedFontCss;

				if (then != null)
				{
        			then();
				}
			}));
        }
        else if (then != null)
        {
            then();
        }
    };
    
    /**
     * Embeds external fonts
     */
    Editor.prototype.embedExtFonts = function(callback)
    {
    	var extFonts = this.graph.getCustomFonts();
    	
		if (extFonts.length > 0)
		{
			var styleCnt = '', waiting = 0;
			
			if (this.cachedGoogleFonts == null)
			{
				this.cachedGoogleFonts = {};
			}
			
			var googleCssDone = mxUtils.bind(this, function()
			{
				if (waiting == 0)
	            {
					this.embedCssFonts(styleCnt, callback);
	            }
			});
			
			for (var i = 0; i < extFonts.length; i++)
			{
				(mxUtils.bind(this, function(fontName, fontUrl)
				{
					if (Graph.isCssFontUrl(fontUrl))
					{
						if (this.cachedGoogleFonts[fontUrl] == null)
						{
							waiting++;
							
							this.loadUrl(fontUrl, mxUtils.bind(this, function(css)
		                    {
								this.cachedGoogleFonts[fontUrl] = css;
								styleCnt += css;
		                        waiting--;
		                        googleCssDone();
		                    }), mxUtils.bind(this, function(err)
		                    {
		                        // LATER: handle error
		                        waiting--;
		                        styleCnt += '@import url(' + fontUrl + ');';
		                        googleCssDone();
		                    }));
						}
						else
						{
							styleCnt += this.cachedGoogleFonts[fontUrl];
						}
					}
					else
					{
						styleCnt += '@font-face {' +
				            'font-family: "' + fontName + '";' + 
				            'src: url("' + fontUrl + '")}';
					}
				}))(extFonts[i].name, extFonts[i].url);
			}
			
			googleCssDone();
		}
		else
		{
			callback();
		}
    };
	
	/**
	 * Copies MathJax CSS into the SVG output.
	 */
	Editor.prototype.addMathCss = function(svgRoot)
	{
		var defs = svgRoot.getElementsByTagName('defs');
		
		if (defs != null && defs.length > 0)
		{
			var styles = document.getElementsByTagName('style');
			
			for (var i = 0; i < styles.length; i++)
			{
				// Ignores style elements with no MathJax CSS
				if (mxUtils.getTextContent(styles[i]).indexOf('MathJax') > 0)
				{
					defs[0].appendChild(styles[i].cloneNode(true));
				}
			}
		}
	};

	/**
	 * Adds the global fontCss configuration.
	 */
	Editor.prototype.addFontCss = function(svgRoot, fontCss)
	{
		fontCss = (fontCss != null) ? fontCss : this.absoluteCssFonts(this.fontCss);

		// Creates defs element if not available
		if (fontCss != null)
		{
			var defs = svgRoot.getElementsByTagName('defs');
			var svgDoc = svgRoot.ownerDocument;
			var defsElt = null;
			
			if (defs.length == 0)
			{
				defsElt = (svgDoc.createElementNS != null) ?
					svgDoc.createElementNS(mxConstants.NS_SVG, 'defs') :
					svgDoc.createElement('defs');
				
				if (svgRoot.firstChild != null)
				{
					svgRoot.insertBefore(defsElt, svgRoot.firstChild);
				}
				else
				{
					svgRoot.appendChild(defsElt);
				}
			}
			else
			{
				defsElt = defs[0];
			}

			var style = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'style') :
				svgDoc.createElement('style');
			style.setAttribute('type', 'text/css');
			mxUtils.setTextContent(style, fontCss);
			defsElt.appendChild(style);
		}
	};
	
	/**
	 * Disables client-side image export if math is enabled.
	 */
	Editor.prototype.isExportToCanvas = function()
	{
		return mxClient.IS_CHROMEAPP || this.useCanvasForExport;
	};

	/**
	 * Returns the maximum possible scale for the given canvas dimension and scale.
	 * This will return the given scale or the maximum scale that can be used to
	 * generate a valid image in the current browser.
	 * 
	 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas
	 */
	Editor.prototype.getMaxCanvasScale = function(w, h, scale)
	{
		var max = (mxClient.IS_FF) ? 8192 : 16384;

		return Math.min(scale, Math.min(max / w, max / h));
	};
	
	/**
	 *
	 */
	Editor.prototype.exportToCanvas = function(callback, width, imageCache, background, error, limitHeight,
		ignoreSelection, scale, transparentBackground, addShadow, converter, graph, border, noCrop, grid,
		keepTheme, exportType, cells)
	{
		try
		{
			limitHeight = (limitHeight != null) ? limitHeight : true;
			ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
			graph = (graph != null) ? graph : this.graph;
			border = (border != null) ? border : 0;
			
			var bg = (transparentBackground) ? null : graph.background;
			
			if (bg == mxConstants.NONE)
			{
				bg = null;
			}
			
			if (bg == null)
			{
				bg = background;
			}
			
			// Handles special case where background is null but transparent is false
			if (bg == null && transparentBackground == false)
			{
				bg = (keepTheme) ? this.graph.defaultPageBackgroundColor : '#ffffff';
			}
			
			this.convertImages(graph.getSvg(null, null, border, noCrop, null, ignoreSelection,
				null, null, null, addShadow, null, keepTheme, exportType, cells),
				mxUtils.bind(this, function(svgRoot)
			{
				try
				{
					var img = new Image();
					
					img.onload = mxUtils.bind(this, function()
					{
				   		try
				   		{
				   			var canvas = document.createElement('canvas');
							var w = parseInt(svgRoot.getAttribute('width'));
							var h = parseInt(svgRoot.getAttribute('height'));
							scale = (scale != null) ? scale : 1;
							
							if (width != null)
							{
								scale = (!limitHeight) ? width / w : Math.min(1, Math.min((width * 3) / (h * 4), width / w));
							}
							
							scale = this.getMaxCanvasScale(w, h, scale);
							w = Math.ceil(scale * w);
							h = Math.ceil(scale * h);
							
							canvas.setAttribute('width', w);
					   		canvas.setAttribute('height', h);
					   		var ctx = canvas.getContext('2d');
					   		
					   		if (bg != null)
					   		{
					   			ctx.beginPath();
								ctx.rect(0, 0, w, h);
								ctx.fillStyle = bg;
								ctx.fill();
					   		}
		
					   		if (scale != 1)
					   		{
					   			ctx.scale(scale, scale);
					   		}
	
						    function drawImage()
						    {
						    	// Workaround for broken data URI images in Safari on first export
						   		if (mxClient.IS_SF)
						   		{			   		
									window.setTimeout(function()
									{
										ctx.drawImage(img, 0, 0);
										callback(canvas, svgRoot);
									}, 0);
						   		}
						   		else
						   		{
						   			ctx.drawImage(img, 0, 0);
						   			callback(canvas, svgRoot);
						   		}
						    };
						    
						    if (grid)
						    {
							    var view = graph.view;
							    var curViewScale = view.scale;
							    view.scale = 1; //Reset the scale temporary to generate unscaled grid image which is then scaled
								var gridImage = btoa(unescape(encodeURIComponent(view.createSvgGrid(view.gridColor))));
								view.scale = curViewScale;
								gridImage = 'data:image/svg+xml;base64,' + gridImage;
				                var phase = graph.gridSize * view.gridSteps * scale;
				                
				                var b = graph.getGraphBounds();
								var tx = view.translate.x * curViewScale;
								var ty = view.translate.y * curViewScale;
								var x0 = tx + (b.x - tx) / curViewScale - border;
								var y0 = ty + (b.y - ty) / curViewScale - border;
								
								var background = new Image();
		
								background.onload = function()
								{
									try
									{
										var x = -Math.round(phase - mxUtils.mod((tx - x0) * scale, phase));
										var y = -Math.round(phase - mxUtils.mod((ty - y0) * scale, phase));
			
										for (var i = x; i < w; i += phase)
										{
											for (var j = y; j < h; j += phase)
											{
												ctx.drawImage(background, i / scale, j / scale);	
											}
										}
									
										drawImage();
									}
							   		catch (e)
							   		{
							   			if (error != null)
										{
											error(e);
										}
							   		}
								};
								
								background.onerror = function(e)
								{
									if (error != null)
									{
										error(e);
									}
								};
								
								background.src = gridImage;
						    }
						    else
					    	{
						    	drawImage();
					    	}
				   		}
				   		catch (e)
				   		{
				   			if (error != null)
							{
								error(e);
							}
				   		}
					});
					
					img.onerror = function(e)
					{
						//console.log('img', e, img.src);
						
						if (error != null)
						{
							error(e);
						}
					};

					if (addShadow)
					{
						this.graph.addSvgShadow(svgRoot);
					}
					
					if (this.graph.mathEnabled)
					{
						this.addMathCss(svgRoot);
					}
					
					var done = mxUtils.bind(this, function()
					{
						try
						{
							if (this.resolvedFontCss != null)
							{
								this.addFontCss(svgRoot, this.resolvedFontCss);
							}
							
							img.src = Editor.createSvgDataUri(mxUtils.getXml(svgRoot));
						}
						catch (e)
						{
							if (error != null)
							{
								error(e);
							}
						}
					});
					
					this.embedExtFonts(mxUtils.bind(this, function(extFontsEmbeddedCss)
					{
						try
						{
							if (extFontsEmbeddedCss != null)
							{
								this.addFontCss(svgRoot, extFontsEmbeddedCss);
							}
							
							this.loadFonts(done);
						}
						catch (e)
						{
							if (error != null)
							{
								error(e);
							}
						}
					}));
				}
				catch (e)
				{
					//console.log('src', e, img.src);
					
					if (error != null)
					{
						error(e);
					}
				}
			}), imageCache, converter);
		}
		catch (e)
		{
			if (error != null)
			{
				error(e);
			}
		}
	};
	
	Editor.crcTable = [];
	
	for (var n = 0; n < 256; n++)
	{
		var c = n;
		
		for (var k = 0; k < 8; k++)
		{
			if ((c & 1) == 1)
			{
				c = 0xedb88320 ^ (c >>> 1);
			}
			else
			{
				c >>>= 1;
			}

			Editor.crcTable[n] = c;
		}
	}
	
	Editor.updateCRC = function(crc, data, off, len)
	{
		var c = crc;
	
		for (var n = 0; n < len; n++)
		{
			c = Editor.crcTable[(c ^ data.charCodeAt(off + n)) & 0xff] ^ (c >>> 8);
		}
	
		return c;
	};

	Editor.crc32 = function(str)
	{
	    var crc = 0 ^ (-1);

	    for (var i = 0; i < str.length; i++ )
	    {
	        crc = (crc >>> 8) ^ Editor.crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
	    }

	    return (crc ^ (-1)) >>> 0;
	};

	/**
	 * Adds the given text to the compressed or non-compressed text chunk.
	 */
	Editor.writeGraphModelToPng = function(data, type, key, value, error)
	{
		var base64 = data.substring(data.indexOf(',') + 1);
		var f = (window.atob) ? atob(base64) : Base64.decode(base64, true);
		var pos = 0;
		
		function fread(d, count)
		{
			var start = pos;
			pos += count;
			
			return d.substring(start, pos);
		};
		
		// Reads unsigned long 32 bit big endian
		function _freadint(d)
		{
			var bytes = fread(d, 4);
			
			return bytes.charCodeAt(3) + (bytes.charCodeAt(2) << 8) +
				(bytes.charCodeAt(1) << 16) + (bytes.charCodeAt(0) << 24);
		};
		
		function writeInt(num)
		{
			return String.fromCharCode((num >> 24) & 0x000000ff, (num >> 16) & 0x000000ff,
				(num >> 8) & 0x000000ff, num & 0x000000ff);
		};
		
		// Checks signature
		if (fread(f,8) != String.fromCharCode(137) + 'PNG' + String.fromCharCode(13, 10, 26, 10))
		{
			if (error != null)
			{
				error();
			}
			
			return;
		}
		
		// Reads header chunk
		fread(f,4);
		
		if (fread(f,4) != 'IHDR')
		{
			if (error != null)
			{
				error();
			}
			
			return;
		}
		
		fread(f, 17);
		var result = f.substring(0, pos);
		
		do
		{
			var n = _freadint(f);
			var chunk = fread(f,4);
			
			if (chunk == 'IDAT')
			{
				result = f.substring(0, pos - 8);
				
				if (type == 'pHYs' && key == 'dpi')
				{
					var dpm = Math.round(value / 0.0254); //One inch is equal to exactly 0.0254 meters.
					var chunkData = writeInt(dpm) + writeInt(dpm) + String.fromCharCode(1);
				}
				else
				{
					var chunkData = key + String.fromCharCode(0) +
						((type == 'zTXt') ? String.fromCharCode(0) : '') + 
						value;
				}
				
				var crc = 0xffffffff;
				crc = Editor.updateCRC(crc, type, 0, 4);
				crc = Editor.updateCRC(crc, chunkData, 0, chunkData.length);
				
				result += writeInt(chunkData.length) + type + chunkData + writeInt(crc ^ 0xffffffff);
				result += f.substring(pos - 8, f.length);
				
				break;
			}
			
			result += f.substring(pos - 8, pos - 4 + n);
			fread(f,n);
			fread(f,4);
		}
		while (n);
		
		return 'data:image/png;base64,' + ((window.btoa) ? btoa(result) : Base64.encode(result, true));
	};

	/**
	 * Adds persistence for recent colors
	 */
	if (window.ColorDialog)
	{
		FilenameDialog.filenameHelpLink = 'https://www.diagrams.net/doc/faq/save-file-formats'; 
		
		var colorDialogAddRecentColor = ColorDialog.addRecentColor;
		
		ColorDialog.addRecentColor = function(color, max)
		{
			colorDialogAddRecentColor.apply(this, arguments);
			
			mxSettings.setRecentColors(ColorDialog.recentColors);
			mxSettings.save();
		};
		
		var colorDialogResetRecentColors = ColorDialog.resetRecentColors;
		
		ColorDialog.resetRecentColors = function()
		{
			colorDialogResetRecentColors.apply(this, arguments);
			
			mxSettings.setRecentColors(ColorDialog.recentColors);
			mxSettings.save();
		};
	}
	
	// Overrides ID for pages
	if (window.EditDataDialog)
	{
		EditDataDialog.getDisplayIdForCell = function(ui, cell)
		{
			var id = null;
			
			if (ui.editor.graph.getModel().getParent(cell) != null)
			{
				id = cell.getId();
			}
			else if (ui.currentPage != null)
			{
				id = ui.currentPage.getId();
			}
			
			return id;
		};
	}

	var AddCustomPropertyDialog = function(editorUi, callback)
	{
		var row, td;
		
		var table = document.createElement('table');
		var tbody = document.createElement('tbody');
		table.setAttribute('cellpadding', (mxClient.IS_SF) ? '0' : '2');
		
		row = document.createElement('tr');
		
		td = document.createElement('td');
		td.style.fontSize = '10pt';
		td.style.width = '100px';
		mxUtils.write(td, mxResources.get('name', null, 'Name') + ':');
		
		row.appendChild(td);
		
		var nameInput = document.createElement('input');
		nameInput.style.width = '180px';

		td = document.createElement('td');
		td.appendChild(nameInput);
		row.appendChild(td);
		
		tbody.appendChild(row);
			
		row = document.createElement('tr');
		
		td = document.createElement('td');
		td.style.fontSize = '10pt';
		mxUtils.write(td, mxResources.get('type', null, 'Type') + ':');
		
		row.appendChild(td);
		
		var typeSelect = document.createElement('select');
		typeSelect.style.width = '180px';

		var boolOption = document.createElement('option');
		boolOption.setAttribute('value', 'bool');
		mxUtils.write(boolOption, mxResources.get('bool', null, 'Boolean'));
		typeSelect.appendChild(boolOption);
		
		var clrOption = document.createElement('option');
		clrOption.setAttribute('value', 'color');
		mxUtils.write(clrOption, mxResources.get('color', null, 'Color'));
		typeSelect.appendChild(clrOption);
		
		var enumOption = document.createElement('option');
		enumOption.setAttribute('value', 'enum');
		mxUtils.write(enumOption, mxResources.get('enum', null, 'Enumeration'));
		typeSelect.appendChild(enumOption);

		var floatOption = document.createElement('option');
		floatOption.setAttribute('value', 'float');
		mxUtils.write(floatOption, mxResources.get('float', null, 'Float'));
		typeSelect.appendChild(floatOption);

		var intOption = document.createElement('option');
		intOption.setAttribute('value', 'int');
		mxUtils.write(intOption, mxResources.get('int', null, 'Int'));
		typeSelect.appendChild(intOption);
		
		var strOption = document.createElement('option');
		strOption.setAttribute('value', 'string');
		mxUtils.write(strOption, mxResources.get('string', null, 'String'));
		typeSelect.appendChild(strOption);

		td = document.createElement('td');
		td.appendChild(typeSelect);
		row.appendChild(td);
		
		tbody.appendChild(row);
		
		row = document.createElement('tr');

		td = document.createElement('td');
		td.style.fontSize = '10pt';
		mxUtils.write(td, mxResources.get('dispName', null, 'Display Name') + ':');
		
		row.appendChild(td);
		
		var dispNameInput = document.createElement('input');
		dispNameInput.style.width = '180px';

		td = document.createElement('td');
		td.appendChild(dispNameInput);
		row.appendChild(td);

		tbody.appendChild(row);

		var listRow = document.createElement('tr');

		td = document.createElement('td');
		td.style.fontSize = '10pt';
		mxUtils.write(td, mxResources.get('enumList', null, 'Enum List') + ' (csv):');
		
		listRow.appendChild(td);
		
		var enumListInput = document.createElement('input');
		enumListInput.style.width = '180px';

		td = document.createElement('td');
		td.appendChild(enumListInput);
		listRow.appendChild(td);

		listRow.style.display = 'none';
		tbody.appendChild(listRow);
		
		table.appendChild(tbody);
		
		function typeChanged()
		{
			if (typeSelect.value === 'enum')
			{
				listRow.style.display = '';
				this.container.parentNode.style.height = "150px";
				
			}
			else
			{
				listRow.style.display = 'none';
				this.container.parentNode.style.height = "130px";
			}
		};
		
		mxEvent.addListener(typeSelect, 'change', mxUtils.bind(this, typeChanged));

		row = document.createElement('tr');
		td = document.createElement('td');
		td.setAttribute('align', 'right');
		td.style.paddingTop = '22px';
		td.colSpan = 2;
		
		var addBtn = mxUtils.button(mxResources.get('add', null, 'Add'), mxUtils.bind(this, function()
		{
	    	var name = nameInput.value;

	    	if (name == "")
    		{
	    		nameInput.style.border = "1px solid red";
	    		return;
    		}
	    	
			var type = typeSelect.value;
	    	var dispName = dispNameInput.value;

	    	if (dispName == "")
    		{
	    		dispNameInput.style.border = "1px solid red";
	    		return;
    		}

	    	var enumList = enumListInput.value;
			
	    	if (enumList == "" && type == "enum")
    		{
	    		enumListInput.style.border = "1px solid red";
	    		return;
	    		
    		}
	    	
			if (enumList != null)
			{
				enumList = enumList.split(',');
				
				for (var i = 0; i < enumList.length; i++)
				{
					enumList[i] = enumList[i].trim();
				}
			}
			
			if (callback)
			{
				callback(editorUi, name, type, dispName, enumList);
				editorUi.hideDialog();
			}
		}));
		addBtn.className = 'geBtn gePrimaryBtn';
		
		var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
		{
			editorUi.hideDialog();
		});
		cancelBtn.className = 'geBtn';
		
		if (editorUi.editor.cancelFirst)
		{
			td.appendChild(cancelBtn);
			td.appendChild(addBtn);
		}
		else
		{
			td.appendChild(addBtn);
			td.appendChild(cancelBtn);
		}

		row.appendChild(td);
		tbody.appendChild(row);
		table.appendChild(tbody);
		this.container = table;
	};
	
	if (window.StyleFormatPanel != null)
	{
		var formatInit = Format.prototype.init;
		
		Format.prototype.init = function()
		{
			formatInit.apply(this, arguments);

			this.editorUi.editor.addListener('fileLoaded', this.update);
		};

		var formatRefresh = Format.prototype.refresh;
		
		Format.prototype.refresh = function()
		{
			if (this.editorUi.getCurrentFile() != null || urlParams['embed'] == '1' ||
				this.editorUi.editor.chromeless)
			{
				formatRefresh.apply(this, arguments);
			}
			else
			{
				this.clear();
			}
		};

		/**
		 * Hook for subclassers.
		 */
		DiagramFormatPanel.prototype.isShadowOptionVisible = function()
		{
			var file = this.editorUi.getCurrentFile();
			
			return urlParams['embed'] == '1' || (file != null && file.isEditable());
		};

		/**
		 * Option is not visible in default theme.
		 */
	    DiagramFormatPanel.prototype.isMathOptionVisible = function(div)
	    {
	        return false;
	    };
	    
		/**
		 * Add global shadow option.
		 */
		var diagramFormatPanelAddView = DiagramFormatPanel.prototype.addView;

		DiagramFormatPanel.prototype.addView = function(div)
		{
			var div = diagramFormatPanelAddView.apply(this, arguments);
			var file = this.editorUi.getCurrentFile();
			
			if (mxClient.IS_SVG && this.isShadowOptionVisible())
			{
				var ui = this.editorUi;
				var editor = ui.editor;
				var graph = editor.graph;
				
				var option = this.createOption(mxResources.get('shadow'), function()
				{
					return graph.shadowVisible;
				}, function(checked)
				{
					var change = new ChangePageSetup(ui);
					change.ignoreColor = true;
					change.ignoreImage = true;
					change.shadowVisible = checked;
					
					graph.model.execute(change);
				},
				{
					install: function(apply)
					{
						this.listener = function()
						{
							apply(graph.shadowVisible);
						};
						
						ui.addListener('shadowVisibleChanged', this.listener);
					},
					destroy: function()
					{
						ui.removeListener(this.listener);
					}
				});
				
				if (!Editor.enableShadowOption)
				{
					option.getElementsByTagName('input')[0].setAttribute('disabled', 'disabled');
					mxUtils.setOpacity(option, 60);
				}
				
				div.appendChild(option);
			}
			
			return div;
		};

		/**
		 * Adds autosave and math typesetting options.
		 */
		var diagramFormatPanelAddOptions = DiagramFormatPanel.prototype.addOptions;
		DiagramFormatPanel.prototype.addOptions = function(div)
		{
			div = diagramFormatPanelAddOptions.apply(this, arguments);
			
			var ui = this.editorUi;
			var editor = ui.editor;
			var graph = editor.graph;
			
			if (graph.isEnabled())
			{
				var file = ui.getCurrentFile();

				if (file != null && file.isAutosaveOptional())
				{
					var opt = this.createOption(mxResources.get('autosave'), function()
					{
						return ui.editor.autosave;
					}, function(checked)
					{
						ui.editor.setAutosave(checked);
						
						if (ui.editor.autosave && file.isModified())
						{
							file.fileChanged();
						}
					},
					{
						install: function(apply)
						{
							this.listener = function()
							{
								apply(ui.editor.autosave);
							};
							
							ui.editor.addListener('autosaveChanged', this.listener);
						},
						destroy: function()
						{
							ui.editor.removeListener(this.listener);
						}
					});
					
					div.appendChild(opt);
				}
			}
			
	        if (this.isMathOptionVisible() && graph.isEnabled() && typeof(MathJax) !== 'undefined')
	        {
	            // Math
	            var option = this.createOption(mxResources.get('mathematicalTypesetting'), function()
	            {
	                return graph.mathEnabled;
	            }, function(checked)
	            {
	                ui.actions.get('mathematicalTypesetting').funct();
	            },
	            {
	                install: function(apply)
	                {
	                    this.listener = function()
	                    {
	                        apply(graph.mathEnabled);
	                    };
	                    
	                    ui.addListener('mathEnabledChanged', this.listener);
	                },
	                destroy: function()
	                {
	                    ui.removeListener(this.listener);
	                }
	            });
	            
	            option.style.paddingTop = '5px';
	            div.appendChild(option);
	            
	            var help = ui.menus.createHelpLink('https://www.diagrams.net/doc/faq/math-typesetting');
	            help.style.position = 'relative';
	            help.style.marginLeft = '6px';
	            help.style.top = '2px';
	            option.appendChild(help);
	        }
	        
			return div;
		};

		mxCellRenderer.prototype.defaultVertexShape.prototype.customProperties = [
	        {name: 'arcSize', dispName: 'Arc Size', type: 'float', min:0, defVal: mxConstants.LINE_ARCSIZE},
	        {name: 'absoluteArcSize', dispName: 'Abs. Arc Size', type: 'bool', defVal: false}
	      ];

		mxCellRenderer.defaultShapes['link'].prototype.customProperties = [
	        {name: 'width', dispName: 'Width', type: 'float', min:0, defVal: 4}
		];

		mxCellRenderer.defaultShapes['flexArrow'].prototype.customProperties = [
	        {name: 'width', dispName: 'Width', type: 'float', min:0, defVal: 10},
	        {name: 'startWidth', dispName: 'Start Width', type: 'float', min:0, defVal: 20},
	        {name: 'endWidth', dispName: 'End Width', type: 'float', min:0, defVal: 20}
		];

		mxCellRenderer.defaultShapes['process'].prototype.customProperties = [
			{name: 'size', dispName: 'Indent', type: 'float', min: 0, max: 0.5, defVal: 0.1}
		];

		mxCellRenderer.defaultShapes['rhombus'].prototype.customProperties = [
	        {name: 'arcSize', dispName: 'Arc Size', type: 'float', min:0, max: 50, defVal: mxConstants.LINE_ARCSIZE},
	        {name: 'double', dispName: 'Double', type: 'bool', defVal: false}
		];
		
		mxCellRenderer.defaultShapes['partialRectangle'].prototype.customProperties = [
	        {name: 'top', dispName: 'Top Line', type: 'bool', defVal: true},
	        {name: 'bottom', dispName: 'Bottom Line', type: 'bool', defVal: true},
	        {name: 'left', dispName: 'Left Line', type: 'bool', defVal: true},
	        {name: 'right', dispName: 'Right Line', type: 'bool', defVal: true}
        ];
		
		mxCellRenderer.defaultShapes['parallelogram'].prototype.customProperties = [
	        {name: 'arcSize', dispName: 'Arc Size', type: 'float', min:0, defVal: mxConstants.LINE_ARCSIZE},
	        {name: 'size', dispName: 'Slope Angle', type: 'float', min:0, max: 1, defVal: 0.2}
		];
		
		mxCellRenderer.defaultShapes['hexagon'].prototype.customProperties = [
	        {name: 'arcSize', dispName: 'Arc Size', type: 'float', min:0, defVal: mxConstants.LINE_ARCSIZE},
	        {name: 'size', dispName: 'Slope Angle', type: 'float', min:0, max: 1, defVal: 0.25}
		];
		
		mxCellRenderer.defaultShapes['triangle'].prototype.customProperties = [
	        {name: 'arcSize', dispName: 'Arc Size', type: 'float', min:0, defVal: mxConstants.LINE_ARCSIZE}
		];
		
		mxCellRenderer.defaultShapes['document'].prototype.customProperties = [
	        {name: 'size', dispName: 'Size', type: 'float', defVal: 0.3, min:0, max:1}
		];
		
		mxCellRenderer.defaultShapes['internalStorage'].prototype.customProperties = [
	        {name: 'arcSize', dispName: 'Arc Size', type: 'float', min:0, defVal: mxConstants.LINE_ARCSIZE},
	        {name: 'dx', dispName: 'Left Line', type: 'float', min:0, defVal: 20},
	        {name: 'dy', dispName: 'Top Line', type: 'float', min:0, defVal: 20}
		];
		
		mxCellRenderer.defaultShapes['cube'].prototype.customProperties = [
	        {name: 'size', dispName: 'Size', type: 'float', min:0, defVal:20 },
	        {name: 'darkOpacity', dispName: 'Dark Opacity', type: 'float', min:-1, max:1, defVal:0 },
	        {name: 'darkOpacity2', dispName: 'Dark Opacity 2', type: 'float', min:-1, max:1, defVal:0 }
		];
		
		mxCellRenderer.defaultShapes['step'].prototype.customProperties = [
	        {name: 'size', dispName: 'Notch Size', type: 'float', min:0, defVal:20},
	        {name: 'fixedSize', dispName: 'Fixed Size', type: 'bool', defVal:true}
		];
		
		mxCellRenderer.defaultShapes['trapezoid'].prototype.customProperties = [
	        {name: 'arcSize', dispName: 'Arc Size', type: 'float', min:0, defVal: mxConstants.LINE_ARCSIZE},
	        {name: 'size', dispName: 'Slope Angle', type: 'float', min:0, max: 1, defVal: 0.2}
		];
		
		mxCellRenderer.defaultShapes['tape'].prototype.customProperties = [
	        {name: 'size', dispName: 'Size', type: 'float', min:0, max:1, defVal:0.4 }
		];
		
		mxCellRenderer.defaultShapes['note'].prototype.customProperties = [
	        {name: 'size', dispName: 'Fold Size', type: 'float', min:0, defVal: 30},
	        {name: 'darkOpacity', dispName: 'Dark Opacity', type: 'float', min:-1, max:1, defVal:0 },
	    ];
		
		mxCellRenderer.defaultShapes['card'].prototype.customProperties = [
	        {name: 'arcSize', dispName: 'Arc Size', type: 'float', min:0, defVal: mxConstants.LINE_ARCSIZE},
	        {name: 'size', dispName: 'Cutoff Size', type: 'float', min:0, defVal: 30}
	    ];
		
		mxCellRenderer.defaultShapes['callout'].prototype.customProperties = [
	        {name: 'arcSize', dispName: 'Arc Size', type: 'float', min:0, defVal: mxConstants.LINE_ARCSIZE},
	        {name: 'base', dispName: 'Callout Width', type: 'float', min:0, defVal: 20},
	        {name: 'size', dispName: 'Callout Length', type: 'float', min:0, defVal: 30},
	        {name: 'position', dispName: 'Callout Position', type: 'float', min:0, max:1, defVal: 0.5},
	        {name: 'position2', dispName: 'Callout Tip Position', type: 'float', min:0, max:1, defVal: 0.5}
	    ];
		
		mxCellRenderer.defaultShapes['folder'].prototype.customProperties = [
	        {name: 'tabWidth', dispName: 'Tab Width', type: 'float'},
	        {name: 'tabHeight', dispName: 'Tab Height', type: 'float'},
	        {name: 'tabPosition', dispName: 'Tap Position', type: 'enum',
	        	enumList: [{val: 'left', dispName: 'Left'}, {val: 'right', dispName: 'Right'}]
	        }
	    ];
		
		mxCellRenderer.defaultShapes['swimlane'].prototype.customProperties = [
	        {name: 'arcSize', dispName: 'Arc Size', type: 'float', min:0, defVal: 15},
	        {name: 'startSize', dispName: 'Header Size', type: 'float'},
	        {name: 'horizontal', dispName: 'Horizontal', type: 'bool', defVal: true},
	        {name: 'separatorColor', dispName: 'Separator Color', type: 'color', defVal: null},
	    ];
		
		mxCellRenderer.defaultShapes['table'].prototype.customProperties = [
			{name: 'rowLines', dispName: 'Row Lines', type: 'bool', defVal: true},
			{name: 'columnLines', dispName: 'Column Lines', type: 'bool', defVal: true},
			{name: 'fixedRows', dispName: 'Fixed Rows', type: 'bool', defVal: false},
			{name: 'resizeLast', dispName: 'Resize Last Column', type: 'bool', defVal: false},
			{name: 'resizeLastRow', dispName: 'Resize Last Row', type: 'bool', defVal: false}].
			concat(mxCellRenderer.defaultShapes['swimlane'].prototype.customProperties);
		
		mxCellRenderer.defaultShapes['doubleEllipse'].prototype.customProperties = [
	        {name: 'margin', dispName: 'Indent', type: 'float', min:0, defVal:4}
	    ];
		
		mxCellRenderer.defaultShapes['ext'].prototype.customProperties = [
	        {name: 'arcSize', dispName: 'Arc Size', type: 'float', min:0, defVal: 15},
			{name: 'double', dispName: 'Double', type: 'bool', defVal: false},
	        {name: 'margin', dispName: 'Indent', type: 'float', min: 0, defVal:0}
	    ];
		
		mxCellRenderer.defaultShapes['curlyBracket'].prototype.customProperties = [
			{name: 'rounded', dispName: 'Rounded', type: 'bool', defVal: true},
	        {name: 'size', dispName: 'Size', type: 'float', min:0, max: 1, defVal: 0.5}
	    ];
		
		mxCellRenderer.defaultShapes['image'].prototype.customProperties = [
			{name: 'imageAspect', dispName: 'Fixed Image Aspect', type: 'bool', defVal:true}
	    ];
		
		mxCellRenderer.defaultShapes['label'].prototype.customProperties = [
			{name: 'imageAspect', dispName: 'Fixed Image Aspect', type: 'bool', defVal:true},
			{name: 'imageAlign', dispName: 'Image Align', type: 'enum',
				enumList: [{val: 'left', dispName: 'Left'}, 
						   {val: 'center', dispName: 'Center'}, 
						   {val: 'right', dispName: 'Right'}], defVal: 'left'},
			{name: 'imageVerticalAlign', dispName: 'Image Vertical Align', type: 'enum',
				enumList: [{val: 'top', dispName: 'Top'}, 
					       {val: 'middle', dispName: 'Middle'}, 
					       {val: 'bottom', dispName: 'Bottom'}], defVal: 'middle'},
	        {name: 'imageWidth', dispName: 'Image Width', type: 'float', min:0, defVal: 24},
	        {name: 'imageHeight', dispName: 'Image Height', type: 'float', min:0, defVal: 24},
	        {name: 'arcSize', dispName: 'Arc Size', type: 'float', min:0, defVal: 12},
	        {name: 'absoluteArcSize', dispName: 'Abs. Arc Size', type: 'bool', defVal: false}
	    ];
		
		mxCellRenderer.defaultShapes['dataStorage'].prototype.customProperties = [
	        {name: 'size', dispName: 'Size', type: 'float', min:0, max:1, defVal:0.1 }
		];
		
		mxCellRenderer.defaultShapes['manualInput'].prototype.customProperties = [
	        {name: 'size', dispName: 'Size', type: 'float', min:0, defVal:30 },
	        {name: 'arcSize', dispName: 'Arc Size', type: 'float', min:0, defVal: 20}
		];
		
		mxCellRenderer.defaultShapes['loopLimit'].prototype.customProperties = [
	        {name: 'size', dispName: 'Size', type: 'float', min:0, defVal:20 },
	        {name: 'arcSize', dispName: 'Arc Size', type: 'float', min:0, defVal: 20}
		];
		
		mxCellRenderer.defaultShapes['offPageConnector'].prototype.customProperties = [
	        {name: 'size', dispName: 'Size', type: 'float', min:0, defVal:38 },
	        {name: 'arcSize', dispName: 'Arc Size', type: 'float', min:0, defVal: 20}
		];
		
		mxCellRenderer.defaultShapes['display'].prototype.customProperties = [
	        {name: 'size', dispName: 'Size', type: 'float', min: 0, max: 1, defVal: 0.25 }
		];
		
		mxCellRenderer.defaultShapes['singleArrow'].prototype.customProperties = [
	        {name: 'arrowWidth', dispName: 'Arrow Width', type: 'float', min: 0, max: 1, defVal: 0.3 },
	        {name: 'arrowSize', dispName: 'Arrowhead Length', type: 'float', min: 0, max: 1, defVal: 0.2 }
		];
		
		mxCellRenderer.defaultShapes['doubleArrow'].prototype.customProperties = [
	        {name: 'arrowWidth', dispName: 'Arrow Width', type: 'float', min: 0, max: 1, defVal: 0.3 },
	        {name: 'arrowSize', dispName: 'Arrowhead Length', type: 'float', min: 0, max: 1, defVal: 0.2 }
		];
		
		mxCellRenderer.defaultShapes['cross'].prototype.customProperties = [
	        {name: 'size', dispName: 'Size', type: 'float', min: 0, max: 1, defVal: 0.2 }
		];
		
		mxCellRenderer.defaultShapes['corner'].prototype.customProperties = [
	        {name: 'dx', dispName: 'Width1', type: 'float', min: 0, defVal: 20 },
	        {name: 'dy', dispName: 'Width2', type: 'float', min: 0, defVal: 20 }
		];
		
		mxCellRenderer.defaultShapes['tee'].prototype.customProperties = [
	        {name: 'dx', dispName: 'Width1', type: 'float', min: 0, defVal: 20 },
	        {name: 'dy', dispName: 'Width2', type: 'float', min: 0, defVal: 20 }
		];
		
		mxCellRenderer.defaultShapes['umlLifeline'].prototype.customProperties = [
			{name: 'participant', dispName:'Participant', type:'enum', defVal:'none', enumList:[
				{val:'none', dispName: 'Default'},	
				{val:'umlActor', dispName: 'Actor'},	
				{val:'umlBoundary', dispName: 'Boundary'},	
				{val:'umlEntity', dispName: 'Entity'},	
				{val:'umlControl', dispName: 'Control'},	
				]},
			{name: 'size', dispName:'Height', type:'float', defVal:40, min:0}
		];
		
		mxCellRenderer.defaultShapes['umlFrame'].prototype.customProperties = [
			{name: 'width', dispName:'Title Width', type:'float', defVal:60, min:0},
			{name: 'height', dispName:'Title Height', type:'float', defVal:30, min:0}
		];
		
		/**
		 * Configures global color schemes.
		 */
		StyleFormatPanel.prototype.defaultColorSchemes = [[{fill: '', stroke: ''}, {fill: '#f5f5f5', stroke: '#666666', font: '#333333'},
			{fill: '#dae8fc', stroke: '#6c8ebf'}, {fill: '#d5e8d4', stroke: '#82b366'},
			{fill: '#ffe6cc', stroke: '#d79b00'}, {fill: '#fff2cc', stroke: '#d6b656'},
			{fill: '#f8cecc', stroke: '#b85450'}, {fill: '#e1d5e7', stroke: '#9673a6'}],
			[{fill: '', stroke: ''}, {fill: '#60a917', stroke: '#2D7600', font: '#ffffff'},
			{fill: '#008a00', stroke: '#005700', font: '#ffffff'}, {fill: '#1ba1e2', stroke: '#006EAF', font: '#ffffff'},
			{fill: '#0050ef', stroke: '#001DBC', font: '#ffffff'}, {fill: '#6a00ff', stroke: '#3700CC', font: '#ffffff'},
			//{fill: '#aa00ff', stroke: '#7700CC', font: '#ffffff'},
			{fill: '#d80073', stroke: '#A50040', font: '#ffffff'}, {fill: '#a20025', stroke: '#6F0000', font: '#ffffff'}],
			[{fill: '#e51400', stroke: '#B20000', font: '#ffffff'}, {fill: '#fa6800', stroke: '#C73500', font: '#000000'},
			{fill: '#f0a30a', stroke: '#BD7000', font: '#000000'}, {fill: '#e3c800', stroke: '#B09500', font: '#000000'},
			{fill: '#6d8764', stroke: '#3A5431', font: '#ffffff'}, {fill: '#647687', stroke: '#314354', font: '#ffffff'},
			{fill: '#76608a', stroke: '#432D57', font: '#ffffff'}, {fill: '#a0522d', stroke: '#6D1F00', font: '#ffffff'}],
			[{fill: '', stroke: ''}, {fill: mxConstants.NONE, stroke: ''},
			{fill: '#fad7ac', stroke: '#b46504'}, {fill: '#fad9d5', stroke: '#ae4132'},
			{fill: '#b0e3e6', stroke: '#0e8088'}, {fill: '#b1ddf0', stroke: '#10739e'},
			{fill: '#d0cee2', stroke: '#56517e'}, {fill: '#bac8d3', stroke: '#23445d'}],
		    [{fill: '', stroke: ''},
			{fill: '#f5f5f5', stroke: '#666666', gradient: '#b3b3b3'},
			{fill: '#dae8fc', stroke: '#6c8ebf', gradient: '#7ea6e0'},
			{fill: '#d5e8d4', stroke: '#82b366', gradient: '#97d077'},
			{fill: '#ffcd28', stroke: '#d79b00', gradient: '#ffa500'},
			{fill: '#fff2cc', stroke: '#d6b656', gradient: '#ffd966'},
			{fill: '#f8cecc', stroke: '#b85450', gradient: '#ea6b66'},
			{fill: '#e6d0de', stroke: '#996185', gradient: '#d5739d'}],
			[{fill: '', stroke: ''}, {fill: '#eeeeee', stroke: '#36393d'},
			{fill: '#f9f7ed', stroke: '#36393d'}, {fill: '#ffcc99', stroke: '#36393d'},
			{fill: '#cce5ff', stroke: '#36393d'}, {fill: '#ffff88', stroke: '#36393d'},
			{fill: '#cdeb8b', stroke: '#36393d'}, {fill: '#ffcccc', stroke: '#36393d'}]];
		
		/**
		 * Configures custom color schemes.
		 */
		StyleFormatPanel.prototype.customColorSchemes = null;

		StyleFormatPanel.prototype.findCommonProperties = function(cell, properties, addAll)
		{
			if (properties == null) return;
			
			var handleCustomProp = function(custProperties)
			{
				if (custProperties != null)
				{
					if (addAll)
					{
						for (var i = 0; i < custProperties.length; i++)
						{
							properties[custProperties[i].name] = custProperties[i];
						}
					}
					else
					{
						for (var key in properties)
						{
							var found = false;
							
							for (var i = 0; i < custProperties.length; i++)
							{
								if (custProperties[i].name == key && custProperties[i].type == properties[key].type)
								{
									found = true;
									break;
								}
							}
							
							if (!found)
							{
								delete properties[key];
							}
						}
					}
				}
			};
			
			var view = this.editorUi.editor.graph.view;
			var state = view.getState(cell);
			
			if (state != null && state.shape != null)
			{
				//Add common properties to all shapes
				if (!state.shape.commonCustomPropAdded)
				{
					state.shape.commonCustomPropAdded = true;
					state.shape.customProperties = state.shape.customProperties || [];
					
					if (state.cell.vertex)
					{
						Array.prototype.push.apply(state.shape.customProperties, Editor.commonVertexProperties);					
					}
					else
					{
						Array.prototype.push.apply(state.shape.customProperties, Editor.commonEdgeProperties);
					}
				}
				
				handleCustomProp(state.shape.customProperties);
			}
			
			//This currently is not needed but let's keep it in case we needed in the future
			var userCustomProp = cell.getAttribute('customProperties');
			
			if (userCustomProp != null)
			{
				try
				{
					handleCustomProp(JSON.parse(userCustomProp));
				}
				catch(e){}
			}
		};
		
		/**
		 * Adds predefiend styles.
		 */
		var styleFormatPanelInit = StyleFormatPanel.prototype.init;
		
		StyleFormatPanel.prototype.init = function()
		{
			var sstate = this.editorUi.getSelectionState();

			if (sstate.style.shape != 'image' && !sstate.containsLabel && sstate.cells.length > 0)
			{
				this.container.appendChild(this.addStyles(this.createPanel()));
			}
			
			styleFormatPanelInit.apply(this, arguments);

			if (Editor.enableCustomProperties)
			{
				var properties = {};
				var vertices = sstate.vertices;
				var edges = sstate.edges;
				
				for (var i = 0; i < vertices.length; i++) 
				{
					this.findCommonProperties(vertices[i], properties, i == 0);
				}
				
				for (var i = 0; i < edges.length; i++) 
				{
					this.findCommonProperties(edges[i], properties, vertices.length == 0 && i == 0);
				}

				if (Object.getOwnPropertyNames != null && Object.getOwnPropertyNames(properties).length > 0)
				{
					this.container.appendChild(this.addProperties(this.createPanel(), properties, sstate));
				}
			}
		};

		/**
		 * Overridden to add copy and paste style.
		 */
		var styleFormatPanelAddStyleOps = StyleFormatPanel.prototype.addStyleOps;
		
		StyleFormatPanel.prototype.addStyleOps = function(div)
		{
			this.addActions(div, ['copyStyle', 'pasteStyle']);
			
			return styleFormatPanelAddStyleOps.apply(this, arguments);
		};
		
		/**
		 * Initial collapsed state of the properties panel.
		 */
		EditorUi.prototype.propertiesCollapsed = true;

		/**
		 * Create Properties Panel
		 */
		StyleFormatPanel.prototype.addProperties = function(div, properties, state)
		{
			var that = this;
			var graph = this.editorUi.editor.graph;
			var secondLevel = [];
			
			function insertAfter(newElem, curElem)
			{
				curElem.parentNode.insertBefore(newElem, curElem.nextSibling);
			};
			
			function applyStyleVal(pName, newVal, prop, delIndex)
			{
				graph.getModel().beginUpdate();
				try
				{
					var changedProps = [];
					var changedVals = [];

					if (prop.index != null)
					{
						var allVals = [];
						var curVal = prop.parentRow.nextSibling;
						
						while(curVal && curVal.getAttribute('data-pName') == pName)
						{
							allVals.push(curVal.getAttribute('data-pValue'));
							curVal = curVal.nextSibling;
						}
						
						if (prop.index < allVals.length)
						{
							if (delIndex != null)
							{
								allVals.splice(delIndex, 1);
							}
							else
							{
								allVals[prop.index] = newVal;
							}
						}
						else
						{
							allVals.push(newVal);
						}
						
						if (prop.size != null && allVals.length > prop.size) //trim the array to the specifies size
						{
							allVals = allVals.slice(0, prop.size);
						}
						
						newVal = allVals.join(',');
						
						if (prop.countProperty != null)
						{
							graph.setCellStyles(prop.countProperty, allVals.length, graph.getSelectionCells());
							
							changedProps.push(prop.countProperty);
							changedVals.push(allVals.length);
						}
					}

					graph.setCellStyles(pName, newVal, graph.getSelectionCells());
					changedProps.push(pName);
					changedVals.push(newVal);
					
					if (prop.dependentProps != null)
					{
						for (var i = 0; i < prop.dependentProps.length; i++)
						{
							var defVal = prop.dependentPropsDefVal[i];
							var vals = prop.dependentPropsVals[i];
							
							if (vals.length > newVal)
							{
								vals = vals.slice(0, newVal);
							}
							else
							{
								for (var j = vals.length; j < newVal; j++)
								{
									vals.push(defVal);
								}
							}
							
							vals = vals.join(',');
							graph.setCellStyles(prop.dependentProps[i], vals, graph.getSelectionCells());
							changedProps.push(prop.dependentProps[i]);
							changedVals.push(vals);
						}
					}
					
					if (typeof(prop.onChange) == 'function')
					{
						prop.onChange(graph, newVal);
					}
					
					that.editorUi.fireEvent(new mxEventObject('styleChanged', 'keys', changedProps,
						'values', changedVals, 'cells', graph.getSelectionCells()));
				}
				finally
				{
					graph.getModel().endUpdate();
				}
			}
			
			function setElementPos(td, elem, adjustHeight)
			{
				var divPos = mxUtils.getOffset(div, true);
				var pos = mxUtils.getOffset(td, true);
				elem.style.position = 'absolute';
				elem.style.left = (pos.x - divPos.x) + 'px';
				elem.style.top = (pos.y - divPos.y) + 'px';
				elem.style.width = td.offsetWidth + 'px';
				elem.style.height = (td.offsetHeight - (adjustHeight? 4 : 0)) + 'px';
				elem.style.zIndex = 5;
			};
			
			function createColorBtn(pName, pValue, prop)
			{
				var clrDiv = document.createElement('div');
				clrDiv.style.width = '32px';
				clrDiv.style.height = '4px';
				clrDiv.style.margin = '2px';
				clrDiv.style.border = '1px solid black';
				clrDiv.style.background = !pValue || pValue == 'none'? 'url(\'' + Dialog.prototype.noColorImage + '\')' : pValue;

				btn = mxUtils.button('', mxUtils.bind(that, function(evt)
				{
					this.editorUi.pickColor(pValue, function(color)
					{
						clrDiv.style.background = color == 'none'? 'url(\'' + Dialog.prototype.noColorImage + '\')' : color;
						applyStyleVal(pName, color, prop);
					});
					mxEvent.consume(evt);
				}));
				
				btn.style.height = '12px';
				btn.style.width = '40px';
				btn.className = 'geColorBtn';
				
				btn.appendChild(clrDiv);
				return btn;
			};
			
			function createDynArrList(pName, pValue, subType, defVal, countProperty, myRow, flipBkg)
			{
				if (pValue != null)
				{
					var vals = pValue.split(',');
					secondLevel.push({name: pName, values: vals, type: subType, defVal: defVal, countProperty: countProperty, parentRow: myRow, isDeletable: true, flipBkg: flipBkg});
				}
				
				btn = mxUtils.button('+', mxUtils.bind(that, function(evt)
				{
					var beforeElem = myRow;
					var index = 0;
					
					while (beforeElem.nextSibling != null)
					{
						var cur = beforeElem.nextSibling;
						var elemPName = cur.getAttribute('data-pName');

						if (elemPName == pName)
						{
							beforeElem = beforeElem.nextSibling;
							index++;
						}
						else
						{
							break;
						}
					}
					
					var newProp = {type: subType, parentRow: myRow, index: index, isDeletable: true, defVal: defVal, countProperty: countProperty};
					var arrItem = createPropertyRow(pName, '', newProp, index % 2 == 0, flipBkg);
					applyStyleVal(pName, defVal, newProp);
					insertAfter(arrItem, beforeElem);
					
					mxEvent.consume(evt);
				}));
				
				btn.style.height = '16px';
				btn.style.width = '25px';
				btn.className = 'geColorBtn';
				
				return btn;
			};
			
			function createStaticArrList(pName, pValue, subType, defVal, size, myRow, flipBkg)
			{
				if (size > 0)
				{
					var vals = new Array(size);
					
					var curVals = pValue != null? pValue.split(',') : [];
					
					for (var i = 0; i < size; i++) 
					{
						vals[i] = curVals[i] != null? curVals[i] : (defVal != null? defVal : '');
					}
					
					secondLevel.push({name: pName, values: vals, type: subType, defVal: defVal, parentRow: myRow, flipBkg: flipBkg, size: size});
				}
				
				return document.createElement('div'); //empty cell
			};
			
			function createCheckbox(pName, pValue, prop)
			{
				var input = document.createElement('input');
				input.type = 'checkbox';
				input.checked = pValue == '1';
				
				mxEvent.addListener(input, 'change', function() 
				{
					applyStyleVal(pName, input.checked? '1' : '0', prop);
				});
				return input;
			};
			
			function createPropertyRow(pName, pValue, prop, isOdd, flipBkg)
			{
				var pDiplayName = prop.dispName;
				var pType = prop.type;
				var row = document.createElement('tr');
				row.className = 'gePropRow' + (flipBkg? 'Dark' : '') + (isOdd? 'Alt' : '') + ' gePropNonHeaderRow';
				row.setAttribute('data-pName', pName);
				row.setAttribute('data-pValue', pValue);
				var rightAlig = false;
				
				if (prop.index != null)
				{
					row.setAttribute('data-index', prop.index);
					pDiplayName = (pDiplayName != null? pDiplayName : '') + '[' + prop.index + ']';
					rightAlig = true;
				}
				
				var td = document.createElement('td');
				td.className = 'gePropRowCell';
				var label = mxResources.get(pDiplayName, null, pDiplayName);
				mxUtils.write(td, label);
				td.setAttribute('title', label);
				
				if (rightAlig)
				{
					td.style.textAlign = 'right';
				}
					
				row.appendChild(td);
				td = document.createElement('td');
				td.className = 'gePropRowCell';
				
				if (pType == 'color')
				{
					td.appendChild(createColorBtn(pName, pValue, prop));
				}
				else if (pType == 'bool' || pType == 'boolean')
				{
					td.appendChild(createCheckbox(pName, pValue, prop));
				}
				else if (pType == 'enum')
				{
					var pEnumList = prop.enumList;
					
					for (var i = 0; i < pEnumList.length; i++)
					{
						var op = pEnumList[i];
						
						if (op.val == pValue)
						{
							mxUtils.write(td, mxResources.get(op.dispName, null, op.dispName));
							break;
						}
					}
					
					mxEvent.addListener(td, 'click', mxUtils.bind(that, function()
					{
						var select = document.createElement('select');
						setElementPos(td, select);

						for (var i = 0; i < pEnumList.length; i++)
						{
							var op = pEnumList[i];
							var opElem = document.createElement('option');
							opElem.value = mxUtils.htmlEntities(op.val);
							mxUtils.write(opElem, mxResources.get(op.dispName, null, op.dispName));
							select.appendChild(opElem);
						}
						
						select.value = pValue;
						
						div.appendChild(select);

						mxEvent.addListener(select, 'change', function()
						{
							var newVal = mxUtils.htmlEntities(select.value);
							applyStyleVal(pName, newVal, prop);
							//set value triggers a redraw of the panel which removes the select and updates the row
						});
			
						select.focus();

						//FF calls blur on focus! so set the event after focusing (not with selects but to be safe)
						mxEvent.addListener(select, 'blur', function()
						{
							div.removeChild(select);
						});
					}));
				}
				else if (pType == 'dynamicArr')
				{
					td.appendChild(createDynArrList(pName, pValue, prop.subType, prop.subDefVal, prop.countProperty, row, flipBkg));
				}
				else if (pType == 'staticArr')
				{
					td.appendChild(createStaticArrList(pName, pValue, prop.subType, prop.subDefVal, prop.size, row, flipBkg));
				}
				else if (pType == 'readOnly')
				{
					var inp = document.createElement('input');
					inp.setAttribute('readonly', '');
					inp.value = pValue;
					inp.style.width = '96px';
					inp.style.borderWidth = '0px';
					td.appendChild(inp);
				}
				else
				{
					td.innerHTML = pValue;
					
					mxEvent.addListener(td, 'click', mxUtils.bind(that, function()
					{
						var input = document.createElement('input');
						setElementPos(td, input, true);
						input.value = pValue;
						input.className = 'gePropEditor';
						
						if ((pType == 'int' || pType == 'float') && !prop.allowAuto)
						{
							input.type = 'number';
							input.step = pType == 'int'? '1' : 'any';
							
							if (prop.min != null)
							{
								input.min = parseFloat(prop.min); 
							}
							
							if (prop.max != null)
							{
								input.max = parseFloat(prop.max);
							}
						}
						
						div.appendChild(input);

						function setInputVal()
						{
							var inputVal = input.value;
							inputVal = inputVal.length == 0 && pType != 'string'? 0 : inputVal;
							
							if (prop.allowAuto)
							{
								if (inputVal.trim != null && inputVal.trim().toLowerCase() == 'auto')
								{
									inputVal = 'auto';
									pType = 'string';
								}
								else
								{
									inputVal = parseFloat(inputVal);
									inputVal = isNaN(inputVal)? 0 : inputVal;
								}
							}
							
							if (prop.min != null && inputVal < prop.min)
							{
								inputVal = prop.min;
							} 
							else if (prop.max != null && inputVal > prop.max)
							{
								inputVal = prop.max;
							}

							var newVal = mxUtils.htmlEntities((pType == 'int'? parseInt(inputVal) : inputVal) + '');
							
							applyStyleVal(pName, newVal, prop);
						}
						
						mxEvent.addListener(input, 'keypress', function(e)
						{
							if (e.keyCode == 13) 
							{
								setInputVal();
								//set value triggers a redraw of the panel which removes the input
							}
						});
						
						input.focus();
						
						//FF calls blur on focus! so set the event after focusing
						mxEvent.addListener(input, 'blur', function() 
						{
							setInputVal();
						});
					}));
				}

				if (prop.isDeletable)
				{
					var delBtn = mxUtils.button('-', mxUtils.bind(that, function(evt)
					{
						//delete the node by refreshing the properties
						applyStyleVal(pName, '', prop, prop.index);
						
						mxEvent.consume(evt);
					}));
					
					delBtn.style.height = '16px';
					delBtn.style.width = '25px';
					delBtn.style.float = 'right';
					delBtn.className = 'geColorBtn';
					td.appendChild(delBtn);
				}
				
				row.appendChild(td);
				return row;
			};
			
			div.style.position = 'relative';
			div.style.padding = '0';
			var grid = document.createElement('table');
			grid.className = 'geProperties';
			grid.style.whiteSpace = 'nowrap';
			grid.style.width = '100%';
			//create header row
			var hrow = document.createElement('tr');
			hrow.className = 'gePropHeader';
			var th = document.createElement('th');
			th.className = 'gePropHeaderCell';
			var collapseImg = document.createElement('img');
			collapseImg.src = Sidebar.prototype.expandedImage;
			collapseImg.style.verticalAlign = 'middle';
			th.appendChild(collapseImg);
			mxUtils.write(th, mxResources.get('property'));
			hrow.style.cursor = 'pointer';
			
			var onFold = function()
			{
				var rows = grid.querySelectorAll('.gePropNonHeaderRow');
				var display;
				
				if (!that.editorUi.propertiesCollapsed)
				{
					collapseImg.src = Sidebar.prototype.expandedImage;
					display = '';
				}
				else
				{
					collapseImg.src = Sidebar.prototype.collapsedImage;
					display = 'none';
					
					for (var e = div.childNodes.length - 1; e >= 0 ; e--)
					{
						//Blur can be executed concurrently with this method and the element is removed before removing it here
						try
						{
							var child = div.childNodes[e]; 
							var nodeName = child.nodeName.toUpperCase();
							
							if (nodeName == 'INPUT' || nodeName == 'SELECT')
							{
								div.removeChild(child);
							}
						}
						catch(ex){}
					}
				}
				
				for (var r = 0; r < rows.length; r++)
				{
					rows[r].style.display = display;
				}
			};

			mxEvent.addListener(hrow, 'click', function()
			{
				that.editorUi.propertiesCollapsed = !that.editorUi.propertiesCollapsed;
				onFold();
			});
			hrow.appendChild(th);
			th = document.createElement('th');
			th.className = 'gePropHeaderCell';
			th.innerHTML = mxResources.get('value');
			hrow.appendChild(th);
			grid.appendChild(hrow);
			
			var isOdd = false;
			var flipBkg = false;
			
			var cellId = null;
			
			if (state.vertices.length == 1 && state.edges.length == 0)
			{
				cellId = state.vertices[0].id;
			}
			else if (state.vertices.length == 0 && state.edges.length == 1)
			{
				cellId = state.edges[0].id;
			}
			
			//Add it to top (always)
			if (cellId != null)
			{
				grid.appendChild(createPropertyRow('id', mxUtils.htmlEntities(cellId), {dispName: 'ID', type: 'readOnly'}, true, false));
			}
			
			for (var key in properties)
			{
				var prop = properties[key];
				
				if (typeof(prop.isVisible) == 'function')
				{
					if (!prop.isVisible(state, this)) continue;
				}
				
				var pValue = state.style[key] != null? mxUtils.htmlEntities(state.style[key] + '') :
					((prop.getDefaultValue != null) ? prop.getDefaultValue(state, this) : prop.defVal); //or undefined if defVal is undefined

				if (prop.type == 'separator')
				{
					flipBkg = !flipBkg;
					continue;
				}
				else if (prop.type == 'staticArr') //if dynamic values are needed, a more elegant technique is needed to replace such values
				{
					prop.size = parseInt(state.style[prop.sizeProperty] || properties[prop.sizeProperty].defVal) || 0;
				}
				else if (prop.dependentProps != null)
				{
					var dependentProps = prop.dependentProps;
					var dependentPropsVals = [];
					var dependentPropsDefVal = [];
					
					for (var i = 0; i < dependentProps.length; i++)
					{
						var propVal = state.style[dependentProps[i]];
						dependentPropsDefVal.push(properties[dependentProps[i]].subDefVal);
						dependentPropsVals.push(propVal != null? propVal.split(',') : []);
					}
					
					prop.dependentPropsDefVal = dependentPropsDefVal;
					prop.dependentPropsVals = dependentPropsVals;
				}
				
				grid.appendChild(createPropertyRow(key, pValue, prop, isOdd, flipBkg));
				
				isOdd = !isOdd;
			}
			
			for (var i = 0; i < secondLevel.length; i++)
			{
				var prop = secondLevel[i];
				var insertElem = prop.parentRow;
					
				for (var j = 0; j < prop.values.length; j++)
				{
					//mxUtils.clone failed because of the HTM element, so manual cloning is used
					var iProp = {type: prop.type, parentRow: prop.parentRow, isDeletable: prop.isDeletable, index: j, defVal: prop.defVal, countProperty: prop.countProperty, size: prop.size};
					var arrItem = createPropertyRow(prop.name, prop.values[j], iProp, j % 2 == 0, prop.flipBkg);
					insertAfter(arrItem, insertElem);
					insertElem = arrItem;
				}
			}
			
			div.appendChild(grid);
			onFold();
			
			return div;
		};
		
		/**
		 * Creates the buttons for the predefined styles.
		 */
		StyleFormatPanel.prototype.addStyles = function(div)
		{
			var ui = this.editorUi;
			var graph = ui.editor.graph;
			var picker = document.createElement('div');
			picker.style.whiteSpace = 'nowrap';
			picker.style.paddingLeft = '24px';
			picker.style.paddingRight = '20px';
			div.style.paddingLeft = '16px';
			div.style.paddingBottom = '6px';
			div.style.position = 'relative';
			div.appendChild(picker);

			var stylenames = ['plain-gray', 'plain-blue', 'plain-green', 'plain-turquoise',
				'plain-orange', 'plain-yellow', 'plain-red', 'plain-pink', 'plain-purple', 'gray',
				'blue', 'green', 'turquoise', 'orange', 'yellow', 'red', 'pink', 'purple'];
			
			// Maximum palettes to switch the switcher
			var maxEntries = 10;
						
			// Selector
			var switcher = document.createElement('div');
			switcher.style.whiteSpace = 'nowrap';
			switcher.style.position = 'relative';
			switcher.style.textAlign = 'center';
			switcher.style.width = '210px';
			
			var dots = [];
			
			for (var i = 0; i < this.defaultColorSchemes.length; i++)
			{
				var dot = document.createElement('div');
				dot.style.display = 'inline-block';
				dot.style.width = '6px';
				dot.style.height = '6px';
				dot.style.marginLeft = '4px';
				dot.style.marginRight = '3px';
				dot.style.borderRadius = '3px';
				dot.style.cursor = 'pointer';
				dot.style.background = 'transparent';
				dot.style.border = '1px solid #b5b6b7';
				
				(mxUtils.bind(this, function(index)
				{
					mxEvent.addListener(dot, 'click', mxUtils.bind(this, function()
					{
						setScheme(index);
					}));
				}))(i);
				
				dots.push(dot);
				switcher.appendChild(dot);
			}
			
			var setScheme = mxUtils.bind(this, function(index)
			{
				if (dots[index] != null)
				{
					if (this.format.currentScheme != null && dots[this.format.currentScheme] != null)
					{
						dots[this.format.currentScheme].style.background = 'transparent';
					}
					
					this.format.currentScheme = index;
					updateScheme(this.defaultColorSchemes[this.format.currentScheme]);
					dots[this.format.currentScheme].style.background = '#84d7ff';
				}
			});
			
			var updateScheme = mxUtils.bind(this, function(colorsets)
			{
				var addButton = mxUtils.bind(this, function(colorset)
				{
					var btn = mxUtils.button('', mxUtils.bind(this, function(evt)
					{
						graph.getModel().beginUpdate();
						try
						{
							var cells = ui.getSelectionState().cells;
							
							for (var i = 0; i < cells.length; i++)
							{
								var style = graph.getModel().getStyle(cells[i]);
				
								for (var j = 0; j < stylenames.length; j++)
								{
									style = mxUtils.removeStylename(style, stylenames[j]);
								}

								var defaults = (graph.getModel().isVertex(cells[i])) ? graph.defaultVertexStyle : graph.defaultEdgeStyle;
								
								if (colorset != null)
								{
									if (!mxEvent.isShiftDown(evt))
									{
										if (colorset['fill'] == '')
										{
											style = mxUtils.setStyle(style, mxConstants.STYLE_FILLCOLOR, null);
										}
										else
										{
											style = mxUtils.setStyle(style, mxConstants.STYLE_FILLCOLOR, colorset['fill'] ||
												mxUtils.getValue(defaults, mxConstants.STYLE_FILLCOLOR, null));
										}

										style = mxUtils.setStyle(style, mxConstants.STYLE_GRADIENTCOLOR, colorset['gradient'] ||
											mxUtils.getValue(defaults, mxConstants.STYLE_GRADIENTCOLOR, null));
									
										if (!mxEvent.isControlDown(evt) && (!mxClient.IS_MAC || !mxEvent.isMetaDown(evt)) &&
											graph.getModel().isVertex(cells[i]))
										{
											style = mxUtils.setStyle(style, mxConstants.STYLE_FONTCOLOR, colorset['font'] ||
												mxUtils.getValue(defaults, mxConstants.STYLE_FONTCOLOR, null));
										}
									}
									
									if (!mxEvent.isAltDown(evt))
									{
										if (colorset['stroke'] == '')
										{
											style = mxUtils.setStyle(style, mxConstants.STYLE_STROKECOLOR, null);
										}
										else
										{
											style = mxUtils.setStyle(style, mxConstants.STYLE_STROKECOLOR, colorset['stroke'] ||
												mxUtils.getValue(defaults, mxConstants.STYLE_STROKECOLOR, null));
										}
									}
								}
								else
								{
									style = mxUtils.setStyle(style, mxConstants.STYLE_FILLCOLOR,
										mxUtils.getValue(defaults, mxConstants.STYLE_FILLCOLOR, '#ffffff'));
									style = mxUtils.setStyle(style, mxConstants.STYLE_STROKECOLOR,
										mxUtils.getValue(defaults, mxConstants.STYLE_STROKECOLOR, '#000000'));
									style = mxUtils.setStyle(style, mxConstants.STYLE_GRADIENTCOLOR,
										mxUtils.getValue(defaults, mxConstants.STYLE_GRADIENTCOLOR, null));
									
									if (graph.getModel().isVertex(cells[i]))
									{
										style = mxUtils.setStyle(style, mxConstants.STYLE_FONTCOLOR,
											mxUtils.getValue(defaults, mxConstants.STYLE_FONTCOLOR, null));
									}
								}

								graph.getModel().setStyle(cells[i], style);
							}
						}
						finally
						{
							graph.getModel().endUpdate();
						}
					}));
	
					btn.className = 'geStyleButton';
					btn.style.width = '36px';
					btn.style.height = (this.defaultColorSchemes.length <= maxEntries) ? '24px' : '30px';
					btn.style.margin = '0px 6px 6px 0px';
					
					if (colorset != null)
					{
						var b = (urlParams['sketch'] == '1') ? '2px solid' : '1px solid';
						
						if (colorset['gradient'] != null)
						{
							if (mxClient.IS_IE && (document.documentMode < 10))
							{
						    	btn.style.filter = 'progid:DXImageTransform.Microsoft.Gradient('+
				                	'StartColorStr=\'' + colorset['fill'] +
				                	'\', EndColorStr=\'' + colorset['gradient'] + '\', GradientType=0)';
							}
							else
							{
								btn.style.backgroundImage = 'linear-gradient(' + colorset['fill'] + ' 0px,' +
									colorset['gradient'] + ' 100%)';
							}
						}
						else if (colorset['fill'] == mxConstants.NONE)
						{
							btn.style.background = 'url(\'' + Dialog.prototype.noColorImage + '\')';
						}
						else if (colorset['fill'] == '')
						{
							btn.style.backgroundColor = mxUtils.getValue(graph.defaultVertexStyle,
								mxConstants.STYLE_FILLCOLOR, (Editor.isDarkMode()) ? Editor.darkColor : '#ffffff');
						}
						else
						{
							btn.style.backgroundColor = colorset['fill'] || mxUtils.getValue(graph.defaultVertexStyle,
								mxConstants.STYLE_FILLCOLOR, (Editor.isDarkMode()) ? Editor.darkColor : '#ffffff');
						}
						
						if (colorset['stroke'] == mxConstants.NONE)
						{
							btn.style.border = b + ' transparent';
						}
						else if (colorset['stroke'] == '')
						{
							btn.style.border = b + ' ' + mxUtils.getValue(graph.defaultVertexStyle, 
								mxConstants.STYLE_STROKECOLOR, (!Editor.isDarkMode()) ? Editor.darkColor : '#ffffff');
						}
						else
						{
							btn.style.border = b + ' ' + (colorset['stroke'] || mxUtils.getValue(graph.defaultVertexStyle,
									mxConstants.STYLE_STROKECOLOR, (!Editor.isDarkMode()) ? Editor.darkColor : '#ffffff'));
						}

						if (colorset['title'] != null)
						{
							btn.setAttribute('title', colorset['title']);
						}
					}
					else
					{
						var bg = mxUtils.getValue(graph.defaultVertexStyle, mxConstants.STYLE_FILLCOLOR, '#ffffff');
						var bd = mxUtils.getValue(graph.defaultVertexStyle, mxConstants.STYLE_STROKECOLOR, '#000000');
						
						btn.style.backgroundColor = bg;
						btn.style.border = '1px solid ' + bd;
					}

					btn.style.borderRadius = '0';
					
					picker.appendChild(btn);
				});
				
				picker.innerHTML = '';
				
				for (var i = 0; i < colorsets.length; i++)
				{
					if (i > 0 && mxUtils.mod(i, 4) == 0)
					{
						mxUtils.br(picker);
					}
					
					addButton(colorsets[i]);
				}
			});

			if (this.format.currentScheme == null)
			{
				setScheme(Editor.isDarkMode() ? 1 : (urlParams['sketch'] == '1' ? 5 : 0));
			}
			else
			{
				setScheme(this.format.currentScheme);
			}
			
			var bottom = (this.defaultColorSchemes.length <= maxEntries) ? 28 : 8;

			var left = document.createElement('div');
			left.style.cssText = 'position:absolute;left:10px;top:8px;bottom:' + bottom + 'px;width:20px;margin:4px;opacity:0.5;' +
				'background-repeat:no-repeat;background-position:center center;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQBAMAAADQT4M0AAAAIVBMVEUAAAB2dnZ4eHh3d3d1dXVxcXF2dnZ2dnZ2dnZxcXF2dnYmb3w1AAAACnRSTlMAfCTkhhvb7cQSPH2JPgAAADRJREFUCNdjwACMAmBKaiGYs2oJmLPKAZ3DabU8AMRTXpUKopislqFyVzCAuUZgikkBZjoAcMYLnp53P/UAAAAASUVORK5CYII=);';
			
			mxEvent.addListener(left, 'click', mxUtils.bind(this, function()
			{
				setScheme(mxUtils.mod(this.format.currentScheme - 1, this.defaultColorSchemes.length));
			}));
			
			var right = document.createElement('div');
			right.style.cssText = 'position:absolute;left:202px;top:8px;bottom:' + bottom + 'px;width:20px;margin:4px;opacity:0.5;' +
				'background-repeat:no-repeat;background-position:center center;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQBAMAAADQT4M0AAAAIVBMVEUAAAB2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnYBuwCcAAAACnRSTlMAfCTkhhvb7cQSPH2JPgAAADZJREFUCNdjQAOMAmBKaiGY8loF5rKswsZlrVo8AUiFrTICcbIWK8A5DF1gDoMymMPApIAwHwCS0Qx/U7qCBQAAAABJRU5ErkJggg==);';

			if (this.defaultColorSchemes.length > 1)
			{
				div.appendChild(left);
				div.appendChild(right);
			}
			
			mxEvent.addListener(right, 'click', mxUtils.bind(this, function()
			{
				setScheme(mxUtils.mod(this.format.currentScheme + 1, this.defaultColorSchemes.length));
			}));
			
			// Hover state
			function addHoverState(elt)
			{
				mxEvent.addListener(elt, 'mouseenter', function()
				{
					elt.style.opacity = '1';
				});
				mxEvent.addListener(elt, 'mouseleave', function()
				{
					elt.style.opacity = '0.5';
				});
			};
			
			addHoverState(left);
			addHoverState(right);
			
			updateScheme(this.defaultColorSchemes[this.format.currentScheme]);
			
			if (this.defaultColorSchemes.length <= maxEntries)
			{
				div.appendChild(switcher);
			}
			
			return div;
		};
		
		StyleFormatPanel.prototype.addEditOps = function(div)
		{
			var ss = this.editorUi.getSelectionState();
			var graph = this.editorUi.editor.graph;
			var btn = null;
			
			if (ss.cells.length == 1)
			{
				btn = mxUtils.button(mxResources.get('editStyle'), mxUtils.bind(this, function(evt)
				{
					this.editorUi.actions.get('editStyle').funct();
				}));
				
				btn.setAttribute('title', mxResources.get('editStyle') + ' (' + this.editorUi.actions.get('editStyle').shortcut + ')');
				btn.style.width = '210px';
				btn.style.marginBottom = '2px';
				
				div.appendChild(btn);
			}
			
			var state = (ss.cells.length == 1) ? graph.view.getState(ss.cells[0]) : null;
			
			if (state != null && state.shape != null && state.shape.stencil != null)
			{
				var btn2 = mxUtils.button(mxResources.get('editShape'), mxUtils.bind(this, function(evt)
				{
					this.editorUi.actions.get('editShape').funct();
				}));
				
				btn2.setAttribute('title', mxResources.get('editShape'));
				btn2.style.marginBottom = '2px';
				
				if (btn == null)
				{
					btn2.style.width = '210px';
				}
				else
				{
					btn.style.width = '104px';
					btn2.style.width = '104px';
					btn2.style.marginLeft = '2px';
				}
				
				div.appendChild(btn2);
			}
			else if (ss.image && ss.cells.length > 0)
			{
				var btn2 = mxUtils.button(mxResources.get('editImage'), mxUtils.bind(this, function(evt)
				{
					this.editorUi.actions.get('image').funct();
				}));
				
				btn2.setAttribute('title', mxResources.get('editImage'));
				btn2.style.marginBottom = '2px';
				
				if (btn == null)
				{
					btn2.style.width = '210px';
				}
				else
				{
					btn.style.width = '104px';
					btn2.style.width = '104px';
					btn2.style.marginLeft = '2px';
				}
				
				div.appendChild(btn2);
			}
			
			return div;
		};
	}
	
	/**
	 * Lookup table for mapping from font URL and name to elements in the DOM.
	 */
	Graph.customFontElements = {};
		
	/**
	 * Lookup table for recent custom fonts.
	 */
	Graph.recentCustomFonts = {};

	/**
	 * Returns true if the given font URL references a Google font.
	 */
	Graph.isGoogleFontUrl = function(url)
	{
		return url.substring(0, Editor.GOOGLE_FONTS.length) == Editor.GOOGLE_FONTS;
	};

	/**
	 * Returns true if the given font URL is a CSS file.
	 */
	Graph.isCssFontUrl = function(url)
	{
		return Graph.isGoogleFontUrl(url);
	};

	/**
	 * Creates the DOM node for the custom font.
	 */
	Graph.createFontElement = function(name, url)
	{
		var elt = null;

		if (Graph.isCssFontUrl(url))
		{
			elt = document.createElement('link');
			elt.setAttribute('rel', 'stylesheet');
			elt.setAttribute('type', 'text/css');
			elt.setAttribute('charset', 'UTF-8');
			elt.setAttribute('href', url);
		}
		else
		{
			elt = document.createElement('style');
			mxUtils.write(elt, '@font-face {\n' +	
				'font-family: "' + name + '";\n' + 	
				'src: url("' + url + '");\n}');
		}
		
		return elt;
	};
	
	/**
	 * Adds a font to the document.
	 */
	Graph.addFont = function(name, url, callback)
	{
		if (name != null && name.length > 0 && url != null && url.length > 0)
		{
			var key = name.toLowerCase();
			
			// Blocks UI font from being overwritten
			if (key != 'helvetica' && name != 'arial' && key != 'sans-serif')
			{
				var entry = Graph.customFontElements[key];
				
				// Replaces element if URL has changed
				if (entry != null && entry.url != url)
				{
					entry.elt.parentNode.removeChild(entry.elt);
					entry = null;
				}
				
				if (entry == null)
				{
					var realUrl = url;
					
					// Fixes possible mixed content by using proxy
					if (url.substring(0, 5) == 'http:')
					{
						realUrl = PROXY_URL + '?url=' + encodeURIComponent(url);
					}

					entry = {name: name, url: url, elt: Graph.createFontElement(name, realUrl)};
					Graph.customFontElements[key] = entry;
					Graph.recentCustomFonts[key] = entry;
					var head = document.getElementsByTagName('head')[0];
					
					if (callback != null)
					{
						if (entry.elt.nodeName.toLowerCase() == 'link')
						{
							entry.elt.onload = callback;
							entry.elt.onerror = callback;
						}
						else
						{
							callback();
						}
					}
						
					if (head != null)
					{
						head.appendChild(entry.elt);
					}
				}
				else if (callback != null)
				{
					callback();
				}
			}
			else if (callback != null)
			{
				callback();
			}
		}
		else if (callback != null)
		{
			callback();
		}
				
		return name;
	};

	/**
	 * Returns the URL for the given font name if it exists in the document.
	 * Otherwise it returns the given URL.
	 */
	Graph.getFontUrl = function(name, url)
	{
		var font = Graph.customFontElements[name.toLowerCase()];
		
		if (font != null)
		{
			url = font.url;
		}
		
		return url;
	};
	
	/**
	 * Processes the fonts in the given element and its descendants.
	 */
	Graph.processFontAttributes = function(elt)
	{
		var elts = elt.getElementsByTagName('*');
		
		for (var i = 0; i < elts.length; i++)
		{
			var url = elts[i].getAttribute('data-font-src');
			
			if (url != null)
			{
				var name = (elts[i].nodeName == 'FONT') ?
					elts[i].getAttribute('face') :
					elts[i].style.fontFamily;
	
				if (name != null)
				{
					Graph.addFont(name, url);
				}
			}
		}		
	};
	
	/**
	 * Processes the font in the given cell style.
	 */
	Graph.processFontStyle = function(style)
	{
		if (style != null)
		{
			var url = mxUtils.getValue(style, 'fontSource', null);
	
			if (url != null)
			{
				var name = mxUtils.getValue(style, mxConstants.STYLE_FONTFAMILY, null);
				
				if (name != null)
				{
					Graph.addFont(name, decodeURIComponent(url));
				}
			}
		}
		
		return style;
	};

	/**
	 * Changes the default stylename so that it matches the old named style
	 * if one was specified in the XML.
	 */
	Graph.prototype.defaultThemeName = 'default-style2';
	
	/**
	 * Contains the last XML that was pasted.
	 */
	Graph.prototype.lastPasteXml = null;
	
	/**
	 * Contains the number of times the last XML was pasted.
	 */
	Graph.prototype.pasteCounter = 0;
	
	/**
	 * Graph Overrides
	 */
	Graph.prototype.defaultScrollbars = urlParams['sb'] != '0';

	/**
	 * Specifies if the page should be visible for new files. Default is true.
	 */
	Graph.prototype.defaultPageVisible = urlParams['pv'] != '0';

	/**
	 * Specifies if the page should be visible for new files. Default is true.
	 */
	Graph.prototype.shadowId = 'dropShadow';
	
	/**
	 * Properties for the SVG shadow effect.
	 */
	Graph.prototype.svgShadowColor = '#3D4574';

	/**
	 * Properties for the SVG shadow effect.
	 */
	Graph.prototype.svgShadowOpacity = '0.4';

	/**
	 * Properties for the SVG shadow effect.
	 */
	Graph.prototype.svgShadowBlur = '1.7';
	
	/**
	 * Properties for the SVG shadow effect.
	 */
	Graph.prototype.svgShadowSize = '3';

	/**
	 * Enables move of bends/segments without selecting.
	 */
	Graph.prototype.edgeMode = urlParams['edge'] != 'move';
			
	/**
	 * Enables move of bends/segments without selecting.
	 */
	Graph.prototype.hiddenTags = null;
	
	/**
	 * Enables move of bends/segments without selecting.
	 */
	Graph.prototype.defaultMathEnabled = false;
	
	/**
	 * Adds rack child layout style.
	 */
	var graphInit = Graph.prototype.init;
	
	Graph.prototype.init = function()
	{
		graphInit.apply(this, arguments);

		// Array of hidden tags used in isCellVisible override
		this.hiddenTags = [];

		//TODO initialize Freehand in the correct location!
		if (window.mxFreehand)
		{
			this.freehand = new mxFreehand(this);
		}
		
		// Override insert location for current mouse point
		var mouseEvent = null;
		
		function setMouseEvent(evt)
		{
			mouseEvent = evt;
		};
		
		mxEvent.addListener(this.container, 'mouseenter', setMouseEvent);
		mxEvent.addListener(this.container, 'mousemove', setMouseEvent);
		mxEvent.addListener(this.container, 'mouseleave', function(evt)
		{
			mouseEvent = null;
		});
				
		// Extends getInsertPoint to use the current mouse location
		this.isMouseInsertPoint = function()
		{
			return mouseEvent != null;
		};
		
		var getInsertPoint = this.getInsertPoint;
		
		this.getInsertPoint = function()
		{
			if (mouseEvent != null)
			{
				return this.getPointForEvent(mouseEvent);
			}
			
			return getInsertPoint.apply(this, arguments);
		};
		
		var layoutManagerGetLayout = this.layoutManager.getLayout;
		
		this.layoutManager.getLayout = function(cell)
		{
			// Workaround for possible invalid style after change and before view validation
			var style = this.graph.getCellStyle(cell);
			
			// mxRackContainer may be undefined as it is dynamically loaded at render time
			if (style != null)
			{
				if (style['childLayout'] == 'rack')
				{
					var rackLayout = new mxStackLayout(this.graph, false);
					var unitSize = 20;
					
					if (style['rackUnitSize'] != null)
					{
						rackLayout.gridSize = parseFloat(style['rackUnitSize']);
					}
					else
					{
						rackLayout.gridSize = (typeof mxRackContainer !== 'undefined') ? mxRackContainer.unitSize : unitSize;
					}
					
					rackLayout.marginLeft = style['marginLeft'] || 0;
					rackLayout.marginRight = style['marginRight'] || 0;
					rackLayout.marginTop = style['marginTop'] || 0;
					rackLayout.marginBottom = style['marginBottom'] || 0;
					rackLayout.allowGaps = style['allowGaps'] || 0;
					rackLayout.horizontal = mxUtils.getValue(style, 'horizontalRack', '0') == '1';
					rackLayout.resizeParent = false;
					rackLayout.fill = true;
					
					return rackLayout;
				}
			}
			
			return layoutManagerGetLayout.apply(this, arguments);
		}
		
		this.updateGlobalUrlVariables();
	};

	/**
	 * Adds support for custom fonts in cell styles.
	 */
	var graphPostProcessCellStyle = Graph.prototype.postProcessCellStyle;
	Graph.prototype.postProcessCellStyle = function(cell, style)
	{
		return Graph.processFontStyle(graphPostProcessCellStyle.apply(this, arguments));
	};

	/**
	 * Handles custom fonts in labels.
	 */
	var mxSvgCanvas2DUpdateTextNodes = mxSvgCanvas2D.prototype.updateTextNodes;
	mxSvgCanvas2D.prototype.updateTextNodes = function(x, y, w, h, align, valign, wrap, overflow, clip, rotation, g)
	{
		mxSvgCanvas2DUpdateTextNodes.apply(this, arguments);
		Graph.processFontAttributes(g);
	};
		
	/**
	 * Handles custom fonts in labels.
	 */
	var mxTextRedraw = mxText.prototype.redraw;
	mxText.prototype.redraw = function()
	{
		mxTextRedraw.apply(this, arguments);
		
		// Handles label rendered without foreign object
		if (this.node != null && this.node.nodeName == 'DIV')
		{
			Graph.processFontAttributes(this.node);
		}
	};

	Graph.prototype.createTagsDialog = function(isEnabled, invert, addFn)
	{
		var graph = this;
		var allTags = graph.hiddenTags.slice();
		
		var div = document.createElement('div');
		div.style.userSelect = 'none';
		div.style.overflow = 'hidden';
		div.style.padding = '10px';
		div.style.height = '100%';
		
		var tagCloud = document.createElement('div');
		tagCloud.style.boxSizing = 'border-box';
		tagCloud.style.borderRadius = '4px';
		tagCloud.style.userSelect = 'none';
		tagCloud.style.overflow = 'auto';
		tagCloud.style.position = 'absolute';
		tagCloud.style.left = '10px';
		tagCloud.style.right = '10px';
		tagCloud.style.top = '10px';
		tagCloud.style.border = (graph.isEnabled()) ? '1px solid #808080' : 'none';
		tagCloud.style.bottom = (graph.isEnabled()) ? '48px' : '10px';
	
		div.appendChild(tagCloud);

		function removeInvisibleSelectionCells()
		{
			var cells = graph.getSelectionCells();
			var visible = [];

			for (var i = 0; i < cells.length; i++)
			{
				if (graph.isCellVisible(cells[i]))
				{
					visible.push(cells[i]);	
				}
			}

			graph.setSelectionCells(visible);
		};

		function setAllVisible(visible)
		{
			if (visible)
			{
				graph.hiddenTags = [];
			}
			else
			{
				graph.hiddenTags = allTags.slice();
			}

			removeInvisibleSelectionCells();
			graph.refresh();
		};

		var resetBtn = mxUtils.button(mxResources.get('reset'), function(evt)
		{
			graph.hiddenTags = [];

			if (!mxEvent.isShiftDown(evt))
			{
				allTags = graph.hiddenTags.slice();
			}

			removeInvisibleSelectionCells();
			graph.refresh();
		});
		
		resetBtn.setAttribute('title', mxResources.get('reset'));
		resetBtn.className = 'geBtn';
		resetBtn.style.margin = '0 4px 0 0';

		var addBtn = mxUtils.button(mxResources.get('add'), function()
		{
			if (addFn != null)
			{
				// Takes all tags and callback to update all tags
				addFn(allTags, function(newAllTags)
				{
					allTags = newAllTags;
					refreshUi();
				});
			}
		});
		addBtn.setAttribute('title', mxResources.get('add'));
		addBtn.className = 'geBtn';
		addBtn.style.margin = '0';
	
		graph.addListener(mxEvent.ROOT, function()
		{
			allTags = graph.hiddenTags.slice();
		});
	
		function refreshTags(tags, selected)
		{
			tagCloud.innerHTML = '';
	
			if (tags.length > 0)
			{
				var table = document.createElement('table');
				table.setAttribute('cellpadding', '2');
				table.style.boxSizing = 'border-box';
				table.style.tableLayout = 'fixed';
				table.style.width = '100%';
	
				var tbody = document.createElement('tbody');

				if (tags != null && tags.length > 0)
				{
					for (var i = 0; i < tags.length; i++)
					{
						(function(tag)
						{
							function setTagVisible()
							{
								var temp = allTags.slice();
								var index = mxUtils.indexOf(temp, tag);
								temp.splice(index, 1);
								graph.hiddenTags = temp;
								removeInvisibleSelectionCells();
								graph.refresh();
							};

							function selectCells()
							{
								var cells = graph.getCellsForTags(
									[tag], null, null, true);

								if (graph.isEnabled())
								{
									graph.setSelectionCells(cells);
								}
								else
								{
									graph.highlightCells(cells);
								}
							};

							var visible = mxUtils.indexOf(graph.hiddenTags, tag) < 0;
							var row = document.createElement('tr');
							var td = document.createElement('td');
							td.style.align = 'center';
							td.style.width = '16px';

							var img = document.createElement('img');
							img.setAttribute('src', visible ? Editor.visibleImage : Editor.hiddenImage);
							img.setAttribute('title', mxResources.get(visible ? 'hideIt' : 'show', [tag]));
							mxUtils.setOpacity(img, visible ? 75 : 25);
							img.style.verticalAlign = 'middle';
							img.style.cursor = 'pointer';
							img.style.width = '16px';
							
							if (invert || Editor.isDarkMode())
							{
								img.style.filter = 'invert(100%)';
							}
							
							td.appendChild(img);

							mxEvent.addListener(img, 'click', function(evt)
							{
								var idx = mxUtils.indexOf(graph.hiddenTags, tag);

								if (mxEvent.isShiftDown(evt))
								{
									setAllVisible(mxUtils.indexOf(graph.hiddenTags, tag) >= 0);
								}
								else
								{
									if (idx < 0)
									{
										graph.hiddenTags.push(tag);
									}
									else if (idx >= 0)
									{
										graph.hiddenTags.splice(idx, 1);
									}

									removeInvisibleSelectionCells();
									graph.refresh();
								}

								mxEvent.consume(evt);
							});
							
							row.appendChild(td);

							td = document.createElement('td');
							td.style.overflow = 'hidden';
							td.style.whiteSpace = 'nowrap';
							td.style.textOverflow = 'ellipsis';
							td.style.verticalAlign = 'middle';
							td.style.cursor = 'pointer';
							td.setAttribute('title', tag);
	
							a = document.createElement('a');
							mxUtils.write(a, tag);
							a.style.textOverflow = 'ellipsis';
							a.style.position = 'relative';
							mxUtils.setOpacity(a, visible ? 100 : 40);
							td.appendChild(a);
	
							mxEvent.addListener(td, 'click', (function(evt)
							{
								if (mxEvent.isShiftDown(evt))
								{
									setAllVisible(true);
									selectCells();	
								}
								else
								{
									if (visible && graph.hiddenTags.length > 0)
									{
										setAllVisible(true);
									}
									else
									{
										setTagVisible();
									}
								}

								mxEvent.consume(evt);
							}));

							row.appendChild(td);

							if (graph.isEnabled())
							{
								td = document.createElement('td');
								td.style.verticalAlign = 'middle';
								td.style.textAlign = 'center';
								td.style.width = '18px';
	
								if (selected == null)
								{
									td.style.align = 'center';
									td.style.width = '16px';
		
									var img = document.createElement('img');
									img.setAttribute('src', Editor.crossImage);
									img.setAttribute('title', mxResources.get('removeIt', [tag]));
									mxUtils.setOpacity(img, visible ? 75 : 25);
									img.style.verticalAlign = 'middle';
									img.style.cursor = 'pointer';
									img.style.width = '16px';

									if (invert || Editor.isDarkMode())
									{
										img.style.filter = 'invert(100%)';
									}

									mxEvent.addListener(img, 'click', function(evt)
									{
										var idx = mxUtils.indexOf(allTags, tag);

										if (idx >= 0)
										{
											allTags.splice(idx, 1);
										}

										graph.removeTagsForCells(
											graph.model.getDescendants(
											graph.model.getRoot()), [tag]);
										graph.refresh();

										mxEvent.consume(evt);
									});

									td.appendChild(img);
								}
								else
								{
									var cb2 = document.createElement('input');
									cb2.setAttribute('type', 'checkbox');
									cb2.style.margin = '0px';
		
									cb2.defaultChecked = (selected != null &&
										mxUtils.indexOf(selected, tag) >= 0);
									cb2.checked = cb2.defaultChecked;
									cb2.style.background = 'transparent';
									cb2.setAttribute('title', mxResources.get(
										cb2.defaultChecked ?
										'removeIt' : 'add', [tag]));
		
									mxEvent.addListener(cb2, 'change', function(evt)
									{
										if (cb2.checked)
										{
											graph.addTagsForCells(graph.getSelectionCells(), [tag]);
										}
										else
										{
											graph.removeTagsForCells(graph.getSelectionCells(), [tag]);
										}
									
										mxEvent.consume(evt);
									});
		
									td.appendChild(cb2);
								}

								row.appendChild(td);
							}
	
							tbody.appendChild(row);
						})(tags[i]);
					}
				}
	
				table.appendChild(tbody);
				tagCloud.appendChild(table);
			}
		};
	
		var refreshUi = mxUtils.bind(this, function(sender, evt)
		{
			if (isEnabled())
			{
				var tags = graph.getAllTags();
	
				for (var i = 0; i < tags.length; i++)
				{
					if (mxUtils.indexOf(allTags, tags[i]) < 0)
					{
						allTags.push(tags[i]);
					}
				}
	
				allTags.sort();
	
				if (graph.isSelectionEmpty())
				{
					refreshTags(allTags);
				}
				else
				{
					refreshTags(allTags, graph.getCommonTagsForCells(
						graph.getSelectionCells()));
				}
			}
		});
	
		graph.selectionModel.addListener(mxEvent.CHANGE, refreshUi);
		graph.model.addListener(mxEvent.CHANGE, refreshUi);
		graph.addListener(mxEvent.REFRESH, refreshUi);
	
		var footer = document.createElement('div');
		footer.style.boxSizing = 'border-box';
		footer.style.whiteSpace = 'nowrap';
		footer.style.position = 'absolute';
		footer.style.overflow = 'hidden';
		footer.style.bottom = '0px';
		footer.style.height = '42px';
		footer.style.right = '10px';
		footer.style.left = '10px';

		if (graph.isEnabled())
		{
			footer.appendChild(resetBtn);
			footer.appendChild(addBtn);
			div.appendChild(footer);
		}

		return {div: div, refresh: refreshUi};
	};
	
	/**
	 * Returns all custom fonts (old and new).
	 */
	Graph.prototype.getCustomFonts = function()
	{
		var fonts = this.extFonts;
		
		if (fonts != null)
		{
			fonts = fonts.slice();
		}
		else
		{
			fonts = [];
		}
		
		for (var key in Graph.customFontElements)
		{
			var font = Graph.customFontElements[key];
			fonts.push({name: font.name, url: font.url});
		}
		
		return fonts;
	};
	
	/**
	 * Assigns the given custom font to the selected text.
	 */
	Graph.prototype.setFont = function(name, url)
	{
		// Adds the font element to the document
		Graph.addFont(name, url);
		
		// Only valid known fonts are allowed as parameters so we set
		// the real font name and the data-source-face in the element
		// which is used as the face attribute when editing stops
		// KNOWN: Undo for the DOM change is not working
		document.execCommand('fontname', false, name);

		// Finds element with new font name and checks its data-font-src attribute
		if (url != null)
		{
			var fonts = this.cellEditor.textarea.getElementsByTagName('font');
			
			// Enforces consistent font naming
			url = Graph.getFontUrl(name, url);
			
			for (var i = 0; i < fonts.length; i++)
			{
				if (fonts[i].getAttribute('face') == name)
				{
					if (fonts[i].getAttribute('data-font-src') != url)
					{
						fonts[i].setAttribute('data-font-src', url);
					}
				}
			}
		}
	};
	
	/**
	 * Disables fast zoom with shadow in lightbox for Safari
	 * to work around blank output on retina screen.
	 */
	var graphIsFastZoomEnabled = Graph.prototype.isFastZoomEnabled;
	
	Graph.prototype.isFastZoomEnabled = function()
	{
		return graphIsFastZoomEnabled.apply(this, arguments) && (!this.shadowVisible || !mxClient.IS_SF);
	};
	
	/**
	 * Updates the global variables from the vars URL parameter.
	 */
	Graph.prototype.updateGlobalUrlVariables = function()
	{
		this.globalVars = Editor.globalVars;
		
		if (urlParams['vars'] != null)
		{
			try
			{
				this.globalVars = (this.globalVars != null) ? mxUtils.clone(this.globalVars) : {};
				var vars = JSON.parse(decodeURIComponent(urlParams['vars']));
				
				if (vars != null)
				{
					for (var key in vars)
					{
						this.globalVars[key] = vars[key];
					}
				}
			}
			catch (e)
			{
				if (window.console != null)
				{
					console.log('Error in vars URL parameter: ' + e);
				}
			}
		}
	};

	/**
	 * Returns all global variables used for export. This function never returns null.
	 * This can be overridden by plugins to return global variables for export.
	 */
	Graph.prototype.getExportVariables = function()
	{
		return (this.globalVars != null) ? mxUtils.clone(this.globalVars) : {};
	};
	
	/**
	 * Adds support for vars URL parameter.
	 */
	var graphGetGlobalVariable = Graph.prototype.getGlobalVariable;
	
	Graph.prototype.getGlobalVariable = function(name)
	{
		var val = graphGetGlobalVariable.apply(this, arguments);
		
		if (val == null && this.globalVars != null)
		{
			val = this.globalVars[name];
		}
		
		return val;
	};

	/**
	 * Cached default stylesheet for image export in dark mode.
	 */
	Graph.prototype.getDefaultStylesheet = function()
	{
		if (this.defaultStylesheet == null)
		{
			var node = this.themes['default-style2'];
			var dec = new mxCodec(node.ownerDocument);
			this.defaultStylesheet = dec.decode(node);
		}
		
		return this.defaultStylesheet;
	};
	
	/**
	 * Overiddes function to use url parameter
	 */
	Graph.prototype.isViewer = function()
	{
		return urlParams['viewer'];
	};

	/**
	 * Temporarily overrides stylesheet during image export in dark mode.
	 */
	var graphGetSvg = Graph.prototype.getSvg;
	
	Graph.prototype.getSvg = function(background, scale, border, nocrop, crisp,
		ignoreSelection, showText, imgExport, linkTarget, hasShadow,
		incExtFonts, keepTheme, exportType, cells)
	{
		var temp = null;
		var tempFg = null;
		var tempBg = null;
		
		if (!keepTheme && this.themes != null && this.defaultThemeName == 'darkTheme')
		{
			temp = this.stylesheet;
			tempFg = this.shapeForegroundColor;
			tempBg = this.shapeBackgroundColor;
			this.shapeForegroundColor = (this.defaultThemeName == 'darkTheme') ?
				'#000000' : Editor.lightColor;
			this.shapeBackgroundColor = (this.defaultThemeName == 'darkTheme') ?
				'#ffffff' : Editor.darkColor;
			this.stylesheet = this.getDefaultStylesheet();
			// LATER: Fix math export in dark mode by fetching text nodes before
			// calling refresh and changing the font color in-place
			this.refresh();
		}
		
		var result = graphGetSvg.apply(this, arguments);
		var extFonts = this.getCustomFonts();
		
		// Adds external fonts
		if (incExtFonts && extFonts.length > 0)
		{
			var svgDoc = result.ownerDocument;
			var style = (svgDoc.createElementNS != null) ?
		    	svgDoc.createElementNS(mxConstants.NS_SVG, 'style') : svgDoc.createElement('style');
			svgDoc.setAttributeNS != null? style.setAttributeNS('type', 'text/css') : style.setAttribute('type', 'text/css');
			
			var prefix = '';
			var postfix = '';
			    	
			for (var i = 0; i < extFonts.length; i++)
			{
				var fontName = extFonts[i].name, fontUrl = extFonts[i].url;
				
				if (Graph.isCssFontUrl(fontUrl))
				{
					prefix += '@import url(' + fontUrl + ');\n';
				}
				else
				{
					postfix += '@font-face {\n' +
			            'font-family: "' + fontName + '";\n' + 
			            'src: url("' + fontUrl + '");\n}\n';
				}				
			}
			
			style.appendChild(svgDoc.createTextNode(prefix + postfix));
			result.getElementsByTagName('defs')[0].appendChild(style);
		}
		
		if (temp != null)
		{
			this.shapeBackgroundColor = tempBg;
			this.shapeForegroundColor = tempFg;
			this.stylesheet = temp;
			this.refresh();
		}
		
		return result;
	};
	
	/**
	 * Overridden to support client-side math typesetting.
	 */
	var graphCreateSvgImageExport = Graph.prototype.createSvgImageExport;
	
	Graph.prototype.createSvgImageExport = function()
	{
		var imgExport = graphCreateSvgImageExport.apply(this, arguments);
		
		if (this.mathEnabled)
		{
			var drawText = imgExport.drawText;
			
			// Replaces input with rendered markup
			imgExport.drawText = function(state, c)
			{
				if (state.text != null && state.text.value != null && state.text.checkBounds() &&
					(mxUtils.isNode(state.text.value) || state.text.dialect == mxConstants.DIALECT_STRICTHTML))
				{
					var clone = state.text.getContentNode();
					
					if (clone != null)
					{
						clone = clone.cloneNode(true);
						
						// Removes duplicate math output
						if (clone.getElementsByTagNameNS)
						{
							var ele = clone.getElementsByTagNameNS('http://www.w3.org/1998/Math/MathML', 'math');
							
							while (ele.length > 0)
							{
								ele[0].parentNode.removeChild(ele[0]);
							}
						}
						
						if (clone.innerHTML != null)
						{
							var prev = state.text.value;
							state.text.value = clone.innerHTML;
							drawText.apply(this, arguments);
							state.text.value = prev;
						}
					}
				}
				else
				{
					drawText.apply(this, arguments);
				}
			};
		}
		
		return imgExport;
	};

	/**
	 * Adds workaround for math rendering in Chrome.
	 * 
	 * Workaround for https://bugs.webkit.org/show_bug.cgi?id=93358 in WebKit
	 * 
	 * Adding an absolute position DIV before the SVG seems to mitigate the problem.
	 */
	var graphViewValidateBackgroundPage = mxGraphView.prototype.validateBackgroundPage;
	
	mxGraphView.prototype.validateBackgroundPage = function()
	{
		graphViewValidateBackgroundPage.apply(this, arguments);
		
		if (mxClient.IS_GC && this.getDrawPane() != null)
		{
			var g = this.getDrawPane().parentNode;
			
			if (this.graph.mathEnabled && !mxClient.NO_FO &&
				(this.webKitForceRepaintNode == null ||
				this.webKitForceRepaintNode.parentNode == null) &&
				this.graph.container.firstChild.nodeName == 'svg')
			{
				this.webKitForceRepaintNode = document.createElement('div');
				this.webKitForceRepaintNode.style.cssText = 'position:absolute;';
				g.ownerSVGElement.parentNode.insertBefore(this.webKitForceRepaintNode, g.ownerSVGElement);
			}
			else if (this.webKitForceRepaintNode != null && (!this.graph.mathEnabled ||
					(this.graph.container.firstChild.nodeName != 'svg' &&
					this.graph.container.firstChild != this.webKitForceRepaintNode)))
			{
				if (this.webKitForceRepaintNode.parentNode != null)
				{
					this.webKitForceRepaintNode.parentNode.removeChild(this.webKitForceRepaintNode);
				}
				
				this.webKitForceRepaintNode = null;
			}
		}
	};

	/**
	 * Updates the SVG for the background image if it references another page.
	 */
	var graphRefresh = Graph.prototype.refresh;
	Graph.prototype.refresh = function()
	{
		graphRefresh.apply(this, arguments);
		this.refreshBackgroundImage();
	};
				 
	/**
	 * Updates the SVG for the background image if it references another page.
	 */
	Graph.prototype.refreshBackgroundImage = function()
	{
		if (this.backgroundImage != null && this.backgroundImage.originalSrc != null)
		{
			this.setBackgroundImage(this.backgroundImage);
			this.view.validateBackgroundImage();
		}
	};
	
	/**
	 * Sets default style (used in editor.get/setGraphXml below)
	 */
	var graphLoadStylesheet = Graph.prototype.loadStylesheet;
	
	Graph.prototype.loadStylesheet = function()
	{
		graphLoadStylesheet.apply(this, arguments);
		this.currentStyle = 'default-style2';
	};

	/**
	 * Adds support for data:action/json,{"actions":[actions]} where actions is
	 * a comma-separated list of JSON objects.
	 * 
	 * An example action is:
	 * 
	 * data:action/json,{"actions":[{"toggle": {"cells": ["3", "4"]}}]}
	 * 
	 * This toggles the visible state of the cells with ID 3 and 4.
	 */
	Graph.prototype.handleCustomLink = function(href)
	{
		if (href.substring(0, 17) == 'data:action/json,')
		{
			var link = JSON.parse(href.substring(17));

			if (link.actions != null)
			{
				this.executeCustomActions(link.actions);
			}
		}
	};
		
	/**
	 * Runs the given actions and invokes done when all actions have been executed.
	 * When adding new actions that reference cell IDs support for updating
	 * those cell IDs must be handled in Graph.updateCustomLinkActions
	 */
	Graph.prototype.executeCustomActions = function(actions, done)
	{
		if (!this.executingCustomActions)
		{
			this.executingCustomActions = true;
			var updatingModel = false;
			var waitCounter = 0;
			var index = 0;

			var beginUpdate = mxUtils.bind(this, function()
			{
				if (!updatingModel)
				{
					updatingModel = true;
					this.model.beginUpdate();
				}
			});

			var endUpdate = mxUtils.bind(this, function()
			{
				if (updatingModel)
				{
					updatingModel = false;
					this.model.endUpdate();
				}
			});

			var waitAndExecute = mxUtils.bind(this, function()
			{
				if (waitCounter > 0)
				{
					waitCounter--;
				}

				if (waitCounter == 0)
				{
					executeNextAction()
				}
			});

			var executeNextAction = mxUtils.bind(this, function()
			{
				if (index < actions.length)
				{
					var stop = this.stoppingCustomActions;
					var action = actions[index++];
					var animations = [];

					// Executes open actions before starting transaction
					if (action.open != null)
					{
						endUpdate();

						if (this.isCustomLink(action.open))
						{
							if (!this.customLinkClicked(action.open))
							{
								return;
							}
						}
						else
						{
							this.openLink(action.open);
						}
					}

					if (action.wait != null && !stop)
					{
						this.pendingExecuteNextAction = mxUtils.bind(this, function()
						{
							this.pendingExecuteNextAction = null;
							this.pendingWaitThread = null;
							waitAndExecute();
						});

						waitCounter++;
						this.pendingWaitThread = window.setTimeout(this.pendingExecuteNextAction,
							(action.wait != '') ? parseInt(action.wait) : 1000);
						endUpdate();
					}

					if (action.opacity != null && action.opacity.value != null)
					{
						Graph.setOpacityForNodes(this.getNodesForCells(
							this.getCellsForAction(action.opacity, true)),
							action.opacity.value);
					}

					if (action.fadeIn != null)
					{
						waitCounter++;
						Graph.fadeNodes(this.getNodesForCells(
							this.getCellsForAction(action.fadeIn, true)),
							0, 1, waitAndExecute, (stop) ?
							0 : action.fadeIn.delay);
					}

					if (action.fadeOut != null)
					{
						waitCounter++;
						Graph.fadeNodes(this.getNodesForCells(
							this.getCellsForAction(action.fadeOut, true)),
							1, 0, waitAndExecute, (stop) ?
							0 : action.fadeOut.delay);
					}

					if (action.wipeIn != null)
					{
						animations = animations.concat(this.createWipeAnimations(
							this.getCellsForAction(action.wipeIn, true), true));
					}

					if (action.wipeOut != null)
					{
						animations = animations.concat(this.createWipeAnimations(
							this.getCellsForAction(action.wipeOut, true), false));
					}

					// Executes all actions that change cell states
					if (action.toggle != null)
					{
						beginUpdate();
						this.toggleCells(this.getCellsForAction(action.toggle, true));
					}

					if (action.show != null)
					{
						beginUpdate();
						var temp = this.getCellsForAction(action.show, true);
						Graph.setOpacityForNodes(this.getNodesForCells(temp), 1);
						this.setCellsVisible(temp, true);
					}

					if (action.hide != null)
					{
						beginUpdate();
						var temp = this.getCellsForAction(action.hide, true);
						Graph.setOpacityForNodes(this.getNodesForCells(temp), 0);
						this.setCellsVisible(temp, false);
					}
					
					if (action.toggleStyle != null && action.toggleStyle.key != null)
					{
						beginUpdate();
						this.toggleCellStyles(action.toggleStyle.key, (action.toggleStyle.defaultValue != null) ?
							action.toggleStyle.defaultValue : '0', this.getCellsForAction(action.toggleStyle, true));
					}

					if (action.style != null && action.style.key != null)
					{
						beginUpdate();
						this.setCellStyles(action.style.key, action.style.value,
							this.getCellsForAction(action.style, true));
					}

					// Executes stateless actions on cells
					var cells = [];
						
					if (action.select != null && this.isEnabled())
					{
						cells = this.getCellsForAction(action.select);
						this.setSelectionCells(cells);
					}

					if (action.highlight != null)
					{
						cells = this.getCellsForAction(action.highlight);
						this.highlightCells(cells, action.highlight.color,
							action.highlight.duration,
							action.highlight.opacity);
					}

					if (action.scroll != null)
					{
						cells = this.getCellsForAction(action.scroll);
					}
					
					if (action.viewbox != null)
					{
						this.fitWindow(action.viewbox, action.viewbox.border);
					}
					
					if (cells.length > 0)
					{
						this.scrollCellToVisible(cells[0]);
					}

					if (action.tags != null)
					{
						var hidden = [];
						
						if (action.tags.hidden != null)
						{
							hidden = hidden.concat(action.tags.hidden);
						}

						if (action.tags.visible != null)
						{
							var all = this.getAllTags();

							for (var i = 0; i < all.length; i++)
							{
								if (mxUtils.indexOf(action.tags.visible, all[i]) < 0 &&
									mxUtils.indexOf(hidden, all[i]) < 0)
								{
									hidden.push(all[i]);
								}
							}
						}

						this.hiddenTags = hidden;
						this.refresh();
					}

					if (animations.length > 0)
					{
						waitCounter++;
						this.executeAnimations(animations, waitAndExecute,
							(stop) ? 1 : action.steps,
							(stop) ? 0 : action.delay);
					}

					if (waitCounter == 0)
					{
						executeNextAction();
					}
					else
					{
						endUpdate();
					}
				}
				else
				{
					this.executingCustomActions = false;
					this.stoppingCustomActions = false;
					endUpdate();

					if (done != null)
					{
						done();
					}
				}
			});

			executeNextAction();
		}
		else
		{
			this.stoppingCustomActions = true;

			if (this.pendingWaitThread != null)
			{
				window.clearTimeout(this.pendingWaitThread);
			}

			if (this.pendingExecuteNextAction != null)
			{
				this.pendingExecuteNextAction();
			}

			this.fireEvent(new mxEventObject('stopExecutingCustomActions'));
		}
	};

	/**
	 * Updates cell IDs in custom links on the given cell and its label.
	 */
	Graph.prototype.doUpdateCustomLinksForCell = function(mapping, cell)
	{
		var href = this.getLinkForCell(cell);
		
		if (href != null && href.substring(0, 17) == 'data:action/json,')
		{
			this.setLinkForCell(cell, this.updateCustomLink(mapping, href));
		}
		
		if (this.isHtmlLabel(cell))
		{
			var temp = document.createElement('div');
			temp.innerHTML = this.sanitizeHtml(this.getLabel(cell));
			var links = temp.getElementsByTagName('a');
			var changed = false;
			
			for (var i = 0; i < links.length; i++)
			{
				href = links[i].getAttribute('href');
				
				if (href != null && href.substring(0, 17) == 'data:action/json,')
				{
					links[i].setAttribute('href', this.updateCustomLink(mapping, href));
					changed = true;
				}
			}
			
			if (changed)
			{
				this.labelChanged(cell, temp.innerHTML);
			}
		}
	};
	
	/**
	 * Updates cell IDs in the given custom link and returns the updated link.
	 */
	Graph.prototype.updateCustomLink = function(mapping, href)
	{
		if (href.substring(0, 17) == 'data:action/json,')
		{
			try
			{
				var link = JSON.parse(href.substring(17));

				if (link.actions != null)
				{
					this.updateCustomLinkActions(mapping, link.actions);
					href = 'data:action/json,' + JSON.stringify(link);
				}
			}
			catch (e)
			{
				// Ignore
			}
		}
		
		return href;
	};

	/**
	 * Updates cell IDs in the given custom link actions.
	 */
	Graph.prototype.updateCustomLinkActions = function(mapping, actions)
	{
		for (var i = 0; i < actions.length; i++)
		{
			var action = actions[i];

			for (var name in action)
			{
				this.updateCustomLinkAction(mapping, action[name], 'cells');
				this.updateCustomLinkAction(mapping, action[name], 'excludeCells');
			}
		}
	};
	
	/**
	 * Updates cell IDs in the given custom link action.
	 */
	Graph.prototype.updateCustomLinkAction = function(mapping, action, name)
	{
		if (action != null && action[name] != null)
		{
			var result = [];
			
			for (var i = 0; i < action[name].length; i++)
			{
				if (action[name][i] == '*')
				{
					result.push(action[name][i]);
				}
				else
				{
					var temp = mapping[action[name][i]];
					
					if (temp != null)
					{
						if (temp != '')
						{
							result.push(temp);
						}
					}
					else
					{
						result.push(action[name][i]);
					}
				}
			}
			
			action[name] = result;
		}
	};
	
	/**
	 * Handles each action in the action array of a custom link. This code
	 * handles toggle actions for cell IDs.
	 */
	Graph.prototype.getCellsForAction = function(action, layers)
	{
		var result = this.getCellsById(action.cells).concat(
			this.getCellsForTags(action.tags, null, layers));

		// Removes excluded cells
		if (action.excludeCells != null)
		{
			var temp = [];

			for (var i = 0; i < result.length; i++)
			{
				if (action.excludeCells.indexOf(result[i].id) < 0)
				{
					temp.push(result[i]);
				}
			}

			result = temp;
		}

		return result;
	};
	
	/**
	 * Returns the cells in the model (or given array) that have all of the
	 * given tags in their tags property.
	 */
	Graph.prototype.getCellsById = function(ids)
	{
		var result = [];
		
		if (ids != null)
		{
			for (var i = 0; i < ids.length; i++)
			{
				if (ids[i] == '*')
				{
					var parent = this.model.getRoot();
					
					result = result.concat(this.model.filterDescendants(function(cell)
					{
						return cell != parent;
					}, parent));
				}
				else
				{
					var cell = this.model.getCell(ids[i]);
					
					if (cell != null)
					{
						result.push(cell);
					}
				}
			}
		}
		
		return result;
	};

	/**
	 * Adds support for custom fonts in cell styles.
	 */
	var graphIsCellVisible = Graph.prototype.isCellVisible;
	Graph.prototype.isCellVisible = function(cell)
	{
		return graphIsCellVisible.apply(this, arguments) &&
			!this.isAllTagsHidden(this.getTagsForCell(cell));
	};
  
	/**
	 * Returns the cells in the model (or given array) that have all of the
	 * given tags in their tags property.
	 */
	Graph.prototype.isAllTagsHidden = function(tags)
	{
		if (tags == null || tags.length == 0 ||
			this.hiddenTags.length == 0)
		{
			return false;
		}
		else
		{
			var tmp = tags.split(' ');

			if (tmp.length > this.hiddenTags.length)
			{
				return false;
			}
			else
			{
				for (var i = 0; i < tmp.length; i++)
				{
					if (mxUtils.indexOf(this.hiddenTags, tmp[i]) < 0)
					{
						return false;
					}
				}
				
				return true;
			}
		}
	};

	/**
	 * Returns the cells in the model (or given array) that have all of the
	 * given tags in their tags property.
	 */
	Graph.prototype.getCellsForTags = function(tagList, cells, includeLayers, checkVisible)
	{
		var result = [];
		
		if (tagList != null)
		{
			cells = (cells != null) ? cells : this.model.getDescendants(this.model.getRoot());
			
			var tagCount = 0;
			var lookup = {};
			
			for (var i = 0; i < tagList.length; i++)
			{
				if (tagList[i].length > 0)
				{
					lookup[tagList[i]] = true;
					tagCount++;
				}
			}
			
			for (var i = 0; i < cells.length; i++)
			{
				if ((includeLayers && this.model.getParent(cells[i]) == this.model.root) ||
					this.model.isVertex(cells[i]) || this.model.isEdge(cells[i]))
				{
					var tags = this.getTagsForCell(cells[i]);
					var match = false;
	
					if (tags.length > 0)
					{
						var tmp = tags.split(' ');
						
						if (tmp.length >= tagList.length)
						{
							var matchCount = 0;
							
							for (var j = 0; j < tmp.length && (matchCount < tagCount); j++)
							{
								if (lookup[tmp[j]] != null)
								{
									matchCount++;
								}
							}
							
							match = matchCount == tagCount;
						}
					}
					
					if (match && ((checkVisible != true) || this.isCellVisible(cells[i])))
					{
						result.push(cells[i]);
					}
				}
			}
		}
		
		return result;
	};
	/**
	 * Returns all tags in the diagram.
	 */
	Graph.prototype.getAllTags = function()
	{
		return this.getTagsForCells(
			this.model.getDescendants(
				this.model.getRoot()));
		
	};

	/**
	 * Returns the common tags for the given cells as a array.
	 */
	Graph.prototype.getCommonTagsForCells = function(cells)
	{
		var commonTokens = null;
		var validTags = [];
		 
		for (var i = 0; i < cells.length; i++)
		{
			var tags = this.getTagsForCell(cells[i]);
			validTags = [];
 
			if (tags.length > 0)
			{
				var tokens = tags.split(' ');
				var temp = {};
				 
				for (var j = 0; j < tokens.length; j++)
				{
					if (commonTokens == null || commonTokens[tokens[j]] != null)
					{
						temp[tokens[j]] = true;
						validTags.push(tokens[j]);
					}
				}
				 
				commonTokens = temp;
			}
			else
			{
				return [];
			}
		}
	 
		return validTags;
	};
 
	/**
	 * Returns all tags for the given cells as an array.
	 */
	Graph.prototype.getTagsForCells = function(cells)
	{
		var tokens = [];
		var temp = {};
		
		for (var i = 0; i < cells.length; i++)
		{
			var tags = this.getTagsForCell(cells[i]);

			if (tags.length > 0)
			{
				var t = tags.split(' ');
				
				for (var j = 0; j < t.length; j++)
				{
					if (temp[t[j]] == null)
					{
						temp[t[j]] = true;
						tokens.push(t[j]);
					}
				}
			}
		}
		
		return tokens;
	};

	/**
	 * Returns the tags for the given cell as a string.
	 */
	Graph.prototype.getTagsForCell = function(cell)
	{
		return this.getAttributeForCell(cell, 'tags', '');
	};

	/**
	 * Adds the given array of tags to the given array cells.
	 */
	Graph.prototype.addTagsForCells = function(cells, tagList)
	{
		if (cells.length > 0 && tagList.length > 0)
		{
			this.model.beginUpdate();
			
			try
			{
				for (var i = 0; i < cells.length; i++)
				{
					var temp = this.getTagsForCell(cells[i]);
					var tags = temp.split(' ');
					var changed = false;
		
					for (var j = 0; j < tagList.length; j++)
					{
						var tag = mxUtils.trim(tagList[j]);

						if (tag != '' && mxUtils.indexOf(tags, tag) < 0)
						{
							temp = (temp.length > 0) ? temp + ' ' + tag : tag;
							changed = true;
						}
					}
					
					if (changed)
					{
						this.setAttributeForCell(cells[i], 'tags', temp);
					}
				}
			}
			finally
			{
				this.model.endUpdate();
			}
		}
	};

	/**
	 * Removes the given array of tags from the given array cells.
	 */
	Graph.prototype.removeTagsForCells = function(cells, tagList)
	{
		if (cells.length > 0 && tagList.length > 0)
		{
			this.model.beginUpdate();
			
			try
			{
				for (var i = 0; i < cells.length; i++)
				{
					var tags = this.getTagsForCell(cells[i]);
					
					if (tags.length > 0)
					{
						var tokens = tags.split(' ');
						var changed = false;
						
						for (var j = 0; j < tagList.length; j++)
						{
							var idx = mxUtils.indexOf(tokens, tagList[j]);
							
							if (idx >= 0)
							{
								tokens.splice(idx, 1);
								changed = true;
							}
						}

						if (changed)
						{
							this.setAttributeForCell(cells[i], 'tags', tokens.join(' '));
						}
					}
				}
			}
			finally
			{
				this.model.endUpdate();
			}
		}
	};
 
	/**
	 * Shows or hides the given cells.
	 */
	Graph.prototype.toggleCells = function(cells)
	{
		this.model.beginUpdate();
		try
		{
			for (var i = 0; i < cells.length; i++)
			{
				this.model.setVisible(cells[i], !this.model.isVisible(cells[i]))
			}
		}
		finally
		{
			this.model.endUpdate();
		}
	};
	
	/**
	 * Shows or hides the given cells.
	 */
	Graph.prototype.setCellsVisible = function(cells, visible)
	{
		this.model.beginUpdate();
		try
		{
			for (var i = 0; i < cells.length; i++)
			{
				this.model.setVisible(cells[i], visible);
			}
		}
		finally
		{
			this.model.endUpdate();
		}
	};
	
	/**
	 * Highlights the given cell.
	 */
	Graph.prototype.highlightCells = function(cells, color, duration, opacity)
	{
		for (var i = 0; i < cells.length; i++)
		{
			this.highlightCell(cells[i], color, duration, opacity);
		}
	};
	
	/**
	 * Highlights the given cell.
	 */
	Graph.prototype.highlightCell = function(cell, color, duration, opacity)
	{
		color = (color != null) ? color : mxConstants.DEFAULT_VALID_COLOR;
		duration = (duration != null) ? duration : 1000;
		var state = this.view.getState(cell);
		
		if (state != null)
		{
			var sw = Math.max(5, mxUtils.getValue(state.style, mxConstants.STYLE_STROKEWIDTH, 1) + 4);
			var hl = new mxCellHighlight(this, color, sw, false);
			
			if (opacity != null)
			{
				hl.opacity = opacity;
			}
			
			hl.highlight(state);
			
			// Fades out the highlight after a duration
			window.setTimeout(function()
			{
				if (hl.shape != null)
				{
				 	mxUtils.setPrefixedStyle(hl.shape.node.style, 'transition', 'all 1200ms ease-in-out');
					hl.shape.node.style.opacity = 0;
				}
				
				// Destroys the highlight after the fade
				window.setTimeout(function()
				{
					hl.destroy();
				}, 1200);
			}, duration);
		}
	};

	/**
	 * Adds a shadow filter to the given svg root.
	 */
	Graph.prototype.addSvgShadow = function(svgRoot, group, createOnly, extend)
	{
		createOnly = (createOnly != null) ? createOnly : false;
		extend = (extend != null) ? extend : true;
		
		var svgDoc = svgRoot.ownerDocument;
		
		var filter = (svgDoc.createElementNS != null) ?
			svgDoc.createElementNS(mxConstants.NS_SVG, 'filter') : svgDoc.createElement('filter');
		filter.setAttribute('id', this.shadowId);

		var blur = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'feGaussianBlur') : svgDoc.createElement('feGaussianBlur');
		blur.setAttribute('in', 'SourceAlpha');
		blur.setAttribute('stdDeviation', this.svgShadowBlur);
		blur.setAttribute('result', 'blur');
		filter.appendChild(blur);
		
		var offset = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'feOffset') : svgDoc.createElement('feOffset');
		offset.setAttribute('in', 'blur');
		offset.setAttribute('dx', this.svgShadowSize);
		offset.setAttribute('dy', this.svgShadowSize);
		offset.setAttribute('result', 'offsetBlur');
		filter.appendChild(offset);
		
		var flood = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'feFlood') : svgDoc.createElement('feFlood');
		flood.setAttribute('flood-color', this.svgShadowColor);
		flood.setAttribute('flood-opacity', this.svgShadowOpacity);
		flood.setAttribute('result', 'offsetColor');
		filter.appendChild(flood);
		
		var composite = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'feComposite') : svgDoc.createElement('feComposite');
		composite.setAttribute('in', 'offsetColor');
		composite.setAttribute('in2', 'offsetBlur');
		composite.setAttribute('operator', 'in');
		composite.setAttribute('result', 'offsetBlur');
		filter.appendChild(composite);

		var feBlend = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'feBlend') : svgDoc.createElement('feBlend');
		feBlend.setAttribute('in', 'SourceGraphic');
		feBlend.setAttribute('in2', 'offsetBlur');
		filter.appendChild(feBlend);
		
		// Creates defs element if not available
		var defs = svgRoot.getElementsByTagName('defs');
		var defsElt = null;
		
		if (defs.length == 0)
		{
			defsElt = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'defs') : svgDoc.createElement('defs');
			
			if (svgRoot.firstChild != null)
			{
				svgRoot.insertBefore(defsElt, svgRoot.firstChild);
			}
			else
			{
				svgRoot.appendChild(defsElt);
			}
		}
		else
		{
			defsElt = defs[0];
		}
		
		defsElt.appendChild(filter);
		
		if (!createOnly)
		{
			group = (group != null) ? group : svgRoot.getElementsByTagName('g')[0];
			
			if (group != null)
			{
				group.setAttribute('filter', 'url(#' + this.shadowId + ')');
				
				if (!isNaN(parseInt(svgRoot.getAttribute('width'))) && extend)
				{
					svgRoot.setAttribute('width', parseInt(svgRoot.getAttribute('width')) + 6);
					svgRoot.setAttribute('height', parseInt(svgRoot.getAttribute('height')) + 6);
					
					// Updates viewbox if one exists
					var vb = svgRoot.getAttribute('viewBox');
					
					if (vb != null && vb.length > 0)
					{
						var tokens = vb.split(' ');
						
						if (tokens.length > 3)
						{
							w = parseFloat(tokens[2]) + 6;
							h = parseFloat(tokens[3]) + 6;
							
							svgRoot.setAttribute('viewBox', tokens[0] + ' ' + tokens[1] + ' ' + w + ' ' + h);
						}
					}
				}
			}
		}
		
		return filter;
	};
	
	/**
	 * Loads the stylesheet for this graph.
	 */
	Graph.prototype.setShadowVisible = function(value, fireEvent)
	{
		if (mxClient.IS_SVG && !mxClient.IS_SF)
		{
			fireEvent = (fireEvent != null) ? fireEvent : true;
			this.shadowVisible = value;
			
			if (this.shadowVisible)
			{
				this.view.getDrawPane().setAttribute('filter', 'url(#' + this.shadowId + ')');
			}
			else
			{
				this.view.getDrawPane().removeAttribute('filter');
			}
			
			if (fireEvent)
			{
				this.fireEvent(new mxEventObject('shadowVisibleChanged'));
			}
		}
	};
	
	/**
	 * Selects first unlocked layer if one exists
	 */
	Graph.prototype.selectUnlockedLayer = function()
	{
		if (this.defaultParent == null)
		{
			var childCount = this.model.getChildCount(this.model.root);
			var cell = null;
			var index = 0;
			
			do
			{
				cell = this.model.getChildAt(this.model.root, index);
			} while (index++ < childCount && mxUtils.getValue(this.getCellStyle(cell), 'locked', '0') == '1')
			
			if (cell != null)
			{
				this.setDefaultParent(cell);
			}
		}
	};

	/**
	 * Specifies special libraries that are loaded via dynamic JS. Add cases
	 * where the filename cannot be worked out from the package name. The
	 * standard scheme for this mapping is stencils/packagename.xml. If there
	 * are multiple XML files, any JS files or any anomalies in the filename or
	 * directory that contains the file, then an entry must be added here and
	 * in EmbedServlet2 for the loading of the shapes to work.
	 */
	// Required to avoid 404 for mockup.xml since naming of mxgraph.mockup.anchor does not contain
	// buttons even though it is defined in the mxMockupButtons.js file. This could only be fixed
	// with aliases for existing shapes or aliases for basenames, but this is essentially the same.
	mxStencilRegistry.libraries['mockup'] = [SHAPES_PATH + '/mockup/mxMockupButtons.js'];
	
	mxStencilRegistry.libraries['arrows2'] = [SHAPES_PATH + '/mxArrows.js'];
	mxStencilRegistry.libraries['atlassian'] = [STENCIL_PATH + '/atlassian.xml', SHAPES_PATH + '/mxAtlassian.js'];
	mxStencilRegistry.libraries['bpmn'] = [SHAPES_PATH + '/mxBasic.js', STENCIL_PATH + '/bpmn.xml', SHAPES_PATH + '/bpmn/mxBpmnShape2.js'];
	mxStencilRegistry.libraries['bpmn2'] = [SHAPES_PATH + '/mxBasic.js', STENCIL_PATH + '/bpmn.xml', SHAPES_PATH + '/bpmn/mxBpmnShape2.js'];
	mxStencilRegistry.libraries['c4'] = [SHAPES_PATH + '/mxC4.js'];
	mxStencilRegistry.libraries['cisco19'] = [SHAPES_PATH + '/mxCisco19.js', STENCIL_PATH + '/cisco19.xml'];
	mxStencilRegistry.libraries['cisco_safe'] = [SHAPES_PATH + '/mxCiscoSafe.js', STENCIL_PATH + '/cisco_safe/architecture.xml', STENCIL_PATH + '/cisco_safe/business_icons.xml', STENCIL_PATH + '/cisco_safe/capability.xml', STENCIL_PATH + '/cisco_safe/design.xml', STENCIL_PATH + '/cisco_safe/iot_things_icons.xml', STENCIL_PATH + '/cisco_safe/people_places_things_icons.xml', STENCIL_PATH + '/cisco_safe/security_icons.xml', STENCIL_PATH + '/cisco_safe/technology_icons.xml', STENCIL_PATH + '/cisco_safe/threat.xml'];
	mxStencilRegistry.libraries['dfd'] = [SHAPES_PATH + '/mxDFD.js'];
	mxStencilRegistry.libraries['er'] = [SHAPES_PATH + '/er/mxER.js'];
	mxStencilRegistry.libraries['kubernetes'] = [SHAPES_PATH + '/mxKubernetes.js', STENCIL_PATH + '/kubernetes.xml'];
	mxStencilRegistry.libraries['flowchart'] = [SHAPES_PATH + '/mxFlowchart.js', STENCIL_PATH + '/flowchart.xml'];
	mxStencilRegistry.libraries['ios'] = [SHAPES_PATH + '/mockup/mxMockupiOS.js'];
	mxStencilRegistry.libraries['rackGeneral'] = [SHAPES_PATH + '/rack/mxRack.js', STENCIL_PATH + '/rack/general.xml'];
	mxStencilRegistry.libraries['rackF5'] = [STENCIL_PATH + '/rack/f5.xml'];
	mxStencilRegistry.libraries['lean_mapping'] = [SHAPES_PATH + '/mxLeanMap.js', STENCIL_PATH + '/lean_mapping.xml'];
	mxStencilRegistry.libraries['basic'] = [SHAPES_PATH + '/mxBasic.js', STENCIL_PATH + '/basic.xml'];
	mxStencilRegistry.libraries['ios7icons'] = [STENCIL_PATH + '/ios7/icons.xml'];
	mxStencilRegistry.libraries['ios7ui'] = [SHAPES_PATH + '/ios7/mxIOS7Ui.js', STENCIL_PATH + '/ios7/misc.xml'];
	mxStencilRegistry.libraries['android'] = [SHAPES_PATH + '/mxAndroid.js', STENCIL_PATH + '/android/android.xml'];
	mxStencilRegistry.libraries['electrical/abstract'] = [SHAPES_PATH + '/mxElectrical.js', STENCIL_PATH + '/electrical/abstract.xml'];
	mxStencilRegistry.libraries['electrical/logic_gates'] = [SHAPES_PATH + '/mxElectrical.js', STENCIL_PATH + '/electrical/logic_gates.xml'];
	mxStencilRegistry.libraries['electrical/miscellaneous'] = [SHAPES_PATH + '/mxElectrical.js', STENCIL_PATH + '/electrical/miscellaneous.xml'];
	mxStencilRegistry.libraries['electrical/signal_sources'] = [SHAPES_PATH + '/mxElectrical.js', STENCIL_PATH + '/electrical/signal_sources.xml'];
	mxStencilRegistry.libraries['electrical/transmission'] = [SHAPES_PATH + '/mxElectrical.js', STENCIL_PATH + '/electrical/transmission.xml'];
	mxStencilRegistry.libraries['infographic'] = [SHAPES_PATH + '/mxInfographic.js'];
	mxStencilRegistry.libraries['mockup/buttons'] = [SHAPES_PATH + '/mockup/mxMockupButtons.js'];
	mxStencilRegistry.libraries['mockup/containers'] = [SHAPES_PATH + '/mockup/mxMockupContainers.js'];
	mxStencilRegistry.libraries['mockup/forms'] = [SHAPES_PATH + '/mockup/mxMockupForms.js'];
	mxStencilRegistry.libraries['mockup/graphics'] = [SHAPES_PATH + '/mockup/mxMockupGraphics.js', STENCIL_PATH + '/mockup/misc.xml'];
	mxStencilRegistry.libraries['mockup/markup'] = [SHAPES_PATH + '/mockup/mxMockupMarkup.js'];
	mxStencilRegistry.libraries['mockup/misc'] = [SHAPES_PATH + '/mockup/mxMockupMisc.js', STENCIL_PATH + '/mockup/misc.xml'];
	mxStencilRegistry.libraries['mockup/navigation'] = [SHAPES_PATH + '/mockup/mxMockupNavigation.js', STENCIL_PATH + '/mockup/misc.xml'];
	mxStencilRegistry.libraries['mockup/text'] = [SHAPES_PATH + '/mockup/mxMockupText.js'];
	mxStencilRegistry.libraries['floorplan'] = [SHAPES_PATH + '/mxFloorplan.js', STENCIL_PATH + '/floorplan.xml'];
	mxStencilRegistry.libraries['bootstrap'] = [SHAPES_PATH + '/mxBootstrap.js', SHAPES_PATH + '/mxBasic.js', STENCIL_PATH + '/bootstrap.xml'];
	mxStencilRegistry.libraries['gmdl'] = [SHAPES_PATH + '/mxGmdl.js', STENCIL_PATH + '/gmdl.xml'];
	mxStencilRegistry.libraries['gcp2'] = [SHAPES_PATH + '/mxGCP2.js', STENCIL_PATH + '/gcp2.xml'];
	mxStencilRegistry.libraries['ibm'] = [SHAPES_PATH + '/mxIBM.js', STENCIL_PATH + '/ibm.xml'];
	mxStencilRegistry.libraries['cabinets'] = [SHAPES_PATH + '/mxCabinets.js', STENCIL_PATH + '/cabinets.xml'];
	mxStencilRegistry.libraries['archimate'] = [SHAPES_PATH + '/mxArchiMate.js'];
	mxStencilRegistry.libraries['archimate3'] = [SHAPES_PATH + '/mxArchiMate3.js'];
	mxStencilRegistry.libraries['sysml'] = [SHAPES_PATH + '/mxSysML.js'];
	mxStencilRegistry.libraries['eip'] = [SHAPES_PATH + '/mxEip.js', STENCIL_PATH + '/eip.xml'];
	mxStencilRegistry.libraries['networks'] = [SHAPES_PATH + '/mxNetworks.js', STENCIL_PATH + '/networks.xml'];
	mxStencilRegistry.libraries['aws3d'] = [SHAPES_PATH + '/mxAWS3D.js', STENCIL_PATH + '/aws3d.xml'];
	mxStencilRegistry.libraries['aws4'] = [SHAPES_PATH + '/mxAWS4.js', STENCIL_PATH + '/aws4.xml'];
	mxStencilRegistry.libraries['aws4b'] = [SHAPES_PATH + '/mxAWS4.js', STENCIL_PATH + '/aws4.xml'];
	mxStencilRegistry.libraries['uml25'] = [SHAPES_PATH + '/mxUML25.js'];
	mxStencilRegistry.libraries['veeam'] = [STENCIL_PATH + '/veeam/2d.xml', STENCIL_PATH + '/veeam/3d.xml', STENCIL_PATH + '/veeam/veeam.xml'];
	mxStencilRegistry.libraries['veeam2'] = [STENCIL_PATH + '/veeam/2d.xml', STENCIL_PATH + '/veeam/3d.xml', STENCIL_PATH + '/veeam/veeam2.xml'];
	mxStencilRegistry.libraries['pid2inst'] = [SHAPES_PATH + '/pid2/mxPidInstruments.js'];
	mxStencilRegistry.libraries['pid2misc'] = [SHAPES_PATH + '/pid2/mxPidMisc.js', STENCIL_PATH + '/pid/misc.xml'];
	mxStencilRegistry.libraries['pid2valves'] = [SHAPES_PATH + '/pid2/mxPidValves.js'];
	mxStencilRegistry.libraries['pidFlowSensors'] = [STENCIL_PATH + '/pid/flow_sensors.xml'];

	// Triggers dynamic loading for markers
	mxMarker.getPackageForType = function(type)
	{
		var name = null;
		
		if (type != null && type.length > 0)
		{
			if (type.substring(0, 2) == 'ER')
			{
				name = 'mxgraph.er';
			}
			else if (type.substring(0, 5) == 'sysML')
			{
				name = 'mxgraph.sysml';
			}
		}
		
		return name;
	};
	
	var mxMarkerCreateMarker = mxMarker.createMarker;
	
	mxMarker.createMarker = function(canvas, shape, type, pe, unitX, unitY, size, source, sw, filled)
	{
		if (type != null)
		{
			var f = mxMarker.markers[type];
			
			if (f == null)
			{
				var name = this.getPackageForType(type);
				
				if (name != null)
				{
					mxStencilRegistry.getStencil(name);
				}
			}
		}
		
		return mxMarkerCreateMarker.apply(this, arguments);
	};

	/**
	 * Constructs a new print dialog.
	 */
	PrintDialog.prototype.create = function(editorUi, titleText)
	{
		var graph = editorUi.editor.graph;
		var div = document.createElement('div');
		
		var title = document.createElement('h3');
		title.style.width = '100%';
		title.style.textAlign = 'center';
		title.style.marginTop = '0px';
		mxUtils.write(title, titleText || mxResources.get('print'));
		div.appendChild(title);
		
		var pageCount = 1;
		var currentPage = 1;

		// Pages
		var pagesSection = document.createElement('div');
		pagesSection.style.cssText = 'border-bottom:1px solid lightGray;padding-bottom:12px;margin-bottom:12px;';
		
		var allPagesRadio = document.createElement('input');
		allPagesRadio.style.cssText = 'margin-right:8px;margin-bottom:8px;';
		allPagesRadio.setAttribute('value', 'all');
		allPagesRadio.setAttribute('type', 'radio');
		allPagesRadio.setAttribute('name', 'pages-printdialog');
		
		pagesSection.appendChild(allPagesRadio);

		var span = document.createElement('span');
		mxUtils.write(span, mxResources.get('printAllPages'));
		pagesSection.appendChild(span);

		mxUtils.br(pagesSection);

		// Pages ... to ...
		var pagesRadio = allPagesRadio.cloneNode(true);
		allPagesRadio.setAttribute('checked', 'checked');
		pagesRadio.setAttribute('value', 'range');
		pagesSection.appendChild(pagesRadio);
		
		var span = document.createElement('span');
		mxUtils.write(span, mxResources.get('pages') + ':');
		pagesSection.appendChild(span);
		
		var pagesFromInput = document.createElement('input');
		pagesFromInput.style.cssText = 'margin:0 8px 0 8px;'
		pagesFromInput.setAttribute('value', '1');
		pagesFromInput.setAttribute('type', 'number');
		pagesFromInput.setAttribute('min', '1');
		pagesFromInput.style.width = '50px';
		pagesSection.appendChild(pagesFromInput);
		
		var span = document.createElement('span');
		mxUtils.write(span, mxResources.get('to'));
		pagesSection.appendChild(span);
		
		var pagesToInput = pagesFromInput.cloneNode(true);
		pagesSection.appendChild(pagesToInput);

		mxEvent.addListener(pagesFromInput, 'focus', function()
		{
			pagesRadio.checked = true;
		});
		
		mxEvent.addListener(pagesToInput, 'focus', function()
		{
			pagesRadio.checked = true;
		});
		
		function validatePageRange()
		{
			pagesToInput.value = Math.max(1, Math.min(pageCount, Math.max(parseInt(pagesToInput.value), parseInt(pagesFromInput.value))));
			pagesFromInput.value = Math.max(1, Math.min(pageCount, Math.min(parseInt(pagesToInput.value), parseInt(pagesFromInput.value))));
		};
		
		mxEvent.addListener(pagesFromInput, 'change', validatePageRange);
		mxEvent.addListener(pagesToInput, 'change', validatePageRange);
		
		if (editorUi.pages != null)
		{
			pageCount = editorUi.pages.length;

			if (editorUi.currentPage != null)
			{
				for (var i = 0; i < editorUi.pages.length; i++)
				{
					if (editorUi.currentPage == editorUi.pages[i])
					{
						currentPage = i + 1;
						pagesFromInput.value = currentPage;
						pagesToInput.value = currentPage;
						break;
					}
				}
			}
		}
		
		pagesFromInput.setAttribute('max', pageCount);
		pagesToInput.setAttribute('max', pageCount);
		
		if (!editorUi.isPagesEnabled())
		{
			pagesRadio.checked = true;
		}
		else if (pageCount > 1)
		{
			div.appendChild(pagesSection);
			pagesRadio.checked = true;
		}
		
		// Adjust to ...
		var adjustSection = document.createElement('div');
		adjustSection.style.marginBottom = '10px';
		
		var adjustRadio = document.createElement('input');
		adjustRadio.style.marginRight = '8px';
		
		adjustRadio.setAttribute('value', 'adjust');
		adjustRadio.setAttribute('type', 'radio');
		adjustRadio.setAttribute('name', 'printZoom');
		adjustSection.appendChild(adjustRadio);

		var span = document.createElement('span');
		mxUtils.write(span, mxResources.get('adjustTo'));
		adjustSection.appendChild(span);
		
		var zoomInput = document.createElement('input');
		zoomInput.style.cssText = 'margin:0 8px 0 8px;';
		zoomInput.setAttribute('value', '100 %');
		zoomInput.style.width = '50px';
		adjustSection.appendChild(zoomInput);
		
		mxEvent.addListener(zoomInput, 'focus', function()
		{
			adjustRadio.checked = true;
		});
		
		div.appendChild(adjustSection);

		// Fit to ...
		var fitSection = pagesSection.cloneNode(false);

		var fitRadio = adjustRadio.cloneNode(true);
		fitRadio.setAttribute('value', 'fit');
		adjustRadio.setAttribute('checked', 'checked');
		
		var spanFitRadio = document.createElement('div');
		spanFitRadio.style.cssText = 'display:inline-block;height:100%;vertical-align:top;padding-top:2px;';
		spanFitRadio.appendChild(fitRadio);
		fitSection.appendChild(spanFitRadio);
		
		var table = document.createElement('table');
		table.style.display = 'inline-block';
		var tbody = document.createElement('tbody');
		
		var row1 = document.createElement('tr');
		var row2 = row1.cloneNode(true);
		
		var td1 = document.createElement('td');
		var td2 = td1.cloneNode(true);
		var td3 = td1.cloneNode(true);
		
		var td4 = td1.cloneNode(true);
		var td5 = td1.cloneNode(true);
		var td6 = td1.cloneNode(true);
		
		td1.style.textAlign = 'right';
		td4.style.textAlign = 'right';

		mxUtils.write(td1, mxResources.get('fitTo'));
		
		var sheetsAcrossInput = document.createElement('input');
		sheetsAcrossInput.style.cssText = 'margin:0 8px 0 8px;';
		sheetsAcrossInput.setAttribute('value', '1');
		sheetsAcrossInput.setAttribute('min', '1');
		sheetsAcrossInput.setAttribute('type', 'number');
		sheetsAcrossInput.style.width = '40px';
		td2.appendChild(sheetsAcrossInput);
		
		var span = document.createElement('span');
		mxUtils.write(span, mxResources.get('fitToSheetsAcross'));
		td3.appendChild(span);

		mxUtils.write(td4, mxResources.get('fitToBy'));
		
		var sheetsDownInput = sheetsAcrossInput.cloneNode(true);
		td5.appendChild(sheetsDownInput);
		
		mxEvent.addListener(sheetsAcrossInput, 'focus', function()
		{
			fitRadio.checked = true;
		});

		mxEvent.addListener(sheetsDownInput, 'focus', function()
		{
			fitRadio.checked = true;
		});

		var span = document.createElement('span');
		mxUtils.write(span, mxResources.get('fitToSheetsDown'));
		td6.appendChild(span);
		
		row1.appendChild(td1);
		row1.appendChild(td2);
		row1.appendChild(td3);
		
		row2.appendChild(td4);
		row2.appendChild(td5);
		row2.appendChild(td6);
		
		tbody.appendChild(row1);
		tbody.appendChild(row2);
		table.appendChild(tbody);
		fitSection.appendChild(table);
		
		div.appendChild(fitSection);
		
		// Page scale ...
		var pageScaleSection = document.createElement('div');

		var span = document.createElement('div');
		span.style.fontWeight = 'bold';
		span.style.marginBottom = '12px';
		mxUtils.write(span, mxResources.get('paperSize'));
		pageScaleSection.appendChild(span);
		
		var span = document.createElement('div');
		span.style.marginBottom = '12px';

		var accessor = PageSetupDialog.addPageFormatPanel(span, 'printdialog',
			editorUi.editor.graph.pageFormat || mxConstants.PAGE_FORMAT_A4_PORTRAIT);
		pageScaleSection.appendChild(span);
		
		var span = document.createElement('span');
		mxUtils.write(span, mxResources.get('pageScale'));
		pageScaleSection.appendChild(span);
		
		var pageScaleInput = document.createElement('input');
		pageScaleInput.style.cssText = 'margin:0 8px 0 8px;';
		pageScaleInput.setAttribute('value', '100 %');
		pageScaleInput.style.width = '60px';
		pageScaleSection.appendChild(pageScaleInput);
		
		div.appendChild(pageScaleSection);
		
		// Buttons
		var buttons = document.createElement('div');
		buttons.style.cssText = 'text-align:right;margin:48px 0 0 0;';
		
		// Overall scale for print-out to account for print borders in dialogs etc
		function preview(print)
		{
			var printScale = parseInt(pageScaleInput.value) / 100;
			
			if (isNaN(printScale))
			{
				printScale = 1;
				pageScaleInput.value = '100 %';
			}
			
			// Workaround to match available paper size in actual print output
			printScale *= 0.75;
			
			// Disables dark mode while printing
			var darkStylesheet = null;
			
			if (graph.themes != null && graph.defaultThemeName == 'darkTheme')
			{
				darkStylesheet = graph.stylesheet;
				graph.stylesheet = graph.getDefaultStylesheet()
				graph.refresh();
			}
			
			function printGraph(thisGraph, pv, forcePageBreaks)
			{
				// Workaround for CSS transforms affecting the print output
				// is to disable during print output and restore after
				var prev = thisGraph.useCssTransforms;
				var prevTranslate = thisGraph.currentTranslate;
				var prevScale = thisGraph.currentScale;
				var prevViewTranslate = thisGraph.view.translate;
				var prevViewScale = thisGraph.view.scale;

				if (thisGraph.useCssTransforms)
				{
					thisGraph.useCssTransforms = false;
					thisGraph.currentTranslate = new mxPoint(0,0);
					thisGraph.currentScale = 1;
					thisGraph.view.translate = new mxPoint(0,0);
					thisGraph.view.scale = 1;
				}

				// Negative coordinates are cropped or shifted if page visible
				var gb = thisGraph.getGraphBounds();
				var border = 0;
				var x0 = 0;
				var y0 = 0;
		
				var pf = accessor.get();
				var scale = 1 / thisGraph.pageScale;
				var autoOrigin = fitRadio.checked;
		
				if (autoOrigin)
				{
					var h = parseInt(sheetsAcrossInput.value);
					var v = parseInt(sheetsDownInput.value);
					
					scale = Math.min((pf.height * v) / (gb.height / thisGraph.view.scale),
						(pf.width * h) / (gb.width / thisGraph.view.scale));
				}
				else
				{
					scale = parseInt(zoomInput.value) / (100 * thisGraph.pageScale);
					
					if (isNaN(scale))
					{
						printScale = 1 / thisGraph.pageScale;
						zoomInput.value = '100 %';
					}
				}
		
				// Applies print scale
				pf = mxRectangle.fromRectangle(pf);
				pf.width = Math.ceil(pf.width * printScale);
				pf.height = Math.ceil(pf.height * printScale);
				scale *= printScale;
				
				// Starts at first visible page
				if (!autoOrigin && thisGraph.pageVisible)
				{
					var layout = thisGraph.getPageLayout();
					x0 -= layout.x * pf.width;
					y0 -= layout.y * pf.height;
				}
				else
				{
					autoOrigin = true;
				}
				
				if (pv == null)
				{
					pv = PrintDialog.createPrintPreview(thisGraph, scale, pf, border, x0, y0, autoOrigin);
					pv.pageSelector = false;
					pv.mathEnabled = false;
					
					var file = editorUi.getCurrentFile();
					
					if (file != null)
					{
						pv.title = file.getTitle();
					}
					
					var writeHead = pv.writeHead;
					
					// Overridden to add custom fonts
					pv.writeHead = function(doc)
					{
						writeHead.apply(this, arguments);
						
						// Workaround for zoomed math clipping in Webkit
						if (mxClient.IS_GC || mxClient.IS_SF)
						{
							doc.writeln('<style type="text/css">');
							doc.writeln(Editor.mathJaxWebkitCss);
							doc.writeln('</style>');
						}

						// Fixes font weight for PDF export in Chrome
						if (mxClient.IS_GC)
						{
							doc.writeln('<style type="text/css">');
							doc.writeln('@media print {');
							doc.writeln('span.MathJax_SVG svg { shape-rendering: crispEdges; }');
							doc.writeln('}');
							doc.writeln('</style>');
						}

						if (editorUi.editor.fontCss != null)
						{
							doc.writeln('<style type="text/css">');
							doc.writeln(editorUi.editor.fontCss);
							doc.writeln('</style>');
						}
						
						var extFonts = thisGraph.getCustomFonts();
						
						for (var i = 0; i < extFonts.length; i++)
						{
							var fontName = extFonts[i].name;
							var fontUrl = extFonts[i].url;
							
							if (Graph.isCssFontUrl(fontUrl))
							{
						   		doc.writeln('<link rel="stylesheet" href="' +
						   			mxUtils.htmlEntities(fontUrl) +
						   			'" charset="UTF-8" type="text/css">');
							}
							else
							{
						   		doc.writeln('<style type="text/css">');
						   		doc.writeln('@font-face {\n' +
						   			'font-family: "' + mxUtils.htmlEntities(fontName) + '";\n' + 
						   			'src: url("' + mxUtils.htmlEntities(fontUrl) + '");\n}');
						   		doc.writeln('</style>');
							}
						}
					};
					
					if (typeof(MathJax) !== 'undefined')
					{
						// Adds class to ignore if math is disabled
						var printPreviewRenderPage = pv.renderPage;
						
						pv.renderPage = function(w, h, dx, dy, content, pageNumber)
						{
							var prev = mxClient.NO_FO;
							mxClient.NO_FO = (this.graph.mathEnabled && !editorUi.editor.useForeignObjectForMath) ?
								true : editorUi.editor.originalNoForeignObject;
							var result = printPreviewRenderPage.apply(this, arguments);
							mxClient.NO_FO = prev;
							
							if (this.graph.mathEnabled)
							{
								this.mathEnabled = this.mathEnabled || true;
							}
							else
							{
								result.className = 'geDisableMathJax';
							}
							
							return result;
						};
					}
					
					// Switches stylesheet for print output in dark mode
					var temp = null;
					
					// Disables dashed printing of flowAnimation
					var enableFlowAnimation = graph.enableFlowAnimation;
					graph.enableFlowAnimation = false;
					
					if (graph.themes != null && graph.defaultThemeName == 'darkTheme')
					{
						temp = graph.stylesheet;
						graph.stylesheet = graph.getDefaultStylesheet()
						graph.refresh();
					}
					
					// Generates the print output
					pv.open(null, null, forcePageBreaks, true);
					
					// Restores flowAnimation
					graph.enableFlowAnimation = enableFlowAnimation;
					
					// Restores the stylesheet
					if (temp != null)
					{
						graph.stylesheet = temp;
						graph.refresh();
					}
				}
				else
				{				
					var bg = thisGraph.background;
					
					if (bg == null || bg == '' || bg == mxConstants.NONE)
					{
						bg = '#ffffff';
					}
					
					pv.backgroundColor = bg;
					pv.autoOrigin = autoOrigin;
					pv.appendGraph(thisGraph, scale, x0, y0, forcePageBreaks, true);
					
					var extFonts = thisGraph.getCustomFonts();
					
					if (pv.wnd != null)
					{
						for (var i = 0; i < extFonts.length; i++)
						{
							var fontName = extFonts[i].name;
							var fontUrl = extFonts[i].url;
							
							if (Graph.isCssFontUrl(fontUrl))
							{
						   		pv.wnd.document.writeln('<link rel="stylesheet" href="' +
						   			mxUtils.htmlEntities(fontUrl) +
						   			'" charset="UTF-8" type="text/css">');
							}
							else
							{
						   		pv.wnd.document.writeln('<style type="text/css">');
						   		pv.wnd.document.writeln('@font-face {\n' +
						   			'font-family: "' + mxUtils.htmlEntities(fontName) + '";\n' + 
						   			'src: url("' + mxUtils.htmlEntities(fontUrl) + '");\n}');
						   		pv.wnd.document.writeln('</style>');
							}
						}
					}
				}
				
				// Restores state if css transforms are used
				if (prev)
				{
					thisGraph.useCssTransforms = prev;
					thisGraph.currentTranslate = prevTranslate;
					thisGraph.currentScale = prevScale;
					thisGraph.view.translate = prevViewTranslate;
					thisGraph.view.scale = prevViewScale;
				}
				
				return pv;
			};
			
			var pagesFrom = pagesFromInput.value;
			var pagesTo = pagesToInput.value;
			var ignorePages = !allPagesRadio.checked;
			var pv = null;
			
			if (EditorUi.isElectronApp)
			{
				PrintDialog.electronPrint(editorUi, allPagesRadio.checked, pagesFrom, pagesTo,  fitRadio.checked,
					sheetsAcrossInput.value, sheetsDownInput.value, parseInt(zoomInput.value) / 100,
					parseInt(pageScaleInput.value) / 100, accessor.get());
				
				return;
			}
			
			if (ignorePages)
			{
				ignorePages = pagesFrom == currentPage && pagesTo == currentPage;
			}
			
			if (!ignorePages && editorUi.pages != null && editorUi.pages.length)
			{
				var i0 = 0;
				var imax = editorUi.pages.length - 1;
				
				if (!allPagesRadio.checked)
				{
					i0 = parseInt(pagesFrom) - 1;
					imax = parseInt(pagesTo) - 1;
				}
				
				for (var i = i0; i <= imax; i++)
				{
					var page = editorUi.pages[i];
					var tempGraph = (page == editorUi.currentPage) ? graph : null;

					if (tempGraph == null)
					{
						tempGraph = editorUi.createTemporaryGraph(graph.stylesheet);

						// Restores graph settings that are relevant for printing
						var pageVisible = true;
						var mathEnabled = false;
						var bg = null;
						var bgImage = null;
						
						if (page.viewState == null)
						{
							// Workaround to extract view state from XML node
							// This changes the state of the page and parses
							// the XML for the graph model even if not needed.
							if (page.root == null)
							{
								editorUi.updatePageRoot(page);
							}
						}
						
						if (page.viewState != null)
						{
							pageVisible = page.viewState.pageVisible;
							mathEnabled = page.viewState.mathEnabled;
							bg = page.viewState.background;
							bgImage = page.viewState.backgroundImage;
							tempGraph.extFonts = page.viewState.extFonts;
						}
					
						tempGraph.background = bg;
						tempGraph.backgroundImage = (bgImage != null) ? new mxImage(bgImage.src, bgImage.width, bgImage.height) : null;
						tempGraph.pageVisible = pageVisible;
						tempGraph.mathEnabled = mathEnabled;
						
						// Redirects placeholders to current page
						var graphGetGlobalVariable = tempGraph.getGlobalVariable;
		
						tempGraph.getGlobalVariable = function(name)
						{
							if (name == 'page')
							{
								return page.getName();
							}
							else if (name == 'pagenumber')
							{
								return i + 1;
							}
							else if (name == 'pagecount')
							{
								return (editorUi.pages != null) ? editorUi.pages.length : 1;
							}
							
							return graphGetGlobalVariable.apply(this, arguments);
						};
						
						document.body.appendChild(tempGraph.container);
						editorUi.updatePageRoot(page);
						tempGraph.model.setRoot(page.root);
					}
					
					pv = printGraph(tempGraph, pv, i != imax);

					if (tempGraph != graph)
					{
						tempGraph.container.parentNode.removeChild(tempGraph.container);
					}
				}
			}
			else
			{
				pv = printGraph(graph);
			}
			
			if (pv == null)
			{
				editorUi.handleError({message: mxResources.get('errorUpdatingPreview')});
			}
			else
			{
				if (pv.mathEnabled)
				{
					var doc = pv.wnd.document;
					
					// Adds asynchronous printing when MathJax finishes rendering
					// via global variable that is checked in math-print.js to
					// avoid generating unsafe-inline script or adding SHA to CSP
					if (print)
					{
						pv.wnd.IMMEDIATE_PRINT = true;
					}

					doc.writeln('<script type="text/javascript" src="' + DRAWIO_BASE_URL + '/js/math-print.js"></script>');
				}
				
				pv.closeDocument();
				
				if (!pv.mathEnabled && print)
				{
					PrintDialog.printPreview(pv);
				}
			}
			
			// Restores dark mode
			if (darkStylesheet != null)
			{
				graph.stylesheet = darkStylesheet;
				graph.refresh();
			}
		};
		
		var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
		{
			editorUi.hideDialog();
		});
		cancelBtn.className = 'geBtn';
		
		if (editorUi.editor.cancelFirst)
		{
			buttons.appendChild(cancelBtn);
		}
		
		if (!editorUi.isOffline())
		{
			var helpBtn = mxUtils.button(mxResources.get('help'), function()
			{
				graph.openLink('https://www.diagrams.net/doc/faq/print-diagram');
			});
			
			helpBtn.className = 'geBtn';
			buttons.appendChild(helpBtn);
		}
		
		if (PrintDialog.previewEnabled)
		{
			var previewBtn = mxUtils.button(mxResources.get('preview'), function()
			{
				editorUi.hideDialog();
				preview(false);
			});
			previewBtn.className = 'geBtn';
			buttons.appendChild(previewBtn);
		}
		
		var printBtn = mxUtils.button(mxResources.get((!PrintDialog.previewEnabled) ? 'ok' : 'print'), function()
		{
			editorUi.hideDialog();
			preview(true);
		});
		printBtn.className = 'geBtn gePrimaryBtn';
		buttons.appendChild(printBtn);
		
		if (!editorUi.editor.cancelFirst)
		{
			buttons.appendChild(cancelBtn);
		}

		div.appendChild(buttons);

		this.container = div;
	};
	
    // Execute fit page on page setup changes
    var changePageSetupExecute = ChangePageSetup.prototype.execute;
    
    ChangePageSetup.prototype.execute = function()
    {
        if (this.page == null)
        {
            this.page = this.ui.currentPage;
        }

        // Workaround for redo existing change with different current page
        if (this.page != this.ui.currentPage)
        {
            if (this.page.viewState != null)
            {
                if (!this.ignoreColor)
                {
                    this.page.viewState.background = this.color;
                }
                
                if (!this.ignoreImage)
                {
					var img = this.image;

					if (img != null && img.src != null && Graph.isPageLink(img.src))
					{
						img = {originalSrc: img.src};
					}

                    this.page.viewState.backgroundImage = img;
                }

                if (this.format != null)
                {
                    this.page.viewState.pageFormat = this.format;
                }
                
                if (this.mathEnabled != null)
                {
                    this.page.viewState.mathEnabled = this.mathEnabled;
                }
                
                if (this.shadowVisible != null)
            	{
            		this.page.viewState.shadowVisible = this.shadowVisible;
            	}
            }   
        }
        else
        {
            changePageSetupExecute.apply(this, arguments);
            
            if (this.mathEnabled != null && this.mathEnabled != this.ui.isMathEnabled())
            {
                this.ui.setMathEnabled(this.mathEnabled);
                this.mathEnabled = !this.mathEnabled;
            }

            if (this.shadowVisible != null && this.shadowVisible != this.ui.editor.graph.shadowVisible)
            {
            	this.ui.editor.graph.setShadowVisible(this.shadowVisible);
                this.shadowVisible = !this.shadowVisible;
            }
        }
    };
    
    /**
	 * Capability check for canvas export
	 */
	Editor.prototype.useCanvasForExport = false;
		
	try
	{
		var canvas = document.createElement('canvas');
		var img = new Image();
		
		// LATER: Capability check should not be async
		img.onload = function()
		{
			try
			{
		   		var ctx = canvas.getContext('2d');
		   		ctx.drawImage(img, 0, 0);

		   		// Works in Chrome, Firefox, Edge, Safari and Opera
				var result = canvas.toDataURL('image/png');
				Editor.prototype.useCanvasForExport = result != null && result.length > 6;
			}
			catch (e)
			{
				// ignore
			}
		};

		// Checks if SVG with foreignObject can be exported
		var svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1px" height="1px" version="1.1"><foreignObject pointer-events="all" width="1" height="1"><div xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject></svg>';
		img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
	}
	catch (e)
	{
		// ignore
	}
	
})();

// Extends codec for ChangePageSetup
(function()
{
	var codec = new mxObjectCodec(new ChangePageSetup(),  ['ui', 'previousColor', 'previousImage', 'previousFormat']);
	  
	codec.beforeDecode = function(dec, node, obj)
	{
		obj.ui = dec.ui;
		  
		return node;
	};

	codec.afterDecode = function(dec, node, obj)
	{
		obj.previousColor = obj.color;
		obj.previousImage = obj.image;
		obj.previousFormat = obj.format;

        if (obj.foldingEnabled != null)
        {
        		obj.foldingEnabled = !obj.foldingEnabled;
        }
       
        if (obj.mathEnabled != null)
        {
        		obj.mathEnabled = !obj.mathEnabled;
        }
        
        if (obj.shadowVisible != null)
        {
        		obj.shadowVisible = !obj.shadowVisible;
        }
        
		return obj;
	};

	mxCodecRegistry.register(codec);
})();

// Extends codec for ChangeGridColor
(function()
{
	var codec = new mxObjectCodec(new ChangeGridColor(),  ['ui']);
	  
	codec.beforeDecode = function(dec, node, obj)
	{
		obj.ui = dec.ui;
		  
		return node;
	};

	mxCodecRegistry.register(codec);
})();

