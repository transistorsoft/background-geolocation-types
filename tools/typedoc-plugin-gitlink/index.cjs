// tools/typedoc-plugin-gitlink/index.cjs
/**
 * TypeDoc plugin: gitlink
 *
 * Converts markdown links of the form [Label](github:<path>) into real GitHub links.
 * Examples:
 *   [Philosophy of Operation](github:wiki/Philosophy-of-Operation)
 *   [README](github:blob/5.0.0-beta/README.md)
 *   [Issues](github:issues)
 *
 * Repo is inferred from package.json -> repository.url.
 * Fallbacks:
 *   --pluginName react-native-background-geolocation
 *   --gitBase https://github.com/transistorsoft
 */

const { Converter } = require('typedoc');
const { ParameterType } = require('typedoc');

const GITHUB_LINK_RE = /\[([^\]]+)\]\(github:([^)]+)\)/gim;

function load(app) {
  // Custom options to help in multi-repo docs setups  
  app.options.addDeclaration({
    name: 'githubUser',
    help: 'GitHub username or org (default: transistorsoft)',
    type: ParameterType.String,
    defaultValue: 'transistorsoft'
  });

  app.converter.on(Converter.EVENT_RESOLVE_END, (ctx) => {
    const project = ctx.project;

    // 1) Determine repository base URL (https://github.com/<owner>/<repo>)
    const repoBase = resolveRepoBase(app, project);

    // Nothing to do if we can’t determine a repo
    if (!repoBase) return;

    // 2) Walk all reflections and rewrite their comments
    for (const key in project.reflections) {
      const refl = project.reflections[key];
      if (!refl?.comment) continue;

      // Replace in summary (shortText)
      if (typeof refl.comment.shortText === 'string') {
        refl.comment.shortText = rewriteGitLinks(refl.comment.shortText, repoBase);
      }

      // Replace in main text body
      if (typeof refl.comment.text === 'string') {
        refl.comment.text = rewriteGitLinks(refl.comment.text, repoBase);
      }

      // Replace in block tags @example, @remarks, etc
      if (Array.isArray(refl.comment.blockTags)) {
        for (const tag of refl.comment.blockTags) {
          if (typeof tag.content === 'string') {
            tag.content = rewriteGitLinks(tag.content, repoBase);
          } else if (Array.isArray(tag.content)) {
            // TypeDoc v0.28 typically stores as CommentDisplayPart[]
            tag.content = tag.content.map((part) => {
              if (part?.kind === 'text' && typeof part.text === 'string') {
                return { ...part, text: rewriteGitLinks(part.text, repoBase) };
              }
              return part;
            });
          }
        }
      }
    }
  });
}

/**
 * Build the repo base URL from package.json repository or from --pluginName/--githubUser.
 * Returns a string like "https://github.com/transistorsoft/react-native-background-geolocation"
 */
function resolveRepoBase(app, project) {
  const githubUser = app.options.getValue('githubUser');
  const pluginName = app.options.getValue('name');

  // Prefer package.json repository.url if available
  let repoUrl =
    project?.packageInfo?.repository?.url ||
    project?.packageInfo?.repository ||
    '';

  // Normalize typical git urls: git+https, ssh, ending .git, etc.
  repoUrl = normalizeRepoUrl(repoUrl);

  if (repoUrl) {
    return repoUrl;
  }

  if (pluginName && githubUser) {
    return `https://github.com/${githubUser}/${pluginName}`;
  }

  return null;
}

function normalizeRepoUrl(url) {
  if (!url || typeof url !== 'string') return '';

  // Examples:
  // git+https://github.com/transistorsoft/react-native-background-geolocation.git
  // https://github.com/transistorsoft/react-native-background-geolocation.git
  // git@github.com:transistorsoft/react-native-background-geolocation.git
  // https://github.com/transistorsoft/react-native-background-geolocation

  // Convert SSH to https
  const sshMatch = url.match(/^git@([^:]+):(.+?)(\.git)?$/i);
  if (sshMatch) {
    return `https://${sshMatch[1]}/${sshMatch[2]}`;
  }

  // Strip leading git+ and trailing .git
  let cleaned = url.replace(/^git\+/, '').replace(/\.git$/i, '');

  // If it’s a GitHub URL, leave as-is
  if (/^https?:\/\/github\.com\//i.test(cleaned)) {
    return cleaned;
  }

  // Not a recognized https GitHub URL
  return '';
}

function stripTrailingSlash(s) {
  return s.endsWith('/') ? s.slice(0, -1) : s;
}

/**
 * Rewrite [Label](github:<path>) to a real GitHub URL.
 * Supports:
 *   - wiki/...        -> <repoBase>/wiki/...
 *   - blob/...        -> <repoBase>/blob/...
 *   - tree/...        -> <repoBase>/tree/...
 *   - issues[...]/... -> <repoBase>/issues... 
 *   - pulls/...       -> <repoBase>/pulls/...
 *   - anything else   -> <repoBase>/<path>
 */
function rewriteGitLinks(text, repoBase) {
  return text.replace(GITHUB_LINK_RE, (_m, label, path) => {
    const p = String(path).replace(/^\/+/, ''); // trim leading slashes
    let target = `${repoBase}`;

    if (/^wiki\//i.test(p)) {
      target += `/${p}`;
    } else if (/^(blob|tree|issues|pulls|compare|actions|releases)\b/i.test(p)) {
      target += `/${p}`;
    } else {
      // default: append as-is
      target += `/${p}`;
    }

    return `[${label}](${target})`;
  });
}

module.exports = { load };