jQuery(function() {
    "use strict";

    $.firegit = {
        errMap: {
            'firegit.u_notfound': '该页面不存在或者已经被删除',
            'firegit.u_login': '您尚未登录',
            'firegit.u_power': '您没有操作的权限'
        }
    };
    function path() {
        var args = arguments,
            result = []
            ;

        for (var i = 0; i < args.length; i++) {
            args[i] = args[i].replace('@', '/static/SyntaxHighlighter/js/shBrush') + '.js';
            result.push(args[i]);
        }
        return result;
    };

    $(function() {
        SyntaxHighlighter.autoloader.apply(null, path(
            'applescript mm m               @AppleScript',
            'actionscript3 as3          @AS3',
            'sh bash shell                 @Bash',
            'coldfusion cf              @ColdFusion',
            'h cpp c                    @Cpp',
            'c# c-sharp csharp          @CSharp',
            'css less                       @Css',
            'delphi pascal              @Delphi',
            'diff patch pas             @Diff',
            'erl erlang                 @Erlang',
            'groovy                     @Groovy',
            'java gradle                       @Java',
            'jfx javafx                 @JavaFX',
            'js json jscript javascript @JScript',
            'perl pl                    @Perl',
            'php phtml                  @Php',
            'text plain pro properties gitignore                @Plain',
            'py python                  @Python',
            'powershell ps posh         @PowerShell',
            'ruby rails ror rb          @Ruby',
            'sass scss                  @Sass',
            'scala                      @Scala',
            'sql                        @Sql',
            'vb vbnet                   @Vb',
            'xml xib xhtml plist xslt html project buildpath buildpath     @Xml',
            'go                         @Go'
        ));
        SyntaxHighlighter.config.strings.viewSource = '查看源代码';
        SyntaxHighlighter.all();
    });


    /**
     * 执行post连接请求
     * @param href
     * @param option
     * @param data
     */
    function doLinkPost(href, option, data) {
        $.post(href, data, function (ret) {
            if (window.currentDialog) {
                window.currentDialog.close();
            }
            if (ret.status == 'firegit.ok') {
                if (option.success) {
                    option.success(ret);
                } else {
                    dialog({
                        title: '操作成功',
                        okValue: '确认',
                        content: option.okText ? option.okText : '操作成功',
                        ok: function () {
                            location.reload();
                        },
                        onClose: function () {
                            location.reload();
                        }
                    }).width(400).show();
                }
            } else {
                var detail = '';
                if (ret.status in $.firegit.errMap) {
                    detail = $.firegit.errMap[ret.status];
                }
                var content = '<label>错误码：</label><code>' + ret.status + '</code>';
                if (detail) {
                    content += '<br/><label>&nbsp;&nbsp;说明：</label><span>' + detail + '</span>';
                }
                dialog({
                    title: '操作失败',
                    content: content,
                    okValue: '确定',
                    ok: function () {
                    }
                }).width(400).show();
            }
        });
    }

    /**
     * 异步提交的hook
     */
    hapj.hook.set('hook.ajaxable', function(node, option) {
        var nodeName = node[0].nodeName, dlg;
        switch (nodeName) {
            case 'A':
                if (option.container) {
                    $(node).on('click', function () {
                        if (!dlg) {
                            dlg = dialog({
                                title: '加载中...',
                                cancel: false,
                                width: 200
                            });
                        }
                        dlg.show();

                        $.get(node.href, function (html) {
                            setTimeout(function () {
                                dlg.close();
                            }, 500);
                            $(option.container).append(html);
                        });
                        return false;
                    });
                } else {
                    $(node).on('click', function () {
                        var confirm = this.getAttribute('data-confirm'), href = this.href;
                        if (confirm) {
                            dialog({
                                content: confirm,
                                title: '提示',
                                okValue: '确认',
                                ok: function () {
                                    doLinkPost(href, option);
                                },
                                cancelValue: '取消',
                                cancel: function () {
                                }
                            }).width(300).show();
                        } else {
                            doLinkPost(this.href, option);
                        }

                        return false;
                    });
                }

                break;
            case 'FORM':
                $(node).on('submit', function () {
                    doLinkPost(this.action, option, $(this).serializeArray());
                    return false;
                });
                break;
        }
    });

    /**
     * 对话框的hook
     */
    hapj.hook.set('hook.dialog', function(elem, option) {
        $(elem).on('click', function () {
            window.currentDialog = dialog(option).show();
        });
    });

});
