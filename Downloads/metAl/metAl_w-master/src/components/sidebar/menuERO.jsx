const MenuERO = [
    {
        path: "/dashboard",
        icon: "fa fa-th",
        title: "Dashboard",
        children: [
            { path: "/dashboard/v2", title: "Dashboard Developer" },
        ],
    },
  {
    path: "/AIML",
    icon: "fa fa-cloud text-lightblue",
    title: "AIML",
    children: [
      { path: "/AIML", title: "Setting" },		    
      { path: "/metai/yourdrive", title: "Import Data" },	    
      { path: "/AIML", title: "AI Service Providers List" },
      { path: "/AIML", title: "AI Service Providers" },
      { path: "/AIML", title: "AIML Tasks" },	  
     { path: "/metai/LabelStudio", title: "Label Studio" },	    
    ],
  },

    {
        path: "/Chatbots",
        icon: "fas fa-ticket-alt text-indigo",
        title: "Chatbots",

        children: [
            { path: "/chatbot/consult", title: "Consult" },
            { path: "/chatbot/setting", title: "Setting" },
            { path: "/chatbot/imexports", title: "Import Export Manager" },
            { path: "/chatbot/conversations", title: "Conversations" },
            { path: "/chatbot/companies", title: "Companies" },
            { path: "/chatbot/APIs", title: "Manage APIs" },
            { path: "/labelstudio", title: "Label Studio" },
            {
                path: "/chatbot/drive", title: "Your Drive",
                children: [
                    { path: "/menu/menu-1-1/menu-2-2", title: "Menu 2.2" },
                ],
            },
        ],
    },
];

export default MenuERO;
