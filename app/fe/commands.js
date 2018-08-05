var URL = "http://localhost:5005/data/dash/metrics?only_outliers=1&filters=metric_label,wow_change,dash_id";
var DASHES = ["android", "ios", "mac", "desktop", "universal", "owa", "calendar", "groups", "outlook"];
var FUZZY = null;
var API_KEY = "980b912fe1c34431922df7886d93551c"
var bingClientTTS = null;

function getBingClient(){
    if(bingClientTTS == null){
        bingClientTTS = new BingSpeech.TTSClient(API_KEY);
        return bingClientTTS;
    }
    else{
        return bingClientTTS;
    }
}

function executeCommand(text){
    var fuzz = getFuzzySet();
    var command = identifyCommand(text, fuzz);
    commandExecutionMap(command);
}
function identifyCommand(text, fuzz){
    text = text.replace(/[^a-zA-Z0-9! ]+/g, "")
    console.log(text);
    var words = text.split(' ');
    var max = [0,null], thresh=0.8;
    var element, command, sims;
    for (var i =0; i < words.length; i++){
        sims = fuzz.get(words[i]);
        if(sims == null)
            continue;
        element = sims[0];
        if(element[0] >= max[0]){
            max = element;
        }
    }
    if(max[0] <= thresh)
        return null;
    command = max[1];
    return command;
    }

function getFuzzySet(){
    if (FUZZY == null){
        FUZZY = FuzzySet(DASHES);
        return FUZZY;
    }else{
        return FUZZY;
    }
}

function commandExecutionMap(command){
    return getDashRelevantInfo(command);
}

function formatDashRelevantData(data){
    var out = [];
    var element;
    for (var prop in data){
        element = [data[prop].metric_label, data[prop].wow_change];
        out.push(element)
    }
    return out;
}

function createText(relevantData, dash_id){
    var text = "", label, change;
    if(!relevantData || relevantData.length == 0){
        return "Nothing extraordinary has happened this week for " + dash_id + "$"
    }
    text += "This are some of the highlights for " + dash_id + " in the last week$";
    for(var i = 0; i < relevantData.length; i++){
        label = relevantData[i][0];
        change = relevantData[i][1];
        percentage = (change * 100).toFixed(2) + '%';
        if (change > 0){
            text += label + "has increased " + percentage + "$";
        }else{
            text += "There has been a drop of " + percentage + " for " + label + "$";
        }
    }
    return text;
}

function getDashRelevantInfo(dash_id){
        if (dash_id == null){
            textToSpeech("Sorry, I didn't hear correctly. Please try again.");
            return;
        }
        var text;
        $.get(dashURLFormatter(dash_id), function(data, status){
            console.log(data);
            text = dashRelevantDataToText(data, dash_id)
            textToSpeech(text);
        });
}

function dashRelevantDataToText(data, dash_id){
    var relevantData = formatDashRelevantData(data);
    var text = createText(relevantData, dash_id)
    return text;
}

function textToSpeech(text){
    getBingClient().multipleXHR = true;
    var sentences = text.split("$");
    for (var i =0; i<sentences.length;i++){
        getBingClient().synthesize(sentences[i]);
    }
}

function dashURLFormatter(command){
    if(command == "outlook"){
        return URL;
    }else{
        return URL + "&dash_id=" + command;
    }
}