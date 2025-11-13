const { Converter } = require('typedoc');

const MEDIA_PLAYER_PATTERN =
  /<mediaplayer:\s?((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9.\-]+)((?:\/[\+~%\/.\w\-_]*)?\??(?:[\-\+=&;%@.\w_]*)#?(?:[.!\/\\\w]*))?)>/gim;

// IMPORTANT: single line, no newlines
const REPLACEMENT_HTML =
  '<video controls name="media" height="32" width="220"><source src="$1" /></video>';

function replaceMediaTagsInText(text) {
  if (typeof text !== 'string') return text;
  return text.replace(MEDIA_PLAYER_PATTERN, REPLACEMENT_HTML);
}

function replaceMediaTagsInParts(parts) {
  if (!Array.isArray(parts)) return parts;
  return parts.map((part) => {
    if (!part || typeof part.text !== 'string') return part;
    const nextText = replaceMediaTagsInText(part.text);
    if (nextText === part.text) return part;
    return { ...part, text: nextText };
  });
}

function rewriteMediaTagsInComment(comment) {
  if (!comment) return;

  // TypeDoc >= 0.28: summary & blockTags with CommentDisplayPart[]
  if (Array.isArray(comment.summary)) {
    comment.summary = replaceMediaTagsInParts(comment.summary);
  }

  if (Array.isArray(comment.blockTags)) {
    for (const tag of comment.blockTags) {
      if (!tag) continue;

      if (Array.isArray(tag.content)) {
        tag.content = replaceMediaTagsInParts(tag.content);
      } else if (typeof tag.content === 'string') {
        tag.content = replaceMediaTagsInText(tag.content);
      }
    }
  }

  // Legacy API compatibility: shortText / text / tags
  if (typeof comment.shortText === 'string') {
    comment.shortText = replaceMediaTagsInText(comment.shortText);
  }

  if (typeof comment.text === 'string') {
    comment.text = replaceMediaTagsInText(comment.text);
  }

  if (Array.isArray(comment.tags)) {
    for (const tag of comment.tags) {
      if (tag && typeof tag.text === 'string') {
        tag.text = replaceMediaTagsInText(tag.text);
      }
    }
  }
}

function load(app) {
  app.converter.on(Converter.EVENT_RESOLVE_END, (ctx) => {
    const project = ctx.project;
    if (!project?.reflections) return;

    for (const key in project.reflections) {
      const refl = project.reflections[key];
      if (!refl?.comment) continue;
      rewriteMediaTagsInComment(refl.comment);
    }
  });
}

module.exports = { load };