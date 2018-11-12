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
    var dateObj = new Date();
    //dateObj.setHours(9);
    var today = dateObj.getDay();
    var now = "";
    if (dateObj.getHours() < 10) {
      now = "0" + dateObj.getHours() + ":00";
    } else {
      now = dateObj.getHours() + ":00";
    }

    var timelist = times.slice(times.indexOf(now), times.length);

    var time = document.getElementById("time");
    var option = document.createElement("option");
    option.setAttribute("selected", "")
    option.text = timelist[0] + " (now)"
    time.appendChild(option);

    for (var timeend = 1; timeend < timelist.length-1; timeend++) {
      var option = document.createElement("option");
      option.text = timelist[timeend];
      time.appendChild(option);
    }

    var endtime = document.getElementById("endtime");

    for (var timeend = 1; timeend < timelist.length-1; timeend++) {
      var option = document.createElement("option");
      option.text = timelist[timeend];
      endtime.appendChild(option);
    }

    var option = document.createElement("option");
    option.setAttribute("selected", "")
    option.text = timelist[timelist.length-1]
    endtime.appendChild(option);

    var bldg = document.getElementById("bldg");
    var option = document.createElement("option");
    option.setAttribute("selected", "")
    option.text = "All"
    bldg.appendChild(option);

    for (var bldgs in buildings) {
      var option = document.createElement("option");
      option.text = buildings[bldgs];
      bldg.appendChild(option);
    }

    showData();

    $("#bldg").change(function () {
      var bldg = document.getElementById("bldg");
      var bldgSel = bldg.options[bldg.selectedIndex].value;

      var roomList = BuildRooms[bldgSel];

      var roomSel = document.getElementById("room");

      roomSel.innerHTML = "";

      var option = document.createElement("option");
      option.setAttribute("disabled", "")
      option.setAttribute("selected", "")
      option.text = "Filter by room..."
      roomSel.appendChild(option);

      for (var room in roomList) {
        //console.log(roomList[room])
        var option = document.createElement("option");
        option.text = roomList[room];
        roomSel.appendChild(option);
      }

      if (bldgSel != "All") {
        document.getElementById("room").style = "";
      } else {
        document.getElementById("room").style = "display:none";
      }
      

      showData();
    });

    $("#time").change(function () {
      var time = document.getElementById("time");

      var timeSel = "";
      if (time.selectedIndex != 0) {
        timeSel = time.options[time.selectedIndex].value;
      } else {
        timeRaw = time.options[time.selectedIndex].value;
        rawList = timeRaw.split(" ");
        timeSel = rawList[0];
      }

      var timelist = times.slice(times.indexOf(timeSel), times.length);

      var endtime = document.getElementById("endtime");

      endtime.innerHTML = "";

      if (timelist.length > 2) {
        for (var timeend = 1; timeend < timelist.length; timeend++) {
          var option = document.createElement("option");
          option.text = timelist[timeend];
          endtime.appendChild(option);
        }
      }
      else {
        var option = document.createElement("option");
        option.text = timelist[timelist.length-1];
        endtime.appendChild(option);
      }
      
      showData();
    });

    $("#endtime").change(function () {
      showData();
    });

    $("#room").change(function () {
      showData();
    });

    function showData() {
      var time = document.getElementById("time");
      var timeSel = "";
      if (time.selectedIndex != 0) {
        timeSel = time.options[time.selectedIndex].value;
      } else {
        timeRaw = time.options[time.selectedIndex].value;
        rawList = timeRaw.split(" ");
        timeSel = rawList[0];
      }
      
      var endtime = document.getElementById("endtime");
      var endtimeSel = endtime.options[endtime.selectedIndex].value;

      var bldg = document.getElementById("bldg");
      var bldgSel = bldg.options[bldg.selectedIndex].value;

      var roomTable = document.getElementById("availRooms");
      roomTable.innerHTML = "";

      var timelist = times.slice(times.indexOf(timeSel),times.indexOf(endtimeSel)+1);

      console.log(timeSel, endtimeSel, bldgSel, timelist);

      $.getJSON("rooms.json", function (data) {
        var starthour = timeSel;
        var endHour = endtimeSel;
        var roomList = Object.keys(data);

        if (bldgSel != "All") {
          roomList = BuildRooms[bldgSel]

          var room = document.getElementById("room");
          var roomSel = room.options[room.selectedIndex].value;
          if (roomSel != "Filter by room..."){
            roomList = [roomSel];
          }
        }
        //console.log(roomList);

        for (var index in roomList) {
          var roomData = data[roomList[index]];
          var todayData = roomData[today];
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
          td1.innerHTML = roomList[index];
          tr.appendChild(td1);

          var td2 = document.createElement("td");
          td2.innerHTML = availability;
          tr.appendChild(td2);

          roomTable.appendChild(tr);
        }
      });
      document.getElementById("roomTable").style = "";
    }

  });
