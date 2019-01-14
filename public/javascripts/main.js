var socket = io();

var progressBar = $("#progressBar");

let progressBarWidth;
let videoId;


/*
$("#previewIframe").load(function () {
    console.log("load");
});
*/

window.onload = function () {

    console.log(progressBar);

    socket.on("correctURL", function (videoID) {
        console.log(videoID);
        videoId = videoID;
        $("#downloadButton").removeClass("disabled");
        setIframe(videoID);
    });


    $("#HTTPLinkInput").on("keyup", function () {
        // console.log("db")
        checkURL($(this).val());

    });


    setInterval(function () {
        checkURL( $("#HTTPLinkInput").val());
    }, 3000);

    $("#downloadButton").on('click', function(){
        // let videoId = checkURL($("#HTTPLinkInput").val());
        // if(videoId === null) return;
        if(videoId) {
            $("#downloadButton").addClass("disabled");
            $("#downloadButton").text("Downloading...");
            sendURL(videoId);
        }
    })

};

window.onresize = function(){
    setProgressBarWidth(progressBarWidth);
};


checkURL = function (link) {

    socket.emit("checkURL", link);

};

setProgressBarWidth = function(value){
    progressBarWidth = value;

    let total = window.innerWidth;
    let partial = total * value / 100;
    console.log(total, value, partial);
    $("#progressBar").width(partial);
};

setIframe = function(videoID){

    let _iframe = document.getElementById("previewIframe");
    let jiframe = $("#previewIframe");

    if(videoID === null && videoID === videoId){
        _iframe.setAttribute("src", "");

        jiframe.removeClass("embed-responsive-item");
        jiframe.parent().removeClass("embed-responsive");
        jiframe.parent().removeClass("embed-responsive-16by9");
        jiframe.addClass("d-none")
    } else {
        _iframe.setAttribute("src", "https://www.youtube.com/embed/"+ videoID);

        jiframe.addClass("embed-responsive-item");
        jiframe.parent().addClass("embed-responsive");
        jiframe.parent().addClass("embed-responsive-16by9");
        jiframe.removeClass("d-none")
    }


};

socket.on("progress", function(progress) {
    setProgressBarWidth(progress.progress.percentage);
    // console.log(progress);
});

socket.on("file", function(data) {
    console.log(data)
    $("#downloadButton").removeClass("disabled");
    $("#downloadButton").text("Download");
    window.open(location.href + data);
    setProgressBarWidth(0);
});

sendURL = function(value) {
    socket.emit('download', value)
}