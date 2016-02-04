var current = ""

$(document).ready(function(){
  var user_id = null

  chrome.windows.getCurrent(function(w) {
    chrome.tabs.getSelected(w.id,
      function (response){
       // window.current = response.url;
       current = response.url;
    });
  });

  if (typeof localStorage["user_id"] == 'string'){
    var params = {user_id:localStorage["user_id"]};
    var url = "http://localhost:3000/extension/lists";

    var request = $.ajax({
      url: url,
      method: 'post',
      data: params
      });

    request.done(function(response){
      var list = response.listArray;
      var htmlString = "<h3 class='margin-bot list-form'>Which list would you like to input this Bookmark Into?</h3><form class='book-name'><label for='name'>Bookmark Name  </label><input class='marg-left' type='text'name='name'><input class='marg-left' type='submit'></form><br><select>"
      for (var i=0; i < list.length; i++){
        htmlString += "<option value=" + list[i][1] + ">" + list[i][0] + "</option>";
      }
      htmlString += "</select>";
      $('.list').html(htmlString);
      $('.logout').show();
    });

  } else {
    $('.form').css('display', 'block');
  };


  $('.list').on('submit', function(e){
    e.preventDefault();
    var list_id = $('select').val();
    var bookName = $('.book-name').serialize();

    var params = {list_id:list_id,
                  bookmark_name:bookName,
                  my_url:current
                  };
    var url = 'http://localhost:3000/extension/bookmark'

   var request = $.ajax({
    url: url,
    method: 'post',
    data: params
    });

   request.done(function(response){
    $('.list').html('<h2>Bookmark Saved Successfully</h2>');

   });

  });

  $('.logout').on('submit', function(e){
    e.preventDefault();
    localStorage.clear();

    $('.list').html("");
    $('.form').css('display', 'block');
    $('.logout').css('display', 'none');

  });


  $('#login').on('submit', function(e){
    e.preventDefault();
    var params = $(this).serialize();
    var url = "http://localhost:3000/extension/login"

    var request = $.ajax({
      url: url,
      method: 'post',
      data: params
      });

    request.done(function (response){
      user_id = response.user_id;
      localStorage["user_id"] = user_id

      $('.form').replaceWith('<h2>Login Successful!</h2><p>Please reopen extension to see your lists</p>');
    });

  });

});