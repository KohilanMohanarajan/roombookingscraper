from selenium import webdriver
from bs4 import BeautifulSoup
import json
import datetime

# year = int(input("Input year: "))
# month = int(input("Input month: "))
# day = int(input("Input day: "))

# An array containing the time slots in the calendar
times = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30"]

# Get current Date and Time
date = datetime.datetime.now()
day = date.day
month = date.month
year = date.year
hour = date.hour
weekday = date.weekday()

#print(day, month, year, weekday)

# Open new Selenium WebDriver for Chrome
browser=webdriver.Chrome("C:/chromedriver")
# Open Registrar Room Booking Website
browser.get('https://www.utsc.utoronto.ca/regoffice/timetable/room_schd.php')

data = {}

# Get all Room selection radio buttons
roomBtn = browser.find_elements_by_name("chk_rooms[]")

# Select all the buttons/rooms
for btn in roomBtn:
    btn.click()

# Get all weeks radio buttons
radioBtn = browser.find_elements_by_name("radio_week")

# Select current week
radioBtn[0].click()

# Get the display button, then click it
dispBtn = browser.find_element_by_name("sbmt_display")
dispBtn.click()

# Open BeautifulSoup parser
soup=BeautifulSoup(browser.page_source, "html.parser")

# Get container with all pertinent content
calContainer = soup.findAll("div", {"id": "content"})

# Extract all divs that pertain to room information
mydivs = calContainer[0].findAll("div", id=lambda x: x and x.endswith('shed') or x.endswith('img'))

#print(len(mydivs))

# Iterate through all the divs/room information containers
for i in mydivs:
    # If this div contains info about the room
    if (i.get('id').endswith("img")):
        # Get the room name
        title = i.find("h5").text
        # Create an entry in our data dictionary for the room
        data[title] = [] 
        # Get the tbody element from our div
        table = i.find("tbody")
        # Get all the headers from the table
        head = table.findAll("tr")
        # Get the building information, format it for entry
        build = head[0].find("td")
        building = build.text[10:]

        # Get information about whether the room has blackboards
        bBoard = head[1].findAll("td")[1].text[12:]

        # Add all data about the room to data dictionary
        data[title].append({
            'room' : title,
            'building' : building,
            'blackboards' : bBoard
        })
    # If this div contains info about the room bookings
    elif (i.get('id').endswith("shed")):
        # Create a dictionary to store booking information for the room
        shed = {}
        # Create an entry in the schedule dictionary for each day of the week
        for j in range(0,7):
            shed[j] = {}
            for k in times:
                shed[j][k] = True
        
        #print(shed[0])

        # Get Table, table body element from the div
        table = i.find("table")
        body = table.find("tbody")

        # Get all the headers from the table
        entries = body.findAll("tr")

        for entry in entries:
            comps = entry.findAll("td")
            ent = comps[0]
            comps.pop(0)
            #print(entry)
            for l in range (0, len(comps)):
                booked = comps[l].get("class")
                length = comps[l].get("rowspan")
                #shed[l][ent]
                #print(booked)
                #print(length)

        # 26 TODO: format booking info to put into dictionary
        

#print(data)

#for btn in radioBtn:
#    btn.click()

# Open json file to store data for writing
open('rooms.json', 'w').close()
outfile = open('rooms.json', 'w')

# Close Selenium WebDriver upon completion
browser.close()
