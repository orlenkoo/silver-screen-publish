const projectId = $("#projectId").val();

$(function () {
    $('#user-table').DataTable({
        "pageLength": 25
    });

    $('#datetimepicker').datetimepicker({ sideBySide: true, allowInputToggle: true, format: "DD MMM yyyy HH:mm" });

    bindContentAdd();
    bindContentRemove();
    bindQRSizes();
    bindMetrics();
    bindTabHistory();
    bindEventBrite();
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
});

function RollIframeStyle(isIframe) {
    if (isIframe) {
        $("#iframe-tab input[name=HideHeader]").removeAttr("disabled");
        $("#iframe-tab input[name=HideFooter]").removeAttr("disabled");
        $("#iframe-tab input[name=FullWidth]").removeAttr("disabled");
    } else {
        $("#iframe-tab input[name=HideHeader]").attr("disabled", true);
        $("#iframe-tab input[name=HideFooter]").attr("disabled", true);
        $("#iframe-tab input[name=FullWidth]").attr("disabled", true);
    }
}

function bindContentAdd() {
    $(".js-content-property").on("change", function (e) {
        $(".js-content").attr("placeholder", $(".js-content-property option:selected").data("default-value"));
    });

    $(".js-content-submit").off("click").on("click", function (e) {
        e.preventDefault();
        var name = $(".js-content-property").val();
        $(".js-content-property").removeClass("is-invalid");
        $(".js-content").removeClass("is-invalid");

        if (!name) {
            $(".js-content-property").addClass("is-invalid");
        }

        var content = $(".js-content").val();

        if (!content) {
            $(".js-content").addClass("is-invalid");
        }

        if (!name || !content)
            return;

        $.ajax({
            type: "POST",
            url: `/project/${projectId}/contents/add`,
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                content: content
            }),
            success: function (response) {
                $(".js-contents-table").html(response);
                bindContentRemove();
                $(".js-content-property").val("");
                $(".js-content").val("");
            },
            error: function () {
                alert("An error occurred");
            }
        });
    });
}

function bindContentRemove() {
    $(".js-remove-content").off("click").on("click", function (e) {
        let projectContentId = $(e.currentTarget).data("id");
        $.ajax({
            type: "POST",
            url: `/project/${projectId}/contents/${projectContentId}/remove`,
            success: function (response) {
                $(".js-contents-table").html(response);
                bindContentRemove();
            },
            error: function () {
                alert("An error occurred");
            }
        });

    });
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