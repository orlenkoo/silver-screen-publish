$(() => {
    $(".js-stream-type").on("change", (e) => {
        if ($(e.currentTarget).val() == "UserAccounts") {
            $(".js-parent-project").show();
        } else {
            $(".js-parent-project").hide();
        }
    })

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
        if (e.which == 13) {
            e.preventDefault();

            if ($(this).val() != "") {
                addTag($(this).val());
                $(this).val("");
            }
        }
    })

    $("#project-tags a").click(function () {
        $(this).remove();
        calcTags();
    })
});

function addTag(tagName) {
    var isExist = false;

    $("#project-tags a").each(function () {
        if ($(this).text() == tagName) isExist = true;
    })

    if (!isExist) {
        $("#project-tags").append($("<a href='#' style='margin-left:5px;'>" + tagName + "</a>").click(function () {
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