(async function()
{
    const mermaid = await import(DRAWIO_BASE_URL + '/js/mermaid/esm/mermaid.esm.min.mjs');
    window.mermaid = mermaid.default; // TODO Is this the correct way to do it
})();