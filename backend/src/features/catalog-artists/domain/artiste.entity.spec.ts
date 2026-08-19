import { Artiste } from './artiste.entity';

describe('Artiste', () => {
    it('cree un artiste avec les champs fournis', () => {
        const artiste = Artiste.create({ id: 'a1', biographie: 'Bio', photoArtisteUrl: null });
        expect(artiste.id).toBe('a1');
        expect(artiste.biographie).toBe('Bio');
    });

    it('modifierProfil() ne change que les champs explicitement fournis', () => {
        const artiste = Artiste.create({ id: 'a1', biographie: 'Ancienne bio', photoArtisteUrl: 'http://old.jpg' });

        artiste.modifierProfil('Nouvelle bio', undefined); // photo non fournie = inchangée

        expect(artiste.biographie).toBe('Nouvelle bio');
        expect(artiste.photoArtisteUrl).toBe('http://old.jpg');
    });
});