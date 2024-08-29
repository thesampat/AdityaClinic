import React, { useState } from 'react';
import CustomInput from '../../../Components/CommonComponents/CustomInput';
import CustomSelect from '../../../Components/CommonComponents/CustomSelect';
import statesData from '../../../Files/states.json';
import { RefrenceList, educationLevels, indianStatesAndUTs, statusOptions } from '../../../Files/dropdownOptions';
import axios from 'axios';
import { toast } from 'react-toastify';
import { END_POINT, getJwtToken } from '../../../Redux/AdminReducer/action';
import { useNavigate, useParams } from 'react-router-dom';
import CustomButton from '../../../Components/CommonComponents/CustomButton';

const createItem = async (data, navigate, setIsPorcessing, threapyType) => {
  
  try {
    const result = await axios.post(`${END_POINT}/alternative_therapy/create/${String(threapyType).toLowerCase()}/`, data);
    setIsPorcessing(false);
    navigate(`/web/afterAction`);
    toast.success('Receptionist Created Successfully');
  } catch (error) {
    toast.error(error?.response?.data || 'Something went wrong');
    setIsPorcessing(false);
  }
};

const initialFormData = {
  fullName: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  profession: '',
  weight: '',
  height: '',
  transport: '',
  workout: '',
  howlongworkout: '',
  exercises: '',
  goal: '',
  Measurements: '',
  weighteasily: '',
  area: '',
  gaingweight: '',
  drink: '',
  food: '',
  veg: '',
  fasting: '',
  family: '',
  month: '',
  edibleOil: '',
  gheeFrequency: '',
  state: '',
  waterIntake: '',
  constipationFrequency: '',
  dislikedFood: '',
  likedFood: '',
  wakeUpTime: '',
  snore: '',
  freshness: '',
  wakeUpMethod: '',
  breakfastTime: '',
  breakfastContent: '',
  sleepTime: '',
  betweenMeals: '',
  hungerFeeling: '',
  mouthDryness: '',
  relationshipWithFood: '',
  sexLife: '',
  teaCoffeeConsumption: '',
  bedtimeHunger: '',
  sleepRating: '',
  lunchTime: '',
  lunchContent: '',
  dinnerTime: '',
  dinnerContent: '',
  cravings: '',
  cravingTime: '',
  gainweight: '',
};

const initialFormError = { ...initialFormData };

export default function Nutrion() {
  const { threapyType } = useParams();
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [filteredStates, setFilteredStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [states, setStates] = useState([]);
  const navigate = useNavigate();
  const [isProcessing, setIsPorcessing] = useState(false);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleForm = (e) => {
    e.preventDefault();

    const trimmedFormData = { ...formData };
    let isValidInput = true;

    for (const key in trimmedFormData) {
      if (trimmedFormData?.hasOwnProperty(key)) {
        if (typeof trimmedFormData[key] === 'string') {
          trimmedFormData[key] = trimmedFormData[key].trim();
        }
      }
    }

    let updatedFormError = { formError };

    // if (!trimmedFormData?.name) {
    //   updatedFormError.name = 'Name is required!';
    //   isValidInput = false;
    // }

    // if (!trimmedFormData?.email) {
    //   updatedFormError.email = 'Email is required!';
    //   isValidInput = false;
    // } else if (!/\S+@\S+\.\S+/.test(trimmedFormData?.email)) {
    //   updatedFormError.email = 'Invalid email address!';
    //   isValidInput = false;
    // }

    // if (!trimmedFormData?.phone) {
    //   updatedFormError.phone = 'Phone number is required!';
    //   isValidInput = false;
    // } else if (!/^\d{10}$/.test(trimmedFormData?.phone)) {
    //   updatedFormError.phone = 'Invalid phone number, must be 10 digits!';
    //   isValidInput = false;
    // }

    setFormError(updatedFormError);
    if (!isValidInput) {
      Object.keys(updatedFormError)?.map((f) => {
        toast.error(updatedFormError?.[f]);
      });
    }

    if (isValidInput) {
      setIsPorcessing(true);
      createItem(trimmedFormData, navigate, setIsPorcessing, threapyType);
    }
  };

  return (
    <div className="bg-primary-50 pb-8 rounded-md pt-4 border-2 border-primary-400 ">
      <div className="pb-8 rounded-md pt-4">
        <form action="">
          <div className="px-6 py-6 rounded-md">
            <h2 className="text-2xl font-semibold text-primary-900 border-l-4 border-primary-400 pl-3">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <CustomInput onChange={handleInputChange} label="Full Name" placeholder="Enter Full Name" type="text" value={formData.fullName} error={formError.fullName} name="fullName" />
              <CustomInput onChange={handleInputChange} label="Date of Birth" placeholder="Enter Date of Birth" type="date" value={formData.dateOfBirth} error={formError.dateOfBirth} name="dateOfBirth" />
              <CustomSelect onChange={handleInputChange} options={['Male', 'Female', 'Other']} label="Gender" value={formData?.gender} error={formError?.gender} name="gender" placeholder="-- Select Gender --" />
              <CustomSelect onChange={handleInputChange} options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} label={'Blood Group'} value={formData?.bloodGroup} error={formError?.bloodGroup} name="bloodGroup" placeholder="-- Select Blood Group --" />
              <CustomSelect onChange={handleInputChange} options={['Homemaker', 'Teacher', 'Student', 'Retired', 'IT', 'Business', 'Engineering', 'Medical', 'Grade I & II', 'Senior Management', 'Defence', 'Baby', 'Police', 'Unknown', 'Self Employed']} label="Profession" value={formData?.profession} error={formError?.profession} name="profession" placeholder="-- Select Profession --" />
              <CustomInput onChange={handleInputChange} label="Weight (in KG)" placeholder="Enter Weight" type="number" value={formData?.weight} error={formError?.weight} name="weight" />
              <CustomInput onChange={handleInputChange} label="Height (in Centimeters)" placeholder="Enter Height (cm)" type="number" value={formData?.height} error={formError?.height} name="height" />
            </div>
          </div>
          <div className="px-6 py-6 rounded-md">
            <h2 className="text-2xl font-semibold text-primary-900 border-l-4 border-primary-400 pl-3">Fitness Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <CustomSelect onChange={handleInputChange} options={['public', 'Transport']} label="How do you travel to office daily ?" value={formData?.transport} error={formError?.transport} name="transport" placeholder="-- How do you travel to office daily --" />
              <CustomSelect onChange={handleInputChange} options={['yes', 'No']} label="Do you work out ?" value={formData?.workout} error={formError?.workout} name="workout" placeholder="-- Do you work out ? --" />
              <CustomInput onChange={handleInputChange} label="What is your workout schedule and intensity and for how long do you work out?" value={formData?.howlongworkout} error={formError?.howlongworkout} name="howlongworkout" placeholder="What is your workout schedule and intensity and for how long do you work out?" />
              <CustomSelect onChange={handleInputChange} options={['Functional training', 'Hard core weight training', 'Power yoga', 'Cardio', 'Pilates', 'Kick boxing', 'Taichi(Japanese or Chinese workout)']} label="What kind of exercises do you do ?" value={formData?.exercises} error={formError?.exercises} name="exercises" placeholder="-- What kind of exercises do you do ? --" />
              <CustomInput onChange={handleInputChange} label="What is your fitness goals ?" value={formData?.goal} error={formError?.goal} name="goal" placeholder="What is your fitness goals ?" />
              <CustomSelect
                onChange={handleInputChange}
                options={['Chest', 'Waist around naval point', 'Hips (Take the highest point of your hip)', ' Thigh', ' Around your arms between your shoulder joint and elbow joint?', 'Kick boxing', 'Taichi(Japanese or Chinese workout)']}
                label="Body Measurements (in cm) ?"
                value={formData?.Measurements}
                error={formError?.Measurements}
                name="Measurements"
                placeholder="-- Body Measurements (in cm) ? --"
              />
              <CustomInput onChange={handleInputChange} label="Do you feel you gain weight more easily on your hips or abdomen ?" value={formData?.weighteasily} error={formError?.weighteasily} name="weighteasily" placeholder="Do you feel you gain weight more easily on your hips or abdomen ?" />
              <CustomInput onChange={handleInputChange} label="Do you store fat specifically in any area ?" value={formData?.area} error={formError?.area} name="area" placeholder="Do you store fat specifically in any area ?" />

              <CustomInput onChange={handleInputChange} label="At What age or stage of your life did you start gaining weight? Reason if any ?" value={formData?.gaingweight} error={formError?.gaingweight} name="gaingweight" placeholder="At What age or stage of your life did you start gaining weight? Reason if any ?" />
            </div>
          </div>

          <div className="px-6 py-6 rounded-md">
            <h2 className="text-2xl font-semibold text-primary-900 border-l-4 border-primary-400 pl-3">Dietary Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <CustomSelect onChange={handleInputChange} options={['Yes', 'No']} label="Do you Smoke / Drink ?" value={formData?.drink} error={formError?.drink} name="drink" placeholder="-- Do you Smoke / Drink? --" />

              <CustomInput onChange={handleInputChange} label="Outside Food Eating (with frequency) ?" value={formData?.food} error={formError?.food} name="food" placeholder="-- Outside Food Eating (with frequency) ? --" />

              <CustomInput onChange={handleInputChange} label="Vegetarian/Non-Vegetarian ?" value={formData?.veg} error={formError?.veg} name="veg" placeholder="Vegetarian/Non-Vegetarian ?" />

              <CustomInput onChange={handleInputChange} label=" Fasting (with frequency) ?" value={formData?.fasting} error={formError?.fasting} name="fasting" placeholder="Fasting (with frequency) ?" />

              <CustomInput onChange={handleInputChange} label="No. of People in Family  ?" value={formData?.family} error={formError?.family} name="family" placeholder="No. of People in Family ?" />
              <CustomInput onChange={handleInputChange} label="Edible Oil Consumption per month by whole Family ?" value={formData?.month} error={formError?.month} name="month" placeholder="Edible Oil Consumption per month by whole Family ?" />

              <CustomSelect onChange={handleInputChange} label="What type of edible oil do you use?" value={formData?.edibleOil} error={formError?.edibleOil} name="edibleOil" placeholder="Select an option" options={['Olive Oil', 'Vegetable Oil', 'Coconut Oil', 'Canola Oil', 'Sunflower Oil', 'Peanut Oil', 'Sesame Oil', 'Grapeseed Oil', 'Other']} />

              <CustomSelect onChange={handleInputChange} label="What is the frequency of Ghee in the diet?" value={formData?.gheeFrequency} error={formError?.gheeFrequency} name="gheeFrequency" placeholder="Select frequency" options={['Daily', 'Weekly', 'Monthly', 'Occasionally', 'Rarely']} />
              <CustomSelect onChange={handleInputChange} options={indianStatesAndUTs} label="State" value={formData.state} error={formError.state} name="state" placeholder="-- Select State --" />

              <CustomInput onChange={handleInputChange} label="Water Intake per Day (glass of 200 ml per day)" placeholder="Enter water intake" type="number" value={formData.waterIntake} error={formError.waterIntake} name="waterIntake" />
              <CustomInput onChange={handleInputChange} label="How often do You Feel constipated?" placeholder="Enter constipation frequency" type="text" value={formData.constipationFrequency} error={formError.constipationFrequency} name="constipationFrequency" />
              <CustomInput onChange={handleInputChange} label="Which food you do not like or eat.?" placeholder="Enter disliked food" type="text" value={formData.dislikedFood} error={formError.dislikedFood} name="dislikedFood" />
              <CustomInput onChange={handleInputChange} label="Which food you like or eat most often." placeholder="Enter liked food" type="text" value={formData.likedFood} error={formError.likedFood} name="likedFood" />
            </div>
          </div>

          <div className="px-6 py-6 rounded-md">
            <h2 className="text-2xl font-semibold text-primary-900 border-l-4 border-primary-400 pl-3">Diet Recall</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <CustomInput onChange={handleInputChange} label="At what time do you wake up?" placeholder="Enter wake-up time" type="time" value={formData.wakeUpTime} error={formError.wakeUpTime} name="wakeUpTime" />
              <CustomSelect onChange={handleInputChange} label="Do you snore or have any whistling sound while sleeping?" value={formData.snore} error={formError.snore} name="snore" options={['Yes', 'No']} placeholder="-- Select answer --" />
              <CustomSelect onChange={handleInputChange} label="Do you wake up fresh or feel like sleeping more?" value={formData.freshness} error={formError.freshness} name="freshness" options={['Yes', 'No']} placeholder="-- Select answer --" />
              <CustomSelect onChange={handleInputChange} label="Do you wake up with an alarm or on your own?" value={formData.wakeUpMethod} error={formError.wakeUpMethod} name="wakeUpMethod" options={['Alarm', 'On my own']} placeholder="-- Select answer --" />
              <CustomInput onChange={handleInputChange} label="At what time do you have your breakfast?" placeholder="Enter breakfast time" type="time" value={formData.breakfastTime} error={formError.breakfastTime} name="breakfastTime" />
              <CustomInput onChange={handleInputChange} label="What does your breakfast include?" placeholder="Enter breakfast content" type="text" value={formData.breakfastContent} error={formError.breakfastContent} name="breakfastContent" />

              <CustomInput onChange={handleInputChange} label="At what time do you have your lunch?" placeholder="Enter lunch time" type="time" value={formData.lunchTime} error={formError.lunchTime} name="lunchTime" />

              <CustomInput onChange={handleInputChange} label="What does your lunch include?" placeholder="Enter lunch content" type="text" value={formData.lunchContent} error={formError.lunchContent} name="lunchContent" />

              <CustomInput onChange={handleInputChange} label="At what time do you have your dinner?" placeholder="Enter dinner time" type="time" value={formData.dinnerTime} error={formError.dinnerTime} name="dinnerTime" />
              <CustomInput onChange={handleInputChange} label="What does your dinner include?" placeholder="Enter dinner content" type="text" value={formData.dinnerContent} error={formError.dinnerContent} name="dinnerContent" />
              <CustomSelect onChange={handleInputChange} label="Do you get cravings?" value={formData.cravings} error={formError.cravings} name="cravings" options={['Yes', 'No']} placeholder="-- Select answer --" />

              <CustomInput onChange={handleInputChange} label="What time of the day do you get cravings?" placeholder="Enter craving time" type="text" value={formData.cravingTime} error={formError.cravingTime} name="cravingTime" />
              <CustomInput onChange={handleInputChange} label="At what time do you go to sleep?" placeholder="Enter sleep time" type="time" value={formData.sleepTime} error={formError.sleepTime} name="sleepTime" />
              <CustomInput onChange={handleInputChange} label="Do you eat anything between meals?" placeholder="Enter between meals content" type="text" value={formData.betweenMeals} error={formError.betweenMeals} name="betweenMeals" />
              <CustomSelect onChange={handleInputChange} label="Do you feel hungry or eat as per timings and schedule or both?" value={formData.hungerFeeling} error={formError.hungerFeeling} name="hungerFeeling" options={['Hungry', 'Timings and schedule', 'Both']} placeholder="-- Select answer --" />
              <CustomSelect onChange={handleInputChange} label="Do you feel parched and dry in your mouth?" value={formData.mouthDryness} error={formError.mouthDryness} name="mouthDryness" options={['Yes', 'No']} placeholder="-- Select answer --" />
              <CustomSelect onChange={handleInputChange} label="Would you call your relationship with food good, bad, or neutral?" value={formData.relationshipWithFood} error={formError.relationshipWithFood} name="relationshipWithFood" options={['Good', 'Bad', 'Neutral']} placeholder="-- Select answer --" />
              <CustomInput onChange={handleInputChange} label="How is your sex life, and how many times do you have sex in a week?" placeholder="Enter sex life details" type="text" value={formData.sexLife} error={formError.sexLife} name="sexLife" />
              <CustomInput onChange={handleInputChange} label="Do you consume Tea / Coffee? If yes, then please mention how many cups per day? With sugar or without sugar?" placeholder="Enter tea/coffee details" type="text" value={formData.teaCoffeeConsumption} error={formError.teaCoffeeConsumption} name="teaCoffeeConsumption" />
              <CustomSelect onChange={handleInputChange} label="Do you feel hungry before going to bed?" value={formData.bedtimeHunger} error={formError.bedtimeHunger} name="bedtimeHunger" options={['Yes', 'No']} placeholder="-- Select answer --" />
              <CustomInput onChange={handleInputChange} label="Rate your sleeping pattern on a scale of 10?" placeholder="Enter sleep rating" type="number" value={formData.sleepRating} error={formError.sleepRating} name="sleepRating" />
            </div>
            <div className="lg:w-80 mx-auto w-full px-5  ">
              <CustomButton onClick={handleForm} isProcessing={isProcessing} label={'Submit'} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
