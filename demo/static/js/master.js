/* global HTMLLint, minify */
(function() {
  'use strict';

  var cType = 'html';

  function byId(id) {
    return document.getElementById(id);
  }

  function escapeHTML(str) {
    return (str + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function getOptions() {
    return {
      removeIgnored:                  byId('remove-ignored').checked,
      removeComments:                 byId('remove-comments').checked,
      removeCommentsFromCDATA:        byId('remove-comments-from-cdata').checked,
      removeCDATASectionsFromCDATA:   byId('remove-cdata-sections-from-cdata').checked,
      collapseWhitespace:             byId('collapse-whitespace').checked,
      conservativeCollapse:           byId('conservative-collapse').checked,
      collapseBooleanAttributes:      byId('collapse-boolean-attributes').checked,
      removeAttributeQuotes:          byId('remove-attribute-quotes').checked,
      removeRedundantAttributes:      byId('remove-redundant-attributes').checked,
      useShortDoctype:                byId('use-short-doctype').checked,
      removeEmptyAttributes:          byId('remove-empty-attributes').checked,
      removeEmptyElements:            byId('remove-empty-elements').checked,
      removeOptionalTags:             byId('remove-optional-tags').checked,
      removeScriptTypeAttributes:     byId('remove-script-type-attributes').checked,
      removeStyleLinkTypeAttributes:  byId('remove-style-link-type-attributes').checked,
      caseSensitive:                  byId('case-sensitive').checked,
      keepClosingSlash:               byId('keep-closing-slash').checked,
      minifyJS:                       byId('minify-js').checked,
      processScripts:                 byId('minify-js-templates').checked ? byId('minify-js-templates-type').value : false,
      minifyCSS:                      byId('minify-css').checked,
      minifyURLs:                     byId('minify-urls').checked ? { site:byId('minify-urls-siteurl').value } : false,
      lint:                           byId('use-htmllint').checked ? new HTMLLint() : null,
      maxLineLength:                  parseInt(byId('max-line-length').value, 10)
    };
  }

  function commify(str) {
    return String(str)
      .split('').reverse().join('')
      .replace(/(...)(?!$)/g, '$1,')
      .split('').reverse().join('');
  }

  function minifyTextarea() {
    try {
      var options = getOptions(),
          lint = options.lint,
          startTag = cType === 'html' ? '' : '<' + cType + '>',
          endTag = cType === 'html' ? '' : '</' + cType + '>',
          originalValue = byId('input').value,
          midValue = minify(startTag + originalValue + endTag, options),
          minifiedValue = cType === 'html' ? midValue : midValue.substring(0, midValue.lastIndexOf(endTag)).replace(startTag, ''),
          diff = originalValue.length - minifiedValue.length,
          savings = originalValue.length ? ((100 * diff) / originalValue.length).toFixed(2) : 0;

      byId('output').value = minifiedValue;

      byId('stats').innerHTML =
        '<span class="success">' +
          'Original size: <strong>' + commify(originalValue.length) + '</strong>' +
          '. Minified size: <strong>' + commify(minifiedValue.length) + '</strong>' +
          '. Savings: <strong>' + commify(diff) + ' (' + savings + '%)</strong>.' +
        '</span>';

      if (lint) {
        lint.populate(byId('report'));
      }
    }
    catch (err) {
      byId('output').value = '';
      byId('stats').innerHTML = '<span class="failure">' + escapeHTML(err) + '</span>';
    }
  }

  byId('max-line-length').oninput = function() { minifyTextarea(); };
  byId('minify-btn').onclick = function() {
    cType = 'html';
    minifyTextarea(); 
  };

  byId('minify-css-btn').onclick = function() {
    cType = 'style';
    minifyTextarea(); 
  };

  byId('minify-js-btn').onclick = function() {
    cType = 'script';
    minifyTextarea(); 
  };

  function setCheckedAttrOnCheckboxes(attrValue) {
    var checkboxes = byId('options').getElementsByTagName('input');
    for (var i = checkboxes.length; i--; ) {
      checkboxes[i].checked = attrValue;
    }
  }

  byId('select-all').onclick = function() {
    setCheckedAttrOnCheckboxes(true);
    return false;
  };

  byId('select-none').onclick = function() {
    setCheckedAttrOnCheckboxes(false);
    return false;
  };

  byId('select-safe').onclick = function() {
    setCheckedAttrOnCheckboxes(true);
    var inputEls = byId('options').getElementsByTagName('input');
    inputEls[10].checked = false;
    inputEls[11].checked = false;
    inputEls[18].checked = false;
    return false;
  };

})();