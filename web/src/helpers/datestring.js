export const dateString = (date) => {
    let monthLUT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${monthLUT[date.getMonth()]} ${date.getFullYear()}`
}