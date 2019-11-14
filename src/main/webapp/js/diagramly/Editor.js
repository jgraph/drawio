/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
(function()
{
	/**
	 * Specifies the app name. Default is document.title.
	 */
	Editor.prototype.appName = 'draw.io';
	
	/**
	 * Known extensions for own files.
	 */
	Editor.prototype.fileExtensions = [
		{ext: 'html', title: 'filetypeHtml'},
		{ext: 'png', title: 'filetypePng'},
		{ext: 'svg', title: 'filetypeSvg'}];
	
	/**
	 * Used in the GraphViewer lightbox.
	 */
	Editor.closeImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/delete.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAApVBMVEUAAAD////k5OT///8AAAB1dXXMzMz9/f39/f37+/v5+fn+/v7///9iYmJaWlqFhYWnp6ejo6OHh4f////////////////7+/v5+fnx8fH///8AAAD///8bGxv7+/v5+fkoKCghISFDQ0MYGBjh4eHY2Njb29tQUFBvb29HR0c/Pz82NjYrKyu/v78SEhLu7u7s7OzV1dVVVVU7OzsVFRXAv78QEBBzqehMAAAAG3RSTlMAA/7p/vz5xZlrTiPL/v78+/v7+OXd2TYQDs8L70ZbAAABKUlEQVQoz3VS13LCMBBUXHChd8iukDslQChJ/v/TchaG4cXS+OSb1c7trU7V60OpdRz2ZtNZL4zXNlcN8BEtSG6+NxIXkeRPoBuQ1cjvZ31/VJFB10ISli6diYfH8iYO3WUNCcNlB0gTrXOtkxTo0O1aKKiBBMhhv2MNBQKoiA5wxlZo0JDzD3AYKbWacyj3fs01wxey0pyEP+R8pWKWXoqtIZ0DDg5pbki9krEKOa6LVDQsdoXEsi46Zqh69KFz7B1u7Hb2yDV8firXDKBlZ4UFiswKGRhXTS93/ECK7yxnJ3+S3y/ThpO+cfSD017nqa18aasabU0/t7d+tk0/1oMEJ1NaD67iwdF68OabFSLn+eHb0+vjy+uk8br9fdrftH0O2menfd7+AQfYM/lNjoDHAAAAAElFTkSuQmCC';

	/**
	 * 
	 */
	Editor.plusImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/plus.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDdCMTdENjVCOEM4MTFFNDlCRjVBNDdCODU5NjNBNUMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDdCMTdENjZCOEM4MTFFNDlCRjVBNDdCODU5NjNBNUMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowN0IxN0Q2M0I4QzgxMUU0OUJGNUE0N0I4NTk2M0E1QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowN0IxN0Q2NEI4QzgxMUU0OUJGNUE0N0I4NTk2M0E1QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtjrjmgAAAAtSURBVHjaYvz//z8DMigvLwcLdHZ2MiKLMzEQCaivkLGsrOw/dU0cAr4GCDAARQsQbTFrv10AAAAASUVORK5CYII=';
	
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
	Editor.commentImageInverted = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABLElEQVRYR+2Wvy4FQRjFf4dINAq9XqtSaVRqXArPINEodUqlhxC5/pU6nYdQSHQeQTRHNtmVuXuXrIxv1k1sN5vMOb85c75kxMCfBvZnCsD2ErAGzAfAvUt6THUnAGwfAWfAQoB5I3kh6aBZfALYXgGeg80b31VJT9UiBRgB48CTp9Lbku7aAPvAZSGAHUm3swEgKWtUbbsj1f4JDA4AbGb24iErgUzzr7bvSrrpVcKgK5ghgKAO9E/gvwNBJRxJuu41BUEd+BFARA3+JsAWcB9x3A7NzgSqt+ALsFwAYhqgMrW9Ub8J14G5QJBugAhD2yfAaUt7T9LVxBhGmDeato/rZJtfZQHq600hygPUEIfAOTAMQALxWrQD7X7ZXpT0VqyE3xU868n9G5PzASPvpiHavBAUAAAAAElFTkSuQmCC';
	
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
	Editor.syncProblemImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMyAxMmMwIDIuMjEuOTEgNC4yIDIuMzYgNS42NEwzIDIwaDZ2LTZsLTIuMjQgMi4yNEM1LjY4IDE1LjE1IDUgMTMuNjYgNSAxMmMwLTIuNjEgMS42Ny00LjgzIDQtNS42NVY0LjI2QzUuNTUgNS4xNSAzIDguMjcgMyAxMnptOCA1aDJ2LTJoLTJ2MnpNMjEgNGgtNnY2bDIuMjQtMi4yNEMxOC4zMiA4Ljg1IDE5IDEwLjM0IDE5IDEyYzAgMi42MS0xLjY3IDQuODMtNCA1LjY1djIuMDljMy40NS0uODkgNi00LjAxIDYtNy43NCAwLTIuMjEtLjkxLTQuMi0yLjM2LTUuNjRMMjEgNHptLTEwIDloMlY3aC0ydjZ6Ii8+PC9zdmc+';
	
	/**
	 * Used in the GraphViewer lightbox.
	 */
	Editor.tweetImage = IMAGE_PATH + '/tweet.png';

	/**
	 * Used in the GraphViewer lightbox.
	 */
	Editor.facebookImage = IMAGE_PATH + '/facebook.png';

	/**
	 * Blank 1x1 pixel transparent PNG image.
	 */
	Editor.blankImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

	/**
	 * Blank 1x1 pixel transparent PNG image.
	 */
	Editor.hiResImage = (mxClient.IS_SVG) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA+CAMAAACLMWy1AAAAh1BMVEUAAABMTExERERBQUFBQUFFRUVAQEBCQkJAQEA6OjpDQ0NKSkpBQUFBQUFERERERERBQUFCQkJCQkJCQkJJSUlBQUFCQkJDQ0NDQ0NCQkJDQ0NBQUFBQUFCQkJBQUFCQkJCQkJDQ0NCQkJHR0dBQUFCQkJCQkJAQEBCQkJDQ0NAQEBERERCQkIk1hS2AAAAKnRSTlMAAjj96BL7PgQFRwfu3TYazKuVjRXl1V1DPCn1uLGjnWNVIgy9hU40eGqPkM38AAACG0lEQVRYw+2X63KbMBCFzwZblgGDceN74muatpLe//m6MHV3gHGFAv2RjM94MAbxzdnVsQbBDKwH8AH8MDAyafzjqYeyOG04XE7RS8nIRDXg6BlT+rA0nmtAPh+NQRDxIASIMG44rAMrGunBgHwy3uUldxggIStGKp2f+DQc2O4h4eQsX3O2IFB/oEbsjOKbStnjAEA+zJ0ylZTbgvoDn8xNyn6Dbj5Kd4GsNpABa6duQPfSdEj88TgMAhKuCWjAkgmFXPLnsD0pWd3OFGdrMugQII/eOMPEiGOzqPMIeWrcSoMCg71W1pXBPvCP+gS/OdXqQ3uW23+93XGWLl/OaBb805bNcBPoEIcVJsnHzcxpZH86u5KZ9gDby5dQCcnKqdbke4ItI4Tzd7IW9hZQt4EO6GG9b9sYuuK9Wwn8TIr2xKbF2+3Nhr+qxChJ/AI6pIfCu4z4Zowp4ZUNihz79vewzctnHDwTvQO/hCdFBzrUGDOPn2Y/F8YKT4oOATLvlhOznzmBSdFBJWtc58y7r+UVFOCQczy3wpN6pegDqHtsCPTGvH9JuTO0Dyg8icldYPk+RB6g8Aofj4m2EKBvtTmUPD9xDd1pPcSReV2U5iD/ik2yrngtvvqBfPzOvKiDTKTsCdoHZJ7pLLffgTwlJ5vJdtJV2/jiAYaLvLGhMAEDO5QcDg2M/jOw/8Zn+K3ZwJvHT7ZffgC/NvA3zcybTeIfE4EAAAAASUVORK5CYII=' : IMAGE_PATH + '/img-hi-res.png';

	/**
	 * Blank 1x1 pixel transparent PNG image.
	 */
	Editor.loResImage = (mxClient.IS_SVG) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA+CAMAAACLMWy1AAAAS1BMVEVAQEAAAAA1NTVBQUFDQ0NDQ0NFRUVERERBQUFBQUFBQUFAQEBBQUFBQUFCQkJCQkJCQkJBQUFCQkJDQ0NDQ0NCQkJCQkJCQkJGRkb5/XqTAAAAGXRSTlP+AAWODlASCsesX+Lc2LyWe3pwa1tCPjohjSJfoAAAAI1JREFUWMPt1MkKhTAMRuG0anvneXr/J71nUypKcdqI/N8yhLMKMZE1CahnClDQzMPB44ED3EgeCubgDWnWQMHpwTtKwTe+UHD4sJ94wbUEHHFGhILlYDeSnsQeabeCgsPBgB0MOZZ9oGA5GJFiJSfUULAfjLjARrhCwX7wh2YCDwVbwZkUBKqFFJRN+wOcwSgR2sREcgAAAABJRU5ErkJggg==' : IMAGE_PATH + '/img-lo-res.png';

	/**
	 * Only needed in browsers with SVG support for export via lightbox toolbar. 
	 */
	Editor.cameraLargeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAA/BJREFUWAnFl0uIjWEYx885buPSuGwmSYwtwsY1ikKSNYNclmQnadgrZSPlsnBLSlaGBdNYKY0Vdi4L4zYzIqxGxmXG//d+7//0+uY7nWMiT/2/53mf+3v7vnNKpf9M5UbrDw8Pj4m+wzmeT1FBUS6Xf+YNox6reMONukijMXUTM3NmI75PyXcJPwRWg5kS7xysDLNmfEUxpx2rceNE50IlYjyRklcLf0prY+x4BTqfmx3ZUHQaO9ISGngYq38V/1EH+ECPa+QaK1u1kVBQirDMChiS3CTeIkwWvghtwhKBpZ8g1CO2B99FynVU/KowSRgQ3mlrBsVZ1awmQlS0SGbfXglfBPbdRGMm5O8RXg2P835pDCvzWjghTHETcLpZLHwS8kTCtBEK1SN83Egam8YxyVZqc+Do5qkwS+gT9grNwkUBG6cbsG/gs3BTuC/0ChCxq4QtwgzBMdwUZBPyN4Ftfi4sYPZHktbOSRlIuutRP5jYj0ueZp88xyYcS/zZoiLyQT1IA/cTj7eSlwnrhI+JnkQbCwo2Sx/2M7VJt17wdhVtgxvrpoFnAuSAbJQ97biZAlKxBfD9wgOhV+BgIR/AZtJ4kwD5PGSj7OmmekjWEy0oAQHAS3+KpBpzXqYK3UItopHpSRMno2N+cm7gDYnfRCcr3QBqriMHLJDkeyhFfiG5aVbK+8rhtP9M6QcIEJHX5Fp9NMAyQlYiu+OOJNlODCIXyka/P23bncTdiC7OydC1+v1Bsb+5r84DK8S3Rdmf5cRUFW3bXtWUSt1Rdk6G4SyJV2o1YId+vNUxr+x5yCJiapFtcxQzLjrxboGcMxvFJwEOKnLwjIbkx/sdSmeSaUY++SwTAxV+4DJT7RVwkbk46gNCsifIItuy0e9PF33Cb4homhN5YRyzL5q5V2VNkv98kqgoGTo3YF9CnMM5Y5rItFfvBSi9JulVXOgI+VwIntkt+SaZ6weQfcovJf7zpTfl86P/wAF7Fz18NeKwmvAWCaX0Z/uMHQr42ZxvR/Rxcw5xM+9J/CJq8w2gduDhmDgso/QrBH47dEXQ1IqczyHpIOfIRtnTtV7SwO1oKXKkU3fbToFGSDHtMWcaH1WBuVYnDbRFi99iqSMySdzxXckrazUh23KBVYGIcfNBkTxca0e4ATJ0KukGYVBgr/MnlhPOtQq/ksUfCbzh+EFCjtnCUoHfjhA/OsiTv2HcEvJMELp0VakZDliTmriTdPivxU4VmEhtPrGV+KJhO7ZKt0doFZh1fgZSBWIW2AGEHwg3BUWOnKtH+suqdw07tYMfglCrWPD5mw9qVYuniaXkT0OtWaSuo5LJTY1RBf+roF9X5+y/5qU+DAAAAABJRU5ErkJggg==';
	
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
	 * Specifies if XML files should be compressed. Default is true.
	 */
	Editor.compressXml = true;

	/**
	 * Specifies global variables.
	 */
	Editor.globalVars = null;

	/**
	 * Disables the shadow option in the format panel.
	 */
	Editor.shadowOptionEnabled = true;

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
        {name: 'jiggle', dispName: 'Jiggle', type: 'float', min: 0, defVal: 1.5, isVisible: function(state)
        {
        	return mxUtils.getValue(state.style, 'comic', '0') == '1';
        }},
        {name: 'editable', dispName: 'Editable', type: 'bool', defVal: true},
        {name: 'backgroundOutline', dispName: 'Background Outline', type: 'bool', defVal: false},
        {name: 'bendable', dispName: 'Bendable', type: 'bool', defVal: true},
        {name: 'movable', dispName: 'Movable', type: 'bool', defVal: true},
        {name: 'cloneable', dispName: 'Cloneable', type: 'bool', defVal: true},
        {name: 'deletable', dispName: 'Deletable', type: 'bool', defVal: true},
        {name: 'orthogonalLoop', dispName: 'Loop Routing', type: 'bool', defVal: false},
        {name: 'noJump', dispName: 'No Jumps', type: 'bool', defVal: false}
	];

	/**
	 * Common properties for all vertices.
	 */
	Editor.commonVertexProperties = [
        {type: 'separator'},
        {name: 'fillOpacity', dispName: 'Fill Opacity', type: 'int', min: 0, max: 100, defVal: 100},
        {name: 'strokeOpacity', dispName: 'Stroke Opacity', type: 'int', min: 0, max: 100, defVal: 100},
        {name: 'overflow', dispName: 'Text Overflow', defVal: 'visible', type: 'enum',
        	enumList: [{val: 'visible', dispName: 'Visible'}, {val: 'hidden', dispName: 'Hidden'}, {val: 'fill', dispName: 'Fill'}, {val: 'width', dispName: 'Width'}]
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
        {name: 'connectable', dispName: 'Connectable', type: 'bool', defVal: true},
        {name: 'allowArrows', dispName: 'Allow Arrows', type: 'bool', defVal: true},
        {name: 'snapToPoint', dispName: 'Snap to Point', type: 'bool', defVal: false},
        {name: 'perimeter', dispName: 'Perimeter', defVal: 'none', type: 'enum',
        	enumList: [{val: 'none', dispName: 'None'},
        			{val: 'rectanglePerimeter', dispName: 'Rectangle'}, {val: 'ellipsePerimeter', dispName: 'Ellipse'},
        			{val: 'rhombusPerimeter', dispName: 'Rhombus'}, {val: 'trianglePerimeter', dispName: 'Triangle'},
        			{val: 'hexagonPerimeter2', dispName: 'Hexagon'}, {val: 'lifelinePerimeter', dispName: 'Lifeline'},
        			{val: 'orthogonalPerimeter', dispName: 'Orthogonal'}, {val: 'backbonePerimeter', dispName: 'Backbone'},
        			{val: 'calloutPerimeter', dispName: 'Callout'}, {val: 'parallelogramPerimeter', dispName: 'Parallelogram'},
        			{val: 'trapezoidPerimeter', dispName: 'Trapezoid'}, {val: 'stepPerimeter', dispName: 'Step'}]
        },
        {name: 'fixDash', dispName: 'Fixed Dash', type: 'bool', defVal: false},
        {name: 'jiggle', dispName: 'Jiggle', type: 'float', min: 0, defVal: 1.5, isVisible: function(state)
        {
        	return mxUtils.getValue(state.style, 'comic', '0') == '1';
        }},
        {name: 'autosize', dispName: 'Autosize', type: 'bool', defVal: false},
        {name: 'collapsible', dispName: 'Collapsible', type: 'bool', defVal: false},
        {name: 'container', dispName: 'Container', type: 'bool', defVal: false},
        {name: 'recursiveResize', dispName: 'Resize Children', type: 'bool', defVal: true},
        {name: 'part', dispName: 'Part', type: 'bool', defVal: false},
        {name: 'editable', dispName: 'Editable', type: 'bool', defVal: true},
        {name: 'backgroundOutline', dispName: 'Background Outline', type: 'bool', defVal: false},
        {name: 'movable', dispName: 'Movable', type: 'bool', defVal: true},
        {name: 'resizable', dispName: 'Resizable', type: 'bool', defVal: true},
        {name: 'resizeWidth', dispName: 'Resize Width', type: 'bool', defVal: false},
        {name: 'resizeHeight', dispName: 'Resize Height', type: 'bool', defVal: false},
        {name: 'rotatable', dispName: 'Rotatable', type: 'bool', defVal: true},
        {name: 'cloneable', dispName: 'Cloneable', type: 'bool', defVal: true},
        {name: 'deletable', dispName: 'Deletable', type: 'bool', defVal: true},
        {name: 'treeFolding', dispName: 'Tree Folding', type: 'bool', defVal: false},
        {name: 'treeMoving', dispName: 'Tree Moving', type: 'bool', defVal: false},
        {name: 'moveCells', dispName: 'Move Cells on Fold', type: 'bool', defVal: false, isVisible: function(state, format)
        {
        	return state.vertices.length > 0 && format.editorUi.editor.graph.isContainer(state.vertices[0]);
        }}
	];
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
		'## In addition to label, an optional fromlabel and tolabel can be used to name the column\n' +
		'## that contains the text for the label in the edges source or target (invert ignored).\n' +
		'## The label is concatenated in the form fromlabel + label + tolabel if all are defined.\n' +
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
		'Evan Miller,CFO,emi,Office 1,,me@example.com,#dae8fc,#6c8ebf,,https://www.draw.io,https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-9-2-128.png\n' +
		'Edward Morrison,Brand Manager,emo,Office 2,Evan Miller,me@example.com,#d5e8d4,#82b366,,https://www.draw.io,https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-10-3-128.png\n' +
		'Ron Donovan,System Admin,rdo,Office 3,Evan Miller,me@example.com,#d5e8d4,#82b366,"emo,tva",https://www.draw.io,https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-2-128.png\n' +
		'Tessa Valet,HR Director,tva,Office 4,Evan Miller,me@example.com,#d5e8d4,#82b366,,https://www.draw.io,https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-3-128.png\n';

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
			return pako.deflateRaw(data, {to: 'string'});
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
			return pako.inflateRaw(data, {to: 'string'});
		}
	};

	/**
	 * Helper function to extract the graph model XML node.
	 */
	Editor.extractGraphModel = function(node, allowMxFile)
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
		        		data = Graph.decompress(data);
		        		
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
				node = Editor.parseDiagramNode(diagramNode);
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
	Editor.parseDiagramNode = function(diagramNode)
	{
		var text = mxUtils.trim(mxUtils.getTextContent(diagramNode));
		var node = null;
		
		if (text.length > 0)
		{
			var tmp = Graph.decompress(text);
			
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
	 * Extracts the XML from the compressed or non-compressed text chunk.
	 */
	Editor.extractGraphModelFromPng = function(data)
	{
		var result = null;
		
		try
		{
			var base64 = data.substring(data.indexOf(',') + 1);

			// Workaround for invalid character error in Safari
			var binary = (window.atob && !mxClient.IS_SF) ? atob(base64) : Base64.decode(base64, true);
			
			EditorUi.parsePng(binary, mxUtils.bind(this, function(pos, type, length)
			{
				var value = binary.substring(pos + 8, pos + 8 + length);
				
				if (type == 'zTXt')
				{
					var idx = value.indexOf(String.fromCharCode(0));
					
					if (value.substring(0, idx) == 'mxGraphModel')
					{
						// Workaround for Java URL Encoder using + for spaces, which isn't compatible with JS
						var xmlData = pako.inflateRaw(value.substring(idx + 2),
							{to: 'string'}).replace(/\+/g,' ');
						
						if (xmlData != null && xmlData.length > 0)
						{
							result = xmlData;
						}
					}
				}
				// Uncompressed section is normally not used
				else if (type == 'tEXt')
				{
					var vals = value.split(String.fromCharCode(0));
					
					if (vals.length > 1 && (vals[0] == 'mxGraphModel' ||
						vals[0] == 'mxfile'))
					{
						result = vals[1];
					}
				}
				
				if (result != null || type == 'IDAT')
				{
					// Stops processing the file as our text chunks
					// are always placed before the data section
					return true;
				}
			}));
		}
		catch (e)
		{
			// ignores decoding errors
		}
		
		if (result != null && result.charAt(0) == '%')
		{
			result = decodeURIComponent(result);
		}
		
		// Workaround for double encoded content
		if (result != null && result.charAt(0) == '%')
		{
			result = decodeURIComponent(result);
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
		
		return cause;
	};

	/**
	 * Global configuration of the Editor
	 * see https://desk.draw.io/solution/articles/16000058316
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
			StyleFormatPanel.prototype.defaultColorSchemes = config.defaultColorSchemes || StyleFormatPanel.prototype.defaultColorSchemes;
			Graph.prototype.defaultEdgeLength = config.defaultEdgeLength || Graph.prototype.defaultEdgeLength;
			DrawioFile.prototype.autosaveDelay = config.autosaveDelay || DrawioFile.prototype.autosaveDelay;
			
			if (config.templateFile != null)
			{
				EditorUi.templateFile = config.templateFile;
			}
			
			if (config.globalVars != null)
			{
				Editor.globalVars = config.globalVars;
			}

			if (config.compressXml != null)
			{
				Editor.compressXml = config.compressXml;
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
				Sidebar.prototype.enabledLibraries = config.enabledLibraries;
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
			
			if (config.emptyDiagramXml)
			{
				EditorUi.prototype.emptyDiagramXml = config.emptyDiagramXml;
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
			
			if (config.sidebarWidth)
			{
				EditorUi.prototype.hsplitPosition = config.sidebarWidth;
			}
			
			if (config.fontCss)
			{
				var s = document.createElement('style');
				s.setAttribute('type', 'text/css');
				s.appendChild(document.createTextNode(config.fontCss));
				
				var t = document.getElementsByTagName('script')[0];
			  	t.parentNode.insertBefore(s, t);
			  	
			  	Editor.prototype.fontCss = config.fontCss;
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
		}
	};

	/**
	 * Generates a unique ID of the given length
	 */
	Editor.GUID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';

	/**
	 * Generates a unique ID of the given length
	 */
	Editor.GUID_LENGTH = 20;
	
	/**
	 * Generates a unique ID of the given length
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
	 * This should not be enabled if reflows are required for math rendering.
	 */
	Editor.prototype.useForeignObjectForMath = false;

	/**
	 * Executes the first step for connecting to Google Drive.
	 */
	Editor.prototype.editButtonLink = (urlParams['edit'] != null) ? decodeURIComponent(urlParams['edit']) : null;

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
					bgImg = JSON.parse(bgImg);
					this.graph.setBackgroundImage(new mxImage(bgImg.src, bgImg.width, bgImg.height));
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
	Editor.prototype.getGraphXml = function(ignoreSelection)
	{
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		var node = editorGetGraphXml.apply(this, arguments);
		
		// Adds the current style
		if (this.graph.currentStyle != null && this.graph.currentStyle != 'default-style2')
		{
			node.setAttribute('style', this.graph.currentStyle);
		}
		
		// Adds the background image
		if (this.graph.backgroundImage != null)
		{
			node.setAttribute('backgroundImage', JSON.stringify(this.graph.backgroundImage));
		}
		
		node.setAttribute('math', (this.graph.mathEnabled) ? '1' : '0');
		node.setAttribute('shadow', (this.graph.shadowVisible) ? '1' : '0');
		
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
	Editor.prototype.extractGraphModel = function(node, allowMxFile)
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
	 * Initializes math typesetting and loads respective code.
	 */
	Editor.initMath = function(src, config)
	{
		src = (src != null) ? src : DRAW_MATH_URL + '/MathJax.js?config=TeX-MML-AM_HTMLorMML';
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

		// Disables global typesetting and messages on startup, adds queue for
		// asynchronous rendering while MathJax is loading
		window.MathJax =
		{
			skipStartupTypeset: true,
			showMathMenu: false,
			messageStyle: 'none',
			AuthorInit: function ()
			{
				// Specification recommends using SVG over HTML-CSS if browser is known
				// Check if too inconsistent with image export and print output
				MathJax.Hub.Config(config || {
					jax: ['input/TeX', 'input/MathML', 'input/AsciiMath', 'output/HTML-CSS'],
					extensions: ['tex2jax.js', 'mml2jax.js', 'asciimath2jax.js'],
					'HTML-CSS': {
						imageFont: null
					},
					TeX: {
					  extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
					},
					// Ignores math in in-place editor
					tex2jax: {
						ignoreClass: 'mxCellEditor'
				  	},
				  	asciimath2jax: {
						ignoreClass: 'mxCellEditor'
				  	}
				});
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
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = src;
			tags[0].parentNode.appendChild(script);
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
	 * Returns true if the given URL is known to have CORS headers.
	 */
	Editor.prototype.isCorsEnabledForUrl = function(url)
	{
		//Disable proxy for electron since it doesn't exist (it is served locally) and it works with most of the sites
		//The same with Chrome App, never use proxy
		if (mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
		{
			return true;
		}
		
		if (urlParams['cors'] != null && this.corsRegExp == null)
		{
			this.corsRegExp = new RegExp(decodeURIComponent(urlParams['cors']));
		}
		
		return (this.corsRegExp != null && this.corsRegExp.test(url)) ||
			url.substring(0, 34) === 'https://raw.githubusercontent.com/' ||
			url.substring(0, 23) === 'https://cdn.rawgit.com/' ||
			url.substring(0, 19) === 'https://rawgit.com/' ||
			/^https?:\/\/[^\/]*\.blob.core.windows.net\//.test(url) ||
			/^https?:\/\/[^\/]*\.iconfinder.com\//.test(url) ||
			/^https?:\/\/[^\/]*\.draw\.io\/proxy/.test(url) ||
			/^https?:\/\/[^\/]*\.github\.io\//.test(url);
	};

	//TODO This function is a replica of EditorUi one, it is planned to replace all calls to EditorUi one to point to this one
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
					src = EditorUi.prototype.svgBrokenImage.src; //TODO move it to Editor?
				}
				else if (remote && src.substring(0, converter.baseUrl.length) != converter.baseUrl &&
						(!EditorUi.prototype.crossOriginImages || !self.isCorsEnabledForUrl(src))) //TODO move it to Editor?
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

	//TODO This function is a replica of EditorUi one, it is planned to replace all calls to EditorUi one to point to this one
	/**
	 * 
	 */
	Editor.prototype.createSvgDataUri = function(svg)
	{
		return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
	};

	//TODO This function is a replica of EditorUi one, it is planned to replace all calls to EditorUi one to point to this one
	/**
	 * 
	 */
	Editor.prototype.convertImageToDataUri = function(url, callback)
	{
		if (/(\.svg)$/i.test(url))
		{
			mxUtils.get(url, mxUtils.bind(this, function(req)
			{
				callback(this.createSvgDataUri(req.getText()));
			}),
			function()
			{
				callback(EditorUi.prototype.svgBrokenImage.src);
			});
		}
		else
		{
		    var img = new Image();
		    var self = this;
		    
		    if (EditorUi.prototype.crossOriginImages)
	    	{
			    img.crossOrigin = 'anonymous';
		    }
		    
		    img.onload = function()
		    {
		        var canvas = document.createElement('canvas');
		        var ctx = canvas.getContext('2d');
		        canvas.height = img.height;
		        canvas.width = img.width;
		        ctx.drawImage(img, 0, 0);
		        
		        try
		        {
	        		callback(canvas.toDataURL());
		        }
		        catch (e)
		        {
	        		callback(EditorUi.prototype.svgBrokenImage.src);
		        }
		    };
		    
		    img.onerror = function()
		    {
	    		callback(EditorUi.prototype.svgBrokenImage.src);
		    };
		    
		    img.src = url;
		}
	};

	//TODO This function is a replica of EditorUi one, it is planned to replace all calls to EditorUi one to point to this one
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

	//TODO This function is a replica of EditorUi one, it is planned to replace all calls to EditorUi one to point to this one
	/**
	 * Base64 encodes the given string. This method seems to be more
	 * robust for encoding PNG from binary AJAX responses.
	 */
	Editor.prototype.base64Encode = function(str)
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

	//TODO This function is a replica of EditorUi one, it is planned to replace all calls to EditorUi one to point to this one
	/**
	 * Checks if the client is authorized and calls the next step.
	 */
	Editor.prototype.loadUrl = function(url, success, error, forceBinary, retry, dataUriPrefix)
	{
		try
		{
			var binary = forceBinary || /(\.png)($|\?)/i.test(url) ||
				/(\.jpe?g)($|\?)/i.test(url) || /(\.gif)($|\?)/i.test(url);
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
								data = dataUriPrefix + this.base64Encode(data);
							}
				    		
				    		success(data);
				    	}
					}
					else if (error != null)
			    	{
			    		error({code: App.ERROR_UNKNOWN}, req);
			    	}
				}), function()
				{
			    	if (error != null)
			    	{
			    		error({code: App.ERROR_UNKNOWN});
			    	}
				}, binary, this.timeout, function()
			    {
				    if (retry && error != null)
					{
						error({code: App.ERROR_TIMEOUT, retry: fn});
					}
			    });
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

	//TODO This function is a replica of EditorUi one, it is planned to replace all calls to EditorUi one to point to this one
	/**
	 * For the fontCSS to be applied when rendering images on canvas, the actual
	 * font data must be made available via a data URI encoding of the file.
	 */
    Editor.prototype.loadFonts = function(then)
    {
        if (this.fontCss != null && this.resolvedFontCss == null)
        {
            var parts = this.fontCss.split('url(');
            var waiting = 0;
            var fonts = {};

            // Strips leading and trailing quotes and spaces
            function trimString(str)
            {
                return str.replace(new RegExp("^[\\s\"']+", "g"), "").replace(new RegExp("[\\s\"']+$", "g"), "");
            };
            
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
                        result.push(fonts[trimString(parts[j].substring(0, idx))]);
                        result.push('"' + parts[j].substring(idx));
                    }
                    
                    this.resolvedFontCss = result.join('');
                    then();
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
                        format = trimString(parts[i].substring(fmtIdx + 7, parts[i].indexOf(')', fmtIdx)));
                    }
    
                    (mxUtils.bind(this, function(url)
                    {
                        if (fonts[url] == null)
                        {
                            // Mark font es being fetched and fetch it
                            fonts[url] = url;
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
                                fonts[url] = uri;
                                waiting--;
                                finish();
                            }), mxUtils.bind(this, function(err)
                            {
                                // LATER: handle error
                                waiting--;
                                finish();
                            }), true, null, 'data:' + mime + ';charset=utf-8;base64,');
                        }
                    }))(trimString(parts[i].substring(0, idx)), format);
                }
            }
        }
        else
        {
            then();
        }
    };

	//TODO This function is a replica of EditorUi one, it is planned to replace all calls to EditorUi one to point to this one
	/**
	 * Converts math in the given SVG
	 */
	Editor.prototype.convertMath = function(graph, svgRoot, fixPosition, callback)
	{
		if (graph.mathEnabled && typeof(MathJax) !== 'undefined' && typeof(MathJax.Hub) !== 'undefined')
		{
	      	// Temporarily attaches to DOM for rendering
			// FIXME: If adding svgRoot to body, the text
			// value of the math is appended, if not
			// added to DOM then LaTeX does not work.
			// This must be fixed to enable client-side export
			// if math is enabled.
//			document.body.appendChild(svgRoot);
			Editor.MathJaxRender(svgRoot);
	      
			window.setTimeout(mxUtils.bind(this, function()
			{
				MathJax.Hub.Queue(mxUtils.bind(this, function ()
				{
					// Removes from DOM
//					svgRoot.parentNode.removeChild(svgRoot);
					
					callback();
				}));
			}), 0);
		}
		else
		{
			callback();
		}
	};

	//TODO This function is a replica of EditorUi one, it is planned to replace all calls to EditorUi one to point to this one
	/**
	 * See fixme in convertMath for client-side image generation with math.
	 */
	Editor.prototype.isExportToCanvas = function()
	{
		return mxClient.IS_CHROMEAPP || (!this.graph.mathEnabled && this.useCanvasForExport);
	};

	//TODO This function is a replica of EditorUi one, it is planned to replace all calls to EditorUi one to point to this one
	/**
	 *
	 */
	Editor.prototype.exportToCanvas = function(callback, width, imageCache, background, error, limitHeight,
		ignoreSelection, scale, transparentBackground, addShadow, converter, graph, border, noCrop)
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
			bg = this.graph.defaultPageBackgroundColor;
		}
		
		this.convertImages(graph.getSvg(bg, null, null, noCrop, null, ignoreSelection, null, null, null, addShadow),
			mxUtils.bind(this, function(svgRoot)
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
					
					w = Math.ceil(scale * w) + 2 * border;
					h = Math.ceil(scale * h) + 2 * border;
					
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

			   		ctx.scale(scale, scale);
			   		
			   		// Workaround for broken data URI images in Safari on first export
			   		if (mxClient.IS_SF)
			   		{			   		
						window.setTimeout(function()
						{
							ctx.drawImage(img, border / scale, border / scale);
							callback(canvas);
						}, 0);
			   		}
			   		else
			   		{
			   			ctx.drawImage(img, border / scale, border / scale);
			   			callback(canvas);
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

			try
			{
				if (addShadow)
				{
					this.graph.addSvgShadow(svgRoot);
				}
				
				var done = mxUtils.bind(this, function()
				{
					if (this.resolvedFontCss != null)
					{
						var st = document.createElement('style');
						st.setAttribute('type', 'text/css');
						st.innerHTML = this.resolvedFontCss;
						
						// Must be in defs section for FF to work
						var defs = svgRoot.getElementsByTagName('defs');
						defs[0].appendChild(st);
					}
					
					this.convertMath(graph, svgRoot, true, mxUtils.bind(this, function()
					{
						img.src = this.createSvgDataUri(mxUtils.getXml(svgRoot));
					}));
				});
				
				this.loadFonts(done);
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
	};

	//TODO This function is a replica of EditorUi one, it is planned to replace all calls to EditorUi one to point to this one
	/**
	 * Adds the given text to the compressed or non-compressed text chunk.
	 */
	Editor.prototype.writeGraphModelToPng = function(data, type, key, value, error)
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
				
				var chunkData = key + String.fromCharCode(0) +
					((type == 'zTXt') ? String.fromCharCode(0) : '') + 
					value;
				
				var crc = 0xffffffff;
				crc = EditorUi.prototype.updateCRC(crc, type, 0, 4); //TODO move code to Editor?
				crc = EditorUi.prototype.updateCRC(crc, chunkData, 0, chunkData.length);
				
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
	}

	/**
	 * Adds persistence for recent colors
	 */
	if (window.ColorDialog)
	{
		FilenameDialog.filenameHelpLink = 'https://desk.draw.io/support/solutions/articles/16000091426'; 
		
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
				
				if (!Editor.shadowOptionEnabled)
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
	            
	            var help = ui.menus.createHelpLink('https://desk.draw.io/support/solutions/articles/16000032875');
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
			[{fill: '#60a917', stroke: '#2D7600', font: '#ffffff'}, {fill: '#008a00', stroke: '#005700', font: '#ffffff'},
			{fill: '#1ba1e2', stroke: '#006EAF', font: '#ffffff'}, {fill: '#0050ef', stroke: '#001DBC', font: '#ffffff'},
			{fill: '#6a00ff', stroke: '#3700CC', font: '#ffffff'}, {fill: '#aa00ff', stroke: '#7700CC', font: '#ffffff'},
			{fill: '#d80073', stroke: '#A50040', font: '#ffffff'}, {fill: '#a20025', stroke: '#6F0000', font: '#ffffff'}],
			[{fill: '#e51400', stroke: '#B20000', font: '#ffffff'}, {fill: '#fa6800', stroke: '#C73500', font: '#ffffff'},
			{fill: '#f0a30a', stroke: '#BD7000', font: '#ffffff'}, {fill: '#e3c800', stroke: '#B09500', font: '#ffffff'},
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
			// TODO: Update sstate in Format
			var sstate = this.format.createSelectionState();

			if (sstate.style.shape != 'image' && !sstate.containsLabel)
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
			var graph = this.editorUi.editor.graph;
			
			var btn = mxUtils.button(mxResources.get('copyStyle'), mxUtils.bind(this, function(evt)
			{
				this.editorUi.actions.get('copyStyle').funct();
			}));
			
			btn.setAttribute('title', mxResources.get('copyStyle') + ' (' + this.editorUi.actions.get('copyStyle').shortcut + ')');
			btn.style.marginBottom = '2px';
			btn.style.width = '100px';
			btn.style.marginRight = '2px';
			
			div.appendChild(btn);
			
			var btn = mxUtils.button(mxResources.get('pasteStyle'), mxUtils.bind(this, function(evt)
			{
				this.editorUi.actions.get('pasteStyle').funct();
			}));
			
			btn.setAttribute('title', mxResources.get('pasteStyle') + ' (' + this.editorUi.actions.get('pasteStyle').shortcut + ')');
			btn.style.marginBottom = '2px';
			btn.style.width = '100px';
			
			div.appendChild(btn);
			mxUtils.br(div);
			
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
				td.innerHTML = mxUtils.htmlEntities(mxResources.get(pDiplayName, null, pDiplayName));
				
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
							td.innerHTML = mxUtils.htmlEntities(mxResources.get(op.dispName, null, op.dispName));
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
							opElem.innerHTML = mxUtils.htmlEntities(mxResources.get(op.dispName, null, op.dispName));
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
								if (inputVal.trim().toLowerCase() == 'auto')
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
			grid.style.whiteSpace = 'nowrap';
			grid.style.width = '100%';
			//create header row
			var hrow = document.createElement('tr');
			hrow.className = 'gePropHeader';
			var th = document.createElement('th');
			th.className = 'gePropHeaderCell';
			var collapseImg = document.createElement('img');
			collapseImg.src = Sidebar.prototype.expandedImage;
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
			
			for (var key in properties)
			{
				var prop = properties[key];
				
				if (typeof(prop.isVisible) == 'function')
				{
					if (!prop.isVisible(state, this)) continue;
				}
				
				var pValue = state.style[key] != null? mxUtils.htmlEntities(state.style[key] + '') : prop.defVal; //or undefined if defVal is undefined

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
			var graph = this.editorUi.editor.graph;
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

			function updateScheme(colorsets)
			{
				function addButton(colorset)
				{
					var btn = mxUtils.button('', function(evt)
					{
						graph.getModel().beginUpdate();
						try
						{
							var cells = graph.getSelectionCells();
							
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
									style = mxUtils.setStyle(style, mxConstants.STYLE_GRADIENTCOLOR, colorset['gradient'] ||
										mxUtils.getValue(defaults, mxConstants.STYLE_GRADIENTCOLOR, null));
								
									if (colorset['fill'] == '')
									{
										style = mxUtils.setStyle(style, mxConstants.STYLE_FILLCOLOR,null);
									}
									else
									{
										style = mxUtils.setStyle(style, mxConstants.STYLE_FILLCOLOR, colorset['fill'] ||
											mxUtils.getValue(defaults, mxConstants.STYLE_FILLCOLOR, null));
									}
									
									if (colorset['stroke'] == '')
									{
										style = mxUtils.setStyle(style, mxConstants.STYLE_STROKECOLOR, null);
									}
									else
									{
										style = mxUtils.setStyle(style, mxConstants.STYLE_STROKECOLOR, colorset['stroke'] ||
											mxUtils.getValue(defaults, mxConstants.STYLE_STROKECOLOR, null));
									}
									
									if (graph.getModel().isVertex(cells[i]))
									{
										style = mxUtils.setStyle(style, mxConstants.STYLE_FONTCOLOR, colorset['font'] ||
											mxUtils.getValue(defaults, mxConstants.STYLE_FONTCOLOR, null));
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
					})
	
					btn.className = 'geStyleButton';
					btn.style.width = '36px';
					btn.style.height = '30px';
					btn.style.margin = '0px 6px 6px 0px';
					
					if (colorset != null)
					{
						if (colorset['gradient'] != null)
						{
							if (mxClient.IS_IE && (mxClient.IS_QUIRKS || document.documentMode < 10))
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
								mxConstants.STYLE_FILLCOLOR, (uiTheme == 'dark') ?'#2a2a2a' : '#ffffff');
						}
						else
						{
							btn.style.backgroundColor = colorset['fill'] || mxUtils.getValue(graph.defaultVertexStyle,
								mxConstants.STYLE_FILLCOLOR, (uiTheme == 'dark') ?'#2a2a2a' : '#ffffff');
						}
						
						if (colorset['stroke'] == mxConstants.NONE)
						{
							btn.style.border = '1px solid transparent';
						}
						else if (colorset['stroke'] == '')
						{
							btn.style.border = '1px solid ' + mxUtils.getValue(graph.defaultVertexStyle, 
								mxConstants.STYLE_STROKECOLOR, (uiTheme != 'dark') ?'#2a2a2a' : '#ffffff');
						}
						else
						{
							btn.style.border = '1px solid ' + (colorset['stroke'] || mxUtils.getValue(graph.defaultVertexStyle,
									mxConstants.STYLE_STROKECOLOR, (uiTheme != 'dark') ?'#2a2a2a' : '#ffffff'));
						}
					}
					else
					{
						var bg = mxUtils.getValue(graph.defaultVertexStyle, mxConstants.STYLE_FILLCOLOR, '#ffffff');
						var bd = mxUtils.getValue(graph.defaultVertexStyle, mxConstants.STYLE_STROKECOLOR, '#000000');
						
						btn.style.backgroundColor = bg;
						btn.style.border = '1px solid ' + bd;
					}
					
					picker.appendChild(btn);
				};
				
				picker.innerHTML = '';
				
				for (var i = 0; i < colorsets.length; i++)
				{
					if (i > 0 && mxUtils.mod(i, 4) == 0)
					{
						mxUtils.br(picker);
					}
					
					addButton(colorsets[i]);
				}
			};

			if (this.editorUi.currentScheme == null)
			{
				this.editorUi.currentScheme = 0;
			}

			var left = document.createElement('div');
			left.style.cssText = 'position:absolute;left:10px;top:8px;bottom:8px;width:20px;margin:4px;opacity:0.5;' +
				'background-repeat:no-repeat;background-position:center center;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQBAMAAADQT4M0AAAAIVBMVEUAAAB2dnZ4eHh3d3d1dXVxcXF2dnZ2dnZ2dnZxcXF2dnYmb3w1AAAACnRSTlMAfCTkhhvb7cQSPH2JPgAAADRJREFUCNdjwACMAmBKaiGYs2oJmLPKAZ3DabU8AMRTXpUKopislqFyVzCAuUZgikkBZjoAcMYLnp53P/UAAAAASUVORK5CYII=);';
			
			mxEvent.addListener(left, 'click', mxUtils.bind(this, function()
			{
				this.editorUi.currentScheme = mxUtils.mod(this.editorUi.currentScheme - 1, this.defaultColorSchemes.length);
				updateScheme(this.defaultColorSchemes[this.editorUi.currentScheme]);
			}));
			
			var right = document.createElement('div');
			right.style.cssText = 'position:absolute;left:202px;top:8px;bottom:8px;width:20px;margin:4px;opacity:0.5;' +
				'background-repeat:no-repeat;background-position:center center;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQBAMAAADQT4M0AAAAIVBMVEUAAAB2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnYBuwCcAAAACnRSTlMAfCTkhhvb7cQSPH2JPgAAADZJREFUCNdjQAOMAmBKaiGY8loF5rKswsZlrVo8AUiFrTICcbIWK8A5DF1gDoMymMPApIAwHwCS0Qx/U7qCBQAAAABJRU5ErkJggg==);';

			if (this.defaultColorSchemes.length > 1)
			{
				div.appendChild(left);
				div.appendChild(right);
			}
			
			mxEvent.addListener(right, 'click', mxUtils.bind(this, function()
			{
				this.editorUi.currentScheme = mxUtils.mod(this.editorUi.currentScheme + 1, this.defaultColorSchemes.length);
				updateScheme(this.defaultColorSchemes[this.editorUi.currentScheme]);
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
			
			updateScheme(this.defaultColorSchemes[this.editorUi.currentScheme]);
			
			return div;
		};
		
		StyleFormatPanel.prototype.addEditOps = function(div)
		{
			var ss = this.format.getSelectionState();
			var btn = null;
			
			if (this.editorUi.editor.graph.getSelectionCount() == 1)
			{
				btn = mxUtils.button(mxResources.get('editStyle'), mxUtils.bind(this, function(evt)
				{
					this.editorUi.actions.get('editStyle').funct();
				}));
				
				btn.setAttribute('title', mxResources.get('editStyle') + ' (' + this.editorUi.actions.get('editStyle').shortcut + ')');
				btn.style.width = '202px';
				btn.style.marginBottom = '2px';
				
				div.appendChild(btn);
			}
			
			var graph = this.editorUi.editor.graph;
			var state = graph.view.getState(graph.getSelectionCell());
			
			if (graph.getSelectionCount() == 1 && state != null && state.shape != null && state.shape.stencil != null)
			{
				var btn2 = mxUtils.button(mxResources.get('editShape'), mxUtils.bind(this, function(evt)
				{
					this.editorUi.actions.get('editShape').funct();
				}));
				
				btn2.setAttribute('title', mxResources.get('editShape'));
				btn2.style.marginBottom = '2px';
				
				if (btn == null)
				{
					btn2.style.width = '202px';
				}
				else
				{
					btn.style.width = '100px';
					btn2.style.width = '100px';
					btn2.style.marginLeft = '2px';
				}
				
				div.appendChild(btn2);
			}
			else if (ss.image)
			{
				var btn2 = mxUtils.button(mxResources.get('editImage'), mxUtils.bind(this, function(evt)
				{
					this.editorUi.actions.get('image').funct();
				}));
				
				btn2.setAttribute('title', mxResources.get('editImage'));
				btn2.style.marginBottom = '2px';
				
				if (btn == null)
				{
					btn2.style.width = '202px';
				}
				else
				{
					btn.style.width = '100px';
					btn2.style.width = '100px';
					btn2.style.marginLeft = '2px';
				}
				
				div.appendChild(btn2);
			}
			
			return div;
		};
	}

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
	 * Adds rack child layout style.
	 */
	var graphInit = Graph.prototype.init;
	
	Graph.prototype.init = function()
	{
		graphInit.apply(this, arguments);

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
			
			// Workaround for member not found in IE8-
			try
			{
				if (mxClient.IS_QUIRKS || document.documentMode == 7 || document.documentMode == 8)
				{
					mouseEvent = document.createEventObject(evt);
					mouseEvent.type = evt.type;
					mouseEvent.canBubble = evt.canBubble;
					mouseEvent.cancelable = evt.cancelable;
					mouseEvent.view = evt.view;
					mouseEvent.detail = evt.detail;
					mouseEvent.screenX = evt.screenX;
					mouseEvent.screenY = evt.screenY;
					mouseEvent.clientX = evt.clientX;
					mouseEvent.clientY = evt.clientY;
					mouseEvent.ctrlKey = evt.ctrlKey;
					mouseEvent.altKey = evt.altKey;
					mouseEvent.shiftKey = evt.shiftKey;
					mouseEvent.metaKey = evt.metaKey;
					mouseEvent.button = evt.button;
					mouseEvent.relatedTarget = evt.relatedTarget;
				}
			}
			catch (e)
			{
				// ignores possible event cloning errors
			}
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
					
					rackLayout.fill = true;
					rackLayout.marginLeft = style['marginLeft'] || 0;
					rackLayout.marginRight = style['marginRight'] || 0;
					rackLayout.marginTop = style['marginTop'] || 0;
					rackLayout.marginBottom = style['marginBottom'] || 0;
					rackLayout.allowGaps = style['allowGaps'] || 0;
					rackLayout.resizeParent = false;
					
					return rackLayout;
				}
				else if (typeof mxTableLayout !== 'undefined' && style['childLayout'] == 'tableLayout')
		        {
		            var tableLayout = new mxTableLayout(this.graph);
		            tableLayout.rows = style['tableRows'] || 2;
		            tableLayout.columns = style['tableColumns'] || 2;
		            tableLayout.colPercentages = style['colPercentages'];
		            tableLayout.rowPercentages = style['rowPercentages'];
		            tableLayout.equalColumns = mxUtils.getValue(style, 'equalColumns', tableLayout.colPercentages? '0' : '1') == '1';
		            tableLayout.equalRows = mxUtils.getValue(style, 'equalRows', tableLayout.rowPercentages? '0' : '1') == '1';
		            tableLayout.resizeParent = mxUtils.getValue(style, 'resizeParent', '1') == '1';
		            tableLayout.border = style['tableBorder'] || tableLayout.border;
		            tableLayout.marginLeft = style['marginLeft'] || 0;
		            tableLayout.marginRight = style['marginRight'] || 0;
		            tableLayout.marginTop = style['marginTop'] || 0;
		            tableLayout.marginBottom = style['marginBottom'] || 0;
		            tableLayout.autoAddCol = mxUtils.getValue(style, 'autoAddCol', '0') == '1';
		            tableLayout.autoAddRow = mxUtils.getValue(style, 'autoAddRow', tableLayout.autoAddCol? '0' : '1') == '1';
		            tableLayout.colWidths = style['colWidths'] || "100";
		            tableLayout.rowHeights = style['rowHeights'] || "50";
		            
		            return tableLayout;
		        }
			}
			
			return layoutManagerGetLayout.apply(this, arguments);
		}
		
		this.updateGlobalUrlVariables();
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
	
	Graph.prototype.getSvg = function()
	{
		var temp = null;
		
		if (this.themes != null && this.defaultThemeName == 'darkTheme')
		{
			temp = this.stylesheet;
			this.stylesheet = this.getDefaultStylesheet()
			this.refresh();
		}
		
		var result = graphGetSvg.apply(this, arguments);
		
		if (temp != null)
		{
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
			var graph = this;
			var origin = graph.container.getBoundingClientRect();
			var dy = graph.container.scrollTop - origin.y;
			var dx = graph.container.scrollLeft - origin.x;
			var drawText = imgExport.drawText;

			// Copies rendered math from container to SVG document
			imgExport.drawText = function(state, canvas)
			{
				if (state.text != null && state.text.node != null &&
					state.text.node.ownerSVGElement == null)
				{
					// Copies text into DOM using actual bounding box
					var rect = state.text.node.getBoundingClientRect();
					
					// Sets position on foreignObject
					var fo = canvas.root.ownerDocument.createElementNS(mxConstants.NS_SVG, 'foreignObject');
					fo.setAttribute('x', (rect.x + dx) * canvas.state.scale + canvas.state.dx);
					fo.setAttribute('y', (rect.y + dy) * canvas.state.scale + canvas.state.dy);
					fo.setAttribute('width', rect.width * canvas.state.scale);
					fo.setAttribute('height', rect.height * canvas.state.scale);
					
					// Resets position on inner DIV
					var clone = state.text.node.cloneNode(true);
					clone.style.top = '0px';
					clone.style.left = '0px';
					clone.style.transform = '';
					
					// Removes all math elements
					var ele = clone.getElementsByTagName('math');
					
					while (ele.length > 0)
					{
						ele[0].parentNode.removeChild(ele[0]);
					}
					
					fo.appendChild(clone);
					canvas.root.ownerSVGElement.appendChild(fo);
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
	 * Safari has problems with math typesetting inside foreignObjects.
	 */
	var graphIsCssTransformsSupported = Graph.prototype.isCssTransformsSupported;
	
	Graph.prototype.isCssTransformsSupported = function()
	{
		// FIXME: Safari only disabled due to mathjax rendering errors
		return graphIsCssTransformsSupported.apply(this, arguments) && !mxClient.IS_SF;
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
	 * a comma-separated list of JSON objects with the following possible keys:
	 * 
	 * "open": string - opens a standard or custom link (including page links)
	 * "toggle"/"show"/"hide"/"highlight": cellset - toggles, shows, hides or
	 * highlights the given cells
	 * "select": cellset - selects the given cells if the graph is editable
	 * "scroll": cellset - scrolls to the first cell in the given celllset
	 * If no scroll action is specified, then the first cell of the select
	 * or highlight action is scrolled to visible (select has precedence).
	 * A cellset is an array of cell IDs or tags or both, eg.
	 * {"cells": ["id1", "id2"], "tags": ["tag1", "tag2"]}
	 * To specify all cells, use "cells": ["*"], to specify all cells with
	 * a tag, use "tags": [] (empty array).
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
			// Some actions are stateless and must be handled before the transaction
			var link = JSON.parse(href.substring(17));

			// When adding new actions that reference cell IDs support for updating
			// those cell IDs must be handled in Graph.updateCustomLinkActions
			if (link.actions != null)
			{
				// Executes open actions before starting transaction
				for (var i = 0; i < link.actions.length; i++)
				{
					var action = link.actions[i];
					
					if (action.open != null)
					{
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
				}

				// Executes all actions that change cell states
	    		this.model.beginUpdate();
	    		try
	    		{
					for (var i = 0; i < link.actions.length; i++)
					{
						var action = link.actions[i];
						
						if (action.toggle != null)
						{
							this.toggleCells(this.getCellsForAction(action.toggle, true));
						}
						
						if (action.show != null)
						{
							this.setCellsVisible(this.getCellsForAction(action.show, true), true);
						}
						
						if (action.hide != null)
						{
							this.setCellsVisible(this.getCellsForAction(action.hide, true), false);
						}
					}
				}
	    		finally
	    		{
	    			this.model.endUpdate();
	    		}
	    		
				// Executes stateless actions on cells
				for (var i = 0; i < link.actions.length; i++)
				{
					var action = link.actions[i];
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
							action.highlight.duration, action.highlight.opacity);
					}

					if (action.scroll != null)
					{
						cells = this.getCellsForAction(action.scroll);
					}
					
					if (cells.length > 0)
					{
						this.scrollCellToVisible(cells[0]);
					}
				}
			}
		}
	};
	
	/**
	 * Updates cell IDs in custom links on the given cell and its label.
	 */
	Graph.prototype.updateCustomLinksForCell = function(mapping, cell)
	{
		var href = this.getLinkForCell(cell);
		
		if (href != null && href.substring(0, 17) == 'data:action/json,')
		{
			this.setLinkForCell(cell, this.updateCustomLink(mapping, href));
		}
		
		if (this.isHtmlLabel(cell))
		{
			var temp = document.createElement('div');
			temp.innerHTML = this.getLabel(cell);
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
				// Some actions are stateless and must be handled before the transaction
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
			
			this.updateCustomLinkAction(mapping, action.toggle);
			this.updateCustomLinkAction(mapping, action.show);
			this.updateCustomLinkAction(mapping, action.hide);
			this.updateCustomLinkAction(mapping, action.select);
			this.updateCustomLinkAction(mapping, action.highlight);
			this.updateCustomLinkAction(mapping, action.scroll);
		}
	};
	
	/**
	 * Updates cell IDs in the given custom link action.
	 */
	Graph.prototype.updateCustomLinkAction = function(mapping, action)
	{
		if (action != null && action.cells != null)
		{
			var result = [];
			
			for (var i = 0; i < action.cells.length; i++)
			{
				if (action.cells[i] == '*')
				{
					result.push(action.cells[i]);
				}
				else
				{
					var temp = mapping[action.cells[i]];
					
					if (temp != null)
					{
						if (temp != '')
						{
							result.push(temp);
						}
					}
					else
					{
						result.push(action.cells[i]);
					}
				}
			}
			
			action.cells = result;
		}
	};
	
	/**
	 * Handles each action in the action array of a custom link. This code
	 * handles toggle actions for cell IDs.
	 */
	Graph.prototype.getCellsForAction = function(action, includeLayers)
	{
		return this.getCellsById(action.cells).concat(
			this.getCellsForTags(action.tags, null, null, includeLayers));
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
					var parent = this.getDefaultParent();
					
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
	 * Returns the cells in the model (or given array) that have all of the
	 * given tags in their tags property.
	 */
	Graph.prototype.getCellsForTags = function(tagList, cells, propertyName, includeLayers)
	{
		var result = [];
		
		if (tagList != null)
		{
			cells = (cells != null) ? cells : this.model.getDescendants(this.model.getRoot());
			propertyName = (propertyName != null) ? propertyName : 'tags';
			
			var tagCount = 0;
			var lookup = {};
			
			for (var i = 0; i < tagList.length; i++)
			{
				if (tagList[i].length > 0)
				{
					lookup[tagList[i].toLowerCase()] = true;
					tagCount++;
				}
			}
			
			for (var i = 0; i < cells.length; i++)
			{
				if ((includeLayers && this.model.getParent(cells[i]) == this.model.root) ||
					this.model.isVertex(cells[i]) || this.model.isEdge(cells[i]))
				{
					var tags = (cells[i].value != null && typeof(cells[i].value) == 'object') ?
						mxUtils.trim(cells[i].value.getAttribute(propertyName) || '') : '';
					var match = false;
	
					if (tags.length > 0)
					{
						var tmp = tags.toLowerCase().split(' ');
						
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
					else
					{
						match = tagList.length == 0;
					}
					
					if (match)
					{
						result.push(cells[i]);
					}
				}
			}
		}
		
		return result;
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
	Graph.prototype.addSvgShadow = function(svgRoot, group, createOnly)
	{
		createOnly = (createOnly != null) ? createOnly : false;
		
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
				
				if (!isNaN(parseInt(svgRoot.getAttribute('width'))))
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
		if (mxClient.IS_SVG)
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
	mxStencilRegistry.libraries['bpmn'] = [SHAPES_PATH + '/bpmn/mxBpmnShape2.js', STENCIL_PATH + '/bpmn.xml'];
	mxStencilRegistry.libraries['dfd'] = [SHAPES_PATH + '/mxDFD.js'];
	mxStencilRegistry.libraries['er'] = [SHAPES_PATH + '/er/mxER.js'];
	mxStencilRegistry.libraries['flowchart'] = [SHAPES_PATH + '/mxFlowchart.js', STENCIL_PATH + '/flowchart.xml'];
	mxStencilRegistry.libraries['ios'] = [SHAPES_PATH + '/mockup/mxMockupiOS.js'];
	mxStencilRegistry.libraries['rackGeneral'] = [SHAPES_PATH + '/rack/mxRack.js', STENCIL_PATH + '/rack/general.xml'];
	mxStencilRegistry.libraries['rackF5'] = [STENCIL_PATH + '/rack/f5.xml'];
	mxStencilRegistry.libraries['lean_mapping'] = [SHAPES_PATH + '/mxLeanMap.js', STENCIL_PATH + '/lean_mapping.xml'];
	mxStencilRegistry.libraries['basic'] = [SHAPES_PATH + '/mxBasic.js', STENCIL_PATH + '/basic.xml'];
	mxStencilRegistry.libraries['ios7icons'] = [STENCIL_PATH + '/ios7/icons.xml'];
	mxStencilRegistry.libraries['ios7ui'] = [SHAPES_PATH + '/ios7/mxIOS7Ui.js', STENCIL_PATH + '/ios7/misc.xml'];
	mxStencilRegistry.libraries['android'] = [SHAPES_PATH + '/mxAndroid.js', STENCIL_PATH + '/android/android.xml'];
	mxStencilRegistry.libraries['electrical/miscellaneous'] = [SHAPES_PATH + '/mxElectrical.js', STENCIL_PATH + '/electrical/miscellaneous.xml'];
	mxStencilRegistry.libraries['electrical/transmission'] = [SHAPES_PATH + '/mxElectrical.js', STENCIL_PATH + '/electrical/transmission.xml'];
	mxStencilRegistry.libraries['electrical/logic_gates'] = [SHAPES_PATH + '/mxElectrical.js', STENCIL_PATH + '/electrical/logic_gates.xml'];
	mxStencilRegistry.libraries['electrical/abstract'] = [SHAPES_PATH + '/mxElectrical.js', STENCIL_PATH + '/electrical/abstract.xml'];
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
	mxStencilRegistry.libraries['bootstrap'] = [SHAPES_PATH + '/mxBootstrap.js', STENCIL_PATH + '/bootstrap.xml'];
	mxStencilRegistry.libraries['gmdl'] = [SHAPES_PATH + '/mxGmdl.js', STENCIL_PATH + '/gmdl.xml'];
	mxStencilRegistry.libraries['gcp2'] = [SHAPES_PATH + '/mxGCP2.js', STENCIL_PATH + '/gcp2.xml'];
	mxStencilRegistry.libraries['cabinets'] = [SHAPES_PATH + '/mxCabinets.js', STENCIL_PATH + '/cabinets.xml'];
	mxStencilRegistry.libraries['archimate'] = [SHAPES_PATH + '/mxArchiMate.js'];
	mxStencilRegistry.libraries['archimate3'] = [SHAPES_PATH + '/mxArchiMate3.js'];
	mxStencilRegistry.libraries['sysml'] = [SHAPES_PATH + '/mxSysML.js'];
	mxStencilRegistry.libraries['eip'] = [SHAPES_PATH + '/mxEip.js', STENCIL_PATH + '/eip.xml'];
	mxStencilRegistry.libraries['networks'] = [SHAPES_PATH + '/mxNetworks.js', STENCIL_PATH + '/networks.xml'];
	mxStencilRegistry.libraries['aws3d'] = [SHAPES_PATH + '/mxAWS3D.js', STENCIL_PATH + '/aws3d.xml'];
	mxStencilRegistry.libraries['aws4'] = [SHAPES_PATH + '/mxAWS4.js', STENCIL_PATH + '/aws4.xml'];
	mxStencilRegistry.libraries['aws4b'] = [SHAPES_PATH + '/mxAWS4.js', STENCIL_PATH + '/aws4.xml'];
	mxStencilRegistry.libraries['veeam'] = [STENCIL_PATH + '/veeam/2d.xml', STENCIL_PATH + '/veeam/3d.xml', STENCIL_PATH + '/veeam/veeam.xml'];
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
		
		if (pageCount > 1)
		{
			div.appendChild(pagesSection);
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
						
						if (editorUi.editor.fontCss != null)
						{
							doc.writeln('<style type="text/css">');
							doc.writeln(editorUi.editor.fontCss);
							doc.writeln('</style>');
						}
					};
					
					if (typeof(MathJax) !== 'undefined')
					{
						// Adds class to ignore if math is disabled
						var printPreviewRenderPage = pv.renderPage;
						
						pv.renderPage = function(w, h, dx, dy, content, pageNumber)
						{
							var prev = mxClient.NO_FO;
							mxClient.NO_FO = (this.graph.mathEnabled && !this.useForeignObjectForMath) ?
									true : this.originalNoForeignObject;
							
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
					
					if (graph.themes != null && graph.defaultThemeName == 'darkTheme')
					{
						temp = graph.stylesheet;
						graph.stylesheet = graph.getDefaultStylesheet()
						graph.refresh();
					}
					
					// Generates the print output
					pv.open(null, null, forcePageBreaks, true);
					
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
						tempGraph = editorUi.createTemporaryGraph(graph.getStylesheet());

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
			
					doc.writeln('<script type="text/x-mathjax-config">');
					doc.writeln('MathJax.Hub.Config({');
					doc.writeln('showMathMenu: false,');
					doc.writeln('messageStyle: "none",');
					doc.writeln('jax: ["input/TeX", "input/MathML", "input/AsciiMath", "output/HTML-CSS"],');
					doc.writeln('extensions: ["tex2jax.js", "mml2jax.js", "asciimath2jax.js"],');
					doc.writeln('"HTML-CSS": {');
					doc.writeln('imageFont: null');
					doc.writeln('},');
					doc.writeln('TeX: {');
					doc.writeln('extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"]');
					doc.writeln('},');
					doc.writeln('tex2jax: {');
					doc.writeln('	ignoreClass: "geDisableMathJax"');
				  	doc.writeln('},');
				  	doc.writeln('asciimath2jax: {');
					doc.writeln('	ignoreClass: "geDisableMathJax"');
				  	doc.writeln('}');
					doc.writeln('});');
					
					// Adds asynchronous printing when MathJax finished rendering
					if (print)
					{
						doc.writeln('MathJax.Hub.Queue(function () {');
						doc.writeln('window.print();');
						doc.writeln('});');
					}
					
					doc.writeln('</script>');
					doc.writeln('<script type="text/javascript" src="' + DRAW_MATH_URL + '/MathJax.js"></script>');
				}
				
				pv.closeDocument();
				
				if (!pv.mathEnabled && print)
				{
					PrintDialog.printPreview(pv);
				}
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
				graph.openLink('https://desk.draw.io/support/solutions/articles/16000048947');
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
                    this.page.viewState.backgroundImage = this.image;
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
