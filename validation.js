import Joi from 'joi';

// register validation
export const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(4),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(data);
}