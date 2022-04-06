$(() => {
    $(".js-stream-type").on("change", (e) => {
        if ($(e.currentTarget).val() == "UserAccounts") {
            $(".js-parent-project").show();
        } else {
            $(".js-parent-project").hide();
        }
    })
});