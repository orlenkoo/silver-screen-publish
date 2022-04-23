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