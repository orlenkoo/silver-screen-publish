$(() => {
    $("#btn-copy-select").click(function () {
        window.location.href = "/admin/project/add?projectIdToCopy=" + getCheckedProject();
    });

    $("#btn-archive-select").click(function () {
        window.location.href = "/admin/project/" + getCheckedProject() + "/archive";
    });

    $("#btn-unarchive-select").click(function () {
        window.location.href = "/admin/project/" + getCheckedProject() + "/restore";
    });

    $("#btn-delete-select").click(function () {
        window.location.href = "/admin/project/" + getCheckedProject() + "/delete";
    });

    $.get("/admin/project/tags", function (data) {
        $("#project-tag").autocomplete({
            source: data,
            select: function (event, ui) {
                addFilterTag(ui.item.value);
                filterTableByTag();
                $(this).val("")
                return false;
            }
        });
    })

    $("table .tag-clip").click(function () {
        addFilterTag($(this).text());
        filterTableByTag();
    })
});

function getCheckedProject() {
    var projectIds = "";

    $(".checkbox-project").each(function () {
        if ($(this).prop("checked") == true) {
            if (projectIds == "") {
                projectIds += $(this).attr("projectid");
            } else {
                projectIds = projectIds + "," + $(this).attr("projectid");
            }
        }
    })

    return projectIds;
}

function addFilterTag(tagName) {
    let isExist = false;

    $("#filter-tag .tag-clip").each(function () {
        if (tagName == $(this).find("span").text()) {
            isExist = true;
        }
    })

    if (!isExist) $("#filter-tag").append($("<div class='tag-clip'><span>" + tagName + "</span></div>").click(function () { $(this).remove(); filterTableByTag(); }))
}

function filterTableByTag() {
    if ($("#filter-tag .tag-clip").length > 0) {
        $("table tbody tr").hide();

        $("#filter-tag .tag-clip").each(function () {
            const tag = $(this).find("span").text();
            $("table tbody tr").each(function () {
                if ($(this).find(".tag-clip").text().includes(tag)) $(this).show();
            })
        })
    } else {
        $("table tbody tr").show();
    }
}