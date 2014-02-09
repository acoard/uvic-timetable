uvic-timetable
==============

A homebrew Javascript timetable application to work with the University of Victoria's courses.  The MIT license is at the bottom of this file.

## Project Tasks

- [X] Finish setting up JS objects
- [X] Get data for courses.  Use Python to scrape data from UVic's site.
- [ ] Complete course-adding functionality control panel at the top.
- [ ] Totally redo the timetable layout, make it so that courses are a div which determine their height based off course length.


## JavaScript

The overview of the structure of the JS is that the Schedule object will be populated with numerous Course objects.  The Schedule object will roughly reflect to the 'user', and persistence will be managed in regards to schedules.

#### Courses()

Use course.getMonday() through friday to get an array of all the times that class is in session for that day.  For a given course, this would not include the applicable tutorials/labs, those must be added separately.

course.addTimeBlock() is the method to add timeblocks to the course, but depending on how the data from UVic is stored this may be scraped and course instantiation may just take this into account.














Copyright (c) 2013 Adam Coard

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
