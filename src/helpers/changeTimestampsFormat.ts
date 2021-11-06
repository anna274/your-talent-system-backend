function changeDateFormat(date) {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function changeTimestampsFormat(obj) {
  if(obj.createdAt) {
    obj.createdAt = changeDateFormat(obj.createdAt)
  }
  if(obj.updatedAt) {
    obj.updatedAt = changeDateFormat(obj.updatedAt)
  }
  return obj;
};

export { changeTimestampsFormat };