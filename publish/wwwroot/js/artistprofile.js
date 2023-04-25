$(function () {

    bindArtistProfile();
});

function bindArtistProfile() {

    $(".row>input[type=hidden]").each(function () {
        $this = $(this);
        if ($(this).val() != null && $(this).val() != '') {
            try {
                var val = JSON.parse($(this).val());
                val.forEach(function (item) {
                    $this.parent().find(".col-6>input[language=" + item['language'] + "]").val(item['content']);
                })
            }
            catch (err) {
                console.log("error happened")
            }
        }
    })

    $(".input-artistprofile").change(function () {

        var inputs = $(this).parent().parent().find(".col-6>input");
        var input = $(this).parent().parent().find("input[type=hidden]");
        var val = [];

        inputs.each(function () {
            val.push({ language: $(this).attr('language'), content: $(this).val() });
        })

        input.val(JSON.stringify(val));
    })
}
