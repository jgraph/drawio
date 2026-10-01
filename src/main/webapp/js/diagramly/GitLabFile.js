/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
GitLabFile = function(ui, data, meta)
{
	GitHubFile.call(this, ui, data, meta);
	
	this.peer = this.ui.gitLab;
};

//Extends mxEventSource
mxUtils.extend(GitLabFile, GitHubFile);

/**
 * Returns the URL of the file on GitLab.
 */
GitLabFile.prototype.getFileUrl = function()
{
	return this.meta.html_url;
};

/**
 * Returns the URL of the folder of the file on GitLab.
 */
GitLabFile.prototype.getFolderUrl = function()
{
	var url = this.getFileUrl();

	return url.substring(0, url.lastIndexOf('/'));
};

/**
 * Opens the members page of the project on GitLab.
 */
GitLabFile.prototype.share = function()
{
	this.ui.editor.graph.openLink(DRAWIO_GITLAB_URL + '/' +
		this.meta.org + '/' + encodeURIComponent(this.meta.repo) +
		'/-/project_members');
};

/**
 * Returns the ID of the file, which consists of the organization, the
 * URI-encoded repository, the ref and the path.
 */
GitLabFile.prototype.getId = function()
{
	return this.meta.org + '/' +
		((this.meta.repo != null) ? encodeURIComponent(this.meta.repo) + '/' +
		((this.meta.ref != null) ? this.meta.ref +
		((this.meta.path != null) ? '/' + this.meta.path : '') : '') : '');
};

/**
 * Returns the hash of the file, which is the URI-encoded A followed by the
 * ID.
 */
GitLabFile.prototype.getHash = function()
{
	return encodeURIComponent('A' + this.getId());
};

/**
 * Returns true if the given error is a conflict (HTTP 400).
 */
GitLabFile.prototype.isConflict = function(err)
{
	return err != null && err.status == 400;
};

/**
 * Returns App.MODE_GITLAB.
 */
GitLabFile.prototype.getMode = function()
{
	return App.MODE_GITLAB;
};

/**
 * Returns the last commit ID from the given descriptor.
 */
GitLabFile.prototype.getDescriptorEtag = function(desc)
{
	return desc.last_commit_id;
};

/**
 * Sets the last commit ID of the given descriptor.
 */
GitLabFile.prototype.setDescriptorEtag = function(desc, etag)
{
	desc.last_commit_id = etag;
};
