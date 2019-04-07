
const api_key = '1ef8fe13ea083d77de52adb8da491377';

//Output functions
function showRecommendationsMovie (data) {
  var html = '<h2>Recommendations</h2>'

  for (var i = 0; i < data['results'].length / 2; i++) {
    html += "<span class='spanlink' onclick='movieFromId(" + data['results'][i]['id'] + ")'>"
      + data['results'][i]['title'] + '</span>'
    html += '<br>'
  }
  document.getElementById('text').innerHTML += html
}

function showRecommendationsTV (data) {
  var html = '<h2>Recommendations:</h2>'

  for (var i = 0; i < data['results'].length / 2; i++) {
    html += "<span class='spanlink' onclick='TVFromId(" + data['results'][i]['id'] + ")'>"
      + data['results'][i]['name'] + '</span>'
    html += '<br>'
  }
  document.getElementById('text').innerHTML += html
}

function showList (data) {
  var html = ''

  for (var i = 0; i < data['results'].length; i++) {
    html += '<br>'
    if (data['results'][i]['title'] != undefined) {
      html += "<span class='spanlink' onclick='movieFromId(" + data['results'][i]['id'] + ")'>"
      + data['results'][i]['title'] + '</span>'
    } else {
      html += "<span class='spanlink' onclick='TVFromId(" + data['results'][i]['id'] + ")'>"
       + data['results'][i]['name'] + '</span>'
    }
  }

  document.getElementById('text').innerHTML = html
}

function showDetailMovie (data) {
  var html = "<h1 align = 'center'>" + data['title'] + '</h1>'

  html += '<h3>' + data['overview'] + '</h3>'
  html += "<img src='http://image.tmdb.org/t/p/w500//" + data['poster_path'] + "'/>"
  html += '<p> vote average = ' + data['vote_average'] + '</p>'
  html += '<p> vote count = ' + data['vote_count'] + '</p>'
  html += '<ul></ul>'
  document.getElementById('text').innerHTML = html

  recommendationsMovie(data['id'])
}

function showDetailTV (data) {
  var html = "<h1 align='center' >" + data['name'] + '</h1>'

  html += '<h3>' + data['overview'] + '</h3>'
  html += "<img src='http://image.tmdb.org/t/p/w500//" + data['poster_path'] + "'/>"
  html += '<p> vote average = ' + data['vote_average'] + '</p>'
  html += '<p> vote count = ' + data['vote_count'] + '</p>'
  html += '<ul></ul>'
  document.getElementById('text').innerHTML = html

  recommendationsTV(data['id'])
}

//Search function
function searchByName () {
  var query = document.getElementById('searchQuery').value
  query = trim(query)
  if (query != '') {
    if(document.getElementById('searchMovie').checked == true){
       searchMovie(query);
  }else {
      searchTV(query);
  }
  } else {
    trending()
  }
  document.getElementById('searchQuery').value = ''
}

//API functions
function get (url, callback) {
  var xmlhttp = new XMLHttpRequest()
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log('responseText:' + xmlhttp.responseText)
      try {
        var data = JSON.parse(xmlhttp.responseText)
      } catch (err) {
        console.log(err.message + ' in ' + xmlhttp.responseText)
        return
      }
      callback(data)
    }
  }

  xmlhttp.open('GET', url, true)
  xmlhttp.send()
}

function trending () {
  get('https://api.themoviedb.org/3/trending/all/day?api_key=' + api_key, function (data) {
    showList(data)
  })
}

function movieFromId (id) {
  get('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + api_key, function (data) {
    showDetailMovie(data)
  })
}
function TVFromId (id) {
  get('https://api.themoviedb.org/3/tv/' + id + '?api_key=' + api_key + '&language=en-US&page=1', function (data) {
    showDetailTV(data)
  })
}

function recommendationsMovie (id) {
  get('https://api.themoviedb.org/3/movie/' + id + '/recommendations?api_key=' + api_key + '&language=en-US&page=1', function (data) {
    showRecommendationsMovie(data)
  })
}

function recommendationsTV (id) {
  get('https://api.themoviedb.org/3/tv/' + id + '/recommendations?api_key=' + api_key + '&language=en-US&page=1', function (data) {
    showRecommendationsTV(data)
  })
}

function searchMovie(query) {
  get('https://api.themoviedb.org/3/search/movie?api_key=' + api_key + '&language=en-US&query='
    + query + '&page=1&include_adult=true', function (data) {
    showList(data);
  })
}

function searchTV(query) {
  get('https://api.themoviedb.org/3/search/tv?api_key=' + api_key + '&language=en-US&query='
    + query + '&page=1&include_adult=true', function (data) {
    showList(data);
  })
}

// function removes whitespace from both sides of a string
function trim (text) {
  return text.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
}
