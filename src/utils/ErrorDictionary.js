const errors = 
{
    //#region general
    SERVER_ERROR: 
    {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Server error',
        status: 505
    },
    UNEXPECTED_ERROR: 
    {
        code: 'UNEXPECTED_ERROR',
        message: 'An unknown error has occurred',
        status: 500
    },
    BAD_REQUEST: 
    {
        code: 'BAD_REQUEST',
        message: 'Bad request',
        status: 400
    },
    MISSING_REQUIRED_FIELDS: 
    {
        code: 'MISSING_REQUIRED_FIELDS',
        message: 'Please provide all required fields, missing required fields.',
        status: 400
    },
    UNAUTHORIZED: 
    {
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
        status: 401
    },
    FORBIDDEN: 
    {
        code: 'FORBIDDEN',
        message: 'Forbidden',
        status: 403
    },
    NOT_FOUND: 
    {
        code: 'NOT_FOUND',
        message: 'Not found',
        status: 404
    },
    SERVICE_UNAVAILABLE: 
    {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Could not reach server',
        status: 503
    },
    INVALID_MONGO_ID: 
    {
        code: 'INVALID_MONGO_ID',
        message: 'Invalid user ID format',
        status: 400
    },
    //#endregion

    //#region users
    //register
    USER_ALREADY_EXISTS: 
    {
        code: 'USER_ALREADY_EXISTS',
        message: 'User already exists.',
        status: 409
    },
    EMAIL_ALREADY_IN_USE: 
    {
        code: 'EMAIL_ALREADY_IN_USE',
        message: 'Email is already in use.',
        status: 409
    },
    INVALID_EMAIL_FORMAT: 
    {
        code: 'INVALID_EMAIL_FORMAT',
        message: 'Invalid email format',
        status: 400
    },
    INVALID_PASSWORD_FORMAT: 
    {
        code: 'INVALID_PASSWORD_FORMAT',
        message: 'Invalid password format',
        status: 400
    },

    //USERS
    USERS_NOT_FOUND: 
    {
        code: 'USERS_NOT_FOUND',
        message: 'Users not found in database, may be empty',
        status: 404
    },
    USER_NOT_FOUND: 
    {
        code: 'USER_NOT_FOUND',
        message: 'User not found in database, be sure of the user ID',
        status: 404
    },
    USER_WRONG_CREDENTIALS: 
    {
        code: 'USER_WRONG_CREDENTIALS',
        message: 'Wrong credentials',
        status: 401
    },
    USER_DISABLED: 
    {
        code: 'USER_DISABLED',
        message: 'User is disabled',
        status: 401
    },
    USER_BLOCKED: 
    {
        code: 'USER_BLOCKED',
        message: 'User is blocked',
        status: 401
    },
    NO_FILES_UPLOADED:
    {
        code: 'NO_FILES_UPLOADED',
        message: 'No files uploaded',
        status: 400
    },
    USER_NOT_AUTHENTICATED:
    {
        code: 'USER_NOT_AUTHENTICATED',
        message: 'User not authenticated',
        status: 401
    },
    USER_NOT_LONGER_EXISTS:
    {
        code: 'USER_NOT_LONGER_EXISTS',
        message: 'User not longer exists in database',
        status: 401
    },
    USERS_NOT_CREATED:
    {
        code: 'USERS_NOT_CREATED',
        message: 'Users not created',
        status: 400
    },

    //session
    SESSION_EXPIRED: 
    {
        code: 'SESSION_EXPIRED',
        message: 'Session expired',
        status: 401
    },
    TOKEN_INVALID: 
    {
        code: 'TOKEN_INVALID',
        message: 'Token is invalid',
        status: 401
    },
    TOKEN_EXPIRED: 
    {
        code: 'TOKEN_EXPIRED',
        message: 'Token is expired',
        status: 401
    },
    UNAUTHORIZED: 
    {
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
        status: 401
    },

    //#endregion

    //#region pets
    PETS_NOT_FOUND: 
    {
        code: 'PETS_NOT_FOUND',
        message: 'Pets not found in database, may be empty',
        status: 404
    },
    PET_NOT_FOUND: 
    {
        code: 'PET_NOT_FOUND',
        message: 'Pet not found in database, be sure of the pet ID',
        status: 404
    },
    PET_ALREADY_EXISTS: 
    {
        code: 'PET_ALREADY_EXISTS',
        message: 'Pet already exists',
        status: 409
    },
    PET_MISSING_REQUIRED_FIELDS: 
    {
        code: 'PET_MISSING_REQUIRED_FIELDS',
        message: 'Missing required fields',
        status: 400
    },
    PET_INVALID_BIRTHDATE: 
    {
        code: 'PET_INVALID_BIRTHDATE',
        message: 'Invalid birthdate',
        status: 400
    },
    PET_NOT_CREATED: 
    {
        code: 'PET_NOT_CREATED',
        message: 'Pet not created in database',
        status: 500
    },
    //#endregion

    //#region adoptions
    ADOPTIONS_NOT_FOUND: 
    {
        code: 'ADOPTIONS_NOT_FOUND',
        message: 'Adoptions not found in database, may be empty',
        status: 404
    },
    ADOPTION_NOT_FOUND: 
    {
        code: 'ADOPTION_NOT_FOUND',
        message: 'Adoption not found',
        status: 404
    },
    ADOPTION_ALREADY_EXISTS: 
    {
        code: 'ADOPTION_ALREADY_EXISTS',
        message: 'Adoption already exists in database, cannot create a new adoption with the same owner and pet',
        status: 409
    },
    ADOPTION_MISSING_REQUIRED_FIELDS: 
    {
        code: 'ADOPTION_MISSING_REQUIRED_FIELDS',
        message: 'Missing required fields',
        status: 400
    },
    //#endregion

    //#region other
    FILE_NOT_FOUND: 
    {
        code: 'FILE_NOT_FOUND',
        message: 'File not found',
        status: 404
    },
    FILE_INVALID_FORMAT: 
    {
        code: 'FILE_INVALID_FORMAT',
        message: 'Invalid file format',
        status: 400
    },
    //#endregion
}

export default errors;