var API_KEY = "980b912fe1c34431922df7886d93551c"
var bingClientTTS = new BingSpeech.TTSClient(API_KEY);
document.getElementById("speakBtn").addEventListener("click", function () {
    bingClientTTS.multipleXHR = document.getElementById("multipleXHRChk").checked;
    bingClientTTS.synthesize("Android is doing great! mail mau mobile increased 6% last week", BingSpeech.SupportedLocales.enUS_Female);
});
//# sourceMappingURL=index.js.map