$(function () {

    bindSuperUserRole();
});

function bindSuperUserRoleActions(tr) {

    var projectId = tr.attr("projectId");

    tr.find(".btn_all").click(function () {
        tr.find("td>input").prop('checked', true);
    })

    tr.find(".btn_none").click(function () {
        tr.find("td>input").prop('checked', false);
    })

    tr.find(".btn_save").click(function (e) {
        e.preventDefault();
        var data = tr.find("input").serialize({ checkboxesAsBools: true });

        $.ajax({
            type: "POST",
            url: `/admin/super-users/edit/${superUserId}/${projectId}`,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: data,
            success: function (response) {
                if (response.success) {
                    $("#alert-container").html("<div class='alert alert-success' role='alert'>" + response.msg + "</div>");
                } else {
                    $("#alert-container").html("<div class='alert alert-danger' role='alert'>" + response.msg + "</div>");
                }
            },
            error: function () {
                console.log('Failed to save');
            }
        })
    })

    tr.find(".btn_remove").click(function () {

        $.ajax({
            type: "POST",
            url: `/admin/super-users/edit/${superUserId}/${projectId}/remove`,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function (response) {
                if (response.success) {
                    tr.remove();
                } else {
                    console.log("Failed to remove")
                }
            },
            error: function () {
                console.log('Failed to remove');
            }
        })
    })
}

function bindSuperUserRole() {

    $("tbody tr").each(function () {
        bindSuperUserRoleActions($(this));
    })

    $(".add_project_to_user").click(function () {

        var projectId = $(this).attr("projectId");
        var projectName = $(this).attr("projectName");

        if ($("tbody tr[projectId=" + projectId + "]").length > 0) {
            alert("This project already added");
            return;
        }

        $("tbody").append("<tr projectId='" + projectId + "'><td>" + projectName + "</td><td><input type='checkbox' name='Users' /></td><td><input type='checkbox' name='Settings' /></td><td><input type='checkbox' name='Contents' /></td><td><input type='checkbox' name='Images' /></td><td><input type='checkbox' name='Streams' /></td><td><input type='checkbox' name='Chat' /></td><td><input type='checkbox' name='Metrics' /></td><td><input type='checkbox' name='Languages' /></td><td><input type='checkbox' name='CustomStrings' /></td><td><input type='checkbox' name='Emails' /></td><td><input type='checkbox' name='IFrame' /></td><td><input type='checkbox' name='Preview' /></td><td><button class='btn btn-primary btn_all'>All</button> <button class='btn btn-primary btn_none'>None</button> <button class='btn btn-primary btn_save'>Save</button> <button class='btn btn-primary btn_remove'>Remove</button></td></tr>");
        bindSuperUserRoleActions($("tbody tr[projectId=" + projectId + "]"));
    })
}
