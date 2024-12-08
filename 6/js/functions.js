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
