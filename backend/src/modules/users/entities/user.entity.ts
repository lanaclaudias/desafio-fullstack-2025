export class UserEntity {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial?: Partial<UserEntity>) {
        if (partial) Object.assign(this, partial);
    }
}