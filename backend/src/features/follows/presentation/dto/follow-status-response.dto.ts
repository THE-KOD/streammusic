import { ApiProperty } from '@nestjs/swagger';

export class FollowStatusResponseDto {
    @ApiProperty() isFollowing: boolean;
}