const MenuReception = [
    {
        path: "/dashboard",
        icon: "fa fa-th",
        title: "Dashboard",
        children: [
            { path: "/dashboard/v2", title: "Dashboard ERO" },
        ],
    },

    {
        path: "/ERO",
        icon: "ion-md-help-buoy",
        title: "ERO",
        children: [
            { path: "/ero/maps/new", title: "Upload Map" },
            { path: "/ero/maps", title: "Admin Maps" },
            { path: "/ero/areas", title: "Areas" },
            { path: "/ero/eros", title: "EROs" },
            { path: "/ero/eros/new", title: "Add ERO" },
            { path: "/ero/searchEROs", title: "Search in EROs" },
            { path: "/ero/floors", title: "Floors" },
            { path: "/ero/incidents", title: "Incidents" },
            { path: "/ero/incidents/new", title: "Add Incident" },
            { path: "/ero/calendar", title: "Calendar" },
            { path: "/ero/eevents", title: "Emergency Events" },
        ],
    },
 {
        path: "/MAP",
        icon: "fa fa-map",
        title: "Map",
        children: [
            { path: "/ero/maps/new", title: "Upload Map" },
            { path: "/ero/maps", title: "Admin Maps" },
            { path: "/ero/map/1", title: "Map 1" },
            { path: "/ero/map/2", title: "Map 2" },
            { path: "/ero/map/3", title: "Map 3" },
        ],
    },
	
];

export default MenuReception;
