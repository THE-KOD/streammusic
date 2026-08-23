import { Playlist } from './playlist.entity';
import { ValidationError } from '../../../core/errors';

describe('Playlist', () => {
    const baseProps = { id: 'p1', proprietaireId: 'u1', nom: 'Ma playlist', visibilite: 'PRIVEE' as const, dateCreation: new Date() };

    it('rejette un nom vide', () => {
        expect(() => Playlist.create({ ...baseProps, nom: '  ' })).toThrow(ValidationError);
    });

    it('estProprietaire() compare correctement', () => {
        const playlist = Playlist.create(baseProps);
        expect(playlist.estProprietaire('u1')).toBe(true);
        expect(playlist.estProprietaire('u2')).toBe(false);
    });

    it('renommer() applique la même validation que create()', () => {
        const playlist = Playlist.create(baseProps);
        playlist.renommer('Nouveau nom');
        expect(playlist.nom).toBe('Nouveau nom');
        expect(() => playlist.renommer('')).toThrow(ValidationError);
    });

    it('changerVisibilite() met à jour estPublique', () => {
        const playlist = Playlist.create(baseProps);
        expect(playlist.estPublique).toBe(false);
        playlist.changerVisibilite('PUBLIQUE');
        expect(playlist.estPublique).toBe(true);
    });
});