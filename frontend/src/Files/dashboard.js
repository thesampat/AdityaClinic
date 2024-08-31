const EnquiresData = [
  { name: "Karan", mobile: "+9187873873", refrence: "Grandfather", purpose: "Sick", statuofenquiry: "Pending" },
  { name: "Arun",  mobile: "+9187873873", refrence: "Grandfather", purpose: "Sick", statuofenquiry: "Pending" },
  { name: "Lila",  mobile: "+9187873873", refrence: "Grandfather", purpose: "Sick", statuofenquiry: "Pending" },
  { name: "Ska",   mobile: "+9187873873", refrence: "Grandfather", purpose: "Sick", statuofenquiry: "Pending" },
  { name: "Siur",  mobile: "+9187873873", refrence: "Grandfather", purpose: "Sick", statuofenquiry: "Pending" },
];

const feesCollected = [
  { period: "Past Week 1", "Online Consultation": 1, "Clinic Consultation": 1, "Consultation Consultation": 1, "Additional Medicine": 1, Reference: "", Packages: "", Total: 0 },
  { period: "Past Week 2", "Online Consultation": 1, "Clinic Consultation": 1, "Consultation Consultation": 1, "Additional Medicine": 1, Reference: "", Packages: "", Total: 0 },
  { period: "Past Week 3", "Online Consultation": 1, "Clinic Consultation": 1, "Consultation Consultation": 1, "Additional Medicine": 1, Reference: "", Packages: "", Total: 0 },
  { period: "Past Week 4", "Online Consultation": 1, "Clinic Consultation": 1, "Consultation Consultation": 1, "Additional Medicine": 1, Reference: "", Packages: "", Total: 0 },
];

const patientStatus = [
  { period: "Past Week 1", Cured: 1, Lapsed: 1, "Left in Between": 1, "Active Treatment": 1, Improving: 2 },
  { period: "Past Week 2", Cured: 1, Lapsed: 1, "Left in Between": 1, "Active Treatment": 1, Improving: 2 },
  { period: "Past Week 3", Cured: 1, Lapsed: 1, "Left in Between": 1, "Active Treatment": 1, Improving: 2 },
  { period: "Past Week 4", Cured: 1, Lapsed: 1, "Left in Between": 1, "Active Treatment": 1, Improving: 2 },
];

const typesOfCases = [
  { period: "Past Week 1", Cured: 0, Lapsed: 0, "Left in Between": 0, "Active Treatment": 0, Improving: 0 },
  { period: "Past Week 2", Cured: 0, Lapsed: 0, "Left in Between": 0, "Active Treatment": 0, Improving: 0 },
  { period: "Past Week 3", Cured: 0, Lapsed: 0, "Left in Between": 0, "Active Treatment": 0, Improving: 0 },
  { period: "Past Week 4", Cured: 0, Lapsed: 0, "Left in Between": 0, "Active Treatment": 0, Improving: 0 },
];

const appointmentStatus = [
  { period: "Past Week 1", Online: 0, Offline: 0, Consultant: 0, Nutrition: 0 },
  { period: "Past Week 2", Online: 0, Offline: 0, Consultant: 0, Nutrition: 0 },
  { period: "Past Week 3", Online: 0, Offline: 0, Consultant: 0, Nutrition: 0 },
  { period: "Past Week 4", Online: 0, Offline: 0, Consultant: 0, Nutrition: 0 },
];

export {appointmentStatus, typesOfCases, patientStatus, feesCollected, EnquiresData}