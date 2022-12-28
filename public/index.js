// dropdown-menu
$(".drop-menu").hide();
$(".dropdown-line").hide();
$(".dropdown-btn").click(function() {
  $(".drop-menu").slideToggle();
  $(".dropdown-line").slideToggle();
});

// home title
$(".intro").css("visibility", "hidden");
$("#title").hide(1);
$("#title").fadeIn(3000);
setTimeout(function() {
  $(".intro #a").hide(1);
  $(".intro #a").css("visibility", "visible");
  $(".intro #a").fadeIn(1500);
}, 2500);
setTimeout(function() {
  $(".intro #c").hide(1);
  $(".intro #c").css("visibility", "visible");
  $(".intro #c").fadeIn(1500);
}, 4000);
setTimeout(function() {
  $(".intro #t").hide(1);
  $(".intro #t").css("visibility", "visible");
  $(".intro #t").fadeIn(1500);
}, 5500);
