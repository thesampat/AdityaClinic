import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export const TreatmentPackage = () => {
  const { treatmentType, topic } = useParams();


  window.location.replace(`https://shivenclinic-content.vercel.app/`)
  
  return (
    <h1></h1>
  );
};