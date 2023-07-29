import {View, Text} from 'react-native';
import React from 'react';

const AgeCount = dateOfBirth => {
  if (!dateOfBirth) return null;

  const dob = new Date(dateOfBirth);

  const currentDate = new Date();

  let age = currentDate.getFullYear() - dob.getFullYear();

  const currentMonth = currentDate.getMonth();
  const birthMonth = dob.getMonth();
  const currentDay = currentDate.getDate();
  const birthDay = dob.getDate();

  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age;
};

export default AgeCount;
