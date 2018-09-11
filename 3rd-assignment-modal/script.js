var nextPageToken = null;

function suggestList(event) {
    var api = {
        suggestUrl : "https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q="
    };
    var searchterm = document.getElementById('searchterm').value;
    if(event.keyCode == 13) {
        console.log("hello");
        searchList();
    }
    else {
        sendHttpRequest(api.suggestUrl+ searchterm ,"suggestQuery",true);
    }
}

function searchList() {
    var api = {
        baseUrl : "https://www.googleapis.com/youtube/v3/search?key=AIzaSyCIJ1PTiC62SeDHcTHSq06RdyVoqhcsNuA&part=snippet&maxResults=10",
        query : "&q="
    };
    var searchterm = document.getElementById('searchterm').value;
    var url = api.baseUrl + api.query + searchterm;
    sendHttpRequest(url,"searchQuery",true);
    window.onscroll = function() {
        if(window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            sendHttpRequest(url + "&pageToken="+nextPageToken,"searchQuery",false);
        }
    } 
}

function playVideo(videoId) {
    history.pushState({},"Playing",window.location.href+"?v="+videoId);

    var videoUrl = document.getElementById('video');
    videoUrl.src = 'https://www.youtube.com/embed/'+videoId;
}

function like(button) {
  button.style.color = "red";
}

function starRate(starNo,starObj) {
    var parent = starObj.parentElement;
    var isFound = false;
    for(var i = 0; i < parent.childNodes.length; i++) {
        if((parent.childNodes[i].getAttribute('onclick')).includes(starNo)) {
          parent.childNodes[i].style.color = 'orange';
          isFound = true;
        } 
        else if(isFound) {
            parent.childNodes[i].style.color = 'black';
        }
        else {
            parent.childNodes[i].style.color = 'orange';
        }
    }
}

function sendHttpRequest(url, type, flush) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if(xmlHttp.readyState == 4) {
            if(xmlHttp.status == 200) {
                if( type == 'searchQuery') {
                    var httpRequestObj = JSON.parse(xmlHttp.response);
                    nextPageToken = httpRequestObj.nextPageToken;
                    if(flush){
                        document.getElementById('video-container').innerHTML = "";
                    }

                    var starRating = "<span><i class='fa fa-thumbs-up' onclick='like(this)'></i></span>";
                    starRating += "<span>";
                    for(var i = 0; i < 5; i++) {
                        starRating += "<span class='fa fa-star' onclick='starRate("+ i +",this)'></span>";
                    }
                    starRating += "</span>";
                    for(var i = 0; i < httpRequestObj.items.length; i++) {
                        var img = httpRequestObj.items[i].snippet.thumbnails.medium.url;
                        var title = (httpRequestObj.items[i].snippet.title).substr(0,58) + "...";
                        var description = (httpRequestObj.items[i].snippet.description);
                        var videoId = httpRequestObj.items[i].id.videoId;   
                        var article = document.createElement("article");
                        
                        article.setAttribute("class","col-4");
                        article.innerHTML = "<img class='thumbnail' src="+img +" alt='' />"+
                          "<h4 class='title'>"+title+"</h4>"+
                          "<p class='description'>"+ description+"</p>" + "<hr/>" + starRating + "<div class='row'><button type='button' class='btn btn-primary' data-toggle='modal' data-target='#video-dialog' onclick=playVideo('" + videoId + "')>Play Now</button></div>";
                        document.getElementById('video-container').append(article);
                    }
                }
                else if( type == 'suggestQuery' ) {
                    var res = xmlHttp.response;
                    res = JSON.parse(res.substring(res.indexOf('['),res.lastIndexOf(']')+1));
                    var displaySuggest = document.getElementById('suggest');
                    suggest.innerHTML = "";
                    for(var i = 0; i < res[1].length; i++) {
                        var opt = document.createElement('option');
                        opt.setAttribute('value',((""+res[1][i][0]).split()).join('+'));
                        opt.append(document.createTextNode(res[1][i][0]));
                        displaySuggest.appendChild(opt);
                    }
                }
            }
            else if(xmlHttp.status == 400) {
                alert('not found');
            }
            else {
                alert('something went wrong');
            }
        }
    }
  xmlHttp.open("GET",url,true);
  xmlHttp.send();
}
