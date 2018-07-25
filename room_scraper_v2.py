import json
import datetime
import requests
from bs4 import BeautifulSoup

# An array containing the time slots in the calendar
times = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30"]

rooms = ["AA-112","AA-204","AA-205","AA-206","AA-207","AA-208","AA-209","AC-223","AC-332","AC-334","BV-260","BV-264","BV-355","BV-359","BV-361","BV-363","HW-214","HW-215","HW-216","HW-308","HW-402","HW-408","IC-120","IC-130","IC-200","IC-204","IC-208","IC-212","IC-220","IC-230","IC-300","IC-302","IC-320","IC-326","IC-328","MW-110","MW-120","MW-130","MW-140","MW-160","MW-170","MW-223","MW-262","MW-264","PO-101","SW-128","SW-143","SW-309","SW-319","SY-110"]

# Get current Date and Time
date = datetime.datetime.now()
day = date.day
month = date.month
year = date.year
hour = date.hour
weekday = date.weekday()

response = requests.get("https://intranet.utsc.utoronto.ca/intranet2/RegistrarService?&room=AA-112%2CAA-204&day=2018-06-25")
#print(response.content)

table = json.loads(response.text)
tableRaw = table["AA-112"]

soup = BeautifulSoup(tableRaw, 'html.parser')
table = soup.find("table")
body = table.find("tbody")

# Get all the headers from the table
entries = body.findAll("tr")

# Create a dictionary to store booking information for the room
shed = {}
# Create an entry in the schedule dictionary for each day of the week
for j in range(0,7):
    shed[j] = {}
    for k in times:
        shed[j][k] = True

for ent in range(0, len(entries)):
    # Comps contains all the td elements
    comps = entries[ent].findAll("td")
    # Get the time
    time = times[ent]
    comps.pop(0)
    if (len(comps) < 7):
        for ie in range(0, 7):
            trye = shed[ie][time]
            if (trye is False):
                new_tag = soup.new_tag("td")
                comps.insert(ie, new_tag)
    for l in range (0, len(comps)):
        booking = comps[l].get("class")
        if (booking != None):
            booked = booking[0]
            length = comps[l].get("rowspan")
            shed[l][time] = False
            for h in range(0, int(length)):
                shed[l][times[h]] = False

# for ir in range(0, 7):
#     for it in range(0, len(shed[0])):
#         print(shed[ir][times[it]])
#     print("--------------------------------")

# Open json file to store data for writing
open('rooms.json', 'w').close()
outfile = open('rooms.json', 'w')