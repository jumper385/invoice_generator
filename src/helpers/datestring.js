export const dateString = (date) => {
    let monthLUT = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec'];
    return `${date.getDate()} ${monthLUT[date.getMonth()]} ${date.getFullYear()}`
}