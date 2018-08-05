var client;
var LANGUAGE = "en-US";
var API_KEY = "980b912fe1c34431922df7886d93551c"
var DIR_IMG = "./"
var speechActivity = document.getElementById("speechActivity");

function getKey() {
    return API_KEY;
}

function getLanguage() {
    return LANGUAGE;
}

function setText(text) {
    document.getElementById("output").value += text + "\n";
}

function start() {
    document.getElementById("startBtn").disabled = true;
    document.getElementById("stopBtn").disabled = false;
    document.getElementById("startImg").src = DIR_IMG + "waiting.gif";
    client.startMicAndContinuousRecognition();
}

function stop() {

    document.getElementById("startBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
    client.endMicAndContinuousRecognition();
    document.getElementById("startImg").src = DIR_IMG + "stop.png";
}

function createAndSetupClient() {
    document.getElementById("startBtn").disabled = false;

    if (client) {
        stop();
    }

    client = new BingSpeech.RecognitionClient(getKey(), getLanguage());

    client.onFinalResponseReceived = function (response) {
        console.log(response);
        setText(response.text);
        stop();
        executeCommand(response.text);

    }

    client.onError = function (code, requestId) {
        console.log("<Error with request n°" + requestId + ">");
    }

    client.onVoiceDetected = function () {
        document.getElementById("startImg").src = DIR_IMG + "listening.gif";
    }

    client.onVoiceEnded = function () {
        document.getElementById("startImg").src = DIR_IMG + "waiting.gif";
    }

}