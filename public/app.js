$( document ).ready(function() {
  $(".saveArticle").click(function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/saved/" + thisId
    }).done(window.location.replace("/"));
  });
  
  $(".deleteSaved").click(function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/saved/" + thisId + "/delete"
    }).done(window.location.replace("/"));
  });
  
  $(".addNote").click(function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId
    }).done(window.location.replace("/"));
  });
});