/*
    REQUIRES:
    BingSpeech.js
    fuzzyset.js
*/

var bingRecognitionClient = null;
var bingClientTTS = null;

var btnStatus = false;
var LANGUAGE = "en-US";
var API_KEY = "980b912fe1c34431922df7886d93551c"
var DIR_IMG = "./img/"
var IMG = {
    "WAITING":"waiting.gif",
    "STOP_STILL":"stop.png",
    "STOP_BREATHING":"stop.gif",
    "LISTENING":"listening.gif"
}

setCortanaBtnOnHover();

/* ---------- Getters */
function getKey() {
    return API_KEY;
}

function getLanguage() {
    return LANGUAGE;
}

function setText(text) {
    document.getElementById("output").value += text + "\n";
}

function setCortanaBtnImage(imgFn){
    document.getElementById("cortanaImg").src = DIR_IMG + imgFn;
}

function setCortanaBtnOnHover(){
    var img = document.getElementById('cortanaImg');
    // default image
    setCortanaBtnImage(IMG.STOP_STILL);

    img.onmouseover = function () {
        if(!btnStatus)
            setCortanaBtnImage(IMG.STOP_BREATHING);
    };

    img.onmouseout = function () {
        if(!btnStatus)
            setCortanaBtnImage(IMG.STOP_STILL);
    };
}

function runVoice(){
    if(btnStatus){
        stop();
        btnStatus = false;
        return;
    }
    start();
    btnStatus = true;
}

function start() {
    createAndSetupClient();
    setCortanaBtnImage(IMG.WAITING);
    bingRecognitionClient.startMicAndContinuousRecognition();
}

function stop() {
    bingRecognitionClient.endMicAndContinuousRecognition();
    setCortanaBtnImage(IMG.STOP_STILL);
}

function createAndSetupClient() {
    if (bingRecognitionClient) {
        return;
    }

    bingRecognitionClient = new BingSpeech.RecognitionClient(getKey(), getLanguage());

    bingRecognitionClient.onFinalResponseReceived = function (response) {
        console.log(response);
        setText(response.text);
        executeCommand(response.text);
        runVoice();

    }

    bingRecognitionClient.onError = function (code, requestId) {
        console.log("<Error with request n°" + requestId + ">");
    }

    bingRecognitionClient.onVoiceDetected = function () {
        setCortanaBtnImage(IMG.LISTENING);
    }

    bingRecognitionClient.onVoiceEnded = function () {
        setCortanaBtnImage(IMG.WAITING);
    }

}

function getBingTTSClient(){
    if(bingClientTTS == null){
        bingClientTTS = new BingSpeech.TTSClient(API_KEY);
        bingClientTTS.multipleXHR = false;
        return bingClientTTS;
    }
    else{
        return bingClientTTS;
    }
}

function sentencesToSpeech(sentences){
    for (var i =0; i<sentences.length;i++){
        getBingTTSClient().synthesize(sentences[i]);
    }
}

