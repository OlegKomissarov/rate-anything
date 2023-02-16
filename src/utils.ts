export const getClassName = (...classNames: Array<string | boolean | undefined>) => {
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

export const setToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = <T>(key: string, validateValue: (value: unknown) => value is T): T | null => {
    let value = localStorage.getItem(key);
    if (value) {
        try {
            value = JSON.parse(value);

            // TODO: remove this when move userRates to the backend from localStorage
            // This is a hack to handle json number->string->number problem.
            if (Array.isArray(value)) {
                // @ts-ignore
                value = value.map(rate => {
                    rate.rate = +rate.rate;
                    return rate;
                });
            }

        } catch (error) {
            console.log(error);
        }

    // TODO: remove this when move password to the backend
    } else {
        if (typeof value === 'number') {
            value = value + '';
        }
    }

    if (validateValue(value)) {
        return value;
    }
    return null;
};
