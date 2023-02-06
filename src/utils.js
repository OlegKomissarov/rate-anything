export const getClassName = (...classNames) => {
    let classNamesString = '';
    classNames.forEach(className => {
        if (className && typeof className === 'string') {
            if (classNamesString) {
                classNamesString += ` ${className}`;
            } else {
                classNamesString = className;
            }
        }
    });
    return classNamesString.trim();
};

export const setToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = key => {
    let value = localStorage.getItem(key);
    try {
        value = JSON.parse(value);
    } catch (error) {
        console.log(error);
    }
    return value;
};
