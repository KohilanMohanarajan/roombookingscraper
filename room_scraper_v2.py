import json
import datetime
import requests
from bs4 import BeautifulSoup

# An array containing the time slots in the calendar
times = ["08:00","08:30","09:00","09:30",
            "10:00","10:30","11:00","11:30",
            "12:00","12:30","13:00","13:30",
            "14:00","14:30","15:00","15:30",
            "16:00","16:30","17:00","17:30",
            "18:00","18:30","19:00","19:30",
            "20:00","20:30","21:00","21:30",
            "22:00","22:30","23:00","23:30"]

rooms = ["AA-112","AA-204","AA-205","AA-206",
            "AA-207","AA-208","AA-209","AC-223",
            "AC-332","AC-334","BV-260","BV-264",
            "BV-355","BV-359","BV-361","BV-363",
            "HL-001","HL-006","HL-008","HL-010",
            "HW-214","HW-215","HW-216","HW-308",
            "HW-402","HW-408","IC-120","IC-130",
            "IC-200","IC-204","IC-208","IC-212",
            "IC-220","IC-230","IC-300","IC-302",
            "IC-320","IC-326","IC-328","MW-110",
            "MW-120","MW-130","MW-140","MW-160",
            "MW-170","MW-223","MW-262","MW-264",
            "PO-101","SW-128","SW-143","SW-309",
            "SW-319","SY-110"]

link = "https://intranet.utsc.utoronto.ca/intranet2/RegistrarService?&room="

# Get current Date and Time
date = datetime.datetime.now()
day = date.day
month = date.month
year = str(date.year)
hour = (date.hour)
weekday = (date.weekday())

# Format day and month to fit into url
if (day < 10):
    day = "0" + str(day)

if (month < 10):
    month = "0" + str(month)

day = str(day)
month = str(month)

def create_dict(): 
    shed = {}
    # Create an entry in the schedule dictionary for each day of the week
    for j in range(0,7):
        shed[j] = {}
        for k in times:
            # By default the room is free (True = Free, False = Booked)
            shed[j][k] = True

    return shed

def enter_data(entries):
    shed = create_dict()
    # Iterate through each row of the table
    for ent in range(0, len(entries)):
        # Comps contains all the td elements (td elements contain column info)
        comps = entries[ent].findAll("td")
        # Get the time pertaining to the current row
        time = times[ent]
        # Pop the first td element out (Time column not needed)
        comps.pop(0)
        # Determine if there are less than normal column entries (Due to weird table formatting)
        if (len(comps) < 7):
            # Iterate through the days of the week for the given row to see if the other days are booked
            for ie in range(0, 7):
                # Get room booking status for the given day, at the given time
                bookStat = shed[ie][time]
                # If the room is booked, do the following
                if (bookStat is False):
                    # Create empty tag and insert into columns list to pad out formatting
                    new_tag = soup.new_tag("td")
                    comps.insert(ie, new_tag)
        # Iterate through columns to see if room is booked for given day at current time
        for l in range (0, len(comps)):
            # Get the class of the current column
            booking = comps[l].get("class")
            # If the room is booked, booking will return a list containing the classname
            if (booking != None):
                # For debugging purposes, returns class element
                #booked = booking[0]

                # Determine how long the room is booked for
                length = comps[l].get("rowspan")

                # Set the booking status for current entry, as well as all subsequent entries for column to booked
                for h in range(0, int(length)):
                    start = times.index(time)
                    shed[l][times[start + h]] = False
    return shed 

def write_to_file(data, file_name):
    # Open json file to store data for writing
    open(file_name, 'w').close()
    outfile = open(file_name, 'w')

    # Dump dictionary into JSON file
    json.dump(data, outfile)

    # Close json file
    outfile.close()

if __name__ == '__main__':
    data = {}

    # Iterate through all rooms to retrieve the data as follows
    for room in rooms:
        # Retrieve XML from Registrar booking website as JSON
        response = requests.get(link + room + "&day=" + year + "-" + month + "-" + day)

        # Parse the JSON to retrieve raw XML
        table = json.loads(response.text)
        tableRaw = table[room]

        # Create an instance of BeautifulSoup parser
        soup = BeautifulSoup(tableRaw, 'html.parser')

        # Get table, and table body element
        table = soup.find("table")
        body = table.find("tbody")

        # Get all the rows from the table
        entries = body.findAll("tr")

        # Add all the booking data into the entry for the current room
        data[room] = enter_data(entries)

    write_to_file(data, "rooms.json")
    