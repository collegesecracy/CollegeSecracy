const branches = {
  CSE: {
    name: "Computer Science Engineering",
    overview: "Focuses on computation, algorithms, programming languages, program design, software, and computer hardware.",
    salary: "₹6-20 LPA (Fresh graduates)",
    demand: "Very High",
    growth: "25% (5-year projected)",
    subjects: ["Data Structures", "Algorithms", "DBMS", "OS", "Computer Networks", "AI/ML", "Cloud Computing"],
    pros: ["High salary", "Abundant job opportunities", "Global demand", "Versatile skills", "Entrepreneurial options"],
    cons: ["Highly competitive", "Rapidly changing technologies", "Can be stressful", "Need continuous learning"],
    colleges: ["IIT Bombay", "BITS Pilani", "NIT Trichy", "IIIT Hyderabad", "DTU", "VIT Vellore"],
    companies: ["Google", "Microsoft", "Amazon", "Adobe", "Flipkart", "Goldman Sachs"],
    specializations: ["Artificial Intelligence", "Data Science", "Cybersecurity", "Blockchain", "Software Engineering"]
  },
  ECE: {
    name: "Electronics & Communication Engineering",
    overview: "Deals with electronic devices, circuits, communication equipment, and basic electronics with applications in telecom, hardware, and embedded systems.",
    salary: "₹4-15 LPA (Fresh graduates)",
    demand: "High",
    growth: "18% (5-year projected)",
    subjects: ["Digital Electronics", "Signal Processing", "VLSI", "Embedded Systems", "Communication Systems", "IoT", "Wireless Networks"],
    pros: ["Diverse career options", "Hardware+software combination", "Growing IoT field", "Defense sector opportunities"],
    cons: ["Core jobs less abundant", "Need higher education for best roles", "Fewer product companies"],
    colleges: ["IIT Delhi", "NIT Warangal", "DTU", "NSIT", "IIIT Bangalore", "PEC Chandigarh"],
    companies: ["Qualcomm", "Intel", "Samsung", "Texas Instruments", "Huawei", "ISRO"],
    specializations: ["VLSI Design", "Embedded Systems", "Wireless Communication", "Signal Processing", "IoT"]
  },
  ME: {
    name: "Mechanical Engineering",
    overview: "Design, analysis, manufacturing, and maintenance of mechanical systems with applications in automotive, aerospace, energy, and robotics.",
    salary: "₹3.5-12 LPA (Fresh graduates)",
    demand: "Moderate",
    growth: "12% (5-year projected)",
    subjects: ["Thermodynamics", "Fluid Mechanics", "Machine Design", "Manufacturing", "Robotics", "CAD/CAM"],
    pros: ["Broad applicability", "Always relevant", "Diverse industries", "Global opportunities"],
    cons: ["Lower starting salaries", "Fewer high-growth companies", "Slow promotion cycles"],
    colleges: ["IIT Madras", "NIT Surathkal", "COEP Pune", "Jadavpur University", "BITS Goa", "VNIT Nagpur"],
    companies: ["TATA Motors", "L&T", "Siemens", "Bosch", "DRDO", "Schneider Electric"],
    specializations: ["Automobile Engineering", "Robotics", "Thermal Engineering", "Mechatronics", "Industrial Design"]
  },
  CE: {
    name: "Civil Engineering",
    overview: "Design, construction, and maintenance of physical infrastructure including buildings, roads, bridges, and water systems.",
    salary: "₹3-10 LPA (Fresh graduates)",
    demand: "Moderate",
    growth: "10% (5-year projected)",
    subjects: ["Structural Analysis", "Geotechnical", "Transportation", "Environmental", "Construction", "Surveying"],
    pros: ["Job stability", "Government opportunities", "Entrepreneurial options", "Field work variety"],
    cons: ["Slower salary growth", "Project-based work", "Site conditions can be tough"],
    colleges: ["IIT Roorkee", "NIT Calicut", "Jamia Millia", "Anna University", "SVNIT Surat", "NIT Patna"],
    companies: ["L&T Construction", "Shapoorji Pallonji", "Afcons", "DRDO", "NHAI", "Jacobs"],
    specializations: ["Structural Engineering", "Environmental Engineering", "Transportation Engineering", "Water Resources", "Geotechnical Engineering"]
  },
  EE: {
    name: "Electrical Engineering",
    overview: "Study and application of electricity, electronics, and electromagnetism with applications in power systems, automation, and electronics.",
    salary: "₹4-14 LPA (Fresh graduates)",
    demand: "High",
    growth: "15% (5-year projected)",
    subjects: ["Power Systems", "Control Systems", "Machines", "Measurements", "Renewable Energy", "Smart Grid"],
    pros: ["Core sector jobs", "Power industry demand", "Diverse roles", "Government sector options"],
    cons: ["Fewer product companies", "Need specialization", "Field work can be demanding"],
    colleges: ["IIT Kharagpur", "NIT Karnataka", "VJTI Mumbai", "PEC Chandigarh", "NIT Rourkela", "Jadavpur University"],
    companies: ["Siemens", "ABB", "BHEL", "TATA Power", "Adani Transmission", "Power Grid Corp"],
    specializations: ["Power Electronics", "Control Engineering", "Electrical Machines", "Energy Systems", "Signal Systems"]
  },
  CHE: {
    name: "Chemical Engineering",
    overview: "Applies physical sciences (physics and chemistry), life sciences (microbiology and biochemistry), and mathematics to process chemicals.",
    salary: "₹3.5-11 LPA (Fresh graduates)",
    demand: "Moderate",
    growth: "10% (5-year projected)",
    subjects: ["Thermodynamics", "Fluid Mechanics", "Process Control", "Chemical Reaction Engineering", "Heat Transfer"],
    pros: ["Core industry relevance", "Good PSU opportunities", "Versatile field"],
    cons: ["Exposure to hazardous environments", "Field work intensive"],
    colleges: ["IIT Bombay", "ICT Mumbai", "NIT Rourkela", "IIT Guwahati", "BITS Hyderabad"],
    companies: ["ONGC", "Reliance Industries", "IOCL", "GAIL", "BPCL", "Lupin"],
    specializations: ["Process Engineering", "Petroleum Engineering", "Biochemical Engineering", "Polymer Science", "Environmental Engineering"]
  },
  IT: {
    name: "Information Technology",
    overview: "Focuses on use of computer systems to manage and process information in enterprise and organizational contexts.",
    salary: "₹5-18 LPA (Fresh graduates)",
    demand: "Very High",
    growth: "22% (5-year projected)",
    subjects: ["Software Engineering", "Operating Systems", "Database Systems", "Web Development", "Cybersecurity", "Cloud Services"],
    pros: ["High job availability", "Remote work options", "Overlap with CSE", "Fast-growing sector"],
    cons: ["Can be repetitive", "Overlaps heavily with CSE"],
    colleges: ["IIIT Hyderabad", "IIT Allahabad", "MIT Pune", "VIT Vellore", "NIT Trichy", "SRM University"],
    companies: ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Tech Mahindra"],
    specializations: ["Cloud Computing", "Cybersecurity", "Web Development", "IT Infrastructure", "System Administration"]
  },
  AERO: {
    name: "Aerospace Engineering",
    overview: "Deals with design and development of aircraft and spacecraft systems including propulsion, avionics, and aerodynamics.",
    salary: "₹4-12 LPA (Fresh graduates)",
    demand: "Moderate",
    growth: "14% (5-year projected)",
    subjects: ["Aerodynamics", "Propulsion", "Structures", "Flight Mechanics", "Avionics"],
    pros: ["Prestigious domain", "Defense and R&D scope", "Cutting-edge technology"],
    cons: ["Limited companies", "High entry barrier"],
    colleges: ["IIT Kanpur", "IIT Bombay", "MIT Chennai", "IIST Trivandrum"],
    companies: ["ISRO", "HAL", "DRDO", "Airbus", "Boeing"],
    specializations: ["Aerodynamics", "Space Propulsion", "Avionics", "Aircraft Design"]
  },
  BT: {
    name: "Biotechnology Engineering",
    overview: "Integrates biology and technology to develop innovations in healthcare, agriculture, and environmental domains.",
    salary: "₹3-9 LPA (Fresh graduates)",
    demand: "Moderate",
    growth: "20% (5-year projected)",
    subjects: ["Molecular Biology", "Genetics", "Bioprocess Engineering", "Immunology", "Biochemistry"],
    pros: ["Emerging field", "Research potential", "Health & environment impact"],
    cons: ["Low initial salary", "Research-heavy field"],
    colleges: ["IIT Delhi", "JNU", "VIT", "Amity", "IISc Bangalore"],
    companies: ["Biocon", "Serum Institute", "Dr. Reddy’s", "Pfizer", "Novo Nordisk"],
    specializations: ["Genetic Engineering", "Bioinformatics", "Pharmaceutical Biotechnology", "Agri-biotech"]
  },
  ENV: {
    name: "Environmental Engineering",
    overview: "Focuses on improving environmental quality through sustainable design, waste management, and pollution control.",
    salary: "₹3-8 LPA (Fresh graduates)",
    demand: "Moderate",
    growth: "18% (5-year projected)",
    subjects: ["Environmental Chemistry", "Solid Waste Management", "Water & Wastewater", "Climate Systems"],
    pros: ["Social impact", "Government project demand", "Sustainable development"],
    cons: ["Low private sector pay", "Often project-based"],
    colleges: ["IIT Madras", "Delhi Technological University", "Anna University"],
    companies: ["Tata Projects", "AECOM", "L&T Enviro", "GAIL", "CPCB"],
    specializations: ["Water Treatment", "Air Pollution Control", "Climate Technology"]
  }
};

const coreBranches = {
  MIN: {
    name: "Mining Engineering",
    overview: "Focuses on the extraction of minerals from the earth in a safe, efficient, and sustainable way.",
    salary: "₹3-10 LPA (Fresh graduates)",
    demand: "Moderate",
    growth: "10% (5-year projected)",
    subjects: ["Mine Surveying", "Rock Mechanics", "Mine Ventilation", "Surface Mining", "Mining Machinery"],
    pros: ["Good PSU opportunities", "High demand in mineral-rich regions", "Field-intensive experience"],
    cons: ["Harsh work environments", "Remote job locations", "Health risks"],
    colleges: ["IIT ISM Dhanbad", "NIT Raipur", "IIT Kharagpur", "BIT Sindri", "Anna University"],
    companies: ["Coal India", "Hindustan Zinc", "Vedanta", "NALCO", "Tata Steel"],
    specializations: ["Mine Planning", "Safety Engineering", "Surface Mining", "Environmental Mining"]
  },
  META: {
    name: "Metallurgical Engineering",
    overview: "Deals with the study of metals and their properties, extraction, processing, and applications.",
    salary: "₹3-9 LPA (Fresh graduates)",
    demand: "Moderate",
    growth: "11% (5-year projected)",
    subjects: ["Physical Metallurgy", "Extractive Metallurgy", "Thermodynamics", "Materials Characterization"],
    pros: ["Strong industry demand", "PSU scope", "Core sector value"],
    cons: ["Niche industry", "Field work heavy", "Relocation possible"],
    colleges: ["IIT BHU", "IIT Madras", "IIT Kharagpur", "NIT Trichy", "NIT Rourkela"],
    companies: ["SAIL", "JSW", "Tata Steel", "Vedanta", "BHEL"],
    specializations: ["Alloy Design", "Materials Testing", "Metal Casting", "Surface Engineering"]
  },
  PROD: {
    name: "Production Engineering",
    overview: "Focuses on the design, control, and continuous improvement of manufacturing systems and processes.",
    salary: "₹3-8 LPA (Fresh graduates)",
    demand: "Moderate",
    growth: "12% (5-year projected)",
    subjects: ["Manufacturing Processes", "Industrial Engineering", "Automation", "Tool Design", "CAD/CAM"],
    pros: ["Industry-relevant", "Automation growth", "Overlap with ME"],
    cons: ["Fewer core companies", "Often mixed with Mechanical roles"],
    colleges: ["IIT Delhi", "NIT Trichy", "COEP Pune", "Anna University", "BITS Pilani"],
    companies: ["Tata Motors", "TVS", "Mahindra", "Bosch", "Ashok Leyland"],
    specializations: ["Manufacturing Automation", "Production Planning", "Lean Manufacturing"]
  },
  MARINE: {
    name: "Marine Engineering",
    overview: "Deals with design, operation and maintenance of ship engines and other onboard systems used in maritime transport.",
    salary: "₹4-10 LPA (Fresh graduates)",
    demand: "Low",
    growth: "8% (5-year projected)",
    subjects: ["Naval Architecture", "Marine Thermodynamics", "Ship Design", "Hydraulics", "Marine Machinery"],
    pros: ["Global opportunities", "High starting pay", "Adventure-rich career"],
    cons: ["Long duration offshore", "Limited work-life balance", "Needs sea-time certification"],
    colleges: ["IMU Chennai", "Tolani Maritime Institute", "MERI Kolkata", "IIT Madras (Naval Arch)"],
    companies: ["Shipping Corp of India", "Great Eastern", "Anglo-Eastern", "Maersk", "Indian Navy"],
    specializations: ["Ship Design", "Marine Propulsion", "Naval Systems"]
  }
};

export {
    branches,
    coreBranches
}