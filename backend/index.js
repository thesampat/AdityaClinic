const express = require('express');
require('dotenv').config();
require('./SCRIPTS/main.js')

const cors = require('cors');

const customerRoutes = require("./Routes/CustomerRoutes")
const MainDoctorRoutes = require("./Routes/MainDoctorRoutes")
const doctorsRoutes = require("./Routes/DoctorsRoutes")
const receptionistRoutes = require("./Routes/ReceptionistRoutes")
const consultantRoutes = require("./Routes/ConsultantRoutes")
const appointmentRoutes = require("./Routes/AppointmentRoutes")
const prescriptionRoutes = require("./Routes/PrescriptionRoutes")
const enquiryRoutes = require("./Routes/EnquiryRoutes")
const assistantDoctor = require("./Routes/AssistantDoctorRoutes")
const inventory = require("./Routes/InventoryRoutes")
const adminRouter = require('./Routes/AdminRoutes')
const RolesPermissionRoutes = require('./Routes/RoleAndPermission')
const feedbackRoutes = require("./Routes/feedbackRoutes");
const resetPassword = require("./Controllers/ResetPasswords")
const alternativeTherapiesRouter = require('./Routes/AlternativeTherapiesRoutes')
const bidRouter = require('./Routes/bidRoutes')

// Direct Routers
const IncomeAndExpensesRouter = require('./Controllers/IncomeAndExpensesController')
const IncomeAndExpensesRouterMod = require('./Controllers/IncomeAndExpensesController')


const connectDB = require("./config/db");

//External Routes
const { createCustomerByExternal } = require('./Controllers/Public/ExternalCustomerControllers');
const { createExternalAppointment } = require('./Controllers/Public/ExternalAppointmentController');
const checkRolesPermissions = require('./Middlewares/PermissionRolesMiddleware');

const app = express();
app.use(express.json());
app.use(cors());

connectDB()

app.get('/', (req, res) => {
    res.send('welcome!')
})


app.use("/customer", customerRoutes);
app.use("/mainDoctor", MainDoctorRoutes);
app.use("/doctor", doctorsRoutes);
app.use("/assistantDoctor", assistantDoctor);
app.use("/receptionist", receptionistRoutes);
app.use("/consultant", consultantRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/alternative_therapy",alternativeTherapiesRouter);
app.use("/prescription", prescriptionRoutes);
app.use("/enquiry", enquiryRoutes);
app.use("/public/customer", createCustomerByExternal);
app.use("/public/appointment", createExternalAppointment)
app.use("/incomeExpense", IncomeAndExpensesRouter)
app.use("/incomeExpenseMod", IncomeAndExpensesRouterMod)
app.use("/inventory", inventory)
app.use("/configAccess", RolesPermissionRoutes)
app.use("/admin", adminRouter)
app.use("/feedback", feedbackRoutes);
app.use("/bid", bidRouter);
app.use("/resetPassword", resetPassword);


const PORT = process.env?.PORT

app.listen(PORT, () => {
    console.log("server is running on port: " + PORT)
})

