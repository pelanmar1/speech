var DASHES = ["android", "ios", "mac", "desktop", "universal", "owa", "calendar", "groups", "outlook"];
var FUZZY = null;

// Fuzzy Set is used to map user input to an actual command.
function getFuzzySet(){
    if (FUZZY == null){
        FUZZY = FuzzySet(DASHES);
        return FUZZY;
    }else{
        return FUZZY;
    }
}

function executeCommand(text){
    var fuzz = getFuzzySet();
    var command = identifyCommand(text, fuzz);
    commandExecutionMap(command);
}

function identifyCommand(text, fuzz){
    /*
    input: raw user input text
    output: whats most likely to be the command the user wants
    */
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


function commandExecutionMap(command){
    // At the moment Dash Highlights is the only command. 
    return getDashHighlights(command);
}


/* --------- DASH HIGHLIGHTS VOICE COMMAND --------- */
var URL_DASH_HIGHLIGHTS = "http://localhost:5005/data/dash/metrics?only_outliers=1&cols_filter=metric_label,wow_change,dash_id,dash_tbl_id&order_by=dash_tbl_id,dash_id";

function dashURLFormatter(command){
    if(command == "outlook"){
        return URL_DASH_HIGHLIGHTS;
    }else{
        return URL_DASH_HIGHLIGHTS + "&dash_id=" + command;
    }
}

function getDashHighlights(dash_id){
    if (dash_id == null){
        sentencesToSpeech(["Sorry, I didn't hear correctly. Please try again."]);
        return;
    }
    $.get(dashURLFormatter(dash_id), function(data, status){
        console.log(data);
        speekDashHighlights(data, dash_id);
        
    });
}

function speekDashHighlights(data, dash_id){
    var relevantData, sentences;
    relevantData = formatDashHighlightsData(data);
    sentences = createDashHighlightsSentences(relevantData, dash_id);
    sentencesToSpeech(sentences);

}

function formatDashHighlightsData(data){
    var out = [];
    var element;
    for (var prop in data){
        element = [data[prop].metric_label, data[prop].wow_change, data[prop].dash_id, data[prop].dash_tbl_id];
        out.push(element)
    }
    return out;
}

function formatDashTableId(dash_tbl_id){
    if(dash_tbl_id == "gmail-cloudcache")
        return "Gmail Cloudcache";
    return dash_tbl_id;
}

function createDashHighlightsSentences(relevantData, command){
    var label, change, dash_id, dash_tbl_id, sentence, allClients = false;
    var currDash_id = "", currDashTblId = "";
    var sentences = []
    if (command == "outlook"){
        allClients = true;
        command = "Outlook Mobile"
    }

    if(!relevantData || relevantData.length == 0){
        return ["Nothing extraordinary has happened this week for " + command + "."];
    }
    sentences.push("This are some of the highlights for " + command + " in the last week.");
    for(var i = 0; i < relevantData.length; i++){
        label = relevantData[i][0];
        change = relevantData[i][1];
        dash_id = relevantData[i][2];
        dash_tbl_id = formatDashTableId(relevantData[i][3]);
        percentage = (change * 100).toFixed(1) + '%';
        if (allClients){
            if (currDash_id != dash_id || currDashTblId != dash_tbl_id){
                sentence = "For " + dash_id + ", " + dash_tbl_id + '.'
                sentences.push(sentence);
                currDash_id = dash_id;
                currDashTblId = dash_tbl_id;
            }
        }
        if (change > 0){
            sentence = label + "has increased " + percentage + '.';
        }else{
            sentence = "There has been a drop of " + percentage + " for " + label + '.';
        }

        sentences.push(sentence);
    }
    return sentences;
}
