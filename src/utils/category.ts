export const categories = {
    1:"Pizza",
    2:"Burger",
    3:"Shakes",
    4:"Snacks",
    5:"Breakfast",
    6:"Wraps",
    7:"Sandwich",
    8:"Pulses",
    9:"Vegetables",
}
type NumberKeyedStringObject = {
    [key: number]: string;
};

export const logObject = (object:NumberKeyedStringObject) => {
    Object.entries(object).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
    });
}