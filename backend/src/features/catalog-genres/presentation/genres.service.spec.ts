import { GenresService } from './genres.service';
import { Genre } from '../domain/genre.entity';
import { GenreNomDejaUtiliseError, GenreNotFoundError } from '../domain/errors';
import type { GenreRepository } from '../domain/genre.repository';

describe('GenresService', () => {
    let repository: jest.Mocked<GenreRepository>;
    let service: GenresService;

    // Un nouveau mock à chaque test : évite qu'un test pollue l'état du suivant.
    beforeEach(() => {
        repository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByNom: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
        };
        service = new GenresService(repository);
    });

    it('refuse de créer un genre avec un nom déjà pris', async () => {
        repository.findByNom.mockResolvedValue(Genre.create({ id: 'g1', nom: 'Pop' }));
        await expect(service.create('Pop')).rejects.toThrow(GenreNomDejaUtiliseError);
    });

    it('crée un genre si le nom est libre', async () => {
        repository.findByNom.mockResolvedValue(null);
        repository.save.mockImplementation(async (g) => g); // simule un save() qui retourne l'objet tel quel
        const genre = await service.create('Jazz');
        expect(genre.nom).toBe('Jazz');
    });

    it('getById() lève une erreur 404 si le genre n\'existe pas', async () => {
        repository.findById.mockResolvedValue(null);
        await expect(service.getById('inconnu')).rejects.toThrow(GenreNotFoundError);
    });

    it('update() n\'appelle findByNom que si le nom change réellement', async () => {
        const genre = Genre.create({ id: 'g1', nom: 'Pop' });
        repository.findById.mockResolvedValue(genre);
        repository.save.mockImplementation(async (g) => g);

        await service.update('g1', 'Pop'); // même nom qu'avant

        expect(repository.findByNom).not.toHaveBeenCalled();
    });
});