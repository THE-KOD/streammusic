import { validate } from 'class-validator';
import { IsUuidString } from './is-uuid-string.decorator';

class TestDto {
    @IsUuidString()
    id: string;
}

describe('IsUuidString', () => {
    it('accepte un UUID valide non-v4 (le cas qui posait problème)', async () => {
        const dto = new TestDto();
        dto.id = 'a1111111-1111-1111-1111-111111111111';
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
    });

    it("rejette une chaîne qui n'est pas un UUID", async () => {
        const dto = new TestDto();
        dto.id = 'pas-un-uuid';
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });
});