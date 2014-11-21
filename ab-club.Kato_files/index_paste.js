var preserveIndents = function (html) {
    return _.reduce(html.split(/\n|\r\n/g), function (acc, line) {
        var indented = '';
        for (var i = 0; i < line.length; ++i) {
            var ccode = line[i].charCodeAt(0);
            if ((ccode === 32) || (ccode === 160)) {
                indented += '&nbsp;';
            }
            else if (ccode === 9) {
                indented += '&nbsp;&nbsp;&nbsp;&nbsp;';
            }
            else {
                break;
            }
        }
        indented += line.trim();
        return acc + (acc.length ? '<br/>' : '') + indented;
    }, '');
};
var load = function (base, r) {
    $.ajax({
        type: 'GET',
        dataType: (r[2] === 'paste.code' || r[2] === 'paste.md' ? 'text' : 'html'),
        url: base + r[1],
        success: function (data) {
            if (r[2] === 'paste.html') {
                $('#paste').html(data);
            }
            else if (r[2] === 'paste.code') {
                $('#paste').html('<pre><code>' + hljs.highlightAuto(data).value + '</code></pre>');
            }
            else if (r[2] === 'paste.md') {
                $('#paste').html(marked(data, {sanitize: true, gfm: true, breaks: true}));
            }
            else {
                $('#paste').html(preserveIndents(linkify(data)));
            }
        }
    });   
};
if (document.location.pathname === '/') {
    var rgx = new RegExp('^\\?o=(.+/(.+))$');
    var r = rgx.exec(document.location.search);
    if (r) {
        load(document.location.protocol + '//' + document.location.host + '/', r);
    }
}
else {
    var rgx = new RegExp('^/paste/(.+/(.+))$');
    var r = rgx.exec(document.location.pathname);
    if (r) {
       load(LECHAT_PASTE_S3_BASE_LEGACY, r);
    }
}