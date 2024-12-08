function workDay(workStart, workEnd, meetStart, meetDuration) {
  function timeChange(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  const workStartMin = timeChange(workStart);
  const workEndMin = timeChange(workEnd);
  const meetStartMin = timeChange(meetStart);
  const meetEndMin = meetStartMin + meetDuration;

  return meetStartMin >= workStartMin && meetEndMin <= workEndMin;
}

// console.log(workDay('08:00', '17:30', '14:00', 90));
// console.log(workDay('8:0', '10:0', '8:0', 120));
// console.log(workDay('08:00', '14:30', '14:00', 90));
// console.log(workDay('14:00', '17:30', '08:0', 90));
// console.log(workDay('8:00', '17:30', '08:00', 900));
