/* Express validator configuration */
export const errorFormatter = (param, msg, value) => {
    const namespace = param.split("");
    const root = namespace.shift();
    let formParam = root;
    while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
    }
    return {
        param: formParam,
        msg,
        value,
    };
};
