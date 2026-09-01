import { registerDecorator, ValidationOptions } from 'class-validator';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Remplace @IsUUID() de class-validator, dont le comportement par défaut
 * s'est révélé peu fiable sur cette installation (rejette silencieusement
 * des UUID valides non-v4 — déjà observé sur genreIds, puis sur titreId).
 * Valide directement contre le format UUID générique par expression
 * régulière, sans dépendre du comportement interne version-dépendant.
 */
export function IsUuidString(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isUuidString',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: unknown): boolean {
                    return typeof value === 'string' && UUID_PATTERN.test(value);
                },
                defaultMessage(): string {
                    return `${propertyName} must be a valid UUID`;
                },
            },
        });
    };
}