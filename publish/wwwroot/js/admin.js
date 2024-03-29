﻿const projectId = $("#projectId").val();
var fontList = [
    { name: 'Arial', family: 'Arial, Helvetica, sans-serif' },
    { name: 'Arial Black', family: '"Arial Black", Gadget, sans-serif' },
    { name: 'Comic Sans', family: '"Comic Sans MS", Textile, cursive, sans-serif' },
    { name: 'Courier New', family: '"Courier New", Courier, monospace' },
    { name: 'Georgia', family: 'Georgia, serif' },
    { name: 'Impact', family: 'Impact, Charcoal, sans-serif' },
    { name: 'Lucida Console', family: '"Lucida Console", Monaco, monospace' },
    { name: 'Lucida Sans', family: '"Lucida Sans Uncide", "Lucida Grande", sans-serif' },
    { name: 'Palatino', family: '"Palatino Linotype", "Book Antiqua", Palatino, serif' },
    { name: 'Tahoma', family: 'Tahoma, Geneva, sans-serif' },
    { name: 'Times New Roman', family: '"Times New Roman", Times, serif' },
    { name: 'Trebuchet', family: '"Trebuchet MS", Helvetica, sans-serif' },
    { name: 'Verdana', family: 'Verdana, Geneva, sans-serif' }
];

for (const font of fonts) {
    fontList.push({ name: font.Name, family: font.Name });
}

$(function () {
    $('#user-table').DataTable({
        "pageLength": 25
    });

    $('#datetimepicker').datetimepicker({ sideBySide: true, allowInputToggle: true, format: "DD MMM yyyy HH:mm" });

    $('.trumbowyg').trumbowyg({
        btnsDef: {
            // Create a new dropdown
            image: {
                dropdown: ['insertImage', 'base64'],
                ico: 'insertImage'
            },
            justify: {
                dropdown: ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'unorderedList', 'orderedList', 'indent', 'outdent'],
                ico: 'justifyFull'
            }
        },
        // Redefine the button pane
        btns: [
            ['viewHTML'],
            ['historyUndo', 'historyRedo'],
            ['formatting'],
            ['strong', 'em', 'del'],
            ['superscript', 'subscript'],
            ['foreColor', 'backColor'],
            ['emoji'],
            ['fontfamily'],
            ['fontsize'],
            ['link'],
            ['image'], // Our fresh created dropdown
            ['justify'],
            ['lineheight'],
            ['horizontalRule'],
            ['removeformat'],
            ['fullscreen']
        ],
        plugins: {
            allowTagsFromPaste: {
                allowedTags: ['h4', 'p', 'br']
            },
            fontfamily: {
                fontList: fontList
            }
        }
    }).on("tbwchange", function () {
        $(this).parent().addClass("changed");
    });

    bindContentAdd();
    bindContentSave();
    bindQRSizes();
    bindMetrics();
    bindTabHistory();
    bindEventBrite();
    bindTag();
    bindS3Uploader();
    bindLanguage();
    RollIframeStyle($("#iframe-tab input[name=IsIframe]").is(":checked"));

    $(".js-change-drm").on("change", function () {
        $(".js-wowza-secure-token").addClass("d-none");
        $(".js-drm").addClass("d-none");

        if ($(".js-change-drm").val() == 1) {
            $(".js-wowza-secure-token").removeClass("d-none");

        } else if ($(".js-change-drm").val() == 2) {
            $(".js-drm").removeClass("d-none");

        }
    });

    $(".js-change-user-lock-type").on("change", function () {
        $(".js-user-lock-type-ip").addClass("d-none");
        $(".js-user-lock-type-logout").addClass("d-none");

        if ($(".js-change-user-lock-type").val() == 0) {
            $(".js-user-lock-type-ip").removeClass("d-none");

        } else if ($(".js-change-user-lock-type").val() == 1) {
            $(".js-user-lock-type-logout").removeClass("d-none");

        }
    });

    $(".js-client-hosted-checkbox").on("change", function () {
        if ($(".js-client-hosted-checkbox:checked").length > 0) {
            $(".js-client-hosted-stream-embed").removeClass("d-none");
            $(".js-client-hosted-stream-url").addClass("d-none");
        } else {
            $(".js-client-hosted-stream-embed").addClass("d-none");
            $(".js-client-hosted-stream-url").removeClass("d-none");
        }
    });

    $("#iframe-tab input[name=IsIframe]").on("change", function () {
        RollIframeStyle($(this).is(":checked"))
    })

    $("#btn-copy-iframe-code").click(function (e) {
        e.preventDefault();
        $("#txt-iframe-code").select();
        document.execCommand('copy');
    })

    $("#input-countdown-preview").change(function () {
        const url = new URL($(this).parent().parent().find("a").attr("href") + "?preview=true");

        url.search = "";
        if ($(this).is(":checked")) url.search = "?preview=true";

        $(this).parent().parent().find("a").attr("href", url);
    })

    $(".spectrum").spectrum({
        type: "component"
    })

    if (!$(".nav-tabs .nav-link").hasClass("active")) {
        $(".nav-tabs .nav-link")[0].click();
    }

});

function bindS3Uploader() {
    $(".input-file-s3").change(function () {
        if ($(this)[0].files.length === 0) return;

        var $this = $(this);

        var formData = new FormData();
        formData.append("file", $(this)[0].files[0]);
        formData.append("projectId", projectId);

        $.ajax({
            url: "/admin/upload/s3",
            data: formData,
            type: "POST",
            contentType: false,
            processData: false,
            beforeSend: function () {
                $this.prop("disabled", true);
            },
            success: function (data) {
                $this.prop("disabled", false);
                if (data.success) {
                    $this.next().val(data.msg);
                    $this.next().next().find("img").attr("src", data.msg);
                }
            }
        });
    })

    $(".input-img-preview").change(function () {
        $(this).next().find("img").attr("src", $(this).val());
    })

    $(".input-file-s3-css").change(function () {
        if ($(this)[0].files.length === 0) return;

        var $this = $(this);

        var formData = new FormData();
        formData.append("file", $(this)[0].files[0]);
        formData.append("projectId", projectId);

        $.ajax({
            url: "/admin/upload/s3/css",
            data: formData,
            type: "POST",
            contentType: false,
            processData: false,
            beforeSend: function () {
                $this.prop("disabled", true);
            },
            success: function (data) {
                $this.prop("disabled", false);
                if (data.success) {
                    $this.next().val(data.msg);
                } else {
                    alert(data.msg);
                    $this.val('');
                }
            }
        });
    })
}

function bindLanguage() {
    $("#languages-wrapper ul li").click(function () {
        $(this).toggleClass("selected");
    });

    $("#language-add").click(function (e) {
        e.preventDefault();

        $(".available-languages li").each(function (index) {
            if ($(this).hasClass("selected")) {
                $(this).removeClass("selected").removeClass("active");
                $(".selected-languages li").eq(index).addClass("active");
            }
        })
    });

    $("#language-remove").click(function (e) {
        e.preventDefault();

        $(".selected-languages li").each(function (index) {
            if ($(this).hasClass("selected")) {
                $(this).removeClass("selected").removeClass("active");
                $(".available-languages li").eq(index).addClass("active");
            }
        })
    });

    $(".save-languages").click(function (e) {
        e.preventDefault();

        var formData = new FormData();
        var addedLanguages = "";
        var removedLanguages = "";
        $(".selected-languages li").each(function (index) {
            if ($(this).hasClass("active") && !$(this).hasClass("current")) {
                if (addedLanguages == "") {
                    addedLanguages = $(this).text();
                } else {
                    addedLanguages = addedLanguages + "," + $(this).text();
                }
            } else if ($(this).hasClass("current") && !$(this).hasClass("active")) {
                if (removedLanguages == "") {
                    removedLanguages = $(this).text();
                } else {
                    removedLanguages = removedLanguages + "," + $(this).text();
                }
            }
        })
        formData.append("addedLanguages", addedLanguages);
        formData.append("removedLanguages", removedLanguages);

        $.ajax({
            url: "/admin/project/" + projectId + "/languages/add",
            data: formData,
            type: "POST",
            contentType: false,
            processData: false,
            beforeSend: function () {
                
            },
            success: function (data) {
                console.log(data)
                $("#languages-tab form").submit();
            }
        });
    })
}

function bindTag() {
    $.get("/admin/project/tags", function (data) {
        $("#input-project-tag").autocomplete({
            source: data,
            select: function (event, ui) {
                addTag(ui.item.value);
                $(this).val("")
                return false;
            }
        });
    })

    $("#input-project-tag").keydown(function (e) {
        var keyCode = e.keyCode || e.which;

        if (keyCode == 13) {
            e.preventDefault();

            if ($(this).val() != "") {
                addTag($(this).val());
                $(this).val("");
            }
        } else {
            if (keyCode == 8 || keyCode == 189) return true;
            if (48 <= keyCode && keyCode <= 57)
                return true;
            if (65 <= keyCode && keyCode <= 90)
                return true;
            if (97 <= keyCode && keyCode <= 122)
                return true;
            return false;
        }
    })

    $("#btn-add-tag").click(function () {
        if ($("#input-project-tag").val() != "") {
            addTag($("#input-project-tag").val());
            $("#input-project-tag").val("");
        }
    })

    $("#project-tags a").click(function (e) {
        e.preventDefault();

        $(this).remove();
        calcTags();
    })
}

function addTag(tagName) {
    var isExist = false;

    $("#project-tags a").each(function () {
        if ($(this).text() == tagName) isExist = true;
    })

    if (!isExist) {
        $("#project-tags").append($("<a href='#' style='margin-left:5px;'>" + tagName + "</a>").click(function (e) {
            e.preventDefault();
            $(this).remove();
            calcTags();
        }));

        calcTags();
    }
}

function calcTags() {
    let projectTags = "";

    $("#project-tags a").each(function () {
        if (projectTags == "") projectTags += $(this).text();
        else projectTags += "," + $(this).text();
    })

    $("#input-project-tags").val(projectTags);
}

function RollIframeStyle(isIframe) {
    if (isIframe) {
        $("#iframe-tab input[name=HideHeader]").prop("checked", true);
        $("#iframe-tab input[name=HideFooter]").prop("checked", true);
        $("#iframe-tab input[name=FullWidth]").prop("checked", true);
    } else {
        $("#iframe-tab input[name=HideHeader]").prop("checked", false);
        $("#iframe-tab input[name=HideFooter]").prop("checked", false);
        $("#iframe-tab input[name=FullWidth]").prop("checked", false);
    }
}

function bindContentAdd() {
    $(".js-content-submit").off("click").on("click", function (e) {
        e.preventDefault();

        var $content = $(this).siblings("input");

        var name = $(this).attr("content-name");
        var content = $content.val();
        var language = $(this).attr("language");

        if (!content) {
            $content.addClass("is-invalid");
        } else {
            $content.removeClass("is-invalid");
        }

        if (!name || !content)
            return;

        $.ajax({
            type: "POST",
            url: `/project/${projectId}/contents/add`,
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                content: content,
                language: language
            }),
            success: function (response) {
                if (response.success) {
                    $content.removeClass("changed");
                    $("#alert-container").html("<div class='alert alert-success' role='alert'>" + response.msg + "</div>");
                } else {
                    $("#alert-container").html("<div class='alert alert-danger' role='alert'>" + response.msg + "</div>");
                }
            },
            error: function () {
                alert("An error occurred");
            }
        });
    });

    $(".js-content input").change(function () {
        $(this).addClass("changed");
    })

    $(".js-content-save-all").click(function () {
        $(".js-content input").each(function () {
            if ($(this).hasClass("changed")) {
                $(this).siblings(".js-content-submit").click();
            }
        })
    })
}

function bindContentSave() {
    $(".js-content-save").off("click").on("click", function (e) {
        e.preventDefault();

        var $content = $(this).siblings().find(".trumbowyg-editor");

        var name = $(this).attr("content-name");
        var content = $content.html();
        var language = $(this).attr("language");

        //console.log(name, content, language);

        if (!content) {
            $content.addClass("is-invalid");
        } else {
            $content.removeClass("is-invalid");
        }

        if (!name || !content)
            return;

        $.ajax({
            type: "POST",
            url: `/project/${projectId}/contents/add`,
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                content: content,
                language: language
            }),
            success: function (response) {
                if (response.success) {
                    $content.removeClass("changed");
                    $("#alert-container").html("<div class='alert alert-success' role='alert'>" + response.msg + "</div>");
                } else {
                    $("#alert-container").html("<div class='alert alert-danger' role='alert'>" + response.msg + "</div>");
                }
            },
            error: function () {
                alert("An error occurred");
            }
        });
    });

    $(".js-content input").change(function () {
        $(this).addClass("changed");
    })

    $(".js-content-save-all").click(function (e) {
        e.preventDefault();

        $.ajax({
            url: `/project/ajaxsave/${projectId}`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                Name: $("input[name=Name]").val(),
                BrowserTabTitle: $("input[name=BrowserTabTitle]").val(),
                CustomCssUrl: $("input[name=CustomCssUrl]").val(),
                PlayerControlsColor: $("input[name=PlayerControlsColor]").val(),
                EventBackgroundColor: $("input[name=EventBackgroundColor]").val(),
                EventForegroundColor: $("input[name=EventForegroundColor]").val()
            }),
            success: function (response) {
                if (response.success) {
                    $("#alert-container").html("<div class='alert alert-success' role='alert'>" + response.msg + "</div>");
                } else {
                    $("#alert-container").html("<div class='alert alert-danger' role='alert'>" + response.msg + "</div>");
                }
            },
            error: function () {
                console.log("An error occurred");
            }
        });

        $(".js-content .trumbowyg.changed").each(function () {
            $(this).siblings(".js-content-save").click();
        })
    })
}

function bindTabHistory() {
    $(".nav-tabs .nav-link").on('show.bs.tab', function () {
        var stateObject = { url: $(this).attr('href') };

        if (window.location.hash && stateObject.url !== window.location.hash) {
            window.history.pushState(
                stateObject,
                document.title,
                window.location.pathname + $(this).attr('href')
            );
        } else {
            window.history.replaceState(
                stateObject,
                document.title,
                window.location.pathname + $(this).attr('href')
            );
        }
    });

    $(".nav-tabs .nav-link").each(function () {
        if ($(this).attr('href') === window.location.hash) {
            $(this).tab('show');
        };
    });

    window.addEventListener('popstate', function (event) {
        if (event.state) {
            $(".nav-tabs")
                .find('[href="' + event.state.url + '"]')
                .tab('show');
        }
    });
}

function bindQRSizes() {
    $(".js-qr-size-change").change(function (e) {
        var $ele = $(e.currentTarget);
        $($ele.data("target")).text($ele.val() * $("#qrBlockSize").val());
    });
}

function bindMetrics() {
    $('.js-metrics-tab').on('shown.bs.tab', function (e) {
        getMetrics();
    })

    $(".js-refresh-metrics").on("click", function (e) {
        e.preventDefault();
        getMetrics();
    });
}

function getMetrics() {
    console.log("Refreshing metrics");

    $(".js-refresh-metrics i").addClass("fa-spin");
    $(".js-refresh-metrics").addClass("disabled");

    $.getJSON("/admin/project/" + projectId + "/metrics").done(function (data) {
        $("#metric-views-value").text(data.views);
        $("#metric-unique-views-value").text(data.uniqueViews);
        $("#metric-nicknames-value").text(data.nicknameRegistrations);
        $("#metric-nicknames-percentage-value").text(data.nicknameRegistrationsPercentage + "%");
        $("#metric-asked-value").text(data.askedAQuestion);
        $("#metric-asked-percentage-value").text(data.askedAQuestionPercentage + "%");
        $("#metric-questions-value").text(data.totalQuestions);
        $("#metric-questions-percentage-value").text(data.totalQuestionsPercentage + "%");
        $(".js-refresh-metrics i").removeClass("fa-spin");

        var date = new Date();

        $(".js-last-updated").text();

        $(".js-metric-timeline li").remove();

        if (data.timeline && data.timeline.length > 0) {
            for (var i = 0; i < data.timeline.length; i++) {
                $(".js-metric-timeline").append($("<li>").text(data.timeline[i].time + " - " + data.timeline[i].count));
            }
        }

        setTimeout(function () {
            $(".js-refresh-metrics").removeClass("disabled");
        }, 5000);
    });

    function getFormattedTime(date) {
        return date.getHours() + ":" + date.getMinutes();
    }
}

function bindEventBrite() {
    showEventBriteTable();

    $(".js-refresh-event-brite").on("click", function (e) {
        e.preventDefault();
        refreshEventBrite();
    });
}

function showEventBriteTable() {
    $('#attendee-table').DataTable({
        "pageLength": 25
    });
}

function refreshEventBrite() {
    console.log("Refreshing event brite");

    $(".js-refresh-event-brite i").addClass("fa-spin");
    $(".js-refresh-event-brite").addClass("disabled");

    $.ajax("/admin/project/" + projectId + "/update-attendees").done(function (data) {
        $("#event-brite-tab").replaceWith(data);
        $("#event-brite-tab").addClass("active");
        bindEventBrite();
        $(".js-refresh-event-brite").addClass("disabled");
        setTimeout(function () {
            $(".js-refresh-event-brite").removeClass("disabled");
        }, 5000);
    });
}