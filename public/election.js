// election page
var positionHeight = $(".position-dropdown-menu").css("height");
$(".positions").hide();
$(".position-dropdown-menu").css("height", positionHeight);
$(".position-dropdown-button").click(function() {
  $(".positions").slideToggle();
})
