import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbonnementOrmEntity } from './data/orm/abonnement.orm-entity';
import { TypeOrmAbonnementRepository } from './data/typeorm-abonnement.repository';
import { ABONNEMENT_REPOSITORY } from './domain/abonnement.repository';
import { SubscriptionsService } from './presentation/subscriptions.service';
import { SubscriptionsController } from './presentation/subscriptions.controller';

@Module({
    imports: [TypeOrmModule.forFeature([AbonnementOrmEntity])],
    controllers: [SubscriptionsController],
    providers: [
        { provide: ABONNEMENT_REPOSITORY, useClass: TypeOrmAbonnementRepository },
        SubscriptionsService,
    ],
    // Exporté : auth en a besoin pour créer l'abonnement par défaut à l'inscription.
    exports: [ABONNEMENT_REPOSITORY],
})
export class SubscriptionsModule {}