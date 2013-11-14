$( document ).ready(function() {  // Function #1
	$ctrl = $('#control-panel');
	$("#control-panel-btn").click(function() { //Function #2
		var btn = $(this); //This lets me reference it in the nested scope.
		// $('#control-panel').css({
		// 	position: 'absolute',
		// 	top: btn.offset().top + btn.outerHeight() + 10,
		// 	left: btn.offset().left + 10,
		// 	width: btn.width() + 30,
		// 	height: 125
		// }).show(300);
		$ctrl.css({display: 'block'});
		//$ctrl.affix({ offset: { top: 100 }});​
		$ctrl.affix()
		})
	$('#CRN-submit').click(function(){ //Function #3
		addCRN(parseInt($('#CRN-input').val()));
		$('#control-panel').css({
			display: 'none'
		});
		$('#CRN-input').val('');
		setTimeout(run, 150); //A really ghetto solution.  But it gives time for addCRN() to process.
		return false; //Stops scroll to top.
	})
	$('#CRN-close').click(function(){ //Function #4
		$('#control-panel').css({
			display: 'none'
		});
		return false; //Stops scroll to top.
	})
	$('#PrevDay').click(function(){
		changeDay("back");
	})
	$('#NextDay').click(function(){
		changeDay("next");
	})

	if ($(window).width() >= 610) {
		$('#control-panel').appendTo('.jumbotron');
	}
});

$ctrl = $('#control-panel');

/* WORKFLOW / README

Here's the workflow:
*Add an item via the page.
*Make the schedule with "Sched.makeSched()"
*Check it worked with Sched.schedule
*Use Sched.schedule.Tuesday an argument for fillTable
fillTable(Sched.schedule.Tuesday)

TODO:
*Track which day it is and only update that day.  Change days.
*Fill out run(), make it trigger on the submit of a CRN.


FIXME: 
*Is Monday displaying right?
*Days aren't looping properly (previous doesn't go back but forward!)
*on changeDay() friday is gone to twice Thursday->Fri->Fri->Monday

*/
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
	input = "next";
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
			currentDay = 5;
		} 
		else{
			currentDay = (1 - Math.abs(currentDay)) % 5;
		}
		day = daysOfWeek[currentDay];
		console.log("Back -> " + String(day));
	}
	$('#dayHeader').text(day);
	fillTable(Sched.schedule[day]);
}

function Course(input){
	//Takes the JSONified course data from addCRN as input.
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

//FIXME: get***Day is NOT WORKING.  The .days method doesn't work for Thursday, 'Th', and furtherore it just isn't working on proper days.
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

Course.prototype.removeTimeBlock = function(day, time){
	//Removes ALL INSTANCES of a given input.  'time' is the input to be removed.
	day = day.toLowerCase();
	this.timetable[day] = jQuery.grep(this.timetable[day], function(value) {
  		return value != time;
	});
}

function clearTable(){
	$("td.courses").each(function(){$(this).text('')})
}

function writeToTable(time, course){
	//Format of time is: "09:00 am-09:50 am"
	start = String(time).split(' ')[0].replace(":", "");
	//$("#930 > .courses").text('hey')
	$("#" + start + " > .courses").text("test!");
}

function fillTable(scheduleDay){
	//Takes e.g. Sched.schedule.Tuesday as input.  Note: Sched.makeSched() must be run first.
	for (var entry in scheduleDay){
		obj = Sched.schedule[day][entry];
		time = obj[0]
		start = String(time).split(' ')[0].replace(":", "");
		course = obj[1];
		desc = course["discipline"] + course["courseNumber"] + "<br>" + course["room"] + "<br>" + "<i>CRN: " + course["crn"] + "</i>";
		$("#" + start + " > .courses").html(desc)
	}
}



function User() {
	//http://stackoverflow.com/questions/387707/whats-the-best-way-to-define-a-class-in-javascript
	//Each object in course is named by CRN as to avoid conflicts.
	this.courses = {};	
	this.schedule = {};
}

var Sched = new User()

User.prototype.addCourse = function(courseObj){
	this.courses[courseObj.crn] = courseObj;
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

//var tempVal;
function addCRN(search) {
		//Currently having troubles getting the function to return properly.  I think it's because it's an async fn, return in .done?
		//INTENDED: Return the new Course object.
		//http://stackoverflow.com/questions/13212630/getjson-never-fires-the-success-function
		var temp;
		var tempVal;
		temp = "TEMP!";
		$.getJSON('semester1.json', function(jdata) {
			$.each(jdata, function(key, val) {
				if (search == val.crn){ 
					console.log("Class found: " + val.verboseName)
					tempVal = val;
				}
			})
		})
			.done(function() {
			//Add the course to the Schedule object.
			console.log("success!");
			console.log("Temp Val --");

			console.log(tempVal);
			temp = new Course(tempVal);	
			Sched.addCourse(temp);

			})
			.fail(function() {
			console.log("bad!");
			})
			 .always(function() {
			// console.log( "finished" );
			});
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
