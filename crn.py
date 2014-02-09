#crn compiler
# ===============================================================
# 					CRN TO JSON COMPILER
# 
# Written by Adam Coard - arcoard@gmail.com. 
# Takes as input the HTML returned from looking up courses once logged in with a UVic account.
# Note: This file does not in any way access UVic services, the page must be manually navigated to then copied and pasted.
# Go to Look up Classes > Advanced Search - then select all the subjects (CTRL+A). 
# Select the entire return, copy and paste it.  Clean it up (i.e. make sure the file is just lists of courses), then run.
# ===============================================================


#NOTE: MAKE SURE TO UPDATE THE OUTPUT FILE NAME BEFORE RUNNING (SEMESTERX.JSON)

import simplejson as json

listOfCourses = []



with open('courses2.txt') as courses:
	i = 0
	readlines = courses.readlines()
	#Why I'm using while True instead of a for loop: http://stackoverflow.com/questions/826493/python-mixing-files-and-loops
	while True:
		try: 
			if i >= 4161: break  #FIXME: make break occur when i >= length of list.
			course = readlines[i]
			x = dict()
			n = course.split('\t')
			x['crn'] = n[1]
			x['discipline'] = n[2] #e.g. PHIL
			x['courseNumber'] = n[3] #310
			x['courseBlock'] = n[4] #A01
			x['verboseName'] = n[7] #'AMERICAN SIGN LANGUAGE I'
			x['courseDay'] = n[8] #M  -nb: each day has own input in diff readline, must combine after.
			x['timeblock'] = n[9] #"03:30pm-5:20pm" -nb: see above, only binds to specific day.
			if len(n) >= 22:
				x['location'] = n[21] #recently added, make sure it works.
			x['schedule'] = dict()
			x['schedule'][n[8]] = n[9]
			listOfCourses.append(x)

			#Test to see if the CRN and discipline fields are empty.  If so, this is not a new course, but information for the previous course.
			if not (x['crn'].strip() or x['discipline'].strip()):
				if i > 0: #can't go back on first column.
					listOfCourses[i-1]['schedule'][n[8]] = n[9] #Add the schedule of this row to the previous row.	
			i += 1
		except Exception as e:
			print e
			print "i value: " + str(i)
			break

with open('semester2.json', 'w') as f:
    json.dump(listOfCourses, f)