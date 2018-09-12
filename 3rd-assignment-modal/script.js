var nextPageToken = null;

// YOUTUBE AUTOCOMPLETE SUGGESTION LIST
function suggestList (event) {
    var api = {
        suggestUrl : "https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q="
    };
    var searchterm = document.getElementById('searchterm').value;
    if(event.keyCode == 13) {
        console.log("hello");
        getVideos();
    }
    else {
        loadVideo(api.suggestUrl+ searchterm ,"suggestQuery",true);
    }
}

//POP STATE EVENT TO CHAGNGE DATA
window.addEventListener('popstate',function(event) {
    document.getElementById('video-container').innerHTML = event.state.data;
});


function getVideos() {
    var api = {
        baseUrl : "https://www.googleapis.com/youtube/v3/search?key=AIzaSyCIJ1PTiC62SeDHcTHSq06RdyVoqhcsNuA&part=snippet&maxResults=10",
        query : "&q="
    };
    var searchterm = document.getElementById('searchterm').value;
    var url = api.baseUrl + api.query + searchterm;
    loadVideo(url, "searchQuery", true);
    window.onscroll = function() {
        if(window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            loadVideo(url + "&pageToken="+nextPageToken,"searchQuery",false);
        }
    } 
}

// PLAY VIDEO BUTTON & NEW STATE LOAD
function playVideo(videoId) {
    document.getElementById('video').src = "https://www.youtube.com/embed/" + videoId;
}

// LIKE BUTTON ON VIDEO
function like(button) {
  button.style.color = "red";
}

// STAR RATING ON VIDEO
function starRate(starNo,starObj) {
    var parentSpan = starObj.parentElement;
    var isFound = false;
    for(var i = 0; i < parentSpan.childNodes.length; i++) {
        if((parentSpan.childNodes[i].getAttribute('onclick')).includes(starNo)) {
          parentSpan.childNodes[i].style.color = 'orange';
          isFound = true;
        } 
        else if(isFound) {
            parentSpan.childNodes[i].style.color = 'black';
        }
        else {
            parentSpan.childNodes[i].style.color = 'orange';
        }
    }
}

// CREATE STAR RATING
function createStar () {
    var star = "<span><i class='fa fa-thumbs-up' onclick='like(this)'></i></span><span>";
    for (var i = 0; i < 5; i++) {
        star += "<span class='fa fa-star' onclick='starRate("+ i +",this)'></span>";
    }
    return star += "</span>";
}

// ARTICLE CONTENT CREATOR
function createArticleContent (img, description, title, videoId, starRating) {
    return "<img class='thumbnail' src="+img +" alt='' />"+
           "<h4 class='title'>"+title+"</h4>"+
           "<p class='description'>"+ description+"</p>" +
           "<hr/>" + starRating + "<div class='row'><button type='button' class='btn btn-primary' data-toggle='modal' data-target='#video-dialog' onclick=playVideo('" + videoId + "')>Play Now</button></div>";
}

// LOAD VIDEO FROM URL ( AJAX CALL)
function loadVideo(url, type, emptyContainer) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 ) {
// CHECK WHETHER SEARCH LIST OR SUGGEST LIST
            if (xmlHttp.status == 200) {
                if ( type == 'searchQuery' ) {
                    var jsonData = JSON.parse(xmlHttp.response);
                    nextPageToken = jsonData.nextPageToken;
                    if (emptyContainer){
                        document.getElementById ('video-container').innerHTML = "";
                    }
                    for ( var i = 0; i < jsonData.items.length; i++) {
                        var article = document.createElement("article");
                        article.setAttribute("class","col-4");
                        article.innerHTML = createArticleContent (
                                                    jsonData.items[i].snippet.thumbnails.medium.url,
                                                    jsonData.items[i].snippet.description,
                                                    (jsonData.items[i].snippet.title).substr(0,58) + "...",
                                                    jsonData.items[i].id.videoId,
                                                    createStar ()
                        );
                        document.getElementById('video-container').append(article);
                    }
                    var state = {data :""+document.getElementById('video-container').innerHTML};
                    history.replaceState ( state, "YouTube", "./");
                }
                else if ( type == 'suggestQuery' ) {
                    var res = xmlHttp.response;
                    var displaySuggest = document.getElementById('suggest');
                    suggest.innerHTML = "";
                    res = JSON.parse(res.substring(res.indexOf('['),res.lastIndexOf(']')+1));
                    for (var i = 0; i < res[1].length; i++) {
                        var opt = document.createElement('option');
                        opt.setAttribute ( 'value',(( ""+res[1][i][0]).split()).join('+'));
                        opt.append (document.createTextNode (res[1][i][0]));
                        displaySuggest.appendChild (opt);
                    }
                }
            }
            else if(xmlHttp.status == 400) {
            }
            else {
                console.log(xmlHttp);
            }
        }
    }
    xmlHttp.open("GET",url,true);
    xmlHttp.send();
}
