$(document).ready(function () {
  $(".saveArticle").click(function (event) {
    event.preventDefault();
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/saved/" + thisId
    }).done(window.location.reload());
  });

  $(".deleteSaved").click(function (event) {
    event.preventDefault();
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/saved/" + thisId + "/delete"
    }).done(window.location.reload());
  });

  $(".viewNotes").click(function (event) {
    event.preventDefault();
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    }).done(window.location.replace("/articles/" + thisId));
  });

  $(".deleteNote").click(function (event) {
    event.preventDefault();
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/notes/" + thisId + "/delete"
    }).done(window.location.reload());
  });

});