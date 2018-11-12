  var buildings = ["Arts and Administration (AA)", "Academic Resource Centre (AC)", 
    "Bladen Wing (BV)", "Highland Hall (HL)", "Humanities Wing (HW)", 
    "Instructional Centre (IC)", "Social Sciences (MW)", "Portable (PO)",
    "Science Wing (SW)", "Science Research (SY)"
    ]

  var BuildRooms = {
    "Instructional Centre (IC)": ["IC-120", "IC-130", "IC-200", "IC-204", "IC-208", "IC-212", "IC-220", "IC-230", "IC-300", "IC-302", "IC-320", "IC-326", "IC-328"],
    "Arts and Administration (AA)": ["AA-112", "AA-204", "AA-205", "AA-206", "AA-207", "AA-208", "AA-209"],
    "Academic Resource Centre (AC)": ["AC-223", "AC-332", "AC-334"],
    "Bladen Wing (BV)": ["BV-260", "BV-264", "BV-355", "BV-359", "BV-361", "BV-363"],
    "Highland Hall (HL)": ["HL-001","HL-006","HL-008","HL-010"],
    "Humanities Wing (HW)": ["HW-214", "HW-215", "HW-216", "HW-308", "HW-402", "HW-408"],
    "Portable (PO)": ["PO-101"],
    "Social Sciences (MW)": ["MW-110", "MW-120", "MW-130", "MW-140", "MW-160", "MW-170", "MW-223", "MW-262", "MW-264"],
    "Science Wing (SW)": ["SW-128", "SW-143", "SW-309", "SW-319"],
    "Science Research (SY)": ["SY-110"]
  }

  var times = ["08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30",
    "22:00", "22:30", "23:00", "23:30"
  ]

  $(document).ready(function () {
    var bldg = document.getElementById("bldg");
    var option = document.createElement("option");
    option.setAttribute("disabled", "")
    option.setAttribute("selected", "")
    option.text = "Select a building..."
    bldg.appendChild(option);

    for (var bldgs in buildings) {
      var option = document.createElement("option");
      option.text = buildings[bldgs];
      bldg.appendChild(option);
    }

    var time = document.getElementById("time");
    var option = document.createElement("option");
    option.setAttribute("disabled", "")
    option.setAttribute("selected", "")
    option.text = "Select a start time..."
    time.appendChild(option);

    for (var timeq in times) {
      var option = document.createElement("option");
      option.text = times[timeq];
      time.appendChild(option);
    }


    $("#bldg").change(function () {
      document.getElementById("dispTable").style = "display:none"

      var bldg = document.getElementById("bldg");
      var bldgSel = bldg.options[bldg.selectedIndex].value;
      console.log(bldgSel);

      var roomList = BuildRooms[bldgSel];

      var roomSel = document.getElementById("room");

      roomSel.innerHTML = "";

      var option = document.createElement("option");
      option.setAttribute("disabled", "")
      option.setAttribute("selected", "")
      option.text = "Select a building..."
      roomSel.appendChild(option);

      for (var room in roomList) {
        console.log(roomList[room])
        var option = document.createElement("option");
        option.text = roomList[room];
        roomSel.appendChild(option);
      }
      document.getElementById("room").style = ""
    });

    $("#room").change(function () {
      var room = document.getElementById("room");
      var roomSel = room.options[room.selectedIndex].value;
      console.log(roomSel);

      var timeTable = document.getElementById("availTimes");
      timeTable.innerHTML = "";

      $.getJSON("rooms.json", function (data) {
        var roomData = data[roomSel];

        var dateObj = new Date();
        var today = dateObj.getDay();
        var hour = dateObj.getHours();
        var currHour = hour + ":00";
        var start = times.indexOf(currHour);
        var upcoming = times.slice(start, -1);

        var todayData = roomData[today];
        for (var index in upcoming) {
          var time = upcoming[index];
          var avail = todayData[upcoming[index]];
          console.log(avail);
          var availability = "<strong>Free</strong>";
          if (avail == false) {
            availability = "Booked";
          }
          var tr = document.createElement("tr");

          var td1 = document.createElement("td");
          td1.innerHTML = time;
          tr.appendChild(td1);

          var td2 = document.createElement("td");
          td2.innerHTML = availability;
          tr.appendChild(td2);

          timeTable.appendChild(tr)
        }
        //console.log(today, , upcoming)
      });
      document.getElementById("dispTable").style = ""
    });

    $("#time").change(function () {
      document.getElementById("roomTable").style = "display:none"

      var time = document.getElementById("time");
      var timeSel = time.options[time.selectedIndex].value;
      console.log(timeSel);

      var endTime = document.getElementById("endtime");

      endTime.innerHTML = "";

      var option = document.createElement("option");
      option.setAttribute("disabled", "")
      option.setAttribute("selected", "")
      option.text = "Select a finish time..."
      endTime.appendChild(option);

      starter = times.indexOf(timeSel)+1
      for (var timeend = starter; timeend < times.length; timeend++) {
        //console.log(times[timeend])
        var option = document.createElement("option");
        option.text = times[timeend];
        endTime.appendChild(option);
      }
      document.getElementById("endtime").style = ""
    });

    $("#endtime").change(function () {
      var time = document.getElementById("time");
      var timeSel = time.options[time.selectedIndex].value;

      var endtime = document.getElementById("endtime");
      var endtimeSel = endtime.options[endtime.selectedIndex].value;

      var roomTable = document.getElementById("availRooms");
      roomTable.innerHTML = "";

      var timelist = times.slice(times.indexOf(timeSel),times.indexOf(endtimeSel)+1);

      $.getJSON("rooms.json", function (data) {
        var dateObj = new Date();
        var today = dateObj.getDay();
        var starthour = timeSel
        var endHour = endtimeSel;

        for (var index in data) {
          var roomData = data[index];
          var todayData = roomData[today]
          //console.log(todayData)

          var finavail = true;

          for (timel in timelist){
            var avail = todayData[timelist[timel]]
            if (avail == false) {
              finavail = false;
            }
          }

          var availability = "<strong>Free</strong>";
          if (finavail == false) {
            availability = "Booked";
          }
          var tr = document.createElement("tr");

          var td1 = document.createElement("td");
          td1.innerHTML = index;
          tr.appendChild(td1);

          var td2 = document.createElement("td");
          td2.innerHTML = availability;
          tr.appendChild(td2);

          roomTable.appendChild(tr);
        }
      });
      document.getElementById("roomTable").style = "";
    });

    $("#timeRoom").click(function(){
      document.getElementById("time").style = 'display:none';
      document.getElementById("endtime").style = 'display:none';
      document.getElementById("room").style = 'display:none';
      document.getElementById("bldg").style = '';
      document.getElementById("bldg").selectedIndex = 0;

      document.getElementById("roomTable").style = "display:none";
      document.getElementById("dispTable").style = "display:none";
    });

    $("#roomTime").click(function(){
      document.getElementById("bldg").style = 'display:none';
      document.getElementById("endtime").style = 'display:none';
      document.getElementById("room").style = 'display:none';
      document.getElementById("time").style = '';
      document.getElementById("time").selectedIndex = 0;

      document.getElementById("roomTable").style = "display:none";
      document.getElementById("dispTable").style = "display:none";
    });

  });
