var socket = io();

var progressBar = $("#progressBar");

window.onload = function () {

    clearPage();

    socket.on("correctURL", function (videoID) {
        setupPage(videoID);
    });



    document.getElementById("downloadButton").onclick = function(){
        console.log("Button onclick setup");

        if($(this).hasClass("disabled")){
            console.log("NOPE");
            return;
        }

        let button = document.getElementById("downloadButton");
        let videoID = button.getAttribute("data-download");

        $("#downloadButton").addClass("disabled");
        $("#downloadButton").text("Downloading...");
        sendURL(videoID);
    };


    $("#HTTPLinkInput").on("keyup", function () {
        checkURL($(this).val());
    });

    $("#HTTPLinkInput").on("change", function () {
        checkURL($(this).val());
    });

};

linkToVideoId = function(link){
    console.log("linkToVideoId: " + link);
//    https: / / www.youtube.com / watch?v=zQ8dDxnsGRI
    let r = link.split('/')[3];
    r = r.split("=")[1];
    console.log("linkToVideoId: return " + r);
    return r;
}

// window.onresize = function(){
//     setProgressBarWidth(progressBarWidth);
// };


checkURL = function (link) {

    console.log("checkURL " + link);

    if(link === ""){
        console.log("link is ''");
        clearPage();
        return;
    }
    setupPage(linkToVideoId(link));
};

setProgressBarWidth = function(value){

    $("#progressBar").show();
    $("#progressBarContainer").show();
    $("#progressBar").show();
    let total = document.body.offsetWidth;
    let partial = total * value / 100;
    console.log(total, value, partial);
    $("#progressBar").width(partial);
    $("#progressBar").text(value.toFixed(2) + "%");

};

progressBarReset = function(){
    setProgressBarWidth(0);
    $("#progressBarContainer").hide();
};

setIframe = function(videoID){
    let _iframe = document.getElementById("previewIframe");
    _iframe.setAttribute("src", "https://www.youtube.com/embed/"+ videoID);
    $("#iFrameContainer").show();

};

clearIframe = function(){
    $("#iFrameContainer").hide();
}

socket.on("progress", function(progress) {
    setProgressBarWidth(progress.progress.percentage);
    // console.log(progress);
});

createListItem = function(data){
    let title = data.name;
    let file = data.file;
    console.log("createListItem: ", data);
    let value =  "<li class=\"list-group-item mt-3\"><a class=\"text-dark\" target=\"_blank\" href='" + file + "'>Download "+ title +"</a></li>";
    $("#URLList").append(value);
}

socket.on("mp3Link", function(data) {
    console.log(data);
    if(data == null) return displayError("null came as response from Server.");
    $("#downloadButton").removeClass("disabled");
    $("#downloadButton").text("Download");
    // window.open(location.href + data);
    createListItem(data);
    progressBarReset();
});

sendURL = function(value) {
    socket.emit('download', value)
};


displayError = function (str) {
    // alert with str as error string.
}

setupDownloadButton = function(videoID){
    let b = document.getElementById("downloadButton");
    b.setAttribute("data-download", videoID);
    b.classList.remove("disabled");
};

clearDownloadButton = function(){
    let b = document.getElementById("downloadButton");
    b.classList.add("disabled");

}

setupPage = function (videoID) {
    setIframe(videoID);
    setupDownloadButton(videoID);
}

clearPage = function(){
    progressBarReset();
    clearIframe();
    clearDownloadButton();

};