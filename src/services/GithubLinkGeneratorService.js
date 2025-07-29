class GithubLinkGeneratorService {
  constructor(repoBaseUrl) {
    this.repoBaseUrl = repoBaseUrl.endsWith('/') ? repoBaseUrl.slice(0, -1) : repoBaseUrl;
    this.branch = 'main';
  }

  getEditLink(curriculum, filename) {
    return `${this.repoBaseUrl}/edit/${this.branch}/${curriculum}/${filename}.md`;
  }

  getIssueLink() {
    return `${this.repoBaseUrl}/issues/new`;
  }

  getChangeLogLink(curriculum, filename) {
    return `${this.repoBaseUrl}/commits/${this.branch}/${curriculum}/${filename}.md`;
  }
}

export default GithubLinkGeneratorService;