// TODO: Add a way so that when updating to a new semester file it automatically wipes previous saves.  Otherwise it'll lookup values that don't exist.

$( document ).ready(function() {  
	$ctrl = $('#control-panel');
	$("#control-panel-btn").click(function() { 
		var btn = $(this); //This lets me reference it in the nested scope.
		$ctrl.css({display: 'block'});
		})
	$('body').on('click', '#CRN-submit', function(){
		// $('[id^=CRN-input]').each(function(){console.log($(this).val())})
		$('[id^=CRN-input]').each(function(){ 
			console.log($(this).val());
			addCRN(parseInt($(this).val()));
			setTimeout(run, 150); //A really ghetto solution.  But it gives time for addCRN() to process.
			$('#control-panel').css({
				display: 'none'
				});
		});
		return false; //Stops scroll to top.
	})
	$('#CRN-close').click(function(){ 
		$('#control-panel').css({
			display: 'none'
		});
		return false; //Stops scroll to top.
	})
	$('#PrevDay').click(function(){
		changeDay("back");
		run();
	})
	$('#NextDay').click(function(){
		changeDay("next");
		run();
	})
	// TODO: Change above functions above into one below
	// $('.daychange').click(function(){
	// 	$(this).inArray
	// })


	$('#control-panel').appendTo('.jumbotron');
	

	//Add event handlers for every 'X' in each row.
	$('.close').click(function() {
		row = $(this).parents()[1]; //If HTML changes, this 
		startTime = $(row).attr('id');
		coursesArray = Sched["courses"];
		for (var key in Sched["courses"]){
			courseStart = trimTime(Sched["courses"][key].timeblock);
			if (startTime == courseStart){
				console.log("Removing course...")
				Sched.removeCourse(key);
				setTimeout(run, 150);
			}
		}
	});
	$('.class-info').click(function(){
		console.log("Info click");
		row = $(this).parents()[1];
		building = trimRoom($(row).children('.courses').children('span').text());
		if (building){
			console.log(building);
			$('#modal-text').html('<img class="img-responsive" src="img/' + building.toLowerCase() + '.gif">');
		}
		else if (building == '') {
			$('#modal-text').html("Either there's no course in this row, or something went wrong.  If you think this is a problem with Tables, please contact me!")
		}
		
	});
	$('#save').click(function(){
		Sched.saveSession();
	})
	if (localStorage.length > 0){loadSession();}
	//Load from URL
	if (linkLoader(document.URL)){
		console.log("URL loaded!");
	}


	
	
	// $("body").on("focus", "[id^=CRN-input]", function(){ 
	  
	// });
	
	$("body").on("blur", "[id^=CRN-input]", function(){ 
	  if ($(this).val().length >= 5) {
		console.log("Input >= 5!, calling lookupCRN()");
		CRN = $(this).val()
		course = $(this).attr("class")
		lookupCRN(CRN, course)	
		}
	});
	courseNum = 2; //used to give each row a unique CSS number.		
	$("body").on("click", ".add-more", function(){
		courseNumString = courseNum.toString();
		$(this).after('<br><span class="course'+courseNumString+'"><label for="CRN-input'+courseNumString+'">CRN: </label>\
          <input id="CRN-input'+courseNumString+'" placeholder="CRN" size="8" class="course'+ courseNumString+'">\
          <i class="fa fa-search"></i>\
          <span class="lookup-info course'+courseNumString+'"><span class="course-name"></span>\
          <span class="section">Enter a five digit CRN</span> <span class="time-days"></span></span></span>\
          <a class="add-more" href="#more">Add more...</a>');
		courseNum++;
		$(this).remove();
	});

	$('#export').click(function(){
		//TODO: FILL THIS OUT
		console.log("Export!");
		var url = exportLink(Sched.getCRNs());
		$('#export-panel input').val(url); 
		$('#export-panel').css({visibility: 'visible', opacity: '1',
		    'opacity': '0.8',
		    'position': 'fixed',
		    'top': '55px',
		    'right': '10%',
		    'transition': 'all 0.5s ease 0s, visibility 0s linear 0.5s;'
		    });
	})
	$(document).mouseup(function (e){
	    var container = $("#export-panel");
		    if (!container.is(e.target)  // if the target of the click isn't the container...
		        && container.has(e.target).length == 0){ // ... nor a descendant of the container
		    		// console.log(e.target);
		    		console.log(container.has(e.target).length == 0)
		        	container.css({opacity: '0', top: '0px'});
	    		}
	});
	$('#export-panel button').click(function(){
		$('#export-panel input').select();
	});
});

$ctrl = $('#control-panel');
var DEBUG = 0;

function lookupCRN(search, courseNum) {
	///This function gets the info for a CRN and shows it in the Control Panel without adding it to the schedule.
	var tempVal;
	var returnVal;
		$.getJSON('semester2.json', function(jdata) {
			$.each(jdata, function(key, val) {
				if (search == val.crn){ 
					// console.log(val)
					returnVal = val;
					
				}
			})
		}).done(function() {
			// Since this info is retrieved through an asychronous $.getJSON call, this UI editting has to occur here.
			var course = "." + String(courseNum);
			if (typeof(returnVal) != "undefined"){
				console.log(returnVal);
				$(course + ' i').attr('class', 'fa fa-check');
				$(course + ' .course-name').text(returnVal.discipline + ' ' + returnVal.courseNumber +': ' + returnVal.verboseName.toLowerCase()+', ');
				$(course + ' .section').text(returnVal.courseBlock +',');
				$(course + ' .time-days').text(returnVal.courseDay + ' ' + returnVal.timeblock);

			}
		
			else{ //undefined, course not found.
				$('.'+courseNum+' i').attr('class', 'fa fa-exclamation-triangle');
				$(course + ' .course-name').text(""); //Don't Use This One, CSS Is Set To Capitalize
				$(course + ' .section').text("We're sorry, the course wasn't found.");
				$(course + ' .time-days').text("");
			}
		})
}

lookupCRN()

function trimTime(input){
	//Input: 06:30 pm-09:20 Output: 0630
	//Input is found in the Course objects, output in CSS/HTML.
	if (typeof(input) != "undefined"){
		return input.slice(0,5).replace(':','');
		}
}

function trimRoom(input){
	//Input: COR A229 output: COR
	return input.split(' ')[0];
}

var day;
day = "Monday";
var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function run(){
	Sched.makeSched();
	clearTable();
	fillTable(Sched.schedule[day]);
}

function changeDay(input){
	//Input to take:  "next" "back" and the name of the specific day.
	clearTable();
	currentDay = daysOfWeek.indexOf(day);
	console.log("Current day initial: " + String(currentDay));
	if (input == "next") {
		currentDay = (currentDay + 1) % 5 //Loops from 0-5.
		day = daysOfWeek[currentDay];
		console.log("Next -> " + String(day));
	}
	if (input == "back") {
		//Have to manually loop it here because I can't get decreasing modulous to work.
		if (currentDay == 0){
			currentDay = 4;
		} 
		else{
			//currentDay = 1 - Math.abs(currentDay))
			currentDay = currentDay - 1
		}
		day = daysOfWeek[currentDay];
		console.log("Back -> " + String(day));
	}
	$('#dayHeader').text(day);
	fillTable(Sched.schedule[day]);
}

function Course(input){
	//Takes the JSONified course data from addCRN as input.
	//TODO: VALIDATE INPUT HERE
	if (typeof(input) != "undefined"){
		this.crn = input.crn;
		this.courseBlock = input.courseBlock;
		this.courseDay = input.courseDay;
		this.courseNumber = input.courseNumber;
		this.discipline = input.discipline;
		this.schedule = input.schedule;
		this.verboseName = input.verboseName;
		this.timeblock = input.timeblock;
		this.room = input.location; //FIXME: Sometimes this has a \n at the end.
		this.days = []; //Characters for days e.g. T, W, F.  Also includes Th.
		if (this.courseDay.indexOf("Th") > -1 ) 
		{
			this.days = String(this.courseDay.replace('Th', '')).split('');
			this.days.push("Th");
			//this.courseDay = this.courseDay.replace('Th', '');
			
		}
		else {
			this.days = String(this.courseDay).split('') 	
		}
	}
	else {
		console.log("Course input == undefined.");
	}
}

Course.prototype.getMonday = function(){
	//Check to see if 'M' is in days, then return the timeBlock if so.
	//return this.timetable.monday;
	if ($.inArray("M", this.days) >= 0){
		return this.timeblock;
	}
	else{return false;}
}

Course.prototype.getTuesday = function(){
	if ($.inArray("T", this.days) >= 0){
		return this.timeblock;
	}
	else{return false;}
}

Course.prototype.getWednesday = function(){
	if ($.inArray("W", this.days) >= 0){
		return this.timeblock;
	}
	else{return false;}
}

Course.prototype.getThursday = function(){
	if ($.inArray("Th", this.days) >= 0){
		return this.timeblock;
	}
	else{return false;}
}

Course.prototype.getFriday = function(){
	if ($.inArray("F", this.days) >= 0){
		return this.timeblock;
	}
	else{return false;}
}

Course.prototype.addTimeBlock = function(day, time){
	//TODO: Error checking, especially for time.
	//Can accept either a single day, or an array of days.
	if (typeof(day) == 'string') 
	{ //Single day input
		day = day.toLowerCase();
		this.timetable[day].push(time);
	} 
	else if( $.isArray(day))  //Multi day input
	{
		that = this;
		//Since jQuery's $.each() has it's own "this" command within its scope, there's a namespace clash.
		//Thus, to differentiate the two I refer to the course object as 'that'.
		console.log("THAT: " + that.timetable);
		$.each(day, function(index, value) {
			console.log("THIS: " + that.timetable);	
			that.timetable[value].push(time)
		});
	}
}

function clearTable(){
	$("td.courses").each(function(){$(this).text('')})
}

function fillTable(scheduleDay){
	//Takes e.g. Sched.schedule.Tuesday as input.  Note: Sched.makeSched() must be run first.
	//TODO: Turn this into a User.prototype.function
	for (var entry in scheduleDay){
		obj = Sched.schedule[day][entry];
		time = obj[0]
		start = String(time).split(' ')[0].replace(":", "");
		course = obj[1];
		desc = course["discipline"] + " " + course["courseNumber"] + " " + course["courseBlock"] + "<br><span class='room'>" + course["room"] + "</span><br>" + "<i>CRN: " + course["crn"] + "</i>";
		$("#" + start + " > .courses").html(desc)
	}
}

function User() {
	//http://stackoverflow.com/questions/387707/whats-the-best-way-to-define-a-class-in-javascript
	//Each object in course is named by CRN as to avoid conflicts.
	this.courses = {};	
	this.schedule = {};
}

//TODO: Consistent naming...
var Sched = new User()

User.prototype.addCourse = function(courseObj){
	this.courses[courseObj.crn] = courseObj;
}

User.prototype.removeCourse = function(crn) {
	 //TODO - Add a way to get CRN.  Lookup from timeblocK?  Grabbing from html? y
	 delete Sched.courses[crn];
	 Sched.makeSched(); //Must be run after the deletion, otherwise the artifact remains in e.g. Sched.schedule.Monday
}

User.prototype.makeSched = function(courses){
	//FIXME: Change Sched["courses"] to actually use the inputted COURSES for the fn.
	var output = {
		Monday: [],
		Tuesday: [],
		Wednesday: [],
		Thursday: [],
		Friday: [],
	};
	//Loop through every object in courses object.
	for (var key in Sched["courses"]){ 
		obj = Sched["courses"][key];
		if ( obj.getMonday() ) { output["Monday"].push([obj.getMonday(), obj]) };
	    if (obj.getTuesday()) {output["Tuesday"].push([obj.getTuesday(), obj])};
	    if (obj.getWednesday()) {output["Wednesday"].push([obj.getWednesday(), obj])};
	    if (obj.getThursday()) {output["Thursday"].push([obj.getThursday(), obj])};
	    if (obj.getFriday()) {output["Friday"].push([obj.getFriday(), obj])};
	}
	this.schedule = output;
	return output;
}


User.prototype.saveSession = function(){
	//Saves a list of CRNs as an array.
	if(typeof(Storage)!=="undefined")
  {
  	console.log("Saving...");
  	var arrayOfCRNs = new Array();
  	for (crn in Sched["courses"]){
  		arrayOfCRNs.push(crn);
  	}
  	localStorage.setItem('userCRNs', JSON.stringify(arrayOfCRNs));
  }
else
  {
  alert("Sorry, saving isn't supported with your browser.");
  }
}

User.prototype.getCRNs = function(){
	//Returns an array of crns, automatically discarding undefined values.
  	var arrayOfCRNs = new Array();
	for (crn in Sched["courses"]){
		if (crn != "undefined"){
			arrayOfCRNs.push(crn);
		}
  	}
  	return arrayOfCRNs;
}

loadSession = function(){
	//Loads from localStorage
	//Loads a list of CRNs, passing each through addCRN().
	console.log("Loading previous session's CRNs...");
	var crns = eval(localStorage.getItem('userCRNs'));
	for (var i = 0; i < crns.length; i++){
		addCRN(crns[i])
	}
	setTimeout(run, 1000);
}

loadCRNs = function(crns){
	//Loads taking a list of CRNs.
	//TODO: Update LoadSession so as to use this fn.
	for (var i = 0; i < crns.length; i++){
		console.log("loadCRNS a firing: " + crns[i])
		addCRN(crns[i])
	}
}



function addCRN(search) {
		//Currently having troubles getting the function to return properly.  I think it's because it's an async fn, return in .done?
		//INTENDED: Return the new Course object.
		//http://stackoverflow.com/questions/13212630/getjson-never-fires-the-success-function
		var temp;
		var tempVal;
		temp = "TEMP!";
		$.getJSON('semester2.json', function(jdata) {
			$.each(jdata, function(key, val) {
				if (search == val.crn){ 
					console.log("Class found: " + val.verboseName)
					tempVal = val;
				}
			})
		})
			.done(function() {
				//Add the course to the Schedule object.
				temp = new Course(tempVal);	
				console.log("Course object created:");
				console.log(temp);
				Sched.addCourse(temp);
				Sched.saveSession();
			})
			.fail(function() {
			console.log("bad!");
			})
			 .always(function() {
			// console.log( "finished" );
			});
}


function linkLoader(url){
	//"http://www.acoard.com/tables/timetable.html?&200052&19999&12345
	//Check if URL has courses in it.  If so, import.
	if (url.indexOf("&") != -1){
		crns = url.split("&").slice(1, url.length);
		if (crns[crns.length-1].indexOf('#') != -1 ){
			// URL ends with something like #more, so chop that bit off.
			crns[crns.length-1] = crns[crns.length-1].slice(0, crns[crns.length-1].indexOf('#'));
		}
		loadCRNs(crns);
		return crns;
	}
	else{return false;}
}


function exportLink(crns){
	//takes Sched.getCRNs() as input
	if (crns.length > 0){
		base = 'http://www.acoard.com/tables/timetable.html?';
		for (var i = 0; i < crns.length ; i++){
			base += "#" + crns[i];
			}
			return base;
		}
}




if (DEBUG){
//DEBUGGING: Remove
setTimeout(addCRN(10105), 250);
setTimeout(addCRN(10104), 250);
setTimeout(run, 1500); //A really ghetto solution.  But it gives time for addCRN() to process.
}

//iPhone bug fix.  Viewport doesn't update when the keyboard is up, so this gets aroundd that.  Navbar.
var needsScrollUpdate = false;
$(document).scroll(function(){
    if(needsScrollUpdate) {
        setTimeout(function() {
            $("body").css("height", "+=1").css("height", "-=1");
        }, 0);
    }
});
$("#CRN-input, textarea").live("focus", function(e) {
    needsScrollUpdate = true;
});

$("#CRN-input, textarea").live("blur", function(e) {
    needsScrollUpdate = false;
});
