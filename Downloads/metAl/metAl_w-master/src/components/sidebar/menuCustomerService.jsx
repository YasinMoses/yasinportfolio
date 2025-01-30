const MenuCustomerService = [
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
        title: "EROs",
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

];

export default MenuCustomerService;
