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
      var htmlString = "<h2 class='margin-bot list-form'>Which list would you like to input this Bookmark Into?</h2><form class='book-name'><label for='name'>Bookmark Name  </label><input type='text'name='name'><input type='submit'></form><br><select>"
      for (var i=0; i < list.length; i++){
        htmlString += "<option value=" + list[i][1] + ">" + list[i][0] + "</option>";
      }
      htmlString += "</select>";
      $('.list').html(htmlString);
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

   console.log("I just made the request")

   request.done(function(response){
    $('.list').html('<h2>Bookmark Saved Successfully</h2>');

   });

  });
  //   var url = "http://localhost:3000/extension/lists"
  //   var data = {
  //     user_id: localStorage["user_id"],
  //   };


  //   var request = $.ajax({
  //     url: url,
  //     method: 'post',
  //     data: params
  //   });

  // }



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
      debugger;
      localStorage["user_id"] = user_id

      $('.form').replaceWith('<h2>Login Successful!</h2><p>Please reopen extension to see your lists</p>');
    });

  });

});

// beforeSend: function(xhr) {
//         request.setRequestHeader("XSRF-TOKEN", token)

// $.ajax({url: "http://localhost:3000/extension/login", method: "post", data: {user: { username: "kevin", password: "kevin" }}, beforeSend: function(xhr) {xhr.setRequestHeader("XSRF-TOKEN", "OenW57yRtUnQYNS2fxTnKRvFSIQH1bDOw8NWOi8o4Z8/OFNjTu/MQ3j5nuz/QAAFjW6KSHCmZ/Jls8wibjO9pg==")}});
// FIGURE OUT HOW TO GET CURRENT URL

//  // * @param {function(string)} callback - called when the URL of the current tab
//  // *   is found.
//  // */
// function getCurrentTabUrl(callback) {
//   // Query filter to be passed to chrome.tabs.query - see
//   // https://developer.chrome.com/extensions/tabs#method-query
//   var queryInfo = {
//     active: true,
//     currentWindow: true
//   };

//   chrome.tabs.query(queryInfo, function(tabs) {
//     // chrome.tabs.query invokes the callback with a list of tabs that match the
//     // query. When the popup is opened, there is certainly a window and at least
//     // one tab, so we can safely assume that |tabs| is a non-empty array.
//     // A window can only have one active tab at a time, so the array consists of
//     // exactly one tab.
//     var tab = tabs[0];

//     // A tab is a plain object that provides information about the tab.
//     // See https://developer.chrome.com/extensions/tabs#type-Tab
//     var url = tab.url;

//     // tab.url is only available if the "activeTab" permission is declared.
//     // If you want to see the URL of other tabs (e.g. after removing active:true
//     // from |queryInfo|), then the "tabs" permission is required to see their
//     // "url" properties.
//     console.assert(typeof url == 'string', 'tab.url should be a string');

//     callback(url);
//   });

//   // Most methods of the Chrome extension APIs are asynchronous. This means that
//   // you CANNOT do something like this:
//   //
//   // var url;
//   // chrome.tabs.query(queryInfo, function(tabs) {
//   //   url = tabs[0].url;
//   // });
//   // alert(url); // Shows "undefined", because chrome.tabs.query is async.
// }

// /**
//  * @param {string} searchTerm - Search term for Google Image search.
//  * @param {function(string,number,number)} callback - Called when an image has
//  *   been found. The callback gets the URL, width and height of the image.
//  * @param {function(string)} errorCallback - Called when the image is not found.
//  *   The callback gets a string that describes the failure reason.
//  */
// function getImageUrl(searchTerm, callback, errorCallback) {
//   // Google image search - 100 searches per day.
//   // https://developers.google.com/image-search/
//   var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
//     '?v=1.0&q=' + encodeURIComponent(searchTerm);
//   var x = new XMLHttpRequest();
//   x.open('GET', searchUrl);
//   // The Google image search API responds with JSON, so let Chrome parse it.
//   x.responseType = 'json';
//   x.onload = function() {
//     // Parse and process the response from Google Image Search.
//     var response = x.response;
//     if (!response || !response.responseData || !response.responseData.results ||
//         response.responseData.results.length === 0) {
//       errorCallback('No response from Google Image search!');
//       return;
//     }
//     var firstResult = response.responseData.results[0];
//     // Take the thumbnail instead of the full image to get an approximately
//     // consistent image size.
//     var imageUrl = firstResult.tbUrl;
//     var width = parseInt(firstResult.tbWidth);
//     var height = parseInt(firstResult.tbHeight);
//     console.assert(
//         typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
//         'Unexpected respose from the Google Image Search API!');
//     callback(imageUrl, width, height);
//   };
//   x.onerror = function() {
//     errorCallback('Network error.');
//   };
//   x.send();
// }

// function renderStatus(statusText) {
//   document.getElementById('status').textContent = statusText;
// }

// document.addEventListener('DOMContentLoaded', function() {
//   getCurrentTabUrl(function(url) {
//     // Put the image URL in Google search.
//     renderStatus('Performing Google Image search for ' + url);

//     getImageUrl(url, function(imageUrl, width, height) {

//       renderStatus('Search term: ' + url + '\n' +
//           'Google image search result: ' + imageUrl);
//       var imageResult = document.getElementById('image-result');
//       // Explicitly set the width/height to minimize the number of reflows. For
//       // a single image, this does not matter, but if you're going to embed
//       // multiple external images in your page, then the absence of width/height
//       // attributes causes the popup to resize multiple times.
//       imageResult.width = width;
//       imageResult.height = height;
//       imageResult.src = imageUrl;
//       imageResult.hidden = false;

//     }, function(errorMessage) {
//       renderStatus('Cannot display image. ' + errorMessage);
//     });
//   });
// });