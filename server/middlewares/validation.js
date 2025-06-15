const myMethods = ['body', 'query', 'header', 'params', 'file', 'files']


export const validation = (schema) => {
    return (req, res, next) => {
        const validationErrors = [];
        myMethods.forEach((key) => {
            if (schema[key]) {
                const { error } = schema[key].validate(req[key], { abortEarly: false });
                if (error?.details) {
                    error.details.forEach((err) => {
                        validationErrors.push(err.message)
                    })
                }
            }
        })
        if (validationErrors.length > 0) {
            return res.status(400).json({ message: validationErrors[0] });
          }
      
          next();
        };  
  };