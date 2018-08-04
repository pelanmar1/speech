var URL = "http://localhost:5005/data/dash/metrics?only_outliers=1&filters=metric_label,wow_change,dash_id";
DASHES = ["android", "ios", "mac", "desktop", "universal", "owa", "calendar", "groups"];

fuzzy = FuzzySet()
for d in dashes.items(){
    fuzzy.add(d);
}
