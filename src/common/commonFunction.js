export const updateContext = (array, Id, state) => {
    return array?.map((ele) => {
        if (ele?.Id == Id) {
            return state;
        } else {
            return ele;
        }
    });
};