$(window).load(function () {
    $("#btn").click(() => {
        const classes = $("#arrow").attr("class");
        if (classes === "glyphicon glyphicon-menu-down") {
            $("html, body").animate({ scrollTop: $(document).height() }, 1000);
            return $("#arrow").removeClass("glyphicon-menu-down").addClass("glyphicon-menu-up");
        }
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return $("#arrow").removeClass("glyphicon-menu-up").addClass("glyphicon-menu-down");
    })
});
