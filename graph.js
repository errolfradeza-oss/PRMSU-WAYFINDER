// Map Layout
// ✅ Converted + formatted exactly like your requested structure
// NOTE: #2 "GATE TO CTHM" is NOT included here because your latest KML version
// split it into 3 routes: (1) GATE TO CTHM, (2) CTHM TO CANTEEN, (3) CTHM TO NEW GRAD

const ADDITIONAL_ROUTES = [
  // 0 - PRMSU ARC TO GATE
  [
    { lat: 15.3218889, lng: 119.9852159 },
    { lat: 15.3214, lng: 119.9849423 },
    { lat: 15.3212926, lng: 119.98489 },
    { lat: 15.3212021, lng: 119.9848578 },
    { lat: 15.321127, lng: 119.9848511 },
    { lat: 15.3210585, lng: 119.9848484 },
    { lat: 15.3207403, lng: 119.9849141 },
    { lat: 15.320457, lng: 119.9849691 },
    { lat: 15.3204208, lng: 119.9849691 },
    { lat: 15.3203678, lng: 119.9849637 },
    { lat: 15.3202805, lng: 119.9849396 },
    { lat: 15.3202009, lng: 119.9848994 },
    { lat: 15.3200988, lng: 119.984835 },
    { lat: 15.3200548, lng: 119.9848135 },
    { lat: 15.3200043, lng: 119.9848028 },
    { lat: 15.3199384, lng: 119.9847921 },
    { lat: 15.3198996, lng: 119.9847854 },
    { lat: 15.3198595, lng: 119.9847693 },
    { lat: 15.3198025, lng: 119.9847357 },
  ],

  // 1 - GATE TO LONG ASS ROTONDA
  [
    { lat: 15.3198025, lng: 119.9847357 },
    { lat: 15.3196321, lng: 119.9846157 },
  ],

  // 2 - BEFORE UTURN N MAHABA
  [
    { lat: 15.3196321, lng: 119.9846157 },
    { lat: 15.3194618, lng: 119.9844691 },
  ],

  // 3 - OBLONG SA GITNA NG PRMSU (Polygon ring)
  [
    { lat: 15.3194186, lng: 119.9844359 },
    { lat: 15.3194245, lng: 119.9844177 },
    { lat: 15.3194193, lng: 119.9843963 },
    { lat: 15.3190736, lng: 119.9841228 },
    { lat: 15.3188657, lng: 119.9839571 },
    { lat: 15.318845, lng: 119.9839584 },
    { lat: 15.3188321, lng: 119.9839665 },
    { lat: 15.3188282, lng: 119.9839866 },
    { lat: 15.3188334, lng: 119.9840061 },
    { lat: 15.3190401, lng: 119.98417 },
    { lat: 15.3193844, lng: 119.9844466 },
    { lat: 15.3194038, lng: 119.9844453 },
    { lat: 15.3194186, lng: 119.9844359 },
  ],

  // 4 - GSOC TO ELIB TO ROTONDA
  [
    { lat: 15.3195704, lng: 119.9843163 },
    { lat: 15.3194618, lng: 119.9844691 },
    { lat: 15.3191255, lng: 119.9849358 },
    { lat: 15.3190017, lng: 119.984837 },
    { lat: 15.3188073, lng: 119.9846837 },
    { lat: 15.3188629, lng: 119.9846032 },
    { lat: 15.318784, lng: 119.9845389 },
    { lat: 15.3190401, lng: 119.98417 },
  ],

  // 5 - ELIB
  [
    { lat: 15.3190017, lng: 119.984837 },
    { lat: 15.3189422, lng: 119.9849189 },
  ],

  // 6 - Registrar to rotonda
  [
    { lat: 15.3189135, lng: 119.984354 },
    { lat: 15.3187867, lng: 119.9842547 },
    { lat: 15.3187557, lng: 119.9842306 },
    { lat: 15.318735, lng: 119.9842011 },
    { lat: 15.3187247, lng: 119.9841662 },
    { lat: 15.3187195, lng: 119.9841287 },
    { lat: 15.3187221, lng: 119.9840911 },
    { lat: 15.3187557, lng: 119.9839074 },
  ],

  // 7 - rotonda to ramon
  [
    { lat: 15.3188321, lng: 119.9839665 },
    { lat: 15.3187557, lng: 119.9839074 },
  ],

  // 8 - rotonda ramon bronze (Polygon ring)
  [
    { lat: 15.3187272, lng: 119.9838879 },
    { lat: 15.3187475, lng: 119.9837603 },
    { lat: 15.3186903, lng: 119.9836488 },
    { lat: 15.31857, lng: 119.9836287 },
    { lat: 15.3184627, lng: 119.9836863 },
    { lat: 15.3184394, lng: 119.9838117 },
    { lat: 15.3184989, lng: 119.983921 },
    { lat: 15.3186156, lng: 119.9839474 },
    { lat: 15.3187272, lng: 119.9838879 },
  ],

  // 9 - RAMON TO COL TO GYM
  [
    { lat: 15.3186903, lng: 119.9836488 },
    { lat: 15.3189296, lng: 119.9833001 },
    { lat: 15.3189659, lng: 119.9832223 },
    { lat: 15.3189891, lng: 119.9831445 },
    { lat: 15.319015, lng: 119.9830185 },
    { lat: 15.3190202, lng: 119.9828817 },
    { lat: 15.3190021, lng: 119.9827556 },
    { lat: 15.3189633, lng: 119.9826644 },
    { lat: 15.3189245, lng: 119.9826061 },
    { lat: 15.318874, lng: 119.9825504 },
    { lat: 15.3188184, lng: 119.9825068 },
    { lat: 15.3187589, lng: 119.9824659 },
    { lat: 15.3186735, lng: 119.982423 },
    { lat: 15.3185235, lng: 119.9823533 },
  ],

  // 10 - COL TO CTHM
  [
    { lat: 15.3189659, lng: 119.9832223 },
    { lat: 15.3191743, lng: 119.9833071 },
    { lat: 15.3193826, lng: 119.9834747 },
    { lat: 15.3194149, lng: 119.9835002 },
    { lat: 15.3196154, lng: 119.9839628 },
    { lat: 15.3196413, lng: 119.9840165 },
  ],

  // 11 - CAFE CONNECTOR
  [
    { lat: 15.3190736, lng: 119.9841228 },
    { lat: 15.3191628, lng: 119.983994 },
    { lat: 15.3190619, lng: 119.9839162 },
    { lat: 15.3192235, lng: 119.9836941 },
    { lat: 15.3193826, lng: 119.9834747 },
  ],

  // 12 - EWAN
  [
    { lat: 15.3186156, lng: 119.9839474 },
    { lat: 15.3185741, lng: 119.9840024 },
    { lat: 15.3184341, lng: 119.9841836 },
    { lat: 15.3183406, lng: 119.9843044 },
    { lat: 15.3182966, lng: 119.984342 },
    { lat: 15.3182397, lng: 119.9843742 },
    { lat: 15.318175, lng: 119.9843876 },
    { lat: 15.3181259, lng: 119.9843795 },
    { lat: 15.3179732, lng: 119.9842709 },
  ],

  // 13 - RAMON TO CIT TO CCIT TO BACKGATE
  [
    { lat: 15.3184989, lng: 119.983921 },
    { lat: 15.3184699, lng: 119.9839209 },
    { lat: 15.3184337, lng: 119.9839129 },
    { lat: 15.3184053, lng: 119.9838994 },
    { lat: 15.3180276, lng: 119.9836446 },
    { lat: 15.3179241, lng: 119.9835642 },
    { lat: 15.3177961, lng: 119.9834529 },
    { lat: 15.3176137, lng: 119.9832906 },
    { lat: 15.3172602, lng: 119.9830496 },
    { lat: 15.3171757, lng: 119.9829959 },
    { lat: 15.3170471, lng: 119.9829097 },
    { lat: 15.3168979, lng: 119.9830557 },
    { lat: 15.3167465, lng: 119.9832046 },
    { lat: 15.3165737, lng: 119.9833737 },
  ],

  // 14 - NURSING TO ENGR TO CBAPA
  [
    { lat: 15.3170471, lng: 119.9829097 },
    { lat: 15.3172318, lng: 119.9827055 },
    { lat: 15.3173576, lng: 119.9825664 },
    { lat: 15.3174119, lng: 119.9826174 },
    { lat: 15.3174973, lng: 119.9825154 },
    { lat: 15.3174429, lng: 119.9824685 },
    { lat: 15.3177999, lng: 119.9820615 },
    { lat: 15.3179758, lng: 119.981861 },
    { lat: 15.3179965, lng: 119.9818449 },
    { lat: 15.318025, lng: 119.9818395 },
    { lat: 15.3183626, lng: 119.9818583 },
    { lat: 15.3191555, lng: 119.9819039 },
    { lat: 15.3191969, lng: 119.9819441 },
    { lat: 15.3192227, lng: 119.9820031 },
    { lat: 15.3192227, lng: 119.9820729 },
    { lat: 15.319202, lng: 119.982148 },
    { lat: 15.3191525, lng: 119.9823003 },
    { lat: 15.3190021, lng: 119.9827556 },
  ],

  // 15 - GYM CONNECTOR CONSTRUCTION
  [
    { lat: 15.3172602, lng: 119.9830496 },
    { lat: 15.3176172, lng: 119.9826004 },
    { lat: 15.3176598, lng: 119.9825815 },
    { lat: 15.3177258, lng: 119.9825668 },
    { lat: 15.317872, lng: 119.9825534 },
    { lat: 15.3180169, lng: 119.9825507 },
    { lat: 15.318229, lng: 119.9825467 },
    { lat: 15.3186636, lng: 119.9825427 },
    { lat: 15.3188184, lng: 119.9825068 },
  ],

  // 16 - ADMIN CONNECTOR
  [
    { lat: 15.3184627, lng: 119.9836863 },
    { lat: 15.3184353, lng: 119.9836664 },
  ],

  // 17 - DORM CONNECTOR
  [
    { lat: 15.3167465, lng: 119.9832046 },
    { lat: 15.3171462, lng: 119.9835908 },
    { lat: 15.3171294, lng: 119.9836069 },
  ],

  // 18 - CCIT CONNECTOR
  [
    { lat: 15.3168979, lng: 119.9830557 },
    { lat: 15.3169535, lng: 119.9831121 },
  ],

  // 19 - NURSING CONNECTOR
  [
    { lat: 15.3172318, lng: 119.9827055 },
    { lat: 15.317215, lng: 119.9826894 },
  ],

  // 20 - ENGR GYM CONNECTOR
  [
    { lat: 15.3177662, lng: 119.9820996 },
    { lat: 15.3179098, lng: 119.982235 },
    { lat: 15.3179447, lng: 119.9822672 },
  ],

  // 21 - GYM ABOVE COURT CONNECTOR
  [
    { lat: 15.3179098, lng: 119.982235 },
    { lat: 15.3176172, lng: 119.9826004 },
  ],

  // 22 - CAS NEW BLDG TO COE
  [
    { lat: 15.3183406, lng: 119.9843044 },
    { lat: 15.3184476, lng: 119.9843908 },
    { lat: 15.3184925, lng: 119.9844262 },
    { lat: 15.3183218, lng: 119.9846582 },
    { lat: 15.3182416, lng: 119.9847695 },
    { lat: 15.3183677, lng: 119.9848688 },
    { lat: 15.3185585, lng: 119.9850217 },
    { lat: 15.3187271, lng: 119.9847942 },
    { lat: 15.3188073, lng: 119.9846837 },
  ],

  // 23 - CAS TO OLD CAS CONNECTOR
  [
    { lat: 15.3184925, lng: 119.9844262 },
    { lat: 15.3185494, lng: 119.9844718 },
    { lat: 15.3186956, lng: 119.9844718 },
    { lat: 15.318784, lng: 119.9845389 },
  ],

  // 24 - CAFE NEWGRAD TO RAMON CONNECTOR
  [
    { lat: 15.3190619, lng: 119.9839162 },
    { lat: 15.3188166, lng: 119.9837409 },
    { lat: 15.3187475, lng: 119.9837603 },
  ],

  // 25 - PRMSU COOP
  [
    { lat: 15.3194948, lng: 119.9848138 },
    { lat: 15.3196565, lng: 119.9849305 },
  ],

  // 26 - CTHM TO GENDER SOC CONNECTOR
  [
    { lat: 15.3195389, lng: 119.9839356 },
    { lat: 15.3193824, lng: 119.9841662 },
    { lat: 15.3195704, lng: 119.9843163 },
  ],

  // 27 - COE CONNECTOR
  [
    { lat: 15.3187271, lng: 119.9847942 },
    { lat: 15.3187142, lng: 119.9847835 },
  ],

  // 28 - CIT CONN GYM
  [
    { lat: 15.3176137, lng: 119.9832906 },
    { lat: 15.3176204, lng: 119.9827348 },
    { lat: 15.3177258, lng: 119.9825668 },
  ],

  // 29 - GATE TO JHS
  [
    { lat: 15.3196321, lng: 119.9846157 },
    { lat: 15.3194948, lng: 119.9848138 },
    { lat: 15.3193655, lng: 119.9850083 },
  ],

  // 30 - MAIN CONN
  [
    { lat: 15.3194618, lng: 119.9844691 },
    { lat: 15.3194186, lng: 119.9844359 },
  ],

  // 31 - CBAPA CONN
  [
    { lat: 15.3191566, lng: 119.982291 },
    { lat: 15.3191825, lng: 119.9823004 },
  ],

  // 32 - COL CONN
  [
    { lat: 15.319015, lng: 119.9830185 },
    { lat: 15.3190433, lng: 119.983022 },
  ],

  // 33 - COE CONN
  [
    { lat: 15.3183512, lng: 119.9848542 },
    { lat: 15.3183279, lng: 119.9848824 },
  ],

  // 34 - AUTOMOTIVE
  [
    { lat: 15.3184341, lng: 119.9841836 },
    { lat: 15.3183451, lng: 119.984169 },
  ],

  // 35 - MID CONN
  [
    { lat: 15.3187557, lng: 119.9839074 },
    { lat: 15.3187272, lng: 119.9838879 },
  ],

  // 36 - CLINIC CONN
  [
    { lat: 15.3185741, lng: 119.9840024 },
    { lat: 15.3186537, lng: 119.9840498 },
  ],

  // 37 - CIT TO CCIT CONN
  [
    { lat: 15.3171757, lng: 119.9829959 },
    { lat: 15.3170916, lng: 119.9830818 },
  ],

  // 38 - CLINIC TO REG CONN
  [
    { lat: 15.3186537, lng: 119.9840498 },
    { lat: 15.3187221, lng: 119.9840911 },
  ],

  // 39 - AUTOMOTIVE CONN TO CAS
  [
    { lat: 15.3184053, lng: 119.9838994 },
    { lat: 15.318418, lng: 119.9839207 },
    { lat: 15.3184231, lng: 119.9839382 },
    { lat: 15.318427, lng: 119.9839543 },
    { lat: 15.3184341, lng: 119.9841836 },
  ],

  // 40 - CLINIC ROTONDA CONN
  [
    { lat: 15.3187557, lng: 119.9839074 },
    { lat: 15.3186537, lng: 119.9840498 },
  ],

  // ✅ NEW from your latest KML split:
  // 41 - GATE TO CTHM (ends at canteen point)
  [
    { lat: 15.3196321, lng: 119.9846157 },
    { lat: 15.3198788, lng: 119.9842524 },
    { lat: 15.319884, lng: 119.984235 },
    { lat: 15.3198814, lng: 119.9842162 },
    { lat: 15.3198737, lng: 119.9841974 },
    { lat: 15.3196413, lng: 119.9840165 },
  ],

  // 42 - CTHM TO CANTEEN
  [
    { lat: 15.3196413, lng: 119.9840165 },
    { lat: 15.3195389, lng: 119.9839356 },
  ],

  // 43 - CTHM TO NEW GRAD
  [
    { lat: 15.3195389, lng: 119.9839356 },
    { lat: 15.3192235, lng: 119.9836941 },
  ],
  [
  { lat: 15.3177258, lng: 119.9825668 },
  { lat: 15.3179447, lng: 119.9822672 },
  ],
];


/* ===== Markers / Locations ===== */
const locations = [
  {
    position: { lat: 15.3170171, lng: 119.9836825 },
    title: "PRMSU Dormitory",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    image: "internal/DORM.jpg",
    overview: "Dorm ng PRMSU ano pa ba?",
    about: {
  sections: [
    {
      title: "PRMSU Dormitory",
      icon: "🏢",
      description: "The PRMSU Dormitory is a university-managed residential facility that provides safe and convenient accommodation for students, especially those coming from distant areas. It offers designated rooms, shared comfort rooms, and common spaces that support both study and community living."

    }
  ]
}
  },
  {
    position: { lat: 15.3196927, lng: 119.9839305 },
    title: "College of Tourism and Hospitality Management",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "College of Tourism and Hospitality Management overview info.",
    about: "About PRMSU College of Tourism and Hospitality Management."
  },
  // GAD
  {
    position: { lat: 15.3194927, lng: 119.9842305 },
    title: "PRMSU Gender and Society Development (GAD)",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "PRMSU Gender and Society Development overview info.",
    about: "About PRMSU Gender and Society Development."
  },
  {
    position: { lat: 15.316957, lng: 119.9831708 },
    title: "College of Communication and Information Technology",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    image: "internal/CCIT.jpg",
    gallery: [
      "internal/CCIT1.jpg",
      //"internal/CCIT2.jpg",
      //"internal/CCIT3.jpg",
      //"internal/CCIT4.jpg",
    ],
    overview: "CCIT overview info.",
    about: {
  intro: "The CCIT (College of Computing and Information Technology) Building is the main academic and administrative facility for IT and Computer Science students. It consists of three floors designated for offices and computer laboratories.",
  sections: [
    {
      title: "Ground Floor",
      icon: "🏢",
      description: "Contains the Dean’s Office, Office of the Program Chair, Faculty Room, Multimedia Room, and Comfort Rooms (CR). This floor handles academic consultations and administrative services."
    },
    {
      title: "Second Floor",
      icon: "💻",
      description: "Houses three Computer Laboratories used for programming, database, and system development classes."
    },
    {
      title: "Third Floor",
      icon: "🧑‍💻",
      description: "Contains two Computer Laboratories used for programming, database, and system development classes."
    }
  ],
},
    panoScene: "ccit_entrance",
    panoPreview: "images/1st_floor_entrance.jpg"
  },
  {
    position: { lat: 15.3178786, lng: 119.9836198 },
    title: "College of Industrial Technology",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "CIT overview info.",
    about: "The College of Industrial Technology (CIT) at PRMSU offers industry-responsive programs like BS Industrial Technology, preparing students for careers in industrial tech, management, and teaching.",
    
    panoScene: null,
    panoPreview: null
    
  },
  {
    position: { lat: 15.3177298, lng: 119.9819898 },
    title: "College of Engineering",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    image: "internal/COE.jpg",
    overview: "Engineering overview info.",
    about: "About College of Engineering.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3179886, lng: 119.98227 },
    title: "College of Physical Education",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "Physical Education overview info.",
    about: "About College of Physical Education.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3183907, lng: 119.9823369 },
    title: "PRMSU Gymnasium",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "PRMSU Gymnasium overview info.",
    about: {
    sections: [
    {
      title: " PRMSU Gymnasium",
      icon: "🏟️",
      description: "The PRMSU Gymnasium is a multi-purpose sports facility that hosts athletic activities, physical education classes, and university events. It is equipped to accommodate indoor sports, training sessions, and gatherings, providing a central space for student recreation and campus programs."
   
    }
  ],
    panoScene: null,
    panoPreview: null
}
  },
  {
    position: { lat: 15.3183834, lng: 119.9817887 },
    title: "Science and Engineering Laboratory Building",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    image: "internal/COELAB.jpg",
    overview: "Science and Engineering Lab overview info.",
    about: "About Science and Engineering Lab.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3192329, lng: 119.9823252 },
    title: "College of Accountancy & Business Administration",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    image: "internal/CBAPA.jpg",
    overview: "CABA overview info.",
    about: "About College of Accountancy & Business Administration.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3190613, lng: 119.9830242 },
    title: "College of Law",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    image: "internal/COL.jpg",
    overview: "College of Law overview info.",
    about: "About College of Law.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3190613, lng: 119.9826242 },
    title: "ROTC BLDG",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    image: "internal/ROTC.jpg",
    overview: "ROTC Building overview info.",
    about: "About PRMSU ROTC Building.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3187705, lng: 119.9836655 },
    title: "PRMSU Graduate School",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "Graduate School overview info.",
    about: "About PRMSU Graduate School.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3188405, lng: 119.9833755 },
    title: "PRMSU Drafting Building",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "Drafting Building overview info.",
    about: "About PRMSU Drafting Building.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3192305, lng: 119.9839655 },
    title: "PRMSU Cafeteria",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "Cafeteria overview info.",
    about: "About PRMSU Cafeteria.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3192305, lng: 119.9836655 },
    title: "PRMSU New Graduate School Building",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "New Graduate School overview info.",
    about: "About PRMSU New Graduate School Building.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3185898, lng: 119.9837803 },
    title: "President Ramon Magsaysay Statue",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    image: "internal/RAMON.jpg",
    overview: "Statue overview info.",
    about: "About PRMSU Statue.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.318377, lng: 119.983605 },
    title: "President Ramon Magsaysay State University",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    image: "internal/ADMIN.jpg",
    overview: "PRMSU overview info.",
    about: "About PRMSU campus.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3189492, lng: 119.9845174 },
    title: "College of Arts & Science New Building",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    image: "internal/CAS.jpg",
    overview: "CAS overview info.",
    about: "About College of Arts & Science.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3182856, lng: 119.9849514 },
    title: "College of Teacher Education",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "CTE overview info.",
    about: "About College of Teacher Education.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3189021, lng: 119.9849827 },
    title: "PRMSU E-Library",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    image: "internal/elib.jpg",
    overview: "E-Library overview info.",
    about: "About PRMSU E-Library.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3193191, lng: 119.9850327 },
    title: "PRMSU Laboratory Highschool",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "Laboratory Highschool overview info.",
    about: "About PRMSU Laboratory Highschool.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3187312, lng: 119.9843354 },
    title: "PRMSU Registrar Building",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "College of Arts & Science Old Building overview info.",
    about: "About PRMSU College of Arts & Science Old Building.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3182856, lng: 119.9846414 },
    title: "College of Arts & Science Old Building",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "College of Arts & Science Old Building overview info.",
    about: "About PRMSU College of Arts & Science Old Building.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3185612, lng: 119.9841354 },
    title: "PRMSU Clinic",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    image: "internal/CLINIC.jpg",
    overview: "PRMSU Clinic overview info.",
    about: "About PRMSU Clinic.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3183012, lng: 119.9841354 },
    title: "PRMSU Automotive Building",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    image: "internal/AUTOMOTIVE.jpg",
    overview: "PRMSU Automotive Building overview info.",
    about: "About PRMSU Automotive Building.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3166213, lng: 119.9833767 },
    title: "PRMSU Back Gate",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    image: "internal/backgate.jpg",
    overview: "Back Gate overview info.",
    about: "About PRMSU Back Gate.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3197159, lng: 119.984991 },
    title: "PRMSU Coop",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "Coop overview info.",
    about: "About PRMSU Coop.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.3197927, lng: 119.9847305 },
    title: "PRMSU Front Gate",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "Front Gate overview info.",
    about: "About PRMSU Front Gate.",
    panoScene: null,
    panoPreview: null
  },
  {
    position: { lat: 15.317167, lng: 119.982632 },
    title: "Bachelor of Science in Nursing",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "BSN overview info.",
    about: {
  sections: [
    {
      title: "College of Nursing & CCIT Building",
      icon: "🏫",
      description: "The building houses both the College of Nursing (CON) and the College of Computing and Information Technology (CCIT)."
    },
    {
      title: "College of Nursing (CON)",
      icon: "🏫",
      description: "The CON side includes faculty offices, a science laboratory, an amphitheater, the SBO room, and six lecture rooms, supporting the academic needs of nursing students."
    },
    {
      title: "College of Computing and Information Technology (CCIT)",
      icon: "🏫",
      description: "The CCIT side has five lecture rooms and the SBO office on the ground floor, and three lecture rooms on the second floor, providing spaces for classes and administrative activities."
    }
  ]
},
    panoScene: "nursing_entrance",
    panoPreview: "images/leftside_nursing_near_stairs.jpg"
  },
  {
    position: { lat: 15.3218841, lng: 119.9852327 },
    title: "PRMSU ARC",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    overview: "PRMSU ARC overview info.",
    about: "PRMSU ARC.",
    panoScene: null,
    panoPreview: null
  }
];

//bldg polygon
const BUILDINGS = [

  // ccit
  {
    title: "College of Communication and Information Technology",
    parts: [
      [
        { lat: 15.3169615, lng: 119.9833413 },
        { lat: 15.3171529, lng: 119.9831415 },
        { lat: 15.3170921, lng: 119.9830784 },
        { lat: 15.3170792, lng: 119.9830905 },
        { lat: 15.3170404, lng: 119.9830516 },
        { lat: 15.3169783, lng: 119.9831120 },
        { lat: 15.3169628, lng: 119.9830972 },
        { lat: 15.3169382, lng: 119.9831254 },
        { lat: 15.3169511, lng: 119.9831388 },
        { lat: 15.3168580, lng: 119.9832380 },
        { lat: 15.3169615, lng: 119.9833413 }
      ],
      [
        { lat: 15.3173852, lng: 119.9824888 },
        { lat: 15.3176788, lng: 119.9821616 },
        { lat: 15.3175896, lng: 119.9820757 },
        { lat: 15.3172986, lng: 119.9824057 },
        { lat: 15.3173852, lng: 119.9824888 }
      ]
    ]
  },

  // Prmsu dorm
  {
    title: "PRMSU Dormitory",
    parts: [[
      { lat: 15.3173194, lng: 119.9838574 },
      { lat: 15.3171306, lng: 119.9836710 },
      { lat: 15.3171474, lng: 119.9836509 },
      { lat: 15.3170931, lng: 119.9836026 },
      { lat: 15.3170762, lng: 119.9836200 },
      { lat: 15.3168874, lng: 119.9834349 },
      { lat: 15.3167632, lng: 119.9835650 },
      { lat: 15.3172004, lng: 119.9839848 },
      { lat: 15.3173194, lng: 119.9838574 }
    ]]
  },

  // nursing
  {
    title: "Bachelor of Science in Nursing",
    parts: [
      [
        { lat: 15.3173683, lng: 119.9825097 },
        { lat: 15.3172765, lng: 119.9824272 },
        { lat: 15.3169673, lng: 119.9827759 },
        { lat: 15.3170566, lng: 119.9828590 },
        { lat: 15.3173683, lng: 119.9825097 }
      ],
      [
        { lat: 15.3170163, lng: 119.9828464 },
        { lat: 15.3169465, lng: 119.9827780 },
        { lat: 15.3168417, lng: 119.9828906 },
        { lat: 15.3169116, lng: 119.9829590 },
        { lat: 15.3170163, lng: 119.9828464 }
      ]
    ]
  },

  // engineering
  {
    title: "College of Engineering",
    parts: [[
      { lat: 15.3178028, lng: 119.9818394 },
      { lat: 15.3176049, lng: 119.9820607 },
      { lat: 15.3176851, lng: 119.9821331 },
      { lat: 15.3178080, lng: 119.9819949 },
      { lat: 15.3178274, lng: 119.9820164 },
      { lat: 15.3178817, lng: 119.9819561 },
      { lat: 15.3178727, lng: 119.9819467 },
      { lat: 15.3178882, lng: 119.9819293 },
      { lat: 15.3178028, lng: 119.9818394 }
    ]]
  },

  // admin
  {
    title: "President Ramon Magsaysay State University",
    parts: [[
      { lat: 15.3185584, lng: 119.9834915 },
      { lat: 15.3184225, lng: 119.9833815 },
      { lat: 15.3182014, lng: 119.9836860 },
      { lat: 15.3183398, lng: 119.9837852 },
      { lat: 15.3185584, lng: 119.9834915 }
    ]]
  },

  // selb
  {
    title: "Science and Engineering Laboratory Building",
    parts: [[
      { lat: 15.3183227, lng: 119.9818345 },
      { lat: 15.3184456, lng: 119.9818425 },
      { lat: 15.3185025, lng: 119.9818586 },
      { lat: 15.3185529, lng: 119.9818667 },
      { lat: 15.3186059, lng: 119.9818680 },
      { lat: 15.3186538, lng: 119.9818627 },
      { lat: 15.3186926, lng: 119.9818479 },
      { lat: 15.3186913, lng: 119.9818667 },
      { lat: 15.3188090, lng: 119.9818734 },
      { lat: 15.3188336, lng: 119.9818452 },
      { lat: 15.3191466, lng: 119.9818694 },
      { lat: 15.3191557, lng: 119.9817513 },
      { lat: 15.3183279, lng: 119.9817125 },
      { lat: 15.3183227, lng: 119.9818345 }
    ]]
  },

  // cbapa
  {
    title: "College of Accountancy & Business Administration",
    parts: [[
      { lat: 15.3192508, lng: 119.9825459 },
      { lat: 15.3193207, lng: 119.9821784 },
      { lat: 15.3192883, lng: 119.9821717 },
      { lat: 15.3192948, lng: 119.9821302 },
      { lat: 15.3192431, lng: 119.9821168 },
      { lat: 15.3192340, lng: 119.9821610 },
      { lat: 15.3192172, lng: 119.9821570 },
      { lat: 15.3191448, lng: 119.9825325 },
      { lat: 15.3191642, lng: 119.9825352 },
      { lat: 15.3191525, lng: 119.9825875 },
      { lat: 15.3192069, lng: 119.9825969 },
      { lat: 15.3192185, lng: 119.9825419 },
      { lat: 15.3192508, lng: 119.9825459 }
    ]]
  },

  // college of law
  {
    title: "College of Law",
    parts: [[
      { lat: 15.3191422, lng: 119.9832258 },
      { lat: 15.3192185, lng: 119.9828302 },
      { lat: 15.3191034, lng: 119.9828021 },
      { lat: 15.3190167, lng: 119.9832004 },
      { lat: 15.3191422, lng: 119.9832258 }
    ]]
  },

  // cafeteria
  {
    title: "PRMSU Cafeteria",
    parts: [[
      { lat: 15.3194407, lng: 119.9839869 },
      { lat: 15.3191820, lng: 119.9837844 },
      { lat: 15.3190850, lng: 119.9839145 },
      { lat: 15.3191277, lng: 119.9839467 },
      { lat: 15.3191341, lng: 119.9839359 },
      { lat: 15.3193527, lng: 119.9841130 },
      { lat: 15.3194407, lng: 119.9839869 }
    ]]
  },

  // cthm
  {
    title: "College of Tourism and Hospitality Management",
    parts: [
      [
        { lat: 15.3198871, lng: 119.9839839 },
        { lat: 15.3197798, lng: 119.9837398 },
        { lat: 15.3196168, lng: 119.9838149 },
        { lat: 15.3196466, lng: 119.9838860 },
        { lat: 15.3196090, lng: 119.9839047 },
        { lat: 15.3196491, lng: 119.9840013 },
        { lat: 15.3196892, lng: 119.9839825 },
        { lat: 15.3197216, lng: 119.9840576 },
        { lat: 15.3198871, lng: 119.9839839 }
      ],
      [
        { lat: 15.3193019, lng: 119.9849807 },
        { lat: 15.3198594, lng: 119.9842203 },
        { lat: 15.3197572, lng: 119.9841452 },
        { lat: 15.3192049, lng: 119.9849123 },
        { lat: 15.3193019, lng: 119.9849807 }
      ]
    ]
  },

  // gensoc
  {
    title: "PRMSU Gender and Society Development (GAD)",
    parts: [[
      { lat: 15.3197097, lng: 119.9841691 },
      { lat: 15.3195325, lng: 119.9840323 },
      { lat: 15.3194420, lng: 119.9841544 },
      { lat: 15.3195053, lng: 119.9842013 },
      { lat: 15.3194898, lng: 119.9842214 },
      { lat: 15.3196114, lng: 119.9843059 },
      { lat: 15.3197097, lng: 119.9841691 }
    ]]
  },

  // cas annex
  {
    title: "College of Arts & Science New Building",
    parts: [[
      { lat: 15.3192401, lng: 119.9846454 },
      { lat: 15.3189142, lng: 119.9843879 },
      { lat: 15.3188482, lng: 119.9844765 },
      { lat: 15.3191677, lng: 119.9847366 },
      { lat: 15.3192401, lng: 119.9846454 }
    ]]
  },

  // registrar
  {
    title: "PRMSU Registrar Building",
    parts: [[
      { lat: 15.3188626, lng: 119.9843631 },
      { lat: 15.3186751, lng: 119.9842169 },
      { lat: 15.3185962, lng: 119.9843215 },
      { lat: 15.3187876, lng: 119.9844636 },
      { lat: 15.3188626, lng: 119.9843631 }
    ]]
  },

  // elib
  {
    title: "PRMSU E-Library",
    parts: [[
      { lat: 15.3190504, lng: 119.9850261 },
      { lat: 15.3189871, lng: 119.9849765 },
      { lat: 15.3189612, lng: 119.9850114 },
      { lat: 15.3188810, lng: 119.9849483 },
      { lat: 15.3188926, lng: 119.9849349 },
      { lat: 15.3188409, lng: 119.9848947 },
      { lat: 15.3188176, lng: 119.9848840 },
      { lat: 15.3187956, lng: 119.9848840 },
      { lat: 15.3187788, lng: 119.9848907 },
      { lat: 15.3187659, lng: 119.9849068 },
      { lat: 15.3187374, lng: 119.9848826 },
      { lat: 15.3186792, lng: 119.9849577 },
      { lat: 15.3186650, lng: 119.9849443 },
      { lat: 15.3186262, lng: 119.9849979 },
      { lat: 15.3188293, lng: 119.9851630 },
      { lat: 15.3188577, lng: 119.9851240 },
      { lat: 15.3189340, lng: 119.9851830 },
      { lat: 15.3190504, lng: 119.9850261 }
    ]]
  },

  // cte
  {
    title: "College of Teacher Education",
    parts: [
      [
        { lat: 15.3185897, lng: 119.9851216 },
        { lat: 15.3182145, lng: 119.9848185 },
        { lat: 15.3181473, lng: 119.9849044 },
        { lat: 15.3185198, lng: 119.9852074 },
        { lat: 15.3185897, lng: 119.9851216 }
      ],
      [
        { lat: 15.3185741, lng: 119.9849532 },
        { lat: 15.3188121, lng: 119.9846381 },
        { lat: 15.3187409, lng: 119.9845844 },
        { lat: 15.3187513, lng: 119.9845697 },
        { lat: 15.3186737, lng: 119.9845053 },
        { lat: 15.3186142, lng: 119.9845885 },
        { lat: 15.3186814, lng: 119.9846435 },
        { lat: 15.3185469, lng: 119.9848245 },
        { lat: 15.3184797, lng: 119.9847735 },
        { lat: 15.3184176, lng: 119.9848553 },
        { lat: 15.3185003, lng: 119.9849197 },
        { lat: 15.3185120, lng: 119.9849050 },
        { lat: 15.3185741, lng: 119.9849532 }
      ]
    ]
  },

  // cas old bldg
  {
    title: "College of Arts & Science Old Building",
    parts: [[
      { lat: 15.3181662, lng: 119.9848058 },
      { lat: 15.3184042, lng: 119.9844946 },
      { lat: 15.3183898, lng: 119.9844849 },
      { lat: 15.3183176, lng: 119.9844235 },
      { lat: 15.3180757, lng: 119.9847374 },
      { lat: 15.3181662, lng: 119.9848058 }
    ]]
  },

  // clinic
  {
    title: "PRMSU Clinic",
    parts: [[
      { lat: 15.3184195, lng: 119.9842673 },
      { lat: 15.3185230, lng: 119.9843491 },
      { lat: 15.3186730, lng: 119.9841533 },
      { lat: 15.3186394, lng: 119.9841278 },
      { lat: 15.3186523, lng: 119.9841104 },
      { lat: 15.3186122, lng: 119.9840795 },
      { lat: 15.3186006, lng: 119.9840956 },
      { lat: 15.3185644, lng: 119.9840688 },
      { lat: 15.3184195, lng: 119.9842673 }
    ]]
  },

  // cit
  {
    title: "College of Industrial Technology",
    parts: [
      [
        { lat: 15.3176659, lng: 119.9834365 },
        { lat: 15.3176089, lng: 119.9838348 },
        { lat: 15.3177344, lng: 119.9838509 },
        { lat: 15.3177887, lng: 119.9834539 },
        { lat: 15.3176659, lng: 119.9834365 }
      ],
      [
        { lat: 15.3179836, lng: 119.9836107 },
        { lat: 15.3178582, lng: 119.9835866 },
        { lat: 15.3177948, lng: 119.9839943 },
        { lat: 15.3179254, lng: 119.9840130 },
        { lat: 15.3179836, lng: 119.9836107 }
      ],
      [
        { lat: 15.3181184, lng: 119.9841635 },
        { lat: 15.3181649, lng: 119.9837504 },
        { lat: 15.3180446, lng: 119.9837343 },
        { lat: 15.3179955, lng: 119.9841501 },
        { lat: 15.3181184, lng: 119.9841635 }
      ],
      [
        { lat: 15.3173902, lng: 119.9831570 },
        { lat: 15.3172712, lng: 119.9831355 },
        { lat: 15.3172220, lng: 119.9835352 },
        { lat: 15.3173462, lng: 119.9835486 },
        { lat: 15.3173902, lng: 119.9831570 }
      ],
      [
        { lat: 15.3188662, lng: 119.9833525 },
        { lat: 15.3187731, lng: 119.9832828 },
        { lat: 15.3186955, lng: 119.9833874 },
        { lat: 15.3187809, lng: 119.9834639 },
        { lat: 15.3188339, lng: 119.9833874 },
        { lat: 15.3188455, lng: 119.9833968 },
        { lat: 15.3188662, lng: 119.9833525 }
      ],
      // drafting1 matched here as second nearby part
      [
        { lat: 15.3190344, lng: 119.9833571 },
        { lat: 15.3189076, lng: 119.9835408 },
        { lat: 15.3188779, lng: 119.9835140 },
        { lat: 15.3188468, lng: 119.9835716 },
        { lat: 15.3189490, lng: 119.9836468 },
        { lat: 15.3191094, lng: 119.9834214 },
        { lat: 15.3190344, lng: 119.9833571 }
      ],
      [
      { lat: 15.3183018, lng: 119.9843032 },
      { lat: 15.3183625, lng: 119.9838955 },
      { lat: 15.3182474, lng: 119.9838767 },
      { lat: 15.3181802, lng: 119.9842858 },
      { lat: 15.3183018, lng: 119.9843032 }
    ]
    ]
  },

  // automotive
  {
    title: "PRMSU Automotive Building",
    parts: [[
      { lat: 15.3183018, lng: 119.9843032 },
      { lat: 15.3183625, lng: 119.9838955 },
      { lat: 15.3182474, lng: 119.9838767 },
      { lat: 15.3181802, lng: 119.9842858 },
      { lat: 15.3183018, lng: 119.9843032 }
    ]]
  },

  // drafting
  {
    title: "PRMSU Drafting Building",
    parts: [
      [
        { lat: 15.3188662, lng: 119.9833525 },
        { lat: 15.3187731, lng: 119.9832828 },
        { lat: 15.3186955, lng: 119.9833874 },
        { lat: 15.3187809, lng: 119.9834639 },
        { lat: 15.3188339, lng: 119.9833874 },
        { lat: 15.3188455, lng: 119.9833968 },
        { lat: 15.3188662, lng: 119.9833525 }
      ],
      // drafting1 matched here as second nearby part
      [
        { lat: 15.3190344, lng: 119.9833571 },
        { lat: 15.3189076, lng: 119.9835408 },
        { lat: 15.3188779, lng: 119.9835140 },
        { lat: 15.3188468, lng: 119.9835716 },
        { lat: 15.3189490, lng: 119.9836468 },
        { lat: 15.3191094, lng: 119.9834214 },
        { lat: 15.3190344, lng: 119.9833571 }
      ]
    ]
  },

  // new grad
  {
    title: "PRMSU New Graduate School Building",
    parts: [[
      { lat: 15.3191611, lng: 119.9837681 },
      { lat: 15.3193447, lng: 119.9835186 },
      { lat: 15.3192516, lng: 119.9834476 },
      { lat: 15.3190692, lng: 119.9837024 },
      { lat: 15.3191611, lng: 119.9837681 }
    ]]
  },

  // jhs
  {
    title: "PRMSU Laboratory Highschool",
    parts: [
      [
        { lat: 15.3193952, lng: 119.9850324 },
        { lat: 15.3193150, lng: 119.9849734 },
        { lat: 15.3189710, lng: 119.9854522 },
        { lat: 15.3186877, lng: 119.9852403 },
        { lat: 15.3186282, lng: 119.9853248 },
        { lat: 15.3192594, lng: 119.9857955 },
        { lat: 15.3193099, lng: 119.9857204 },
        { lat: 15.3190499, lng: 119.9855179 },
        { lat: 15.3193952, lng: 119.9850324 }
      ],
      [
        { lat: 15.3186854, lng: 119.9852292 },
        { lat: 15.3185974, lng: 119.9851635 },
        { lat: 15.3185328, lng: 119.9852466 },
        { lat: 15.3186220, lng: 119.9853164 },
        { lat: 15.3186854, lng: 119.9852292 }
      ]
    ]
  },

  // gym
  {
    title: "PRMSU Gymnasium",
    parts: [[
      { lat: 15.3184727, lng: 119.9824850 },
      { lat: 15.3184598, lng: 119.9821538 },
      { lat: 15.3179579, lng: 119.9821551 },
      { lat: 15.3179657, lng: 119.9824891 },
      { lat: 15.3184727, lng: 119.9824850 }
    ]]
  },

  {
    title: "College of Physical Education",
    parts: [[
      { lat: 15.3184727, lng: 119.9824850 },
      { lat: 15.3184598, lng: 119.9821538 },
      { lat: 15.3179579, lng: 119.9821551 },
      { lat: 15.3179657, lng: 119.9824891 },
      { lat: 15.3184727, lng: 119.9824850 }
    ]]
  },
  //old grad
  {
  title: "PRMSU Graduate School",
  parts: [[
    { lat: 15.3191168, lng: 119.9838076 },
    { lat: 15.3188141, lng: 119.9835770 },
    { lat: 15.3187442, lng: 119.9836735 },
    { lat: 15.3190521, lng: 119.9839042 },
    { lat: 15.3191168, lng: 119.9838076 }
  ]]
},

];

//single callout
const BUILDING_POLYGONS = {};
let glowAnimId = null;
let activeGlowKey = null;

function normTitle(s) {
  return String(s || "").trim().toLowerCase();
}

function expandPolygon(coords, factor = 1.05) {
  let centerLat = 0;
  let centerLng = 0;

  coords.forEach(pt => {
    centerLat += pt.lat;
    centerLng += pt.lng;
  });

  centerLat /= coords.length;
  centerLng /= coords.length;

  return coords.map(pt => ({
    lat: centerLat + (pt.lat - centerLat) * factor,
    lng: centerLng + (pt.lng - centerLng) * factor
  }));
}

function initBuildingPolygons() {
  BUILDINGS.forEach((bldg) => {
    const polys = [];

    bldg.parts.forEach((part) => {
      const basePoly = new google.maps.Polygon({
        paths: part,
        map: map,
        strokeColor: "#d8f8ff",
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: "#8be9ff",
        fillOpacity: 0,
        clickable: false,
        zIndex: 4
      });

      const innerGlow = new google.maps.Polygon({
        paths: expandPolygon(part, 1.02),
        map: map,
        strokeColor: "#7fe7ff",
        strokeOpacity: 0,
        strokeWeight: 5,
        fillColor: "#68dcff",
        fillOpacity: 0,
        clickable: false,
        zIndex: 3
      });

      const midGlow = new google.maps.Polygon({
        paths: expandPolygon(part, 1.045),
        map: map,
        strokeColor: "#42d9ff",
        strokeOpacity: 0,
        strokeWeight: 9,
        fillColor: "#36cfff",
        fillOpacity: 0,
        clickable: false,
        zIndex: 2
      });

      const outerGlow = new google.maps.Polygon({
        paths: expandPolygon(part, 1.075),
        map: map,
        strokeColor: "#c9f7ff",
        strokeOpacity: 0,
        strokeWeight: 14,
        fillColor: "#c9f7ff",
        fillOpacity: 0,
        clickable: false,
        zIndex: 1
      });

      polys.push({
        base: basePoly,
        inner: innerGlow,
        mid: midGlow,
        outer: outerGlow
      });
    });

    BUILDING_POLYGONS[normTitle(bldg.title)] = polys;
  });
}

function glowBuilding(title) {
  const key = normTitle(title);
  const entries = BUILDING_POLYGONS[key];

  if (!entries) {
    console.log("No polygon match for:", title);
    return;
  }

  // stop previous glow first
  if (activeGlowKey && activeGlowKey !== key) {
    unglowBuilding(activeGlowKey, true);
  }

  activeGlowKey = key;

  if (glowAnimId) {
    cancelAnimationFrame(glowAnimId);
    glowAnimId = null;
  }

  let reveal = 0;
  let t = 0;

  function animate() {
    if (activeGlowKey !== key) return;

    reveal = Math.min(reveal + 0.06, 1);
    t += 0.08;

    const pulse = (Math.sin(t) + 1) / 2; // 0..1

    entries.forEach((entry) => {
      // widest aura
      entry.outer.setOptions({
        strokeOpacity: (0.10 + pulse * 0.08) * reveal,
        strokeWeight: 13 + pulse * 3,
        fillOpacity: (0.025 + pulse * 0.02) * reveal
      });

      // mid aura
      entry.mid.setOptions({
        strokeOpacity: (0.16 + pulse * 0.12) * reveal,
        strokeWeight: 8 + pulse * 2,
        fillOpacity: (0.05 + pulse * 0.035) * reveal
      });

      // tight glow
      entry.inner.setOptions({
        strokeOpacity: (0.26 + pulse * 0.16) * reveal,
        strokeWeight: 5 + pulse * 1.2,
        fillOpacity: (0.09 + pulse * 0.05) * reveal
      });

      // building body reveal
      entry.base.setOptions({
        strokeOpacity: (0.65 + pulse * 0.20) * reveal,
        strokeWeight: 2.2 + pulse * 0.8,
        fillOpacity: (0.14 + pulse * 0.08) * reveal
      });
    });

    glowAnimId = requestAnimationFrame(animate);
  }

  animate();
}

function unglowBuilding(title, immediate = false) {
  const key = normTitle(title);
  const entries = BUILDING_POLYGONS[key];
  if (!entries) return;

  if (glowAnimId) {
    cancelAnimationFrame(glowAnimId);
    glowAnimId = null;
  }

  if (immediate) {
    entries.forEach((entry) => {
      entry.base.setOptions({
        strokeOpacity: 0,
        fillOpacity: 0
      });
      entry.inner.setOptions({
        strokeOpacity: 0,
        fillOpacity: 0
      });
      entry.mid.setOptions({
        strokeOpacity: 0,
        fillOpacity: 0
      });
      entry.outer.setOptions({
        strokeOpacity: 0,
        fillOpacity: 0
      });
    });

    if (activeGlowKey === key) activeGlowKey = null;
    return;
  }

  let fade = 1;

  function animateOut() {
    fade -= 0.08;

    if (fade <= 0) {
      entries.forEach((entry) => {
        entry.base.setOptions({
          strokeOpacity: 0,
          fillOpacity: 0
        });
        entry.inner.setOptions({
          strokeOpacity: 0,
          fillOpacity: 0
        });
        entry.mid.setOptions({
          strokeOpacity: 0,
          fillOpacity: 0
        });
        entry.outer.setOptions({
          strokeOpacity: 0,
          fillOpacity: 0
        });
      });

      if (activeGlowKey === key) activeGlowKey = null;
      return;
    }

    entries.forEach((entry) => {
      entry.outer.setOptions({
        strokeOpacity: 0.16 * fade,
        fillOpacity: 0.03 * fade
      });

      entry.mid.setOptions({
        strokeOpacity: 0.24 * fade,
        fillOpacity: 0.06 * fade
      });

      entry.inner.setOptions({
        strokeOpacity: 0.34 * fade,
        fillOpacity: 0.10 * fade
      });

      entry.base.setOptions({
        strokeOpacity: 0.55 * fade,
        fillOpacity: 0.14 * fade
      });
    });

    requestAnimationFrame(animateOut);
  }

  animateOut();
}

function openDirectionsPanel() {
  document.getElementById("directionsPanel").classList.add("open");
}

function closeDirectionsPanel() {
  document.getElementById("directionsPanel").classList.remove("open");
}

function renderAbout(dept) {
  const aboutContainer = document.getElementById("aboutText");
  aboutContainer.innerHTML = "";

  if (!dept.about) {
    aboutContainer.innerHTML = "<p>No information available.</p>";
    return;
  }

  // Intro
  if (dept.about.intro) {
    aboutContainer.innerHTML += `
      <div class="about-intro">
        📍 <strong>${dept.title}</strong>
        <p>${dept.about.intro}</p>
      </div>
    `;
  }

  // Sections (if they exist)
  if (dept.about.sections && dept.about.sections.length > 0) {
    dept.about.sections.forEach(section => {
      aboutContainer.innerHTML += `
        <div class="about-section-card">
          <h4>${section.icon || ""} ${section.title}</h4>
          <p>${section.description}</p>
        </div>
      `;
    });
  }
}

//mobile helper
let ACTIVE_HOVER_TITLE = null;

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

function showMarkerHover(loc, marker) {
  // clear previous hovered marker first
  if (ACTIVE_HOVER_TITLE && ACTIVE_HOVER_TITLE !== loc.title) {
    unglowBuilding(ACTIVE_HOVER_TITLE);
  }

  ACTIVE_HOVER_TITLE = loc.title;
  glowBuilding(loc.title);

  if (loc.image) {
    hoverInfoWindow.setContent(`
      <div class="hover-card">
        <img src="${loc.image}" alt="${loc.title}">
        <div class="hover-title">${loc.title}</div>
      </div>
    `);

    hoverInfoWindow.open({
      anchor: marker,
      map,
      shouldFocus: false
    });
  } else {
    hoverInfoWindow.close();
  }
}

function hideMarkerHover() {
  if (!ACTIVE_HOVER_TITLE) return;

  unglowBuilding(ACTIVE_HOVER_TITLE);
  hoverInfoWindow.close();
  ACTIVE_HOVER_TITLE = null;
}