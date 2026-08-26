import { AdminGuard } from './admin.guard';
import { AdministrateurRequisError } from '../../domain/errors';
import type { AdministrateurRepository } from '../../domain/administrateur.repository';
import type { ExecutionContext } from '@nestjs/common';

function buildContext(userId: string | undefined): ExecutionContext {
    return {
        switchToHttp: () => ({ getRequest: () => ({ user: userId }) }),
    } as unknown as ExecutionContext;
}

describe('AdminGuard', () => {
    let repository: jest.Mocked<AdministrateurRepository>;
    let guard: AdminGuard;

    beforeEach(() => {
        repository = { existsById: jest.fn(), findById: jest.fn() };
        guard = new AdminGuard(repository);
    });

    it('rejette si aucun utilisateur dans la requête', async () => {
        await expect(guard.canActivate(buildContext(undefined))).rejects.toThrow(AdministrateurRequisError);
    });

    it("rejette un utilisateur connecté qui n'est pas admin", async () => {
        repository.existsById.mockResolvedValue(false);
        await expect(guard.canActivate(buildContext('u1'))).rejects.toThrow(AdministrateurRequisError);
    });

    it('autorise un utilisateur admin', async () => {
        repository.existsById.mockResolvedValue(true);
        await expect(guard.canActivate(buildContext('u1'))).resolves.toBe(true);
    });
});