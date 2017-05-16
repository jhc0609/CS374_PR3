// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.

var currentCountry
var question = document.getElementById("pr2__question");
var answer = document.getElementById("pr2__answer");
var submit = document.getElementById("pr2__submit");
var radio = document.getElementsByName("myRadio");
var num_records;
var records = [];
var undoList = [];
var redoList = [];

$( document ).ready(function() {

  firebase.database().ref('record/').once('value', function(snapshot) { 
  	num_records = snapshot.numChildren();
  });

  var country_capital_pairs = pairs
  // Retreive (country, capital) data from web
  // pairs <- List of (country: str, captial: str)\
  $.ajax({
  	type: "GET",
  	url: "https://s3.ap-northeast-2.amazonaws.com/cs374-csv/country_capital_pairs.csv",
  	dataType: "text",
  	success: function(data) {
  		window.pairs = csvtojson(data);
  	},
  	fail: function(data) {
  		alert("fail");
  	}
  });

  var country_capital_pairs = pairs;
  var question = document.getElementById("pr2__question");
  var answer = document.getElementById("pr2__answer");
  currentCountry = pairs[Math.floor(Math.random() * pairs.length)];

  question.innerHTML = currentCountry.country;
  document.getElementById("themap").src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyB6GB4fo15Q_SakG4dODpfwPaSsdLYjvrI&q=" + currentCountry.country.replace(" ", "+") +  "&maptype=satellite"
  answer.focus();
  $("#pr2__answer").autocomplete({
  	source: pairs.map(function(a) {return a.capital;}),
  	minLength: 2,
    select: function (e, ui) {
        answer.value = ui.item.label;
        seeAnswer();
        ui.item.value = "";
    },
  });

});

function csvtojson(data) {
	var rows = data.split(/\r?\n|\r/);
	var jsondata = [];
	for (var i = 0; i < rows.length; i++) {
		if (i > 0) {
			jsondata.push({"country":rows[i].split(",")[0], "capital":rows[i].split(",")[1]});
		}
	}
	return jsondata;
}

function writeOnFirebase(data) {
	var splitter = data.split(",");
	firebase.database().ref('record/' + String(num_records)).set({
		country: splitter[0],
		answer: splitter[1],
		capital: splitter[2],
		correct: splitter[3],
	});
	records.push(num_records);
	num_records++;
}

function deleteLog(index) {
	firebase.database().ref('record/' + String(index)).remove();
	records.splice(records.indexOf(index), 1);
	refresh();
}

function clearAll() {
	firebase.database().ref('record/').remove();
  	num_records = 0;
	refresh();
}

function refresh() {
  var printTable = document.getElementById('myTable');
  var numRows = printTable.rows.length;
  var undobutton = document.getElementById("pr3__undo");
  var redobutton = document.getElementById("pr3__redo");

  if (undoList.length == 0) { undobutton.disabled = true; }
  else { undobutton.disabled = false; }
  if (redoList.length == 0) { redobutton.disabled = true; }
  else { redobutton.disabled = false; }

  for(var i=0;i<numRows-3;i++) {
    printTable.deleteRow(3);
  }
	var state = "0";
	for (var i=0;i<radio.length;i++){
		if(radio[i].checked) {
			state = radio[i].value;
		}
	}

	if(state == "1") {
		var j = 0;
		for(var i=0;i<num_records;i++) {
			firebase.database().ref('record/' + String(i)).once('value').then( function(snapshot) {
				if (snapshot.val() != null){
				if (snapshot.val().correct == "true") {
					$("#myRow").after('<tr class="slim" style="color:blue"><td><p class="link" onmouseover="cursorPointer();" onmouseout="cursorRecover();" onclick="mapupdate(\''+ snapshot.val().country + '\');">' + snapshot.val().country + '</p></td><td>' + snapshot.val().answer + '</td><td><i class="fa fa-check" aria-hidden="true"><button type="button" onclick="deleteLog(' + records[j] + ')">Delete</button></td></tr>');
				}
				else {
					$('#myRow').after('<tr class="slim" style="color:red"><td><p class="link" onmouseover="cursorPointer();" onmouseout="cursorRecover();" onclick="mapupdate(\''+ snapshot.val().country + '\');">' + snapshot.val().country + '</p></td><td><s>' + snapshot.val().answer + '</s></td><td>' + snapshot.val().capital + '<button type="button" onclick="deleteLog(' + records[j] + ')">Delete</button></td></tr>');
				}
				j++;
			}})
		}
	}
	else if(state == "2") {
		var j = 0;
		for(var i=0;i<num_records;i++){
			firebase.database().ref('record/' + String(i)).once('value').then( function(snapshot) {
				if (snapshot.val() != null){
					if (snapshot.val().correct == "true") {
					$("#myRow").after('<tr class="slim" style="color:blue"><td><p class="link" onmouseover="cursorPointer();" onmouseout="cursorRecover();" onclick="mapupdate(\''+ snapshot.val().country + '\');">' + snapshot.val().country + '</p></td><td>' + snapshot.val().answer + '</td><td><i class="fa fa-check" aria-hidden="true"><button type="button" onclick="deleteLog(' + records[j] + ')">Delete</button></td></tr>');
				}
				j++;
			}})
		}
	}
	else {
		var j = 0;
		for(var i=0;i<num_records;i++){
			firebase.database().ref('record/' + String(i)).once('value').then( function(snapshot) {
				if (snapshot.val() != null){
					if (snapshot.val().correct != "true") {
					$('#myRow').after('<tr class="slim" style="color:red"><td><p class="link" onmouseover="cursorPointer();" onmouseout="cursorRecover();" onclick="mapupdate(\''+ snapshot.val().country + '\');">' + snapshot.val().country + '</p></td><td><s>' + snapshot.val().answer + '</s></td><td>' + snapshot.val().capital + '<button type="button" onclick="deleteLog(' + records[j] + ')">Delete</button></td></tr>');
				}
				j++;
			}})
		}
	}
}


function seeAnswer() {
	firebase.database().ref('record/').once('value').then( function(snapshot) {
		var currentState = snapshot.val();
		write
	}
  var state = "0";
	for (var i=0;i<radio.length;i++){
		if(radio[i].checked) {
			state = radio[i].value;
		}
	}
  if(answer.value == currentCountry.capital) {
  	if(state=="3") { radio[0].checked = true; }
  	writeOnFirebase(currentCountry.country + "," + answer.value + ",,true");
  }
  else { 
  	if(state=="2") { radio[0].checked = true; }
  	writeOnFirebase(currentCountry.country + "," + answer.value + "," + currentCountry.capital + ",false");
  }
  currentCountry = pairs[Math.floor(Math.random() * pairs.length)];
  question.innerHTML = currentCountry.country;
  document.getElementById("themap").src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyB6GB4fo15Q_SakG4dODpfwPaSsdLYjvrI&q=" + currentCountry.country.replace(" ", "+") +  "&maptype=satellite"
  answer.value = "";
  answer.focus();
  undoList.push(num_records - 1);
  redoList = [];
  refresh();
}

function mapupdate(country) {
	document.getElementById("themap").src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyB6GB4fo15Q_SakG4dODpfwPaSsdLYjvrI&q=" + country.replace(" ", "+") +  "&maptype=satellite";
	refresh();
}

function cursorPointer() {
	document.body.style.cursor = "pointer";
}

function cursorRecover() {
	document.body.style.cursor = "";
}

function undo() {
	alert("undo!");
	var task = undoList.pop();
	redoList.push(task);
	// Do the Undo

	refresh();
}

function redo() {
	alert("redo!");
	var task = redoList.pop();
	undoList.push(task);
	// Do the Redo

	refresh();
}