export class InvalidCredentialsError extends Error {
    constructor() {
        super('Email ou mot de passe incorrect.')
        this.name = 'InvalidCredentialsError'
    }
}

export class EmailAlreadyExistsError extends Error {
    constructor() {
        super('Un compte existe déjà avec cet email.')
        this.name = 'EmailAlreadyExistsError'
    }
}