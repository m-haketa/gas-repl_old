function GAS_REPL(tunnelURL) {
  if (tunnelURL === undefined) {
    return "Hello from Apps Script ID: " + ScriptApp.getScriptId();
  }

  var value = "START GAS-REPL";
  var exit = "exit";

  // prepare some objects
  var me = Session.getActiveUser().getUsername();
  //var app = initApp();

  do {
    try {
      var response = UrlFetchApp.fetch(
                       tunnelURL,
                       {
                         'method': 'post',
                         'contentType': 'application/json',
                         'payload': JSON.stringify({"result": value})
                       });
      var now = new Date();
      value = eval(response.getContentText());
    }
    catch (e) {
      console.log(e);
      if (/DNS error/.test(e) || /404/.test(e)) {
        throw 'REPL Connection Error';
      }
      value = e
    }
  } while (value != exit);
}
