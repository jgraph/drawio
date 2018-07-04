/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Editor constructor executed on page load.
 */
Editor = function(chromeless, themes, model, graph, editable)
{
	mxEventSource.call(this);
	this.chromeless = (chromeless != null) ? chromeless : this.chromeless;
	this.initStencilRegistry();
	this.graph = graph || this.createGraph(themes, model);
	this.editable = (editable != null) ? editable : !chromeless;
	this.undoManager = this.createUndoManager();
	this.status = '';

	this.getOrCreateFilename = function()
	{
		return this.filename || mxResources.get('drawing', [Editor.pageCounter]) + '.xml';
	};
	
	this.getFilename = function()
	{
		return this.filename;
	};
	
	// Sets the status and fires a statusChanged event
	this.setStatus = function(value)
	{
		this.status = value;
		this.fireEvent(new mxEventObject('statusChanged'));
	};
	
	// Returns the current status
	this.getStatus = function()
	{
		return this.status;
	};

	// Updates modified state if graph changes
	this.graphChangeListener = function(sender, eventObject) 
	{
		var edit = (eventObject != null) ? eventObject.getProperty('edit') : null;
				
		if (edit == null || !edit.ignoreEdit)
		{
			this.setModified(true);
		}
	};
	
	this.graph.getModel().addListener(mxEvent.CHANGE, mxUtils.bind(this, function()
	{
		this.graphChangeListener.apply(this, arguments);
	}));

	// Sets persistent graph state defaults
	this.graph.resetViewOnRootChange = false;
	this.init();
};

/**
 * Counts open editor tabs (must be global for cross-window access)
 */
Editor.pageCounter = 0;

// Cross-domain window access is not allowed in FF, so if we
// were opened from another domain then this will fail.
(function()
{
	try
	{
		var op = window;

		while (op.opener != null && typeof op.opener.Editor !== 'undefined' &&
			!isNaN(op.opener.Editor.pageCounter) &&	
			// Workaround for possible infinite loop in FF https://drawio.atlassian.net/browse/DS-795
			op.opener != op)
		{
			op = op.opener;
		}
		
		// Increments the counter in the first opener in the chain
		if (op != null)
		{
			op.Editor.pageCounter++;
			Editor.pageCounter = op.Editor.pageCounter;
		}
	}
	catch (e)
	{
		// ignore
	}
})();

/**
 * Specifies if local storage should be used (eg. on the iPad which has no filesystem)
 */
Editor.useLocalStorage = typeof(Storage) != 'undefined' && mxClient.IS_IOS;

/**
 * Images below are for lightbox and embedding toolbars.
 */
Editor.helpImage = (mxClient.IS_SVG) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAXVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC5BxTwAAAAH3RSTlMAlUF8boNQIE0LBgOgkGlHNSwqFIx/dGVUOjApmV9ezNACSAAAAIVJREFUGNNtjNsOgzAMQ5NeoVcKDAZs+//PXLKI8YKlWvaRU7jXuFpb9qsbdK05XILUiE8JHQox1Pv3OgFUzf1AGqWqUg+QBwLF0YAeegBlCNgRWOpB5vUfTCmeoHQ/wNdy0jLH/cM+b+wLTw4n/7ACEmHVVy8h6qy8V7MNcGowWpsNbvUFcGUEdSi1s/oAAAAASUVORK5CYII=' :
	IMAGE_PATH + '/help.png';

/**
 * Sets the default font size.
 */
Editor.checkmarkImage = (mxClient.IS_SVG) ? 'data:image/gif;base64,R0lGODlhFQAVAMQfAGxsbHx8fIqKioaGhvb29nJycvr6+sDAwJqamltbW5OTk+np6YGBgeTk5Ly8vJiYmP39/fLy8qWlpa6ursjIyOLi4vj4+N/f3+3t7fT09LCwsHZ2dubm5r6+vmZmZv///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEY4NTZERTQ5QUFBMTFFMUE5MTVDOTM5MUZGMTE3M0QiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEY4NTZERTU5QUFBMTFFMUE5MTVDOTM5MUZGMTE3M0QiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4Rjg1NkRFMjlBQUExMUUxQTkxNUM5MzkxRkYxMTczRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4Rjg1NkRFMzlBQUExMUUxQTkxNUM5MzkxRkYxMTczRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAEAAB8ALAAAAAAVABUAAAVI4CeOZGmeaKqubKtylktSgCOLRyLd3+QJEJnh4VHcMoOfYQXQLBcBD4PA6ngGlIInEHEhPOANRkaIFhq8SuHCE1Hb8Lh8LgsBADs=' :
	IMAGE_PATH + '/checkmark.gif';

/**
 * Images below are for lightbox and embedding toolbars.
 */
Editor.maximizeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVBAMAAABbObilAAAAElBMVEUAAAAAAAAAAAAAAAAAAAAAAADgKxmiAAAABXRSTlMA758vX1Pw3BoAAABJSURBVAjXY8AJQkODGBhUQ0MhbAUGBiYY24CBgRnGFmZgMISwgwwDGRhEhVVBbAVmEQYGRwMmBjIAQi/CTIRd6G5AuA3dzYQBAHj0EFdHkvV4AAAAAElFTkSuQmCC';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.zoomOutImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVBAMAAABbObilAAAAElBMVEUAAAAAAAAsLCxxcXEhISFgYGChjTUxAAAAAXRSTlMAQObYZgAAAEdJREFUCNdjIAMwCQrB2YKCggJQJqMwA7MglK1owMBgqABVApITgLJZXFxgbIQ4Qj3CHIT5ggoIe5kgNkM1KSDYKBKqxPkDAPo5BAZBE54hAAAAAElFTkSuQmCC';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.zoomInImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVBAMAAABbObilAAAAElBMVEUAAAAAAAAsLCwhISFxcXFgYGBavKaoAAAAAXRSTlMAQObYZgAAAElJREFUCNdjIAMwCQrB2YKCggJQJqMIA4sglK3owMzgqABVwsDMwCgAZTMbG8PYCHGEeoQ5CPMFFRD2MkFshmpSQLBRJFSJ8wcAEqcEM2uhl2MAAAAASUVORK5CYII=';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.zoomFitImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVBAMAAABbObilAAAAD1BMVEUAAAAAAAAwMDBwcHBgYGC1xl09AAAAAXRSTlMAQObYZgAAAEFJREFUCNdjIAMwCQrB2YKCggJQJqMwA7MglK1owMBgqABVApITwMdGqEeYgzBfUAFhLxPEZqgmBQQbRUKFOH8AAK5OA3lA+FFOAAAAAElFTkSuQmCC';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.layersImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAaVBMVEUAAAAgICAICAgdHR0PDw8WFhYICAgLCwsXFxcvLy8ODg4uLi4iIiIqKiokJCQYGBgKCgonJycFBQUCAgIqKiocHBwcHBwODg4eHh4cHBwnJycJCQkUFBQqKiojIyMuLi4ZGRkgICAEBATOWYXAAAAAGnRSTlMAD7+fnz8/H7/ff18/77+vr5+fn39/b28fH2xSoKsAAACQSURBVBjTrYxJEsMgDARZZMAY73sgCcn/HxnhKtnk7j6oRq0psfuoyndZ/SuODkHPLzfVT6KeyPePnJ7KrnkRjWMXTn4SMnN8mXe2SSM3ts8L/ZUxxrbAULSYJJULE0Iw9pjpenoICcgcX61mGgTgtCv9Be99pzCoDhNQWQnchD1mup5++CYGcoQexajZbfwAj/0MD8ZOaUgAAAAASUVORK5CYII=';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.previousImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAAh0lEQVQ4je3UsQnCUBCA4U8hpa1NsoEjpHQJS0dxADdwEMuMIJkgA1hYChbGQgMi+JC8q4L/AB/vDu7x74cWWEZhJU44RmA1zujR5GIbXF9YNrjD/Q0bDRY4fEBZ4P4LlgTnCbAf84pUM8/9hY08tMUtEoQ1LpEgrNBFglChFXR6Q6GfwwR6AGKJMF74Vtt3AAAAAElFTkSuQmCC';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.nextImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAAi0lEQVQ4jeXUIQ7CUAwA0MeGxWI2yylwnALJUdBcgYvM7QYLmjOQIAkIPmJZghiIvypoUtX0tfnJL38X5ZfaEgUeUcManFBHgS0SLlhHggk3bCPBhCf2keCQR8wjwYTDp6YiZxJmOU1jGw7vGALescuBxsArNlOwd/CM1VSM/ut1qCIw+uOwiMJ+OF4CQzBCXm3hyAAAAABJRU5ErkJggg==';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.editImage = (mxClient.IS_SVG) ? 'data:image/gif;base64,R0lGODlhCwALAIABAFdXV////yH5BAEAAAEALAAAAAALAAsAAAIZjB8AiKuc4jvLOGqzrjX6zmkWyChXaUJBAQA7' : IMAGE_PATH + '/edit.gif';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.zoomOutLargeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2N2iNAAAALXRSTlMA+vTcKMM96GRBHwXxi0YaX1HLrKWhiHpWEOnOr52Vb2xKSDcT19PKv5l/Ngdk8+viAAABJklEQVQ4y4WT2XaDMAxEvWD2nSSUNEnTJN3r//+9Sj7ILAY6L0ijC4ONYVZRpo6cByrz2YKSUGorGTpz71lPVHvT+avoB5wIkU/mxk8veceSuNoLg44IzziXjvpih72wKQnm8yc2UoiP/LAd8jQfe2Xf4Pq+2EyYIvv9wbzHHCgwxDdlBtWZOdqDfTCVgqpygQpsZaojVAVc9UjQxnAJDIBhiQv84tq3gMQCAVTxVoSibXJf8tMuc7e1TB/DCmejBNg/w1Y3c+AM5vv4w7xM59/oXamrHaLVqPQ+OTCnmMZxgz0SdL5zji0/ld6j88qGa5KIiBB6WeJGKfUKwSMKLuXgvl1TW0tm5R9UQL/efSDYsnzxD8CinhBsTTdugJatKpJwf8v+ADb8QmvW7AeAAAAAAElFTkSuQmCC';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.zoomInLargeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2N2iNAAAALXRSTlMA+vTcKMM96GRBHwXxi0YaX1HLrKWhiHpWEOnOr52Vb2xKSDcT19PKv5l/Ngdk8+viAAABKElEQVQ4y4WT6WKCMBCENwkBwn2oFKvWqr3L+79es4EkQIDOH2d3Pxk2ABiJlB8JCXjqw4LikHVGLHTm3nM3UeVN5690GBBN0GwyV/3kkrUQR+WeKnREeKpzaXWd77CmJiXGfPIEI4V4yQ9TIW/ntlcMBe731Vts9w5TWG8F5j3mQI4hvrKpdGeYA7CX9qAcl650gVJartxRuhyHVghF8idQAIbFLvCLu28BsQEC6aKtCK6Pyb3JT7PmbmtNH8Ny56CotD/2qOs5cJbuffxgXmCib+xddVU5RNOhkvvkhTlFehzVWCOh3++MYElOhfdovaImnRYVmqDdsuhNp1QrBBE6uGC2+3ZNjGdg5B94oD+9uyVgWT79BwAxEBTWdOu3bWBVgsn/N/AHUD9IC01Oe40AAAAASUVORK5CYII=';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.actualSizeLargeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2N2iNAAAALXRSTlMA+vTcKMM96GRBHwXxi0YaX1HLrKWhiHpWEOnOr52Vb2xKSDcT19PKv5l/Ngdk8+viAAABIUlEQVQ4y4WT2XqDIBCFBxDc9yTWNEnTJN3r+79eGT4BEbXnaubMr8dBBaM450dCQp4LWFAascGIRd48eB4cNYE7f6XjgGiCFs5c+dml6CFN6j1V6IQIlHPpdV/usKcmJcV88gQTRXjLD9Mhb+fWq8YG9/uCmTCFjeeDeY85UGKIUGUuqzN42kv7oCouq9oHamlzVR1lVfpAIu1QVRiW+sAv7r4FpAYIZZVsRXB9TP5Dfpo1d1trCgzz1iiptH/sUbdz4CzN9+mLeXHn3+hdddd4RDegsrvzwZwSs2GLPRJidAqCLTlVwaMPqpYMWjTWBB2WRW86pVkhSKyDK2bdt2tmagZG4sBD/evdLQHLEvQfAOKRoLCmG1FAB6uKmby+gz+REDn7O5+EwQAAAABJRU5ErkJggg==';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.printLargeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAXVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9RKvvlAAAAHnRSTlMAydnl77qbMLT093H7K4Nd4Ktn082+lYt5bkklEgP44nQSAAAApUlEQVQ4y73P2Q6DIBRF0cOgbRHHzhP//5m9mBAQKjG1cT0Yc7ITAMu1LNQgUZiQ2DYoNQ0sCQb6qgHAfRx48opq3J9AZ6xuF7uOew8Ik1OsCZRS2UAC9V+D9a+QZYxNA45YFQftPtSkATOhw7dAc0vPBwKWiIOjP0JZ0yMuQJ27g36DipOUsqRAM0dR8KD1/ILHaHSE/w8DIx09E3g/BTce6rHUB5sAPKvfF+JdAAAAAElFTkSuQmCC';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.layersLargeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAmVBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+/v7///+bnZkkAAAAMnRSTlMABPr8ByiD88KsTi/rvJb272mjeUA1CuPe1M/KjVxYHxMP6KZ0S9nYzGRGGRaznpGIbzaGUf0AAAHESURBVDjLbZLZYoIwEEVDgLCjbKIgAlqXqt3m/z+uNwu1rcyDhjl3ktnYL7OY254C0VX3yWFZfzDrOClbbgKxi0YDHjwl4jbnRkXxJS/C1YP3DbBhD1n7Ex4uaAqdVDb3yJ/4J/3nJD2to/ngQz/DfUvzMp4JJ5sSCaF5oXmemgQDfDxzbi+Kq4sU+vNcuAmx94JtyOP2DD4Epz2asWSCz4Z/4fECxyNj9zC9xNLHcdPEO+awDKeSaUu0W4twZQiO2hYVisTR3RCtK/c1X6t4xMEpiGqXqVntEBLolkZZsKY4QtwH6jzq67dEHlJysB1aNOD3XT7n1UkasQN59L4yC2RELMDSeCRtz3yV22Ub3ozIUTknYx8JWqDdQxbUes98cR2kZtUSveF/bAhcedwEWmlxIkpZUy4XOCb6VBjjxHvbwo/1lBAHHi2JCr0NI570QhyHq/DhJoE2lLgyA4RVe6KmZ47O/3b86MCP0HWa73A8/C3SUc5Qc1ajt6fgpXJ+RGpMvDSchepZDOOQRcZVIKcK90x2D7etqtI+56+u6n3sPriO6nfphitR4+O2m3EbM7lh3me1FM1o+LMI887rN+s3/wZdTFlpNVJiOAAAAABJRU5ErkJggg==';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.closeLargeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAUVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////8IN+deAAAAGnRSTlMAuvAIg/dDM/QlOeuFhj0S5s4vKgzjxJRQNiLSey0AAADNSURBVDjLfZLbEoMgDEQjRRRs1XqX///QNmOHJSnjPkHOGR7IEmeoGtJZstnwjqbRfIsmgEdtPCqe9Ynz7ZSc07rE2QiSc+qv8TvjRXA2PDUm3dpe82iJhOEUfxJJo3aCv+jKmRmH4lcCjCjeh9GWOdL/GZZkXH3PYYDrHBnfc4D/RVZf5sjoC1was+Y6HQxwaUxFvq/a0Pv343VCTxfBSRiB+ab3M3eiQZXmMNBJ3Y8pGRZtYQ7DgHMXJEdPLTaN/qBjzJOBc3nmNcbsA16bMR0oLqf+AAAAAElFTkSuQmCC';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.editLargeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAgVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9d3yJTAAAAKnRSTlMA+hzi3nRQWyXzkm0h2j3u54gzEgSXjlYoTBgJxL2loGpAOS3Jt7Wxm35Ga7gRAAAA6UlEQVQ4y63Q2XaCMBSF4Q0JBasoQ5DJqbXjfv8HbCK2BZNwo/8FXHx7rcMC7lQu0iX8qU/qtvAWCpoqH8dYzS0SwaV5eK/UAf8X9pd2CWKzuF5Jrftp1owXwnIGLUaL3PYndOHf4kNNXWrXK/m7CHunk7K8LE6YtBpcknwG9GKxnroY+ylBXcx4xKyx/u/EuXi509cP9V7OO1oyHnzrdFTcqLG/4ibBA5pIMr/4xvKzuQDkVy9wW8SgBFD6HDvuzMvrZcC9QlkfMzI7w64m+b4PqBMNHB05lH21PVxJo2/fBXxV4hB38PcD+5AkI4FuETsAAAAASUVORK5CYII=';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.previousLargeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAPFBMVEUAAAD////////////////////////////////////////////////////////////////////////////YSWgTAAAAE3RSTlMA7fci493c0MW8uJ6CZks4MxQHEZL6ewAAAFZJREFUOMvdkskRgDAMA4lDwg2B7b9XOlge/KKvdsa25KFb5XlRvxXC/DNBEv8IFNjBgGdDgXtFgTyhwDXiQAUHCvwa4Uv6mR6UR+1led2mVonvl+tML45qCQNQLIx7AAAAAElFTkSuQmCC';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.nextLargeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAPFBMVEUAAAD////////////////////////////////////////////////////////////////////////////YSWgTAAAAE3RSTlMA7fci493c0MW8uJ6CZks4MxQHEZL6ewAAAFRJREFUOMvd0skRgCAQBVEFwQ0V7fxzNQP6wI05v6pZ/kyj1b7FNgik2gQzzLcAwiUAigHOTwDHK4A1CmB5BJANJG1hQ9qafYcqFlZP3IFc9eVGrR+iIgkDQRUXIAAAAABJRU5ErkJggg==';

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.ctrlKey = (mxClient.IS_MAC) ? 'Cmd' : 'Ctrl';

/**
 * Specifies if the diagram should be saved automatically if possible. Default
 * is true.
 */
Editor.popupsAllowed = true;

/**
 * Editor inherits from mxEventSource
 */
mxUtils.extend(Editor, mxEventSource);

/**
 * Stores initial state of mxClient.NO_FO.
 */
Editor.prototype.originalNoForeignObject = mxClient.NO_FO;

/**
 * Specifies the image URL to be used for the transparent background.
 */
Editor.prototype.transparentImage = (mxClient.IS_SVG) ? 'data:image/gif;base64,R0lGODlhMAAwAIAAAP///wAAACH5BAEAAAAALAAAAAAwADAAAAIxhI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8egpAAA7' :
	IMAGE_PATH + '/transparent.gif';

/**
 * Specifies if the canvas should be extended in all directions. Default is true.
 */
Editor.prototype.extendCanvas = true;

/**
 * Specifies if the app should run in chromeless mode. Default is false.
 * This default is only used if the contructor argument is null.
 */
Editor.prototype.chromeless = false;

/**
 * Specifies the order of OK/Cancel buttons in dialogs. Default is true.
 * Cancel first is used on Macs, Windows/Confluence uses cancel last.
 */
Editor.prototype.cancelFirst = true;

/**
 * Specifies if the editor is enabled. Default is true.
 */
Editor.prototype.enabled = true;

/**
 * Contains the name which was used for the last save. Default value is null.
 */
Editor.prototype.filename = null;

/**
 * Contains the current modified state of the diagram. This is false for
 * new diagrams and after the diagram was saved.
 */
Editor.prototype.modified = false;

/**
 * Specifies if the diagram should be saved automatically if possible. Default
 * is true.
 */
Editor.prototype.autosave = true;

/**
 * Specifies the top spacing for the initial page view. Default is 0.
 */
Editor.prototype.initialTopSpacing = 0;

/**
 * Specifies the app name. Default is document.title.
 */
Editor.prototype.appName = document.title;

/**
 * 
 */
Editor.prototype.editBlankUrl = window.location.protocol + '//' + window.location.host + '/';

/**
 * Initializes the environment.
 */
Editor.prototype.init = function() { };

/**
 * Sets the XML node for the current diagram.
 */
Editor.prototype.isChromelessView = function()
{
	return this.chromeless;
};

/**
 * Sets the XML node for the current diagram.
 */
Editor.prototype.setAutosave = function(value)
{
	this.autosave = value;
	this.fireEvent(new mxEventObject('autosaveChanged'));
};

/**
 * 
 */
Editor.prototype.getEditBlankUrl = function(params)
{
	return this.editBlankUrl + params;
}

/**
 * 
 */
Editor.prototype.editAsNew = function(xml, title)
{
	var p = (title != null) ? '?title=' + encodeURIComponent(title) : '';
	
	if (urlParams['ui'] != null)
	{
		p += ((p.length > 0) ? '&' : '?') + 'ui=' + urlParams['ui'];
	}
	
	if (this.editorWindow != null && !this.editorWindow.closed)
	{
		this.editorWindow.focus();
	}
	else
	{
		if (typeof window.postMessage !== 'undefined' && (document.documentMode == null || document.documentMode >= 10))
		{
			if (this.editorWindow == null)
			{
				mxEvent.addListener(window, 'message', mxUtils.bind(this, function(evt)
				{
					if (evt.data == 'ready' && evt.source == this.editorWindow)
					{
						this.editorWindow.postMessage(xml, '*');
					}
				}));
			}

			this.editorWindow = this.graph.openLink(this.getEditBlankUrl(p +
				((p.length > 0) ? '&' : '?') + 'client=1'));
		}
		else
		{
			this.editorWindow = this.graph.openLink(this.getEditBlankUrl(p) +
				'#R' + encodeURIComponent(xml));
		}
	}
};

/**
 * Sets the XML node for the current diagram.
 */
Editor.prototype.createGraph = function(themes, model)
{
	var graph = new Graph(null, model, null, null, themes);
	graph.transparentBackground = false;
	
	// Opens all links in a new window while editing
	if (!this.chromeless)
	{
		graph.isBlankLink = function(href)
		{
			return !this.isExternalProtocol(href);
		};
	}
	
	return graph;
};

/**
 * Sets the XML node for the current diagram.
 */
Editor.prototype.resetGraph = function()
{
	this.graph.gridEnabled = !this.isChromelessView() || urlParams['grid'] == '1';
	this.graph.graphHandler.guidesEnabled = true;
	this.graph.setTooltips(true);
	this.graph.setConnectable(true);
	this.graph.foldingEnabled = true;
	this.graph.scrollbars = this.graph.defaultScrollbars;
	this.graph.pageVisible = this.graph.defaultPageVisible;
	this.graph.pageBreaksVisible = this.graph.pageVisible; 
	this.graph.preferPageSize = this.graph.pageBreaksVisible;
	this.graph.background = this.graph.defaultGraphBackground;
	this.graph.pageScale = mxGraph.prototype.pageScale;
	this.graph.pageFormat = mxGraph.prototype.pageFormat;
	this.graph.currentScale = 1;
	this.graph.currentTranslate.x = 0;
	this.graph.currentTranslate.y = 0;
	this.updateGraphComponents();
	this.graph.view.setScale(1);
};

/**
 * Sets the XML node for the current diagram.
 */
Editor.prototype.readGraphState = function(node)
{
	this.graph.gridEnabled = node.getAttribute('grid') != '0' && (!this.isChromelessView() || urlParams['grid'] == '1');
	this.graph.gridSize = parseFloat(node.getAttribute('gridSize')) || mxGraph.prototype.gridSize;
	this.graph.graphHandler.guidesEnabled = node.getAttribute('guides') != '0';
	this.graph.setTooltips(node.getAttribute('tooltips') != '0');
	this.graph.setConnectable(node.getAttribute('connect') != '0');
	this.graph.connectionArrowsEnabled = node.getAttribute('arrows') != '0';
	this.graph.foldingEnabled = node.getAttribute('fold') != '0';

	if (this.isChromelessView() && this.graph.foldingEnabled)
	{
		this.graph.foldingEnabled = urlParams['nav'] == '1';
		this.graph.cellRenderer.forceControlClickHandler = this.graph.foldingEnabled;
	}
	
	var ps = node.getAttribute('pageScale');
	
	if (ps != null)
	{
		this.graph.pageScale = ps;
	}
	else
	{
		this.graph.pageScale = mxGraph.prototype.pageScale;
	}

	if (!this.graph.isLightboxView())
	{
		var pv = node.getAttribute('page');
	
		if (pv != null)
		{
			this.graph.pageVisible = (pv != '0');
		}
		else
		{
			this.graph.pageVisible = this.graph.defaultPageVisible;
		}
	}
	else
	{
		this.graph.pageVisible = false;
	}
	
	this.graph.pageBreaksVisible = this.graph.pageVisible; 
	this.graph.preferPageSize = this.graph.pageBreaksVisible;
	
	var pw = node.getAttribute('pageWidth');
	var ph = node.getAttribute('pageHeight');
	
	if (pw != null && ph != null)
	{
		this.graph.pageFormat = new mxRectangle(0, 0, parseFloat(pw), parseFloat(ph));
	}

	// Loads the persistent state settings
	var bg = node.getAttribute('background');
	
	if (bg != null && bg.length > 0)
	{
		this.graph.background = bg;
	}
	else
	{
		this.graph.background = this.graph.defaultGraphBackground;
	}
};

/**
 * Sets the XML node for the current diagram.
 */
Editor.prototype.setGraphXml = function(node)
{
	if (node != null)
	{
		var dec = new mxCodec(node.ownerDocument);
	
		if (node.nodeName == 'mxGraphModel')
		{
			this.graph.model.beginUpdate();
			
			try
			{
				this.graph.model.clear();
				this.graph.view.scale = 1;
				this.readGraphState(node);
				this.updateGraphComponents();
				dec.decode(node, this.graph.getModel());
			}
			finally
			{
				this.graph.model.endUpdate();
			}
	
			this.fireEvent(new mxEventObject('resetGraphView'));
		}
		else if (node.nodeName == 'root')
		{
			this.resetGraph();
			
			// Workaround for invalid XML output in Firefox 20 due to bug in mxUtils.getXml
			var wrapper = dec.document.createElement('mxGraphModel');
			wrapper.appendChild(node);
			
			dec.decode(wrapper, this.graph.getModel());
			this.updateGraphComponents();
			this.fireEvent(new mxEventObject('resetGraphView'));
		}
		else
		{
			throw { 
			    message: mxResources.get('cannotOpenFile'), 
			    node: node,
			    toString: function() { return this.message; }
			};
		}
	}
	else
	{
		this.resetGraph();
		this.graph.model.clear();
		this.fireEvent(new mxEventObject('resetGraphView'));
	}
};

/**
 * Returns the XML node that represents the current diagram.
 */
Editor.prototype.getGraphXml = function(ignoreSelection)
{
	ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
	var node = null;
	
	if (ignoreSelection)
	{
		var enc = new mxCodec(mxUtils.createXmlDocument());
		node = enc.encode(this.graph.getModel());
	}
	else
	{
		node = this.graph.encodeCells(mxUtils.sortCells(this.graph.model.getTopmostCells(
			this.graph.getSelectionCells())));
	}

	if (this.graph.view.translate.x != 0 || this.graph.view.translate.y != 0)
	{
		node.setAttribute('dx', Math.round(this.graph.view.translate.x * 100) / 100);
		node.setAttribute('dy', Math.round(this.graph.view.translate.y * 100) / 100);
	}
	
	node.setAttribute('grid', (this.graph.isGridEnabled()) ? '1' : '0');
	node.setAttribute('gridSize', this.graph.gridSize);
	node.setAttribute('guides', (this.graph.graphHandler.guidesEnabled) ? '1' : '0');
	node.setAttribute('tooltips', (this.graph.tooltipHandler.isEnabled()) ? '1' : '0');
	node.setAttribute('connect', (this.graph.connectionHandler.isEnabled()) ? '1' : '0');
	node.setAttribute('arrows', (this.graph.connectionArrowsEnabled) ? '1' : '0');
	node.setAttribute('fold', (this.graph.foldingEnabled) ? '1' : '0');
	node.setAttribute('page', (this.graph.pageVisible) ? '1' : '0');
	node.setAttribute('pageScale', this.graph.pageScale);
	node.setAttribute('pageWidth', this.graph.pageFormat.width);
	node.setAttribute('pageHeight', this.graph.pageFormat.height);

	if (this.graph.background != null)
	{
		node.setAttribute('background', this.graph.background);
	}
	
	return node;
};

/**
 * Keeps the graph container in sync with the persistent graph state
 */
Editor.prototype.updateGraphComponents = function()
{
	var graph = this.graph;
	
	if (graph.container != null)
	{
		graph.view.validateBackground();
		graph.container.style.overflow = (graph.scrollbars) ? 'auto' : 'hidden';
		
		this.fireEvent(new mxEventObject('updateGraphComponents'));
	}
};

/**
 * Sets the modified flag.
 */
Editor.prototype.setModified = function(value)
{
	this.modified = value;
};

/**
 * Sets the filename.
 */
Editor.prototype.setFilename = function(value)
{
	this.filename = value;
};

/**
 * Creates and returns a new undo manager.
 */
Editor.prototype.createUndoManager = function()
{
	var graph = this.graph;
	var undoMgr = new mxUndoManager();

	this.undoListener = function(sender, evt)
	{
		undoMgr.undoableEditHappened(evt.getProperty('edit'));
	};
	
    // Installs the command history
	var listener = mxUtils.bind(this, function(sender, evt)
	{
		this.undoListener.apply(this, arguments);
	});
	
	graph.getModel().addListener(mxEvent.UNDO, listener);
	graph.getView().addListener(mxEvent.UNDO, listener);

	// Keeps the selection in sync with the history
	var undoHandler = function(sender, evt)
	{
		var cand = graph.getSelectionCellsForChanges(evt.getProperty('edit').changes);
		var model = graph.getModel();
		var cells = [];
		
		for (var i = 0; i < cand.length; i++)
		{
			if ((model.isVertex(cand[i]) || model.isEdge(cand[i])) && graph.view.getState(cand[i]) != null)
			{
				cells.push(cand[i]);
			}
		}
		
		graph.setSelectionCells(cells);
	};
	
	undoMgr.addListener(mxEvent.UNDO, undoHandler);
	undoMgr.addListener(mxEvent.REDO, undoHandler);

	return undoMgr;
};

/**
 * Adds basic stencil set (no namespace).
 */
Editor.prototype.initStencilRegistry = function() { };

/**
 * Creates and returns a new undo manager.
 */
Editor.prototype.destroy = function()
{
	if (this.graph != null)
	{
		this.graph.destroy();
		this.graph = null;
	}
};

/**
 * Class for asynchronously opening a new window and loading a file at the same
 * time. This acts as a bridge between the open dialog and the new editor.
 */
OpenFile = function(done)
{
	this.producer = null;
	this.consumer = null;
	this.done = done;
	this.args = null;
};

/**
 * Registers the editor from the new window.
 */
OpenFile.prototype.setConsumer = function(value)
{
	this.consumer = value;
	this.execute();
};

/**
 * Sets the data from the loaded file.
 */
OpenFile.prototype.setData = function()
{
	this.args = arguments;
	this.execute();
};

/**
 * Displays an error message.
 */
OpenFile.prototype.error = function(msg)
{
	this.cancel(true);
	mxUtils.alert(msg);
};

/**
 * Consumes the data.
 */
OpenFile.prototype.execute = function()
{
	if (this.consumer != null && this.args != null)
	{
		this.cancel(false);
		this.consumer.apply(this, this.args);
	}
};

/**
 * Cancels the operation.
 */
OpenFile.prototype.cancel = function(cancel)
{
	if (this.done != null)
	{
		this.done((cancel != null) ? cancel : true);
	}
};

/**
 * Basic dialogs that are available in the viewer (print dialog).
 */
function Dialog(editorUi, elt, w, h, modal, closable, onClose, noScroll)
{
	var dx = 0;
	
	if (mxClient.IS_VML && (document.documentMode == null || document.documentMode < 8))
	{
		// Adds padding as a workaround for box model in older IE versions
		// This needs to match the total padding of geDialog in CSS
		dx = 80;
	}
	
	w += dx;
	h += dx;
	
	var w0 = w;
	var h0 = h;
	
	// clientHeight check is attempted fix for print dialog offset in viewer lightbox
	var dh = (document.documentElement.clientHeight > 0) ? document.documentElement.clientHeight :
		Math.max(document.body.clientHeight || 0, document.documentElement.clientHeight);
	var left = Math.max(1, Math.round((document.body.clientWidth - w - 64) / 2));
	var top = Math.max(1, Math.round((dh - h - editorUi.footerHeight) / 3));
	
	// Keeps window size inside available space
	if (!mxClient.IS_QUIRKS)
	{
		elt.style.maxHeight = '100%';
	}
	
	w = Math.min(w, document.body.scrollWidth - 64);
	h = Math.min(h, dh - 64);
	
	// Increments zIndex to put subdialogs and background over existing dialogs and background
	if (editorUi.dialogs.length > 0)
	{
		this.zIndex += editorUi.dialogs.length * 2;
	}

	if (this.bg == null)
	{
		this.bg = editorUi.createDiv('background');
		this.bg.style.position = 'absolute';
		this.bg.style.background = Dialog.backdropColor;
		this.bg.style.height = dh + 'px';
		this.bg.style.right = '0px';
		this.bg.style.zIndex = this.zIndex - 2;
		
		mxUtils.setOpacity(this.bg, this.bgOpacity);
		
		if (mxClient.IS_QUIRKS)
		{
			new mxDivResizer(this.bg);
		}
	}
	
	var origin = mxUtils.getDocumentScrollOrigin(document);
	this.bg.style.left = origin.x + 'px';
	this.bg.style.top = origin.y + 'px';
	left += origin.x;
	top += origin.y;

	if (modal)
	{
		document.body.appendChild(this.bg);
	}
	
	var div = editorUi.createDiv('geDialog');
	var pos = this.getPosition(left, top, w, h);
	left = pos.x;
	top = pos.y;
	
	div.style.width = w + 'px';
	div.style.height = h + 'px';
	div.style.left = left + 'px';
	div.style.top = top + 'px';
	div.style.zIndex = this.zIndex;
	
	div.appendChild(elt);
	document.body.appendChild(div);
	
	// Adds vertical scrollbars if needed
	if (!noScroll && elt.clientHeight > div.clientHeight - 64)
	{
		elt.style.overflowY = 'auto';
	}
	
	if (closable)
	{
		var img = document.createElement('img');

		img.setAttribute('src', Dialog.prototype.closeImage);
		img.setAttribute('title', mxResources.get('close'));
		img.className = 'geDialogClose';
		img.style.top = (top + 14) + 'px';
		img.style.left = (left + w + 38 - dx) + 'px';
		img.style.zIndex = this.zIndex;
		
		mxEvent.addListener(img, 'click', mxUtils.bind(this, function()
		{
			editorUi.hideDialog(true);
		}));
		
		document.body.appendChild(img);
		this.dialogImg = img;
		
		mxEvent.addGestureListeners(this.bg, null, null, mxUtils.bind(this, function(evt)
		{
			editorUi.hideDialog(true);
		}));
	}
	
	this.resizeListener = mxUtils.bind(this, function()
	{
		dh = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
		this.bg.style.height = dh + 'px';
		
		left = Math.max(1, Math.round((document.body.clientWidth - w - 64) / 2));
		top = Math.max(1, Math.round((dh - h - editorUi.footerHeight) / 3));
		w = Math.min(w0, document.body.scrollWidth - 64);
		h = Math.min(h0, dh - 64);
		
		var pos = this.getPosition(left, top, w, h);
		left = pos.x;
		top = pos.y;
		
		div.style.left = left + 'px';
		div.style.top = top + 'px';
		div.style.width = w + 'px';
		div.style.height = h + 'px';
		
		// Adds vertical scrollbars if needed
		if (!noScroll && elt.clientHeight > div.clientHeight - 64)
		{
			elt.style.overflowY = 'auto';
		}
		
		if (this.dialogImg != null)
		{
			this.dialogImg.style.top = (top + 14) + 'px';
			this.dialogImg.style.left = (left + w + 38 - dx) + 'px';
		}
	});
	
	mxEvent.addListener(window, 'resize', this.resizeListener);

	this.onDialogClose = onClose;
	this.container = div;
	
	editorUi.editor.fireEvent(new mxEventObject('showDialog'));
};

/**
 * 
 */
Dialog.backdropColor = 'white';

/**
 * 
 */
Dialog.prototype.zIndex = mxPopupMenu.prototype.zIndex - 1;

/**
 * 
 */
Dialog.prototype.noColorImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/nocolor.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkEzRDlBMUUwODYxMTExRTFCMzA4RDdDMjJBMEMxRDM3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkEzRDlBMUUxODYxMTExRTFCMzA4RDdDMjJBMEMxRDM3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTNEOUExREU4NjExMTFFMUIzMDhEN0MyMkEwQzFEMzciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTNEOUExREY4NjExMTFFMUIzMDhEN0MyMkEwQzFEMzciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5xh3fmAAAABlBMVEX////MzMw46qqDAAAAGElEQVR42mJggAJGKGAYIIGBth8KAAIMAEUQAIElnLuQAAAAAElFTkSuQmCC';

/**
 * 
 */
Dialog.prototype.closeImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/close.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJAQMAAADaX5RTAAAABlBMVEV7mr3///+wksspAAAAAnRSTlP/AOW3MEoAAAAdSURBVAgdY9jXwCDDwNDRwHCwgeExmASygSL7GgB12QiqNHZZIwAAAABJRU5ErkJggg==';

/**
 * 
 */
Dialog.prototype.clearImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/clear.gif' : 'data:image/gif;base64,R0lGODlhDQAKAIABAMDAwP///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUIzOEM1NzI4NjEyMTFFMUEzMkNDMUE3NjZERDE2QjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUIzOEM1NzM4NjEyMTFFMUEzMkNDMUE3NjZERDE2QjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5QjM4QzU3MDg2MTIxMUUxQTMyQ0MxQTc2NkREMTZCMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QjM4QzU3MTg2MTIxMUUxQTMyQ0MxQTc2NkREMTZCMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAEAAAEALAAAAAANAAoAAAIXTGCJebD9jEOTqRlttXdrB32PJ2ncyRQAOw==';

/**
 * 
 */
Dialog.prototype.lockedImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/locked.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzdDMDZCODExNzIxMTFFNUI0RTk5NTg4OTcyMUUyODEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzdDMDZCODIxNzIxMTFFNUI0RTk5NTg4OTcyMUUyODEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozN0MwNkI3RjE3MjExMUU1QjRFOTk1ODg5NzIxRTI4MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozN0MwNkI4MDE3MjExMUU1QjRFOTk1ODg5NzIxRTI4MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvqMCFYAAAAVUExURZmZmb+/v7KysqysrMzMzLGxsf///4g8N1cAAAAHdFJOU////////wAaSwNGAAAAPElEQVR42lTMQQ4AIQgEwUa0//9kTQirOweYOgDqAMbZUr10AGlAwx4/BJ2QJ4U0L5brYjovvpv32xZgAHZaATFtMbu4AAAAAElFTkSuQmCC';

/**
 * 
 */
Dialog.prototype.unlockedImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/unlocked.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzdDMDZCN0QxNzIxMTFFNUI0RTk5NTg4OTcyMUUyODEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzdDMDZCN0UxNzIxMTFFNUI0RTk5NTg4OTcyMUUyODEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozN0MwNkI3QjE3MjExMUU1QjRFOTk1ODg5NzIxRTI4MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozN0MwNkI3QzE3MjExMUU1QjRFOTk1ODg5NzIxRTI4MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkKMpVwAAAAYUExURZmZmbKysr+/v6ysrOXl5czMzLGxsf///zHN5lwAAAAIdFJOU/////////8A3oO9WQAAADxJREFUeNpUzFESACAEBNBVsfe/cZJU+8Mzs8CIABCidtfGOndnYsT40HDSiCcbPdoJo10o9aI677cpwACRoAF3dFNlswAAAABJRU5ErkJggg==';

/**
 * Removes the dialog from the DOM.
 */
Dialog.prototype.bgOpacity = 80;

/**
 * Removes the dialog from the DOM.
 */
Dialog.prototype.getPosition = function(left, top)
{
	return new mxPoint(left, top);
};

/**
 * Removes the dialog from the DOM.
 */
Dialog.prototype.close = function(cancel)
{
	if (this.onDialogClose != null)
	{
		this.onDialogClose(cancel);
		this.onDialogClose = null;
	}
	
	if (this.dialogImg != null)
	{
		this.dialogImg.parentNode.removeChild(this.dialogImg);
		this.dialogImg = null;
	}
	
	if (this.bg != null && this.bg.parentNode != null)
	{
		this.bg.parentNode.removeChild(this.bg);
	}
	
	mxEvent.removeListener(window, 'resize', this.resizeListener);
	this.container.parentNode.removeChild(this.container);
};

/**
 * Constructs a new print dialog.
 */
var PrintDialog = function(editorUi, title)
{
	this.create(editorUi, title);
};

/**
 * Constructs a new print dialog.
 */
PrintDialog.prototype.create = function(editorUi)
{
	var graph = editorUi.editor.graph;
	var row, td;
	
	var table = document.createElement('table');
	table.style.width = '100%';
	table.style.height = '100%';
	var tbody = document.createElement('tbody');
	
	row = document.createElement('tr');
	
	var onePageCheckBox = document.createElement('input');
	onePageCheckBox.setAttribute('type', 'checkbox');
	td = document.createElement('td');
	td.setAttribute('colspan', '2');
	td.style.fontSize = '10pt';
	td.appendChild(onePageCheckBox);
	
	var span = document.createElement('span');
	mxUtils.write(span, ' ' + mxResources.get('fitPage'));
	td.appendChild(span);
	
	mxEvent.addListener(span, 'click', function(evt)
	{
		onePageCheckBox.checked = !onePageCheckBox.checked;
		pageCountCheckBox.checked = !onePageCheckBox.checked;
		mxEvent.consume(evt);
	});
	
	mxEvent.addListener(onePageCheckBox, 'change', function()
	{
		pageCountCheckBox.checked = !onePageCheckBox.checked;
	});
	
	row.appendChild(td);
	tbody.appendChild(row);

	row = row.cloneNode(false);
	
	var pageCountCheckBox = document.createElement('input');
	pageCountCheckBox.setAttribute('type', 'checkbox');
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.appendChild(pageCountCheckBox);
	
	var span = document.createElement('span');
	mxUtils.write(span, ' ' + mxResources.get('posterPrint') + ':');
	td.appendChild(span);
	
	mxEvent.addListener(span, 'click', function(evt)
	{
		pageCountCheckBox.checked = !pageCountCheckBox.checked;
		onePageCheckBox.checked = !pageCountCheckBox.checked;
		mxEvent.consume(evt);
	});
	
	row.appendChild(td);
	
	var pageCountInput = document.createElement('input');
	pageCountInput.setAttribute('value', '1');
	pageCountInput.setAttribute('type', 'number');
	pageCountInput.setAttribute('min', '1');
	pageCountInput.setAttribute('size', '4');
	pageCountInput.setAttribute('disabled', 'disabled');
	pageCountInput.style.width = '50px';

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.appendChild(pageCountInput);
	mxUtils.write(td, ' ' + mxResources.get('pages') + ' (max)');
	row.appendChild(td);
	tbody.appendChild(row);

	mxEvent.addListener(pageCountCheckBox, 'change', function()
	{
		if (pageCountCheckBox.checked)
		{
			pageCountInput.removeAttribute('disabled');
		}
		else
		{
			pageCountInput.setAttribute('disabled', 'disabled');
		}

		onePageCheckBox.checked = !pageCountCheckBox.checked;
	});

	row = row.cloneNode(false);
	
	td = document.createElement('td');
	mxUtils.write(td, mxResources.get('pageScale') + ':');
	row.appendChild(td);
	
	td = document.createElement('td');
	var pageScaleInput = document.createElement('input');
	pageScaleInput.setAttribute('value', '100 %');
	pageScaleInput.setAttribute('size', '5');
	pageScaleInput.style.width = '50px';
	
	td.appendChild(pageScaleInput);
	row.appendChild(td);
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.paddingTop = '20px';
	td.setAttribute('align', 'right');
	
	// Overall scale for print-out to account for print borders in dialogs etc
	function preview(print)
	{
		var autoOrigin = onePageCheckBox.checked || pageCountCheckBox.checked;
		var printScale = parseInt(pageScaleInput.value) / 100;
		
		if (isNaN(printScale))
		{
			printScale = 1;
			pageScaleInput.value = '100%';
		}
		
		// Workaround to match available paper size in actual print output
		printScale *= 0.75;

		var pf = graph.pageFormat || mxConstants.PAGE_FORMAT_A4_PORTRAIT;
		var scale = 1 / graph.pageScale;
		
		if (autoOrigin)
		{
    		var pageCount = (onePageCheckBox.checked) ? 1 : parseInt(pageCountInput.value);
			
			if (!isNaN(pageCount))
			{
				scale = mxUtils.getScaleForPageCount(pageCount, graph, pf);
			}
		}

		// Negative coordinates are cropped or shifted if page visible
		var gb = graph.getGraphBounds();
		var border = 0;
		var x0 = 0;
		var y0 = 0;

		// Applies print scale
		pf = mxRectangle.fromRectangle(pf);
		pf.width = Math.ceil(pf.width * printScale);
		pf.height = Math.ceil(pf.height * printScale);
		scale *= printScale;
		
		// Starts at first visible page
		if (!autoOrigin && graph.pageVisible)
		{
			var layout = graph.getPageLayout();
			x0 -= layout.x * pf.width;
			y0 -= layout.y * pf.height;
		}
		else
		{
			autoOrigin = true;
		}
		
		var preview = PrintDialog.createPrintPreview(graph, scale, pf, border, x0, y0, autoOrigin);
		preview.open();
	
		if (print)
		{
			PrintDialog.printPreview(preview);
		}
	};
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}

	if (PrintDialog.previewEnabled)
	{
		var previewBtn = mxUtils.button(mxResources.get('preview'), function()
		{
			editorUi.hideDialog();
			preview(false);
		});
		previewBtn.className = 'geBtn';
		td.appendChild(previewBtn);
	}
	
	var printBtn = mxUtils.button(mxResources.get((!PrintDialog.previewEnabled) ? 'ok' : 'print'), function()
	{
		editorUi.hideDialog();
		preview(true);
	});
	printBtn.className = 'geBtn gePrimaryBtn';
	td.appendChild(printBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}

	row.appendChild(td);
	tbody.appendChild(row);
	
	table.appendChild(tbody);
	this.container = table;
};

/**
 * Constructs a new print dialog.
 */
PrintDialog.printPreview = function(preview)
{
	if (preview.wnd != null)
	{
		var printFn = function()
		{
			preview.wnd.focus();
			preview.wnd.print();
			preview.wnd.close();
		};
		
		// Workaround for Google Chrome which needs a bit of a
		// delay in order to render the SVG contents
		// Needs testing in production
		if (mxClient.IS_GC)
		{
			window.setTimeout(printFn, 500);
		}
		else
		{
			printFn();
		}
	}
};

/**
 * Constructs a new print dialog.
 */
PrintDialog.createPrintPreview = function(graph, scale, pf, border, x0, y0, autoOrigin)
{
	var preview = new mxPrintPreview(graph, scale, pf, border, x0, y0);
	preview.title = mxResources.get('preview');
	preview.printBackgroundImage = true;
	preview.autoOrigin = autoOrigin;
	var bg = graph.background;
	
	if (bg == null || bg == '' || bg == mxConstants.NONE)
	{
		bg = '#ffffff';
	}
	
	preview.backgroundColor = bg;
	
	var writeHead = preview.writeHead;
	
	// Adds a border in the preview
	preview.writeHead = function(doc)
	{
		writeHead.apply(this, arguments);
		
		doc.writeln('<style type="text/css">');
		doc.writeln('@media screen {');
		doc.writeln('  body > div { padding:30px;box-sizing:content-box; }');
		doc.writeln('}');
		doc.writeln('</style>');
	};
	
	return preview;
};

/**
 * Specifies if the preview button should be enabled. Default is true.
 */
PrintDialog.previewEnabled = true;

/**
 * Constructs a new page setup dialog.
 */
var PageSetupDialog = function(editorUi)
{
	var graph = editorUi.editor.graph;
	var row, td;

	var table = document.createElement('table');
	table.style.width = '100%';
	table.style.height = '100%';
	var tbody = document.createElement('tbody');
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.verticalAlign = 'top';
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('paperSize') + ':');
	
	row.appendChild(td);
	
	td = document.createElement('td');
	td.style.verticalAlign = 'top';
	td.style.fontSize = '10pt';
	
	var accessor = PageSetupDialog.addPageFormatPanel(td, 'pagesetupdialog', graph.pageFormat);

	row.appendChild(td);
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	mxUtils.write(td, mxResources.get('background') + ':');
	
	row.appendChild(td);
	
	td = document.createElement('td');
	td.style.whiteSpace = 'nowrap';
	
	var backgroundInput = document.createElement('input');
	backgroundInput.setAttribute('type', 'text');
	var backgroundButton = document.createElement('button');
	
	backgroundButton.style.width = '18px';
	backgroundButton.style.height = '18px';
	backgroundButton.style.marginRight = '20px';
	backgroundButton.style.backgroundPosition = 'center center';
	backgroundButton.style.backgroundRepeat = 'no-repeat';
	
	var newBackgroundColor = graph.background;
	
	function updateBackgroundColor()
	{
		if (newBackgroundColor == null || newBackgroundColor == mxConstants.NONE)
		{
			backgroundButton.style.backgroundColor = '';
			backgroundButton.style.backgroundImage = 'url(\'' + Dialog.prototype.noColorImage + '\')';
		}
		else
		{
			backgroundButton.style.backgroundColor = newBackgroundColor;
			backgroundButton.style.backgroundImage = '';
		}
	};
	
	updateBackgroundColor();

	mxEvent.addListener(backgroundButton, 'click', function(evt)
	{
		editorUi.pickColor(newBackgroundColor || 'none', function(color)
		{
			newBackgroundColor = color;
			updateBackgroundColor();
		});
		mxEvent.consume(evt);
	});
	
	td.appendChild(backgroundButton);
	
	mxUtils.write(td, mxResources.get('gridSize') + ':');
	
	var gridSizeInput = document.createElement('input');
	gridSizeInput.setAttribute('type', 'number');
	gridSizeInput.setAttribute('min', '0');
	gridSizeInput.style.width = '40px';
	gridSizeInput.style.marginLeft = '6px';
	
	gridSizeInput.value = graph.getGridSize();
	td.appendChild(gridSizeInput);
	
	mxEvent.addListener(gridSizeInput, 'change', function()
	{
		var value = parseInt(gridSizeInput.value);
		gridSizeInput.value = Math.max(1, (isNaN(value)) ? graph.getGridSize() : value);
	});
	
	row.appendChild(td);
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	td = document.createElement('td');
	
	mxUtils.write(td, mxResources.get('image') + ':');
	
	row.appendChild(td);
	td = document.createElement('td');
	
	var changeImageLink = document.createElement('a');
	changeImageLink.style.textDecoration = 'underline';
	changeImageLink.style.cursor = 'pointer';
	changeImageLink.style.color = '#a0a0a0';
	
	var newBackgroundImage = graph.backgroundImage;
	
	function updateBackgroundImage()
	{
		if (newBackgroundImage == null)
		{
			changeImageLink.removeAttribute('title');
			changeImageLink.style.fontSize = '';
			changeImageLink.innerHTML = mxResources.get('change') + '...';
		}
		else
		{
			changeImageLink.setAttribute('title', newBackgroundImage.src);
			changeImageLink.style.fontSize = '11px';
			changeImageLink.innerHTML = newBackgroundImage.src.substring(0, 42) + '...';
		}
	};
	
	mxEvent.addListener(changeImageLink, 'click', function(evt)
	{
		editorUi.showBackgroundImageDialog(function(image)
		{
			newBackgroundImage = image;
			updateBackgroundImage();
		});
		
		mxEvent.consume(evt);
	});
	
	updateBackgroundImage();

	td.appendChild(changeImageLink);
	
	row.appendChild(td);
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.paddingTop = '16px';
	td.setAttribute('align', 'right');

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}
	
	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		editorUi.hideDialog();
		
		if (graph.gridSize !== gridSizeInput.value)
		{
			graph.setGridSize(parseInt(gridSizeInput.value));
		}

		var change = new ChangePageSetup(editorUi, newBackgroundColor,
			newBackgroundImage, accessor.get());
		change.ignoreColor = graph.background == newBackgroundColor;
		
		var oldSrc = (graph.backgroundImage != null) ? graph.backgroundImage.src : null;
		var newSrc = (newBackgroundImage != null) ? newBackgroundImage.src : null;
		
		change.ignoreImage = oldSrc === newSrc;

		if (graph.pageFormat.width != change.previousFormat.width ||
			graph.pageFormat.height != change.previousFormat.height ||
			!change.ignoreColor || !change.ignoreImage)
		{
			graph.model.execute(change);
		}
	});
	applyBtn.className = 'geBtn gePrimaryBtn';
	td.appendChild(applyBtn);

	if (!editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}
	
	row.appendChild(td);
	tbody.appendChild(row);
	
	table.appendChild(tbody);
	this.container = table;
};

/**
 * 
 */
PageSetupDialog.addPageFormatPanel = function(div, namePostfix, pageFormat, pageFormatListener)
{
	var formatName = 'format-' + namePostfix;
	
	var portraitCheckBox = document.createElement('input');
	portraitCheckBox.setAttribute('name', formatName);
	portraitCheckBox.setAttribute('type', 'radio');
	portraitCheckBox.setAttribute('value', 'portrait');
	
	var landscapeCheckBox = document.createElement('input');
	landscapeCheckBox.setAttribute('name', formatName);
	landscapeCheckBox.setAttribute('type', 'radio');
	landscapeCheckBox.setAttribute('value', 'landscape');
	
	var paperSizeSelect = document.createElement('select');
	paperSizeSelect.style.marginBottom = '8px';
	paperSizeSelect.style.width = '202px';

	var formatDiv = document.createElement('div');
	formatDiv.style.marginLeft = '4px';
	formatDiv.style.width = '210px';
	formatDiv.style.height = '24px';

	portraitCheckBox.style.marginRight = '6px';
	formatDiv.appendChild(portraitCheckBox);
	
	var portraitSpan = document.createElement('span');
	portraitSpan.style.maxWidth = '100px';
	mxUtils.write(portraitSpan, mxResources.get('portrait'));
	formatDiv.appendChild(portraitSpan);

	landscapeCheckBox.style.marginLeft = '10px';
	landscapeCheckBox.style.marginRight = '6px';
	formatDiv.appendChild(landscapeCheckBox);
	
	var landscapeSpan = document.createElement('span');
	landscapeSpan.style.width = '100px';
	mxUtils.write(landscapeSpan, mxResources.get('landscape'));
	formatDiv.appendChild(landscapeSpan)

	var customDiv = document.createElement('div');
	customDiv.style.marginLeft = '4px';
	customDiv.style.width = '210px';
	customDiv.style.height = '24px';
	
	var widthInput = document.createElement('input');
	widthInput.setAttribute('size', '7');
	widthInput.style.textAlign = 'right';
	customDiv.appendChild(widthInput);
	mxUtils.write(customDiv, ' in x ');
	
	var heightInput = document.createElement('input');
	heightInput.setAttribute('size', '7');
	heightInput.style.textAlign = 'right';
	customDiv.appendChild(heightInput);
	mxUtils.write(customDiv, ' in');

	formatDiv.style.display = 'none';
	customDiv.style.display = 'none';
	
	var pf = new Object();
	var formats = PageSetupDialog.getFormats();
	
	for (var i = 0; i < formats.length; i++)
	{
		var f = formats[i];
		pf[f.key] = f;

		var paperSizeOption = document.createElement('option');
		paperSizeOption.setAttribute('value', f.key);
		mxUtils.write(paperSizeOption, f.title);
		paperSizeSelect.appendChild(paperSizeOption);
	}
	
	var customSize = false;
	
	function listener(sender, evt, force)
	{
		if (force || (widthInput != document.activeElement && heightInput != document.activeElement))
		{
			var detected = false;
			
			for (var i = 0; i < formats.length; i++)
			{
				var f = formats[i];
	
				// Special case where custom was chosen
				if (customSize)
				{
					if (f.key == 'custom')
					{
						paperSizeSelect.value = f.key;
						customSize = false;
					}
				}
				else if (f.format != null)
				{
					// Fixes wrong values for previous A4 and A5 page sizes
					if (f.key == 'a4')
					{
						if (pageFormat.width == 826)
						{
							pageFormat = mxRectangle.fromRectangle(pageFormat);
							pageFormat.width = 827;
						}
						else if (pageFormat.height == 826)
						{
							pageFormat = mxRectangle.fromRectangle(pageFormat);
							pageFormat.height = 827;
						}
					}
					else if (f.key == 'a5')
					{
						if (pageFormat.width == 584)
						{
							pageFormat = mxRectangle.fromRectangle(pageFormat);
							pageFormat.width = 583;
						}
						else if (pageFormat.height == 584)
						{
							pageFormat = mxRectangle.fromRectangle(pageFormat);
							pageFormat.height = 583;
						}
					}
					
					if (pageFormat.width == f.format.width && pageFormat.height == f.format.height)
					{
						paperSizeSelect.value = f.key;
						portraitCheckBox.setAttribute('checked', 'checked');
						portraitCheckBox.defaultChecked = true;
						portraitCheckBox.checked = true;
						landscapeCheckBox.removeAttribute('checked');
						landscapeCheckBox.defaultChecked = false;
						landscapeCheckBox.checked = false;
						detected = true;
					}
					else if (pageFormat.width == f.format.height && pageFormat.height == f.format.width)
					{
						paperSizeSelect.value = f.key;
						portraitCheckBox.removeAttribute('checked');
						portraitCheckBox.defaultChecked = false;
						portraitCheckBox.checked = false;
						landscapeCheckBox.setAttribute('checked', 'checked');
						landscapeCheckBox.defaultChecked = true;
						landscapeCheckBox.checked = true;
						detected = true;
					}
				}
			}
			
			// Selects custom format which is last in list
			if (!detected)
			{
				widthInput.value = pageFormat.width / 100;
				heightInput.value = pageFormat.height / 100;
				portraitCheckBox.setAttribute('checked', 'checked');
				paperSizeSelect.value = 'custom';
				formatDiv.style.display = 'none';
				customDiv.style.display = '';
			}
			else
			{
				formatDiv.style.display = '';
				customDiv.style.display = 'none';
			}
		}
	};
	
	listener();

	div.appendChild(paperSizeSelect);
	mxUtils.br(div);

	div.appendChild(formatDiv);
	div.appendChild(customDiv);
	
	var currentPageFormat = pageFormat;
	
	var update = function(evt, selectChanged)
	{
		var f = pf[paperSizeSelect.value];
		
		if (f.format != null)
		{
			widthInput.value = f.format.width / 100;
			heightInput.value = f.format.height / 100;
			customDiv.style.display = 'none';
			formatDiv.style.display = '';
		}
		else
		{
			formatDiv.style.display = 'none';
			customDiv.style.display = '';
		}
		
		if (isNaN(parseFloat(widthInput.value)))
		{
			widthInput.value = pageFormat.width / 100;
		}

		if (isNaN(parseFloat(heightInput.value)))
		{
			heightInput.value = pageFormat.height / 100;
		}
		
		var newPageFormat = new mxRectangle(0, 0,
			Math.floor(parseFloat(widthInput.value) * 100),
			Math.floor(parseFloat(heightInput.value) * 100));
		
		if (paperSizeSelect.value != 'custom' && landscapeCheckBox.checked)
		{
			newPageFormat = new mxRectangle(0, 0, newPageFormat.height, newPageFormat.width);
		}
		
		// Initial select of custom should not update page format to avoid update of combo
		if ((!selectChanged || !customSize) && (newPageFormat.width != currentPageFormat.width ||
			newPageFormat.height != currentPageFormat.height))
		{
			currentPageFormat = newPageFormat;
			
			// Updates page format and reloads format panel
			if (pageFormatListener != null)
			{
				pageFormatListener(currentPageFormat);
			}
		}
	};

	mxEvent.addListener(portraitSpan, 'click', function(evt)
	{
		portraitCheckBox.checked = true;
		update(evt);
		mxEvent.consume(evt);
	});
	
	mxEvent.addListener(landscapeSpan, 'click', function(evt)
	{
		landscapeCheckBox.checked = true;
		update(evt);
		mxEvent.consume(evt);
	});
	
	mxEvent.addListener(widthInput, 'blur', update);
	mxEvent.addListener(widthInput, 'click', update);
	mxEvent.addListener(heightInput, 'blur', update);
	mxEvent.addListener(heightInput, 'click', update);
	mxEvent.addListener(landscapeCheckBox, 'change', update);
	mxEvent.addListener(portraitCheckBox, 'change', update);
	mxEvent.addListener(paperSizeSelect, 'change', function(evt)
	{
		// Handles special case where custom was chosen
		customSize = paperSizeSelect.value == 'custom';
		update(evt, true);
	});
	
	update();
	
	return {set: function(value)
	{
		pageFormat = value;
		listener(null, null, true);
	},get: function()
	{
		return currentPageFormat;
	}, widthInput: widthInput,
	heightInput: heightInput};
};

/**
 * 
 */
PageSetupDialog.getFormats = function()
{
	return [{key: 'letter', title: 'US-Letter (8,5" x 11")', format: mxConstants.PAGE_FORMAT_LETTER_PORTRAIT},
	        {key: 'legal', title: 'US-Legal (8,5" x 14")', format: new mxRectangle(0, 0, 850, 1400)},
	        {key: 'tabloid', title: 'US-Tabloid (279 mm x 432 mm)', format: new mxRectangle(0, 0, 1100, 1700)},
	        {key: 'a0', title: 'A0 (841 mm x 1189 mm)', format: new mxRectangle(0, 0, 3300, 4681)},
	        {key: 'a1', title: 'A1 (594 mm x 841 mm)', format: new mxRectangle(0, 0, 2339, 3300)},
	        {key: 'a2', title: 'A2 (420 mm x 594 mm)', format: new mxRectangle(0, 0, 1654, 2336)},
	        {key: 'a3', title: 'A3 (297 mm x 420 mm)', format: new mxRectangle(0, 0, 1169, 1654)},
	        {key: 'a4', title: 'A4 (210 mm x 297 mm)', format: mxConstants.PAGE_FORMAT_A4_PORTRAIT},
	        {key: 'a5', title: 'A5 (148 mm x 210 mm)', format: new mxRectangle(0, 0, 583, 827)},
	        {key: 'a6', title: 'A6 (105 mm x 148 mm)', format: new mxRectangle(0, 0, 413, 583)},
	        {key: 'a7', title: 'A7 (74 mm x 105 mm)', format: new mxRectangle(0, 0, 291, 413)},
	        {key: 'custom', title: mxResources.get('custom'), format: null}];
};

/**
 * Static overrides
 */
(function()
{
	// Uses HTML for background pages (to support grid background image)
	mxGraphView.prototype.validateBackgroundPage = function()
	{
		var graph = this.graph;
		
		if (graph.container != null && !graph.transparentBackground)
		{
			if (graph.pageVisible)
			{
				var bounds = this.getBackgroundPageBounds();
				
				if (this.backgroundPageShape == null)
				{
					// Finds first element in graph container
					var firstChild = graph.container.firstChild;
					
					while (firstChild != null && firstChild.nodeType != mxConstants.NODETYPE_ELEMENT)
					{
						firstChild = firstChild.nextSibling;
					}
					
					if (firstChild != null)
					{
						this.backgroundPageShape = this.createBackgroundPageShape(bounds);
						this.backgroundPageShape.scale = 1;
						
						// Shadow filter causes problems in outline window in quirks mode. IE8 standards
						// also has known rendering issues inside mxWindow but not using shadow is worse.
						this.backgroundPageShape.isShadow = !mxClient.IS_QUIRKS;
						this.backgroundPageShape.dialect = mxConstants.DIALECT_STRICTHTML;
						this.backgroundPageShape.init(graph.container);
	
						// Required for the browser to render the background page in correct order
						firstChild.style.position = 'absolute';
						graph.container.insertBefore(this.backgroundPageShape.node, firstChild);
						this.backgroundPageShape.redraw();
						
						this.backgroundPageShape.node.className = 'geBackgroundPage';
						
						// Adds listener for double click handling on background
						mxEvent.addListener(this.backgroundPageShape.node, 'dblclick',
							mxUtils.bind(this, function(evt)
							{
								graph.dblClick(evt);
							})
						);
						
						// Adds basic listeners for graph event dispatching outside of the
						// container and finishing the handling of a single gesture
						mxEvent.addGestureListeners(this.backgroundPageShape.node,
							mxUtils.bind(this, function(evt)
							{
								graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt));
							}),
							mxUtils.bind(this, function(evt)
							{
								// Hides the tooltip if mouse is outside container
								if (graph.tooltipHandler != null && graph.tooltipHandler.isHideOnHover())
								{
									graph.tooltipHandler.hide();
								}
								
								if (graph.isMouseDown && !mxEvent.isConsumed(evt))
								{
									graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt));
								}
							}),
							mxUtils.bind(this, function(evt)
							{
								graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt));
							})
						);
					}
				}
				else
				{
					this.backgroundPageShape.scale = 1;
					this.backgroundPageShape.bounds = bounds;
					this.backgroundPageShape.redraw();
				}
			}
			else if (this.backgroundPageShape != null)
			{
				this.backgroundPageShape.destroy();
				this.backgroundPageShape = null;
			}
			
			this.validateBackgroundStyles();
		}
	};

	// Updates the CSS of the background to draw the grid
	mxGraphView.prototype.validateBackgroundStyles = function()
	{
		var graph = this.graph;
		var color = (graph.background == null || graph.background == mxConstants.NONE) ? graph.defaultPageBackgroundColor : graph.background;
		var gridColor = (color != null && this.gridColor != color.toLowerCase()) ? this.gridColor : '#ffffff';
		var image = 'none';
		var position = '';
		
		if (graph.isGridEnabled())
		{
			var phase = 10;
			
			if (mxClient.IS_SVG)
			{
				// Generates the SVG required for drawing the dynamic grid
				image = unescape(encodeURIComponent(this.createSvgGrid(gridColor)));
				image = (window.btoa) ? btoa(image) : Base64.encode(image, true);
				image = 'url(' + 'data:image/svg+xml;base64,' + image + ')'
				phase = graph.gridSize * this.scale * this.gridSteps;
			}
			else
			{
				// Fallback to grid wallpaper with fixed size
				image = 'url(' + this.gridImage + ')';
			}
			
			var x0 = 0;
			var y0 = 0;
			
			if (graph.view.backgroundPageShape != null)
			{
				var bds = this.getBackgroundPageBounds();
				
				x0 = 1 + bds.x;
				y0 = 1 + bds.y;
			}
			
			// Computes the offset to maintain origin for grid
			position = -Math.round(phase - mxUtils.mod(this.translate.x * this.scale - x0, phase)) + 'px ' +
				-Math.round(phase - mxUtils.mod(this.translate.y * this.scale - y0, phase)) + 'px';
		}
		
		var canvas = graph.view.canvas;
		
		if (canvas.ownerSVGElement != null)
		{
			canvas = canvas.ownerSVGElement;
		}
		
		if (graph.view.backgroundPageShape != null)
		{
			graph.view.backgroundPageShape.node.style.backgroundPosition = position;
			graph.view.backgroundPageShape.node.style.backgroundImage = image;
			graph.view.backgroundPageShape.node.style.backgroundColor = color;
			graph.container.className = 'geDiagramContainer geDiagramBackdrop';
			canvas.style.backgroundImage = 'none';
			canvas.style.backgroundColor = '';
		}
		else
		{
			graph.container.className = 'geDiagramContainer';
			canvas.style.backgroundPosition = position;
			canvas.style.backgroundColor = color;
			canvas.style.backgroundImage = image;
		}
	};
	
	// Returns the SVG required for painting the background grid.
	mxGraphView.prototype.createSvgGrid = function(color)
	{
		var tmp = this.graph.gridSize * this.scale;
		
		while (tmp < this.minGridSize)
		{
			tmp *= 2;
		}
		
		var tmp2 = this.gridSteps * tmp;
		
		// Small grid lines
		var d = [];
		
		for (var i = 1; i < this.gridSteps; i++)
		{
			var tmp3 = i * tmp;
			d.push('M 0 ' + tmp3 + ' L ' + tmp2 + ' ' + tmp3 + ' M ' + tmp3 + ' 0 L ' + tmp3 + ' ' + tmp2);
		}
		
		// KNOWN: Rounding errors for certain scales (eg. 144%, 121% in Chrome, FF and Safari). Workaround
		// in Chrome is to use 100% for the svg size, but this results in blurred grid for large diagrams.
		var size = tmp2;
		var svg =  '<svg width="' + size + '" height="' + size + '" xmlns="' + mxConstants.NS_SVG + '">' +
		    '<defs><pattern id="grid" width="' + tmp2 + '" height="' + tmp2 + '" patternUnits="userSpaceOnUse">' +
		    '<path d="' + d.join(' ') + '" fill="none" stroke="' + color + '" opacity="0.2" stroke-width="1"/>' +
		    '<path d="M ' + tmp2 + ' 0 L 0 0 0 ' + tmp2 + '" fill="none" stroke="' + color + '" stroke-width="1"/>' +
		    '</pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>';

		return svg;
	};

	// Adds panning for the grid with no page view and disabled scrollbars
	var mxGraphPanGraph = mxGraph.prototype.panGraph;
	mxGraph.prototype.panGraph = function(dx, dy)
	{
		mxGraphPanGraph.apply(this, arguments);
		
		if (this.shiftPreview1 != null)
		{
			var canvas = this.view.canvas;
			
			if (canvas.ownerSVGElement != null)
			{
				canvas = canvas.ownerSVGElement;
			}
			
			var phase = this.gridSize * this.view.scale * this.view.gridSteps;
			var position = -Math.round(phase - mxUtils.mod(this.view.translate.x * this.view.scale + dx, phase)) + 'px ' +
				-Math.round(phase - mxUtils.mod(this.view.translate.y * this.view.scale + dy, phase)) + 'px';
			canvas.style.backgroundPosition = position;
		}
	};
	
	// Draws page breaks only within the page
	mxGraph.prototype.updatePageBreaks = function(visible, width, height)
	{
		var scale = this.view.scale;
		var tr = this.view.translate;
		var fmt = this.pageFormat;
		var ps = scale * this.pageScale;

		var bounds2 = this.view.getBackgroundPageBounds();

		width = bounds2.width;
		height = bounds2.height;
		var bounds = new mxRectangle(scale * tr.x, scale * tr.y, fmt.width * ps, fmt.height * ps);

		// Does not show page breaks if the scale is too small
		visible = visible && Math.min(bounds.width, bounds.height) > this.minPageBreakDist;

		var horizontalCount = (visible) ? Math.ceil(height / bounds.height) - 1 : 0;
		var verticalCount = (visible) ? Math.ceil(width / bounds.width) - 1 : 0;
		var right = bounds2.x + width;
		var bottom = bounds2.y + height;

		if (this.horizontalPageBreaks == null && horizontalCount > 0)
		{
			this.horizontalPageBreaks = [];
		}
		
		if (this.verticalPageBreaks == null && verticalCount > 0)
		{
			this.verticalPageBreaks = [];
		}
			
		var drawPageBreaks = mxUtils.bind(this, function(breaks)
		{
			if (breaks != null)
			{
				var count = (breaks == this.horizontalPageBreaks) ? horizontalCount : verticalCount; 
				
				for (var i = 0; i <= count; i++)
				{
					var pts = (breaks == this.horizontalPageBreaks) ?
						[new mxPoint(Math.round(bounds2.x), Math.round(bounds2.y + (i + 1) * bounds.height)),
						 new mxPoint(Math.round(right), Math.round(bounds2.y + (i + 1) * bounds.height))] :
						[new mxPoint(Math.round(bounds2.x + (i + 1) * bounds.width), Math.round(bounds2.y)),
						 new mxPoint(Math.round(bounds2.x + (i + 1) * bounds.width), Math.round(bottom))];
					
					if (breaks[i] != null)
					{
						breaks[i].points = pts;
						breaks[i].redraw();
					}
					else
					{
						var pageBreak = new mxPolyline(pts, this.pageBreakColor);
						pageBreak.dialect = this.dialect;
						pageBreak.isDashed = this.pageBreakDashed;
						pageBreak.pointerEvents = false;
						pageBreak.init(this.view.backgroundPane);
						pageBreak.redraw();
						
						breaks[i] = pageBreak;
					}
				}
				
				for (var i = count; i < breaks.length; i++)
				{
					breaks[i].destroy();
				}
				
				breaks.splice(count, breaks.length - count);
			}
		});
			
		drawPageBreaks(this.horizontalPageBreaks);
		drawPageBreaks(this.verticalPageBreaks);
	};
	
	// Disables removing relative children from parents
	var mxGraphHandlerShouldRemoveCellsFromParent = mxGraphHandler.prototype.shouldRemoveCellsFromParent;
	mxGraphHandler.prototype.shouldRemoveCellsFromParent = function(parent, cells, evt)
	{
		for (var i = 0; i < cells.length; i++)
		{
			if (this.graph.getModel().isVertex(cells[i]))
			{
				var geo = this.graph.getCellGeometry(cells[i]);
				
				if (geo != null && geo.relative)
				{
					return false;
				}
			}
		}
		
		return mxGraphHandlerShouldRemoveCellsFromParent.apply(this, arguments);
	};

	// Overrides to ignore hotspot only for target terminal
	var mxConnectionHandlerCreateMarker = mxConnectionHandler.prototype.createMarker;
	mxConnectionHandler.prototype.createMarker = function()
	{
		var marker = mxConnectionHandlerCreateMarker.apply(this, arguments);
		
		marker.intersects = mxUtils.bind(this, function(state, evt)
		{
			if (this.isConnecting())
			{
				return true;
			}
			
			return mxCellMarker.prototype.intersects.apply(marker, arguments);
		});
		
		return marker;
	};

	// Creates background page shape
	mxGraphView.prototype.createBackgroundPageShape = function(bounds)
	{
		return new mxRectangleShape(bounds, '#ffffff', this.graph.defaultPageBorderColor);
	};

	// Fits the number of background pages to the graph
	mxGraphView.prototype.getBackgroundPageBounds = function()
	{
		var gb = this.getGraphBounds();
		
		// Computes unscaled, untranslated graph bounds
		var x = (gb.width > 0) ? gb.x / this.scale - this.translate.x : 0;
		var y = (gb.height > 0) ? gb.y / this.scale - this.translate.y : 0;
		var w = gb.width / this.scale;
		var h = gb.height / this.scale;
		
		var fmt = this.graph.pageFormat;
		var ps = this.graph.pageScale;

		var pw = fmt.width * ps;
		var ph = fmt.height * ps;

		var x0 = Math.floor(Math.min(0, x) / pw);
		var y0 = Math.floor(Math.min(0, y) / ph);
		var xe = Math.ceil(Math.max(1, x + w) / pw);
		var ye = Math.ceil(Math.max(1, y + h) / ph);
		
		var rows = xe - x0;
		var cols = ye - y0;

		var bounds = new mxRectangle(this.scale * (this.translate.x + x0 * pw), this.scale *
				(this.translate.y + y0 * ph), this.scale * rows * pw, this.scale * cols * ph);
		
		return bounds;
	};
	
	// Add panning for background page in VML
	var graphPanGraph = mxGraph.prototype.panGraph;
	mxGraph.prototype.panGraph = function(dx, dy)
	{
		graphPanGraph.apply(this, arguments);
		
		if ((this.dialect != mxConstants.DIALECT_SVG && this.view.backgroundPageShape != null) &&
			(!this.useScrollbarsForPanning || !mxUtils.hasScrollbars(this.container)))
		{
			this.view.backgroundPageShape.node.style.marginLeft = dx + 'px';
			this.view.backgroundPageShape.node.style.marginTop = dy + 'px';
		}
	};

	/**
	 * Consumes click events for disabled menu items.
	 */
	var mxPopupMenuAddItem = mxPopupMenu.prototype.addItem;
	mxPopupMenu.prototype.addItem = function(title, image, funct, parent, iconCls, enabled)
	{
		var result = mxPopupMenuAddItem.apply(this, arguments);
		
		if (enabled != null && !enabled)
		{
			mxEvent.addListener(result, 'mousedown', function(evt)
			{
				mxEvent.consume(evt);
			});
		}
		
		return result;
	};

	// Selects ancestors before descendants
	var graphHandlerGetInitialCellForEvent = mxGraphHandler.prototype.getInitialCellForEvent;
	mxGraphHandler.prototype.getInitialCellForEvent = function(me)
	{
		var model = this.graph.getModel();
		var psel = model.getParent(this.graph.getSelectionCell());
		var cell = graphHandlerGetInitialCellForEvent.apply(this, arguments);
		var parent = model.getParent(cell);
		
		if (psel == null || (psel != cell && psel != parent))
		{
			while (!this.graph.isCellSelected(cell) && !this.graph.isCellSelected(parent) &&
				model.isVertex(parent) && !this.graph.isContainer(parent))
			{
				cell = parent;
				parent = this.graph.getModel().getParent(cell);
			}
		}
		
		return cell;
	};
	
	// Selection is delayed to mouseup if ancestor is selected
	var graphHandlerIsDelayedSelection = mxGraphHandler.prototype.isDelayedSelection;
	mxGraphHandler.prototype.isDelayedSelection = function(cell, me)
	{
		var result = graphHandlerIsDelayedSelection.apply(this, arguments);
		
		if (!result)
		{
			var model = this.graph.getModel();
			var parent = model.getParent(cell);
			
			while (parent != null)
			{
				// Inconsistency for unselected parent swimlane is intended for easier moving
				// of stack layouts where the container title section is too far away
				if (this.graph.isCellSelected(parent) && model.isVertex(parent))
				{
					result = true;
					break;
				}
				
				parent = model.getParent(parent);
			}
		}
		
		return result;
	};
	
	// Delayed selection of parent group
	mxGraphHandler.prototype.selectDelayed = function(me)
	{
		if (!this.graph.popupMenuHandler.isPopupTrigger(me))
		{
			var cell = me.getCell();
			
			if (cell == null)
			{
				cell = this.cell;
			}

			// Selects folded cell for hit on folding icon
			var state = this.graph.view.getState(cell)
			
			if (state != null && me.isSource(state.control))
			{
				this.graph.selectCellForEvent(cell, me.getEvent());
			}
			else
			{
				var model = this.graph.getModel();
				var parent = model.getParent(cell);
				
				while (!this.graph.isCellSelected(parent) && model.isVertex(parent))
				{
					cell = parent;
					parent = model.getParent(cell);
				}
				
				this.graph.selectCellForEvent(cell, me.getEvent());
			}
		}
	};

	// Returns last selected ancestor
	mxPopupMenuHandler.prototype.getCellForPopupEvent = function(me)
	{
		var cell = me.getCell();
		var model = this.graph.getModel();
		var parent = model.getParent(cell);
		
		while (model.isVertex(parent) && !this.graph.isContainer(parent))
		{
			if (this.graph.isCellSelected(parent))
			{
				cell = parent;
			}
			
			parent = model.getParent(parent);
		}
		
		return cell;
	};

})();
