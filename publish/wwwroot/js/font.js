$(function () {

    bindS3Uploader();
    bindCopyToClipboard();
});

function bindS3Uploader () {

    $(".input-file-s3-font").change(function () {
        if ($(this)[0].files.length === 0) return;

        var $this = $(this);

        var formData = new FormData();
        formData.append("file", $(this)[0].files[0]);

        $.ajax({
            url: "/admin/upload/s3/font",
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
                    $this.next().next().val(data.size);
                } else {
                    alert(data.msg);
                    $this.val('');
                }
            }
        });
    })
}

function bindCopyToClipboard () {

    $(".btnCopyToClipboard").click(function () {
        navigator.clipboard.writeText($(this).attr("url"));
    });
}