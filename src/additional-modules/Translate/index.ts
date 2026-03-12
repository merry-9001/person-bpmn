import translations from "./zh";

function customTranslate(
  template: string,
  replacements?: Record<string, string>
) {
  replacements = replacements || {};

  // ---- 大小写不敏感查找函数 ----
  function findTranslation(key: string): string | undefined {
    if (translations[key]) return translations[key];

    // 忽略大小写匹配
    const lowerKey = key.toLowerCase();
    for (const k in translations) {
      if (k.toLowerCase() === lowerKey) {
        return translations[k];
      }
    }
    return undefined;
  }

  // Translate
  template = findTranslation(template) || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function (_, key) {
    const replacementKey = replacements![key];

    // 如果没有提供替换 key，则直接返回原占位符
    if (!replacementKey) {
      return "{" + key + "}";
    }

    // 先用替换 key 作为默认字符串
    let str = replacementKey;

    const translated = findTranslation(replacementKey);
    if (translated !== null && translated !== undefined && translated !== "undefined") {
      str = translated;
    }

    return str || "{" + key + "}";
  });
}

const customTranslateModule = {
  translate: ["value", customTranslate],
};

export default customTranslateModule;
