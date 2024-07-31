export const calculateGender = (nic) => {
    let dayOfYear = 0;
    if (nic.length === 10) { // old NIC format
      dayOfYear = parseInt(nic.slice(2, 5), 10);
    } else if (nic.length === 12) { // new NIC format
      dayOfYear = parseInt(nic.slice(4, 7), 10);
    }
  
    return dayOfYear > 500 ? 'Female' : 'Male';
  };
  
  export const calculateBirthday = (nic) => {
    let year = 0, dayOfYear = 0;
    if (nic.length === 10) { // old NIC format
      year = parseInt(nic.slice(0, 2), 10);
      dayOfYear = parseInt(nic.slice(2, 5), 10) % 500;
      year += year > 20 ? 1900 : 2000; // adjust for year
    } else if (nic.length === 12) { // new NIC format
      year = parseInt(nic.slice(0, 4), 10);
      dayOfYear = parseInt(nic.slice(4, 7), 10) % 500;
    }
  
    const date = new Date(year, 0); // initialize date at the beginning of the year
    date.setDate(dayOfYear); // set the day of the year
  
    return date.toISOString().split('T')[0]; // return date in YYYY-MM-DD format
  };
  
  export const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
  
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  