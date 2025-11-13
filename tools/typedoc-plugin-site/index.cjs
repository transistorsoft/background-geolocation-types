/**
 * TypeDoc plugin: site helpers
 *
 * This plugin performs post-processing on generated TypeDoc comments in order to
 * support simple "site" template tags that keep documentation DRY and
 * package-agnostic.
 *
 * Currently supported template variables (used inside comments):
 *
 * - `{{pluginName}}`
 *   - Resolved from:
 *     1. TypeDoc's built-in `--name` option (preferred)
 *     2. `project.packageInfo.name` (from package.json)
 *     3. `project.name`
 *     4. `process.env.DOCS_PLUGIN_NAME` or `process.env.npm_package_name`
 *   - Typical usage: keep import examples consistent across packages.
 *
 *     ```ts
 *     // In a TypeDoc comment
 *     import BackgroundGeolocation from '{{pluginName}}';
 *
 *     // Rendered for react-native-background-geolocation
 *     import BackgroundGeolocation from 'react-native-background-geolocation';
 *     ```
 *
 * - `{{repoUrl}}`
 *   - Resolved from:
 *     1. `package.json` `repository` field (string or `{ url: string }`)
 *     2. First `http(s)` URL found in the project readme
 *     3. `process.env.DOCS_REPO_URL`
 *   - Typical usage: link to the current repo without hard-coding URLs.
 *
 *     ```md
 *     For more information, see the repository: {{repoUrl}}.
 *
 *     // Rendered
 *     For more information, see the repository: https://github.com/transistorsoft/react-native-background-geolocation
 *     ```
 *
 * Integration details:
 *
 * - Hooks into `Converter.EVENT_RESOLVE_END`.
 * - Walks every reflection comment and replaces template variables in:
 *   - Legacy `shortText` / `text` fields
 *   - `summary: CommentDisplayPart[]`
 *   - `blockTags[].content` (eg: `@example`, `@remarks`, etc.)
 * - Safe no-op if `pluginName` or `repoUrl` cannot be resolved.
 *
 * Usage:
 *
 * - Add this plugin to your TypeDoc configuration (typedoc.json):
 *
 *   ```json
 *   {
 *     "plugin": [
 *       "./tools/typedoc-plugin-site"
 *     ],
 *     "name": "react-native-background-geolocation"
 *   }
 *   ```
 *
 * - In your comments, use the template variables where appropriate:
 *
 *  ```ts
 *    * @example
 *    * ```ts
 *    * import BackgroundGeolocation from '{{pluginName}}';
 *    * ```
 *   ```
 * 
 */
const { Converter } = require('typedoc');

function safeGetOption(app, key) {
  try {
    return app.options.getValue(key);
  } catch {
    return undefined;
  }
}

function resolvePluginName(app, project) {
  // 1) Prefer TypeDoc's built-in --name (you already set this)
  const nameOpt = safeGetOption(app, 'name');
  if (nameOpt) return nameOpt;

  // 2) Fallbacks from package.json / project
  if (project?.packageInfo?.name) return project.packageInfo.name;
  if (project?.name) return project.name;

  // 3) Env fallback (optional)
  if (process.env.DOCS_PLUGIN_NAME) return process.env.DOCS_PLUGIN_NAME;
  if (process.env.npm_package_name) return process.env.npm_package_name;

  return null;
}

function resolveRepoUrl(app, project, pluginName) {
  // Try to read the same custom option used by typedoc-plugin-gitlink.
  // If not set, you can either:
  //   - fall back to a default (eg: 'transistorsoft'), or
  //   - require DOCS_REPO_URL to be set.
  //
  // Here we:
  //   1) prefer --githubUser
  //   2) then DOCS_GITHUB_USER
  //   3) finally fall back to 'transistorsoft' (easy default for your org)
  const githubUser =
    safeGetOption(app, 'githubUser') ||
    process.env.DOCS_GITHUB_USER ||
    'transistorsoft';

  if (pluginName && githubUser) {
    return `https://github.com/${githubUser}/${pluginName}`;
  }

  // Absolute last-chance escape hatch:
  return process.env.DOCS_REPO_URL || null;
}

function replaceTemplateVars(text, pluginName, repoUrl) {
  if (!text || typeof text !== 'string') return text;

  // Debug helper
  if (/{{\s*pluginName\s*}}/g.test(text)) {
    console.log('*** Replacing {{pluginName}} with "', pluginName, '"');
  }

  let out = text.replace(/{{\s*pluginName\s*}}/g, pluginName);
  out = out.replace(/{{\s*repoUrl\s*}}/g, repoUrl);
  return out;
}

function applyPluginNameToComment(comment, pluginName, repoUrl) {
  if (!comment) return;

  // ---- Old-style string fields (pre-0.28) ----
  if (typeof comment.shortText === 'string') {
    comment.shortText = replaceTemplateVars(comment.shortText, pluginName, repoUrl);
  }
  if (typeof comment.text === 'string') {
    comment.text = replaceTemplateVars(comment.text, pluginName, repoUrl);
  }

  // ---- New-style fields: summary is CommentDisplayPart[] ----
  if (Array.isArray(comment.summary)) {
    comment.summary = comment.summary.map((part) => {
      if (part && typeof part.text === 'string') {
        return { ...part, text: replaceTemplateVars(part.text, pluginName, repoUrl) };
      }
      return part;
    });
  }

  // ---- New-style block tags (@example, @remarks, etc) ----
  if (Array.isArray(comment.blockTags)) {
    comment.blockTags = comment.blockTags.map((tag) => {
      // TypeDoc 0.28+: content is CommentDisplayPart[]
      if (Array.isArray(tag.content)) {
        tag.content = tag.content.map((part) => {
          if (part && typeof part.text === 'string') {
            return { ...part, text: replaceTemplateVars(part.text, pluginName, repoUrl) };
          }
          return part;
        });
      } else if (typeof tag.content === 'string') {
        // Older shapes
        tag.content = replaceTemplateVars(tag.content, pluginName, repoUrl);
      }
      return tag;
    });
  }
}

function load(app) {
  app.converter.on(Converter.EVENT_RESOLVE_END, (ctx) => {
    const project = ctx.project;
    const pluginName = resolvePluginName(app, project);
    const repoUrl = resolveRepoUrl(app, project, pluginName);

    if (!pluginName) {
      console.warn('[typedoc-plugin-site] pluginName could not be resolved');
      return;
    }

    const reflections = project?.reflections || {};
    for (const id in reflections) {
      const refl = reflections[id];
      if (!refl || !refl.comment) continue;
      applyPluginNameToComment(refl.comment, pluginName, repoUrl);
    }
  });
}

module.exports = { load };