const MenuSupervisor = [
    {
        path: "/dashboard",
        icon: "fa fa-th",
        title: "Dashboard",
        children: [
            { path: "/dashboard/v2", title: "Dashboard TCMFiles" },
        ],
    },

    {
        path: "/Users",
        icon: "fa fa-address-book",
        title: "Users",
        badge: "10",
        children: [
            { path: "/user/userroles", title: "Admin User-Roles" },
            { path: "/user/userroles/new", title: "Add User-Role" },
            { path: "/user/modulepermissions", title: "Admin Module-Permissions"},
            { path: "/user/modulepermissions/new", title: "Add Module-Permission" },
            { path: "/user/rightspermissions", title: "Rights & Permissions" },
            { path: "/user/rightspermissions/new", title: "Add new Rights & Permissions"},
            { path: "/user/users", title: "Users" },
            { path: "/user/users/new", title: "Add User" },
            { path: "/user/search_user", title: "Search in Users" },
            { path: "/user/contacts", title: "Contacts" },
        ],
    },

    {
        path: "/Human Resources",
        icon: "fa fa-graduation-cap",
        title: "Human Resources",
        children: [
            { path: "/user/skills", title: "Skills" },
            { path: "/user/shifts", title: "Shifts" },
            { path: "/user/leaves", title: "Leaves" },
            { path: "/user/certificates", title: "Certificates" },            
            { path: "/user/attendances", title: "Attendances" },
            { path: "/planning/adminskills", title: "Admin Skills" },
            { path: "/planning/admincertificates", title: "Admin Certificates"},
            { path: "/user/adminshifts", title: "Admin Shifts" },
            { path: "/planning/leavereasons", title: "Admin Leave-Reasons" },
            { path: "/planning/adminskills", title: "Admin Skills" },
        ],
    },

    {
        path: "/ERO",
        icon: "ion-md-help-buoy",
        title: "ERO",
        children: [
            { path: "/ero/erosetting", title: "Setting" },				
            { path: "/ero/maps/new", title: "Upload Map" },
            { path: "/ero/maps", title: "Admin Maps" },
            { path: "/ero/areas", title: "Areas" },
            { path: "/ero/spots", title: "Spots" },						
            { path: "/ero/eros", title: "EROs" },
            { path: "/ero/eros/new", title: "Add ERO" },
            { path: "/ero/searchEROs", title: "Search in EROs" },
            { path: "/ero/floors", title: "Floors" },
            { path: "/ero/incidents", title: "Incidents" },
            { path: "/ero/incidents/new", title: "Add Incident" },
            { path: "/ero/calendar", title: "Calendar" },
            { path: "/ero/eevents", title: "Emergency Events" },
            { path: "/ero/emergencyevacuations", title: "Emergency Evacuations" },			
            { path: "/ero/drills", title: "Drills" },						
        ],
    },
  {
    path: "/AIML",
    icon: "fa fa-cloud text-lightblue",
    title: "AIML",
    children: [
      { path: "/AIML/AIMLsetting", title: "Setting" },		    
      { path: "/metai/yourdrive", title: "Import Data" },	    
      { path: "/AIML", title: "AI Service Providers List" },
      { path: "/AIML", title: "AI Service Providers" },
     { path: "/AIML", title: "AIssistants" },	  
      { path: "/AIML/AIMLtasks", title: "AIML Tasks" },	        
     { path: "/metai/LabelStudio", title: "Label Studio" },	    
    ],
  },    
];

export default MenuSupervisor;
