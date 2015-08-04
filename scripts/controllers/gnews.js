google.load('search', '1');

      var newsSearch;

      function searchComplete() {

          var container = document.getElementById('gnews-div');
          container.innerHTML = '';

          if (newsSearch.results && newsSearch.results.length > 0) {
              for (var i = 0; i < newsSearch.results.length; i++) {

                  // Create HTML elements for search results
                  var p = document.createElement('p');
                  var gimg = document.createElement('gimg');
                  var gtitle = document.createElement('gtitle');
                  var gcontent = document.createElement('gcontent');
                  var gpubdate = document.createElement('gpubdate');
                  var gpub = document.createElement('gpub');
                  var gloc = document.createElement('gloc');
                  var gurl = document.createElement('gurl');
                  var glang = document.createElement('glang');


                  gimg.innerHTML = '<img style="width:60px;height:60px;" src=\"' + newsSearch.results[i].image.url + '\">'
                  gtitle.innerHTML = "<h2>" + newsSearch.results[i].title; + "</h2>"
                  gcontent.innerHTML = "<p>" + newsSearch.results[i].content; + "</p>"
                  gpubdate.innerHTML = "<p>Published on: " + newsSearch.results[i].publishedDate; + "</p>"
                  gpub.innerHTML = "<p>Published by: " + newsSearch.results[i].publisher; + "</p>"
                  gloc.innerHTML = "<p>Location: " + newsSearch.results[i].location; + "</p>"
                  gurl.innerHTML = "<p>Visit: " + newsSearch.results[i].signedRedirectUrl; + "</p>"
                  glang.innerHTML = "<p>Published language: " + newsSearch.results[i].language; + "</p>"




                  // Append search results to the HTML nodes
                  p.appendChild(gimg);
                  p.appendChild(gtitle);
                  p.appendChild(gcontent);
                  p.appendChild(gpubdate);
                  p.appendChild(gpub);
                  p.appendChild(gloc);
                  p.appendChild(gurl);
                  p.appendChild(glang);
                  container.appendChild(p);
              }
          }
      }

      function gnewsextract(text) {
          var gnewsfeed = document.getElementById('gnewsrequest').value;
          // Create a News Search instance.
          newsSearch = new google.search.NewsSearch();

          // Set searchComplete as the callback function when a search is 
          // complete.  The newsSearch object will have results in it.
          newsSearch.setSearchCompleteCallback(this, searchComplete, null);

          // Specify search quer(ies)
          newsSearch.execute(gnewsfeed);

          // Include the required Google branding
          google.search.Search.getBranding('branding');
      }

      // Set a callback to call your code when the page loads
      google.setOnLoadCallback(gnewsextract);
